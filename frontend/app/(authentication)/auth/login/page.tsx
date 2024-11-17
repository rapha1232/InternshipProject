import { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/components/Auth/loginForm";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Login Page",
  description: "Login Page",
};

export default function LoginPage() {
  return (
    <>
      <div className="container flex mx-auto max-w-[400px] relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* Form on the left side */}
        <div className="lg:p-8">
          {/* Move the Register link here, aligned with the form */}
          <Link
            href="/auth/register"
            className={cn(
              buttonVariants({ variant: "default" }),
              "absolute left-4 top-4 md:left-8 md:top-8"
            )}
          >
            Register
          </Link>
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Log into your account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your info below to login
              </p>
            </div>
            <LoginForm />
          </div>
        </div>

        {/* Image on the right side */}
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            My Book Rep
          </div>
        </div>
      </div>
    </>
  );
}
