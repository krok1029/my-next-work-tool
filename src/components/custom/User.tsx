'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import { User as UserIcon } from 'lucide-react';

const User = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="">
          <UserIcon className="h-[1.2rem] w-[1.2rem] text-accent-foreground transition-all" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default User;
