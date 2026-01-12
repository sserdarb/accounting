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
