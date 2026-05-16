import { AlertOctagon, ShieldAlert, ArrowRight } from "lucide-react";
import Link from "next/link";
import ToastOnMount from "@/components/ToastOnMount";

export default async function BannedPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const reason = resolvedParams.reason as string || "Severe violation of platform terms of service.";

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <ToastOnMount message="You have been forcibly logged out. Your account is banned." />
      <div className="bg-darker border border-red-500/30 p-8 rounded-xl shadow-2xl shadow-red-500/10 max-w-md w-full text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-400"></div>
        
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertOctagon className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2">Account Permanently Banned</h1>
        <p className="text-gray-400 mb-6">
          Your account has been permanently restricted from accessing Neon Nexus.
        </p>

        <div className="bg-dark/50 rounded-lg p-4 text-left border border-white/5 mb-6">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Ban Reason</span>
              <p className="text-sm text-gray-200 font-medium">{reason}</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-400 mb-8">
          This decision is final. You cannot create new accounts, make purchases, or use our services.
        </p>

        <Link
          href="/support"
          className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full border border-white/10"
        >
          Appeal Decision <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
