import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { clientAuth as auth } from './init';
import { FirebaseError } from 'firebase/app';

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export const signIn = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const buildErrorMessage = (e: FirebaseError): string => {
  let error;
  if (e.code.startsWith('auth/')) {
    error = e.code.substring(5);
  }
  switch (error) {
    case 'invalid-email':
      return 'Invalid email';
    case 'missing-password':
      return 'Missing password';
    case 'invalid-credential':
      return 'Invalid credential.';
    // case 'invalid'
    default:
      break;
  }
  return 'Something went wrong.';
};
