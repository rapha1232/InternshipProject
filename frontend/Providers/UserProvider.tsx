"use client";
import { ApplicationUser } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode, useContext, useEffect, useState } from "react";

const UserContext = React.createContext<{
  user: ApplicationUser | null;
  setUser: React.Dispatch<React.SetStateAction<ApplicationUser | null>>;
  loading: boolean;
}>({
  user: null,
  setUser: () => {},
  loading: true,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ApplicationUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      const u = {
        ...user,
        wishlist: user?.wishlist ?? [],
      };
      setUser(u);
    } else if (
      !savedUser &&
      pathname !== "/" &&
      pathname !== "/books" &&
      pathname !== "/authors"
    ) {
      router.replace("/");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "user") {
        setUser(event.newValue ? JSON.parse(event.newValue) : null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserProvider;
