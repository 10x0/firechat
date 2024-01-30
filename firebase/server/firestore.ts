import 'server-only';
import { type UserRecord } from 'firebase-admin/auth';

import { serverDb as db } from '.';

const usersRef = db.collection('users');

export const createAccount = async (user: UserRecord) => {
  try {
    await usersRef.add(user.toJSON());
  } catch (e) {
    console.log(e);
  }
};

export const getAccount = (uid: string) => {
  return usersRef.where('uid', '==', uid).get();
};
