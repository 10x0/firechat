'use client';
import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';

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

import { EyeSlashFilledIcon } from '@/icons/EyeSlashFilledIcon';
import { EyeFilledIcon } from '@/icons/EyeFilledIcon';
import { registerUser } from '@/actions/register';
import { LuAlertTriangle } from 'react-icons/lu';
import { Reaction } from '@/types/types';
import logo from '@/public/firechat.svg';
import Socials from '../socials';

const initialState: Reaction = {
  type: 'not-performed',
  message: '',
};

export function RegistrationForm() {
  const [state, formAction] = useFormState<Reaction | null, FormData>(
    registerUser,
    initialState
  );

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Card className='w-full md:w-1/2 lg:w-1/4 p-2'>
      <CardHeader className='text-3xl font-semibold flex gap-4 justify-center'>
        <Image src={logo} className='w-10 h-10' alt='Firechat Logo' priority />
        <span className='text-primary-500'>Firechat</span>
      </CardHeader>
      <CardHeader className='text-3xl font-semibold'>Register</CardHeader>
      <CardBody>
        <form action={formAction}>
          <Input isRequired type='text' name='name' label='Fullname' />
          <Spacer y={4} />
          <Input isRequired type='email' name='email' label='Email' />
          <Spacer y={4} />
          <Input
            isRequired
            name='password'
            label='Password'
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
          {state?.type === 'error' && (
            <div className='bg-danger-300/40 p-3 rounded-xl flex items-center gap-x-2 text-sm text-danger-500'>
              <LuAlertTriangle className='h-4 w-4' />
              <p>{state.message}</p>
            </div>
          )}
          <Spacer y={4} />
          <SubmitButton />
        </form>
      </CardBody>
      <div className='flex justify-center items-center gap-1'>
        Already have an account?
        <Button as={Link} href='/login' variant='light' color='primary'>
          Sign in
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

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      fullWidth
      size='lg'
      color='primary'
      type='submit'
      isLoading={pending}
    >
      Register
    </Button>
  );
};
