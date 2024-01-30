import 'server-only';
import type { SessionCookieOptions } from 'firebase-admin/auth';

import { serverAuth as auth, createAccount, getAccount } from '.';
import { getSession } from '@/helpers/auth';

export async function isUserAuthenticated(
  session: string | undefined = undefined
) {
  const _session = session ?? (await getSession());
  if (!_session) return false;

  try {
    const isRevoked = !(await auth.verifySessionCookie(_session, true));
    return !isRevoked;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function createUser({
  displayName,
  email,
  password,
}: {
  displayName: string;
  email: string;
  password: string;
}) {
  console.table({ displayName, email, password });
  const userRecord = await auth.createUser({
    displayName,
    email,
    password,
    emailVerified: false,
    disabled: false,
  });

  try {
    await createAccount(userRecord);
  } catch (e) {
    console.log(e);
  }
  return userRecord;
}

export const createIdToken = async (uid: string) => {
  const customToken = await auth.createCustomToken(uid);

  const res = await fetch(
    `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${process.env.FIREBASE_API_KEY}`,
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: customToken,
        returnSecureToken: true,
      }),
    }
  );
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const json = await res.json();
  return json.idToken;
};

export const verifyIdToken = async (idToken: string) => {
  let decoded = await auth.verifyIdToken(idToken);
  if (!decoded) {
    throw new Error('Invalid token.');
  }
  let user = await auth.getUser(decoded.uid);
  if (!user) {
    throw new Error('Invalid token.');
  }

  const userAccount = await getAccount(user.uid);
  if (userAccount.empty) {
    createAccount(user);
  }
  return decoded;
};

export async function getCurrentUser() {
  const session = await getSession();

  if (!(await isUserAuthenticated(session))) {
    return null;
  }

  const decodedIdToken = await auth.verifySessionCookie(session!);
  const currentUser = await auth.getUser(decodedIdToken.uid);

  return currentUser;
}

export async function createSessionCookie(
  idToken: string,
  sessionCookieOptions: SessionCookieOptions
) {
  return auth.createSessionCookie(idToken, sessionCookieOptions);
}

export async function revokeAllSessions(session: string) {
  const decodedIdToken = await auth.verifySessionCookie(session);

  return await auth.revokeRefreshTokens(decodedIdToken.sub);
}
