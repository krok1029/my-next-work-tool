import { ModeToggle } from '@/components/custom/ModeToggle';

const Navbar = () => {
  return (
    <div className="h-16 p-3 flex justify-between items-center border-b border-gray-600 mb-3">
      <div>Web?</div>
      <ModeToggle />
    </div>
  );
};

export default Navbar;
