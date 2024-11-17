"use client";

import { useUser } from "@/Providers/UserProvider";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

const SignedOut = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useUser();
  if (!user && !loading) {
    return <>{children}</>;
  }
  if (loading) {
    return <Loader2 className="h-8 w-8 animate-spin" />;
  }
  return null;
};

export default SignedOut;
