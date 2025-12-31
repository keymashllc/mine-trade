import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/auth';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20),
  password: z.string().min(6),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, password } = registerSchema.parse(body);

    // Check if user exists
    const { prisma } = await import('@/lib/db');
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email or username already exists' },
        { status: 400 }
      );
    }

    const user = await createUser(email, username, password);

    return NextResponse.json(
      { id: user.id, email: user.email, username: user.username, sector: user.sector },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Registration error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Registration failed', details: errorMessage },
      { status: 500 }
    );
  }
}

