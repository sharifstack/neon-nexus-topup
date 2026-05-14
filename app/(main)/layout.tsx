import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const dynamic = 'force-dynamic';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-grow flex flex-col">{children}</main>
      <Footer />
    </>
  );
}
