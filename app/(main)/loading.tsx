export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#0d1117]">
      <div className="relative">
        {/* Outer Glow */}
        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse"></div>
        
        {/* Spinner */}
        <div className="relative w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
        
        {/* Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary animate-pulse text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            token
          </span>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col items-center gap-2">
        <p className="text-white font-black uppercase tracking-[0.2em] text-sm animate-pulse">
          Neon Nexus
        </p>
        <p className="text-on-surface-variant text-[10px] uppercase tracking-widest font-bold">
          Initiating Secure Connection...
        </p>
      </div>
    </div>
  );
}
