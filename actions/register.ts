'use server';

import {
  createUser,
  createIdToken,
  createSessionCookie,
} from '@/firebase/server';
import { RegisterSchema } from '@/schemas/schemas';
import { FormAction } from '@/types/types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const registerUser: FormAction = async (prevState, formData) => {
  const validatedFields = RegisterSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      type: 'error',
      message: 'Input vadlidation failed.',
    };
  }

  try {
    const userRecord = await createUser({
      displayName: validatedFields.data.name,
      email: validatedFields.data.email,
      password: validatedFields.data.password,
    });
    if (!userRecord) {
      return { type: 'error', message: 'Error' };
    }
    const token = await createIdToken(userRecord!.uid);
    console.log('TOKEN: ', token);

    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    const sessionCookie = await createSessionCookie(token, {
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
