'use client';
import { logout } from '@/actions/logout';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

export function SignOutButton() {
  const router = useRouter();

  const onClick = async () => {
    await logout();
    router.refresh();
  };

  return <Button onClick={onClick}>Log out</Button>;
}
