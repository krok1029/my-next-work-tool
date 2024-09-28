import Link from 'next/link';
import { ModeToggle } from '@/components/custom/ModeToggle';

const Navbar = () => {
  return (
    <div className="h-16 px-6 flex justify-between items-center bg-gray-800 text-white border-b border-gray-600 mb-3">
      <Link href="/">
        <div className="text-lg font-semibold cursor-pointer">My Website</div>
      </Link>
      <ModeToggle />
    </div>
  );
};

export default Navbar;
