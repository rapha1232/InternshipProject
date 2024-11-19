"use client";
import { useUser } from "@/Providers/UserProvider";

const SignedOut = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser(); // Get user state from context

  if (user) {
    return null; // Render nothing if user is signed in
  }

  return <>{children}</>;
};

export default SignedOut;
