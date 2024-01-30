'use server';

import { revokeAllSessions } from '@/firebase/server';
import { cookies } from 'next/headers';

export const logout = async () => {
  const sessionCookie = cookies().get('__session')?.value;

  if (!sessionCookie) {
    return {
      type: 'error',
      message: 'Session not found.',
    };
  }

  await revokeAllSessions(sessionCookie);
  cookies().delete('__session');
};
