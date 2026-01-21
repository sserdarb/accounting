import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBankAccount extends Document {
    companyId: string;
    name: string;
    type: 'cash' | 'bank' | 'credit';
    currency: 'TRY' | 'USD' | 'EUR';
    balance: number;
    iban?: string;
    bankName?: string;
    accountNumber?: string;
    branchCode?: string;
    status: 'active' | 'inactive' | 'blocked';
    createdAt: Date;
    updatedAt: Date;
}

export interface IBankTransaction extends Document {
    companyId: string;
    accountId: string;
    type: 'income' | 'expense' | 'transfer';
    amount: number;
    description: string;
    category: string;
    reference?: string;
    relatedAccountId?: string; // For transfers
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}

const BankAccountSchema = new Schema<IBankAccount>(
    {
        companyId: {
            type: String,
            required: true,
            ref: 'Company',
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ['cash', 'bank', 'credit'],
            required: true,
        },
        currency: {
            type: String,
            enum: ['TRY', 'USD', 'EUR'],
            default: 'TRY',
        },
        balance: {
            type: Number,
            default: 0,
        },
        iban: {
            type: String,
            trim: true,
        },
        bankName: {
            type: String,
            trim: true,
        },
        accountNumber: {
            type: String,
            trim: true,
        },
        branchCode: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'blocked'],
            default: 'active',
        },
    },
    {
        timestamps: true,
    }
);

BankAccountSchema.index({ companyId: 1 });

const BankTransactionSchema = new Schema<IBankTransaction>(
    {
        companyId: {
            type: String,
            required: true,
            ref: 'Company',
        },
        accountId: {
            type: String,
            required: true,
            ref: 'BankAccount',
        },
        type: {
            type: String,
            enum: ['income', 'expense', 'transfer'],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        reference: {
            type: String,
        },
        relatedAccountId: {
            type: String,
            ref: 'BankAccount',
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

BankTransactionSchema.index({ companyId: 1 });
BankTransactionSchema.index({ accountId: 1 });
BankTransactionSchema.index({ date: -1 });

export const BankAccount: Model<IBankAccount> =
    mongoose.models.BankAccount || mongoose.model<IBankAccount>('BankAccount', BankAccountSchema);

export const BankTransaction: Model<IBankTransaction> =
    mongoose.models.BankTransaction || mongoose.model<IBankTransaction>('BankTransaction', BankTransactionSchema);
