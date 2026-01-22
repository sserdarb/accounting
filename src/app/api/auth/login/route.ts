import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email: rawEmail, password } = body;
    const email = rawEmail?.toLowerCase().trim();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-posta ve şifre gerekli' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user by email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.warn(`Login attempt failed: User not found with email: ${email}`);
      return NextResponse.json(
        { error: 'Geçersiz e-posta veya şifre' },
        { status: 401 }
      );
    }

    // Check user status
    if (user.status === 'suspended') {
      console.warn(`Login attempt failed: Suspended account: ${email}`);
      return NextResponse.json(
        { error: 'Hesabınız askıya alınmıştır. Lütfen yönetici ile iletişime geçin.' },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      console.warn(`Login attempt failed: Incorrect password for user: ${email}`);
      return NextResponse.json(
        { error: 'Geçersiz e-posta veya şifre' },
        { status: 401 }
      );
    }

    console.log(`User logged in successfully: ${email}`);

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      companyId: user.companyId?.toString(),
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
          companyId: user.companyId?.toString(),
        },
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Giriş başarısız' },
      { status: 500 }
    );
  }
}
