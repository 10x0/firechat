import { loginUser } from '@/actions/login';
import { signInWithGoogle } from '@/firebase/client';
import { Button } from '@nextui-org/react';
import { useTransition } from 'react';
import { FaGithub, FaGoogle } from 'react-icons/fa';

export default function Socials({}) {
  const [pending, startTransition] = useTransition();

  const handleGoogleLogin = () => {
    startTransition(async () => {
      try {
        let userCredential = await signInWithGoogle();
        let idToken = await userCredential.user.getIdToken(true);
        await loginUser(idToken);
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
    <div className='flex items-center w-full gap-x-2'>
      <Button
        size='lg'
        className='w-full'
        onClick={handleGoogleLogin}
        isLoading={pending}
      >
        {!pending && <FaGoogle className='w-5 h-5' />}
      </Button>
      <Button size='lg' className='w-full' onClick={() => {}}>
        <FaGithub className='w-5 h-5' />
      </Button>
    </div>
  );
}
