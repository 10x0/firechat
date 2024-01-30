'use server';
import type { Reaction } from '@/types/types';

import { createSessionCookie, verifyIdToken } from '@/firebase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const loginUser = async (idToken: string): Promise<Reaction> => {
  try {
    const decodedIdToken = await verifyIdToken(idToken);
    if (!decodedIdToken) {
      return {
        type: 'error',
        message: 'Token expired.',
      };
    }

    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    const sessionCookie = await createSessionCookie(idToken, {
      expiresIn,
    });

    cookies().set('__session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
    });
  } catch (error: any) {
    return {
      type: 'error',
      message: error.message,
    };
  }

  redirect('/');
};
