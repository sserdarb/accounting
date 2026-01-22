/**
 * Custom Email Service
 * Supports both Gmail OAuth and custom IMAP/SMTP servers
 */

import Imap from 'imap';
import { simpleParser } from 'mailparser';

export interface EmailConfig {
    provider: 'gmail' | 'custom';
    // Gmail OAuth
    gmailClientId?: string;
    gmailClientSecret?: string;
    gmailRefreshToken?: string;
    // Custom IMAP/SMTP
    imapHost?: string;
    imapPort?: number;
    imapSecure?: boolean;
    imapUser?: string;
    imapPassword?: string;
    smtpHost?: string;
    smtpPort?: number;
    smtpSecure?: boolean;
    smtpUser?: string;
    smtpPassword?: string;
}

export interface EmailMessage {
    id: string;
    subject: string;
    from: string;
    date: string;
    hasAttachments: boolean;
    snippet?: string;
    attachments?: {
        filename: string;
        contentType: string;
        size: number;
        content: Buffer;
    }[];
}

class CustomEmailService {
    private config: EmailConfig | null = null;

    /**
     * Initialize with company configuration
     */
    async initializeWithCompany(companyId: string): Promise<boolean> {
        try {
            const Company = (await import('@/models/Company')).default;
            const connectDB = (await import('@/lib/mongodb')).default;

            await connectDB();
            const company = await Company.findById(companyId);

            if (!company) {
                console.warn('Company not found');
                return false;
            }

            this.config = {
                provider: company.emailProvider || 'gmail',
                gmailClientId: company.gmailClientId,
                gmailClientSecret: company.gmailClientSecret,
                gmailRefreshToken: company.gmailRefreshToken,
                imapHost: company.imapHost,
                imapPort: company.imapPort,
                imapSecure: company.imapSecure,
                imapUser: company.imapUser,
                imapPassword: company.imapPassword,
                smtpHost: company.smtpHost,
                smtpPort: company.smtpPort,
                smtpSecure: company.smtpSecure,
                smtpUser: company.smtpUser,
                smtpPassword: company.smtpPassword,
            };

            return true;
        } catch (error) {
            console.error('Email Service Initialization Error:', error);
            return false;
        }
    }

    /**
     * Test IMAP connection
     */
    async testImapConnection(config: EmailConfig): Promise<{ success: boolean; message: string; email?: string }> {
        return new Promise((resolve) => {
            if (config.provider !== 'custom' || !config.imapHost || !config.imapUser || !config.imapPassword) {
                resolve({ success: false, message: 'IMAP configuration incomplete' });
                return;
            }

            const imap = new Imap({
                user: config.imapUser,
                password: config.imapPassword,
                host: config.imapHost,
                port: config.imapPort || 993,
                tls: config.imapSecure !== false,
                tlsOptions: { rejectUnauthorized: false },
            });

            imap.once('ready', () => {
                imap.end();
                resolve({
                    success: true,
                    message: 'IMAP connection successful',
                    email: config.imapUser,
                });
            });

            imap.once('error', (err: Error) => {
                console.error('IMAP connection error:', err);
                resolve({
                    success: false,
                    message: `IMAP connection failed: ${err.message}`,
                });
            });

            imap.connect();
        });
    }

    /**
     * Fetch recent emails via IMAP
     */
    async getRecentEmails(maxResults: number = 20): Promise<EmailMessage[]> {
        if (!this.config || this.config.provider !== 'custom') {
            console.warn('Custom email not configured');
            return [];
        }

        return new Promise((resolve, reject) => {
            const imap = new Imap({
                user: this.config!.imapUser!,
                password: this.config!.imapPassword!,
                host: this.config!.imapHost!,
                port: this.config!.imapPort || 993,
                tls: this.config!.imapSecure !== false,
                tlsOptions: { rejectUnauthorized: false },
            });

            const messages: EmailMessage[] = [];

            imap.once('ready', () => {
                imap.openBox('INBOX', true, (err, box) => {
                    if (err) {
                        imap.end();
                        reject(err);
                        return;
                    }

                    const fetchCount = Math.min(maxResults, box.messages.total);
                    if (fetchCount === 0) {
                        imap.end();
                        resolve([]);
                        return;
                    }

                    const start = Math.max(1, box.messages.total - fetchCount + 1);
                    const fetch = imap.seq.fetch(`${start}:*`, {
                        bodies: '',
                        struct: true,
                    });

                    fetch.on('message', (msg, seqno) => {
                        msg.on('body', (stream) => {
                            simpleParser(stream, async (err, parsed) => {
                                if (err) {
                                    console.error('Parse error:', err);
                                    return;
                                }

                                const attachments = (parsed.attachments || []).map((att) => ({
                                    filename: att.filename || 'unknown',
                                    contentType: att.contentType,
                                    size: att.size,
                                    content: att.content,
                                }));

                                messages.push({
                                    id: `msg-${seqno}`,
                                    subject: parsed.subject || 'No Subject',
                                    from: parsed.from?.text || 'Unknown',
                                    date: parsed.date?.toISOString() || new Date().toISOString(),
                                    hasAttachments: attachments.length > 0,
                                    snippet: parsed.text?.substring(0, 150),
                                    attachments,
                                });
                            });
                        });
                    });

                    fetch.once('error', (err) => {
                        console.error('Fetch error:', err);
                        imap.end();
                        reject(err);
                    });

                    fetch.once('end', () => {
                        imap.end();
                        resolve(messages);
                    });
                });
            });

            imap.once('error', (err) => {
                console.error('IMAP error:', err);
                reject(err);
            });

            imap.connect();
        });
    }

    /**
     * Process invoice emails
     */
    async processInvoiceEmails(): Promise<{ success: boolean; count: number; invoices: any[] }> {
        try {
            const emails = await this.getRecentEmails();
            const invoiceEmails = emails.filter(
                (e) =>
                    e.hasAttachments &&
                    (e.subject.toLowerCase().includes('fatura') || e.subject.toLowerCase().includes('invoice'))
            );

            return {
                success: true,
                count: invoiceEmails.length,
                invoices: invoiceEmails.map((e) => ({
                    source: 'email',
                    subject: e.subject,
                    from: e.from,
                    attachmentCount: e.attachments?.length || 0,
                })),
            };
        } catch (error: any) {
            console.error('Process invoice emails error:', error);
            return {
                success: false,
                count: 0,
                invoices: [],
            };
        }
    }
}

const customEmailService = new CustomEmailService();
export default customEmailService;
