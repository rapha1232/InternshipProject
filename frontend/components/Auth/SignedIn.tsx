"use client";

import { useUser } from "@/Providers/UserProvider";
import { ApplicationUser } from "@/types";
import { ReactNode } from "react";

const SignedIn = ({
  children,
}: {
  children: (props: { user: ApplicationUser }) => ReactNode;
}) => {
  const { user, loading } = useUser();
  if (!user) {
    return null;
  }

  if (loading) {
    return null;
  }

  return <>{children({ user })}</>;
};

export default SignedIn;
