"use client";
import { Button } from "@/components/ui/button";
import { sidebarLinks } from "@/constants";
import { useUser } from "@/Providers/UserProvider";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SignedOut from "./Auth/SignedOut";

const LeftSideBar = () => {
  const pathname = usePathname();
  const { isAdmin, loading } = useUser();

  if (loading) return <Loader2 className="" />;
  return (
    <section className="bg-background custom-scrollbar light-border sticky left-0 top-0 z-10 flex h-screen flex-col justify-between overflow-y-auto border-r border-violet-600/30 p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
      <div className="flex flex-1 flex-col gap-6">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname?.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;
          return (
            <Link
              key={link.route}
              href={link.route}
              className={`${
                isActive
                  ? "bg-violet-600"
                  : "dark:bg-neutral-900 bg-neutral-200 text-muted-foreground"
              }
            relative flex items-center justify-start gap-4 p-4 rounded-lg`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={20}
                height={20}
                className={`invert dark:invert-0`}
              />
              <p
                className={`${
                  isActive ? "base-bold" : "base-medium"
                } max-lg:hidden`}
              >
                {link.label}
              </p>
            </Link>
          );
        })}
        {/* Admin Panel Link */}
        {isAdmin && (
          <Link
            href="/admin/panel"
            className={`${
              pathname === "/admin/panel"
                ? "bg-violet-600"
                : "dark:bg-neutral-900 bg-neutral-200 text-muted-foreground"
            } relative flex items-center justify-start gap-4 p-4 rounded-lg`}
          >
            <Image
              src="/icons/admin.svg"
              alt="Admin Panel"
              width={20}
              height={20}
              className="invert dark:invert-0"
            />
            <p className="base-medium max-lg:hidden">Admin Panel</p>
          </Link>
        )}
      </div>
      <SignedOut>
        <div className="flex flex-col gap-3">
          <Link href="/auth/login">
            <Button
              className="min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none bg-neutral-100 dark:bg-neutral-900"
              variant={"outline"}
            >
              <Image
                src="/icons/account.svg"
                alt="Log In"
                width={20}
                height={20}
                className="invert dark:invert-0 lg:hidden"
              />
              <span className="text-foreground max-lg:hidden">Log In</span>
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button
              className="text-foreground min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none bg-violet-600"
              variant={"outline"}
            >
              <Image
                src="/icons/register.svg"
                alt="Log In"
                width={20}
                height={20}
                className="invert dark:invert-0 lg:hidden"
              />
              <span className="text-foreground max-lg:hidden">Sign Up</span>
            </Button>
          </Link>
        </div>
      </SignedOut>
    </section>
  );
};

export default LeftSideBar;
