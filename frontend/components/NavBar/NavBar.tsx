import Image from "next/image";
import Link from "next/link";
import ProfileButton from "../Auth/profile-button";
import { ModeToggle } from "../theme-switcher";
import MobileNav from "./MobileNav";

const NavBar = () => {
  return (
    <nav className="bg-background flex justify-between items-center fixed z-50 w-full gap-5 p-6 dark:shadow-none sm:px-12">
      <Link href="/" className="flex items-center gap-1">
        <Image src="/icons/logo.svg" width={23} height={23} alt="" />
        <p className="max-sm:hidden text-2xl">
          Book <span className="text-violet-600">Rep</span>
        </p>
      </Link>
      <div className="flex justify-between items-center gap-5">
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <ProfileButton />
        </div>
        <MobileNav />
      </div>
    </nav>
  );
};

export default NavBar;
