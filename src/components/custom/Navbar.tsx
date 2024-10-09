import Link from 'next/link';
import { ModeToggle } from '@/components/custom/ModeToggle';
import User from '@/components/custom/User';
import { Menubar, MenubarMenu } from '@/components/ui/menubar';

const Navbar = () => {
  return (
    <div className="h-16 px-6 flex justify-between items-center  border-b border-gray-600 mb-3">
      <Link href="/">
        <div className="text-lg font-semibold cursor-pointer">My Website</div>
      </Link>
      <Menubar className="border-none gap-1">
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
