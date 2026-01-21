import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const uri = process.env.MONGODB_URI || 'not defined';
        // Mask password
        const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');

        const start = Date.now();
        await connectDB();
        const duration = Date.now() - start;

        const dbState = mongoose.connection.readyState;
        const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];

        return NextResponse.json({
            success: true,
            message: 'Database connection successful',
            state: states[dbState] || 'unknown',
            uri: maskedUri,
            dbName: mongoose.connection.name,
            host: mongoose.connection.host,
            duration: `${duration}ms`
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            name: error.name,
            stack: error.stack,
            env_uri_defined: !!process.env.MONGODB_URI,
            masked_uri: (process.env.MONGODB_URI || '').replace(/:([^:@]+)@/, ':****@')
        }, { status: 500 });
    }
}
