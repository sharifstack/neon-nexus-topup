import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export const dynamic = 'force-dynamic';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-grow flex flex-col">{children}</main>
      <Footer />
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#1c1c24', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
    </>
  );
}
