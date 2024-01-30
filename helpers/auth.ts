import 'server-only';

import { cookies } from 'next/headers';

export async function getSession() {
  try {
    return cookies().get('__session')?.value;
  } catch (error) {
    return undefined;
  }
}
