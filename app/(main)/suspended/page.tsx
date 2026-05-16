import { AlertCircle, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import ToastOnMount from "@/components/ToastOnMount";

export default async function SuspendedPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const reason = resolvedParams.reason as string || "Violation of platform policies.";
  const untilStr = resolvedParams.until as string;
  let untilDate = null;
  let remainingTime = "";

  if (untilStr) {
    untilDate = new Date(untilStr);
    if (!isNaN(untilDate.getTime())) {
      remainingTime = formatDistanceToNow(untilDate);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <ToastOnMount message="You have been forcibly logged out due to suspension." />
      <div className="bg-darker border border-orange-500/30 p-8 rounded-xl shadow-2xl shadow-orange-500/10 max-w-md w-full text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 to-yellow-500"></div>
        
        <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-orange-400" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2">Account Suspended</h1>
        <p className="text-gray-400 mb-6">
          Your account has been temporarily suspended by our moderation team.
        </p>

        <div className="bg-dark/50 rounded-lg p-4 text-left border border-white/5 mb-6">
          <div className="mb-4">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Reason for Suspension</span>
            <p className="text-sm text-gray-200 font-medium">{reason}</p>
          </div>
          
          {untilDate && (
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Suspension Ends In</span>
              <p className="text-sm text-orange-400 font-medium">{remainingTime}</p>
              <p className="text-xs text-gray-500 mt-1">{untilDate.toLocaleString()}</p>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-400 mb-8">
          You cannot log in, make purchases, or access protected features until the suspension expires.
        </p>

        <Link
          href="/support"
          className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full border border-white/10"
        >
          Contact Support <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
