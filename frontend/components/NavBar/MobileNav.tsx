"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SignedOut from "../Auth/SignedOut";

const NavContent = () => {
  const pathname = usePathname();
  return (
    <section className="flex h-full flex-col  gap-6 pt-16">
      {sidebarLinks.map((link) => {
        const isActive =
          (pathname?.includes(link.route) && link.route.length > 1) ||
          pathname === link.route;
        return (
          <SheetClose asChild key={link.route}>
            <Link
              href={link.route}
              className={`${
                isActive ? "bg-violet-600 rounded-lg" : "text-muted-foreground"
              }
            relative flex items-center justify-start gap-4 p-4`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={20}
                height={20}
                className={`${isActive ? "" : "invert-colors"}`}
              />
              <p className={`${isActive ? "base-bold" : "base-medium"}`}>
                {link.label}
              </p>
            </Link>
          </SheetClose>
        );
      })}
    </section>
  );
};

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image
          src="/icons/burger.svg"
          width={36}
          height={36}
          alt="menu"
          className="invert dark:invert-0 sm:hidden"
        ></Image>
      </SheetTrigger>
      <SheetTitle className="hidden">Menu</SheetTitle>
      <SheetContent side={"left"} className="border-none" aria-describedby="">
        <Link href="/" className="flex flex-row gap-2">
          <Image
            src="/icons/logo.svg"
            width={23}
            height={23}
            alt="DevFlow"
          ></Image>
          <p>
            Book <span className="text-primary-500">Rep</span>
          </p>
        </Link>
        <div className="h-4/5">
          <SheetClose asChild>
            <NavContent />
          </SheetClose>
          <SignedOut>
            <div className="flex flex-col gap-3">
              <SheetClose asChild>
                <Link href="/login">
                  <Button className="min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                    <span className="text-primary-500">Log In</span>
                  </Button>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/register">
                  <Button className="min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                    <span className="text-primary-500">Sign Up</span>
                  </Button>
                </Link>
              </SheetClose>
            </div>
          </SignedOut>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
