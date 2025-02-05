import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export async function HashingPassword(pass: string): Promise<string> {
  const saltRounds: number = 10;

  if (!pass)
    throw new HttpException('Password is required', HttpStatus.CONFLICT);

  try {
    const hash = await bcrypt.hash(pass, saltRounds);
    return hash;
  } catch (error) {
    console.error('Error while hashing password:', error);
    throw error;
  }
}
