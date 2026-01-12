import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInvoice extends Document {
  type: 'sales' | 'purchase';
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'cancelled';
  paymentStatus: 'pending' | 'partial' | 'paid' | 'overdue';
  invoiceNumber: string;
  date: Date;
  dueDate?: Date;
  companyId: string;
  customerId?: string;
  supplierId?: string;
  customerName?: string;
  supplierName?: string;
  customerTaxNumber?: string;
  supplierTaxNumber?: string;
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    vatRate: number;
    vatAmount: number;
    total: number;
  }>;
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  withholdingRate?: number;
  withholdingAmount?: number;
  total: number;
  notes?: string;
  gibUuid?: string;
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema = new Schema<IInvoice>(
  {
    type: {
      type: String,
      enum: ['sales', 'purchase'],
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'viewed', 'accepted', 'rejected', 'cancelled'],
      default: 'draft',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'partial', 'paid', 'overdue'],
      default: 'pending',
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    date: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
    },
    companyId: {
      type: String,
      required: true,
      ref: 'Company',
    },
    customerId: {
      type: String,
      ref: 'Contact',
    },
    supplierId: {
      type: String,
      ref: 'Contact',
    },
    customerName: {
      type: String,
    },
    supplierName: {
      type: String,
    },
    customerTaxNumber: {
      type: String,
    },
    supplierTaxNumber: {
      type: String,
    },
    items: [{
      id: String,
      description: String,
      quantity: Number,
      unit: String,
      unitPrice: Number,
      vatRate: Number,
      vatAmount: Number,
      total: Number,
    }],
    subtotal: {
      type: Number,
      required: true,
    },
    vatRate: {
      type: Number,
      required: true,
    },
    vatAmount: {
      type: Number,
      required: true,
    },
    withholdingRate: {
      type: Number,
    },
    withholdingAmount: {
      type: Number,
    },
    total: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
    },
    gibUuid: {
      type: String,
    },
    pdfUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
InvoiceSchema.index({ invoiceNumber: 1 });
InvoiceSchema.index({ companyId: 1 });
InvoiceSchema.index({ customerId: 1 });
InvoiceSchema.index({ status: 1 });
InvoiceSchema.index({ date: -1 });

const Invoice: Model<IInvoice> =
  mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);

export default Invoice;
