"use client";
import { ApplicationUser } from "@/types";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode, useContext, useEffect, useState } from "react";

const UserContext = React.createContext<{
  user: ApplicationUser | null;
  isAdmin: boolean;
  setUser: React.Dispatch<React.SetStateAction<ApplicationUser | null>>;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => void;
  loading: boolean;
}>({
  user: null,
  isAdmin: false,
  setIsAdmin: () => {},
  setUser: () => {},
  logout: () => {},
  loading: true,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ApplicationUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const jwtToken = Cookies.get("jwtToken");

    if (savedUser) {
      const user = JSON.parse(savedUser);
      const u = {
        ...user,
        wishlist: user?.wishlist ?? [],
      };
      setUser(u);

      // Decode role from JWT
      if (jwtToken) {
        const decoded: { [key: string]: any } = jwtDecode(jwtToken);
        const role =
          decoded[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];
        setIsAdmin(role === "admin");
      }
    } else if (
      !savedUser &&
      pathname !== "/" &&
      pathname !== "/books" &&
      pathname !== "/authors" &&
      !pathname?.startsWith("/auth")
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

  // Redirect non-admins away from the admin panel
  useEffect(() => {
    if (!loading && pathname?.startsWith("/admin/panel") && !isAdmin) {
      router.replace("/");
    }
  }, [pathname, loading, isAdmin]);

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem("user");
    Cookies.remove("jwtToken");
    Cookies.remove("refreshToken");
    router.replace("/");
  };

  return (
    <UserContext.Provider
      value={{ user, isAdmin, setUser, loading, logout, setIsAdmin }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserProvider;
