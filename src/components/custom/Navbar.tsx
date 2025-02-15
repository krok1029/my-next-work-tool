import Link from 'next/link';
import { ModeToggle } from '@/components/custom/ModeToggle';
import User from '@/components/custom/User';
import { Menubar, MenubarMenu } from '@/components/ui/menubar';

const Navbar = () => {
  return (
    <div className="mb-3 flex h-16 items-center justify-between gap-4 border-b border-gray-600 px-6">
      <Link href="/">
        <div className="cursor-pointer text-lg font-semibold">My Website</div>
      </Link>

      <div className="flex grow justify-end gap-3">
        <Link href="/todos">
          <div className="cursor-pointer">Task 列表</div>
        </Link>
      </div>

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
