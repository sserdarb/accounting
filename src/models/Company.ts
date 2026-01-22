import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  taxNumber: string;
  taxOffice: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  gibUsername?: string;
  gibPassword?: string;
  gibAlias?: string;
  ocrProvider?: 'google-vision' | 'tesseract';
  ocrApiKey?: string;
  // Gmail OAuth (legacy)
  gmailClientId?: string;
  gmailClientSecret?: string;
  gmailRefreshToken?: string;
  // Custom Email Server (IMAP/SMTP)
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
  emailProvider?: 'gmail' | 'custom';
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    taxNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    taxOffice: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    logo: {
      type: String,
    },
    gibUsername: {
      type: String,
    },
    gibPassword: {
      type: String,
    },
    gibAlias: {
      type: String,
    },
    ocrProvider: {
      type: String,
      enum: ['google-vision', 'tesseract'],
      default: 'tesseract',
    },
    ocrApiKey: {
      type: String,
    },
    gmailClientId: {
      type: String,
    },
    gmailClientSecret: {
      type: String,
    },
    gmailRefreshToken: {
      type: String,
    },
    // Custom Email Server (IMAP/SMTP)
    imapHost: {
      type: String,
    },
    imapPort: {
      type: Number,
    },
    imapSecure: {
      type: Boolean,
      default: true,
    },
    imapUser: {
      type: String,
    },
    imapPassword: {
      type: String,
    },
    smtpHost: {
      type: String,
    },
    smtpPort: {
      type: Number,
    },
    smtpSecure: {
      type: Boolean,
      default: true,
    },
    smtpUser: {
      type: String,
    },
    smtpPassword: {
      type: String,
    },
    emailProvider: {
      type: String,
      enum: ['gmail', 'custom'],
      default: 'gmail',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
CompanySchema.index({ taxNumber: 1 });

const Company: Model<ICompany> =
  mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema);

export default Company;
