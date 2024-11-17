import LeftSideBar from "@/components/LeftSideBar";
import NavBar from "@/components/NavBar/NavBar";
import "../globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative bg-background">
      <NavBar />
      <div className="flex">
        <LeftSideBar />
        <section className="flex min-h-screen mt-[100px] w-full flex-col">
          <div className="size-full">{children}</div>
        </section>
      </div>
    </main>
  );
}
