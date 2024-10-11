'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from '@/app/action/auth/signOut';
import { User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

const User = () => {
  const router = useRouter();
  const handleSignOut = async () => {
    await signOut();
    router.push('/user/signin');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="">
          <UserIcon className="h-[1.2rem] w-[1.2rem] text-accent-foreground transition-all" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleSignOut}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default User;
