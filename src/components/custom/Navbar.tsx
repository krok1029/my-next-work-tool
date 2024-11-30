import Link from 'next/link';
import { ModeToggle } from '@/components/custom/ModeToggle';
import User from '@/components/custom/User';
import { Menubar, MenubarMenu } from '@/components/ui/menubar';

const Navbar = () => {
  return (
    <div className="mb-3 flex h-16 items-center justify-between border-b border-gray-600 px-6">
      <Link href="/">
        <div className="cursor-pointer text-lg font-semibold">My Website</div>
      </Link>
      <Menubar className="gap-1 border-none">
        <MenubarMenu>
          <User />
        </MenubarMenu>
        <MenubarMenu>
          <ModeToggle />
        </MenubarMenu>
      </Menubar>
    </div>
  );
};

export default Navbar;
