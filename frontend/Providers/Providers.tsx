import ReactQueryProvider from "@/Providers/QueryProvider";
import UserProvider from "@/Providers/UserProvider";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <ReactQueryProvider>
        <UserProvider>{children}</UserProvider>
      </ReactQueryProvider>
    </ThemeProvider>
  );
};

export default Providers;
