'use client';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
  Spacer,
} from '@nextui-org/react';
import { FormEvent, useState, useTransition } from 'react';
import { EyeSlashFilledIcon } from '../../../icons/EyeSlashFilledIcon';
import { EyeFilledIcon } from '../../../icons/EyeFilledIcon';
import Socials from '../socials';
import { buildErrorMessage, signIn } from '@/firebase/client';
import { loginUser } from '@/actions/login';
import { LuAlertTriangle } from 'react-icons/lu';
import { FirebaseError } from 'firebase/app';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/firechat.svg';

export function LoginForm() {
  const [pending, startTransition] = useTransition();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isVisible, setIsVisible] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        let userCredential = await signIn({ email, password });
        let idToken = await userCredential.user.getIdToken(true);
        await loginUser(idToken);
      } catch (e: any) {
        if (e instanceof FirebaseError) {
          let errorMessage = buildErrorMessage(e);
          setError(errorMessage);
        }
      }
    });
  };

  return (
    <Card className='w-full md:w-1/2 lg:w-1/4 p-2'>
      <CardHeader className='text-3xl font-semibold flex gap-4 justify-center'>
        <Image src={logo} className='w-10 h-10' alt='Firechat Logo' priority />
        <span className='text-primary-500'>Firechat</span>
      </CardHeader>
      <CardHeader className='text-3xl font-semibold'>Log In</CardHeader>
      <CardBody>
        <form onSubmit={onSubmit}>
          <Input
            isRequired
            type='email'
            name='email'
            label='Email'
            value={email}
            onValueChange={setEmail}
          />
          <Spacer y={4} />
          <Input
            isRequired
            name='password'
            label='Password'
            value={password}
            onValueChange={setPassword}
            endContent={
              <button
                className='focus:outline-none'
                type='button'
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className='text-2xl text-default-400 pointer-events-none' />
                ) : (
                  <EyeFilledIcon className='text-2xl text-default-400 pointer-events-none' />
                )}
              </button>
            }
            type={isVisible ? 'text' : 'password'}
          />
          <Spacer y={4} />
          {error && (
            <div className='bg-danger-300/40 p-3 rounded-xl flex items-center gap-x-2 text-sm text-danger-500'>
              <LuAlertTriangle className='h-4 w-4' />
              <p>{error}</p>
            </div>
          )}
          <Spacer y={4} />
          <Button
            fullWidth
            size='lg'
            color='primary'
            type='submit'
            isLoading={pending}
          >
            Login
          </Button>
        </form>
      </CardBody>
      <div className='flex justify-center items-center gap-1'>
        Don&apos;t have an account?
        <Button as={Link} href='/register' variant='light' color='primary'>
          Register
        </Button>
      </div>
      <Spacer />
      <Divider />
      <Spacer />
      <p className='text-center'>Or continue with</p>
      <CardFooter>
        <Socials />
      </CardFooter>
    </Card>
  );
}
