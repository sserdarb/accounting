import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContact extends Document {
  type: 'customer' | 'supplier';
  name: string;
  taxNumber?: string;
  taxOffice?: string;
  address?: string;
  phone?: string;
  email?: string;
  companyId: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    type: {
      type: String,
      enum: ['customer', 'supplier'],
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    taxNumber: {
      type: String,
      trim: true,
    },
    taxOffice: {
      type: String,
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
    companyId: {
      type: String,
      required: true,
      ref: 'Company',
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
ContactSchema.index({ companyId: 1 });
ContactSchema.index({ type: 1 });
ContactSchema.index({ taxNumber: 1 });

const Contact: Model<IContact> =
  mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);

export default Contact;
