import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Company from '@/models/Company';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, companyName, taxNumber } = body;

    // Validation
    if (!name || !email || !password || !companyName || !taxNumber) {
      return NextResponse.json(
        { error: 'Tüm alanlar gerekli' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Geçersiz e-posta adresi' },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Şifre en az 8 karakter olmalı' },
        { status: 400 }
      );
    }

    // Tax number validation
    if (!/^\d{10}$/.test(taxNumber)) {
      return NextResponse.json(
        { error: 'Vergi numarası 10 haneli olmalı' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu e-posta adresi zaten kullanımda' },
        { status: 400 }
      );
    }

    // Check if tax number already exists
    const existingCompany = await Company.findOne({ taxNumber });
    if (existingCompany) {
      return NextResponse.json(
        { error: 'Bu vergi numarası zaten kullanımda' },
        { status: 400 }
      );
    }

    // Create company
    const company = await Company.create({
      name: companyName,
      taxNumber,
      taxOffice: 'Belirtilmedi',
      address: 'Belirtilmedi',
      phone: 'Belirtilmedi',
      email: email,
      logo: '',
      gibUsername: '',
      gibPassword: '',
    });

    // Create user
    const user = await User.create({
      email,
      password,
      name,
      role: 'admin',
      companyId: company._id,
    });

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      companyId: company._id.toString(),
    });

    // Return user data and token
    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          companyId: company._id.toString(),
        },
        company: {
          id: company._id.toString(),
          name: company.name,
          taxNumber: company.taxNumber,
        },
        token,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Kayıt başarısız' },
      { status: 500 }
    );
  }
}
