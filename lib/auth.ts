import bcrypt from 'bcryptjs';
import { prisma } from './db';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createUser(email: string, username: string, password: string) {
  const passwordHash = await hashPassword(password);
  
  // Assign sector randomly (A, B, or C)
  const sectors = ['A', 'B', 'C'];
  const sector = sectors[Math.floor(Math.random() * sectors.length)];

  const user = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash,
      sector,
      credits: 500, // Starting credits
    },
  });

  // Create vault balances
  await prisma.vaultBalances.create({
    data: {
      userId: user.id,
      credits: 0,
    },
  });

  return user;
}

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return null;
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return null;
  }

  return user;
}

