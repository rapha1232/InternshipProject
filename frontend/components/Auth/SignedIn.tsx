"use client";

import { useUser } from "@/Providers/UserProvider";
import { ApplicationUser } from "@/types";
import { ReactNode } from "react";

const SignedIn = ({
  children,
}: {
  children: (props: { user: ApplicationUser }) => ReactNode;
}) => {
  const { user } = useUser();
  if (!user) {
    return null;
  }
  return <>{children({ user })}</>;
};

export default SignedIn;
