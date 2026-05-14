"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { processCheckout } from "@/app/actions/checkout";

export default function Checkout() {
  const [view, setView] = useState<"checkout" | "success">("checkout");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [transactionId, setTransactionId] = useState("");

  const handleCheckout = () => {
    startTransition(async () => {
      setError("");
      const formData = new FormData();
      formData.append('amount', '64.18');
      formData.append('description', 'Neon Nexus Pro Pass & 1000 Nexus Credits');
      
      const result = await processCheckout(formData);
      
      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        setTransactionId(result.transactionId!);
        setView("success");
      }
    });
  };

  return (
    <main className="flex-grow flex flex-col items-center justify-center p-gutter max-w-container-max mx-auto w-full py-xxl relative min-h-screen">
      {/* Ambient Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-container/10 rounded-full blur-[100px] pointer-events-none"></div>

      {view === "checkout" && (
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-gutter relative z-10" id="checkout-view">
          {/* Left Column: Stepper & Details */}
          <div className="md:col-span-7 flex flex-col gap-lg">
            <div className="glass-panel rounded-xl p-xl shadow-2xl flex flex-col gap-xl">
              {/* Header */}
              <div>
                <h1 className="font-headline-lg text-headline-lg text-primary mb-sm">Secure Checkout</h1>
                <p className="text-on-surface-variant font-body-lg text-body-lg">Complete your transaction to unlock your digital assets.</p>
              </div>

              {error && (
                <div className="p-sm bg-error/20 text-error rounded-md text-sm border border-error/30">
                  {error}
                </div>
              )}

              {/* Stepper */}
              <div className="flex items-center justify-between relative mb-md">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-surface-variant z-0"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 h-[2px] bg-tertiary-container shadow-[0_0_10px_rgba(189,236,0,0.5)] z-0 transition-all duration-500"></div>
                
                <div className="relative z-10 flex flex-col items-center gap-xs">
                  <div className="w-8 h-8 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center font-bold shadow-[0_0_15px_rgba(189,236,0,0.4)]">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-tertiary-container">Details</span>
                </div>
                
                <div className="relative z-10 flex flex-col items-center gap-xs">
                  <div className="w-8 h-8 rounded-full bg-surface-variant border-2 border-tertiary-container text-tertiary-container flex items-center justify-center font-bold shadow-[0_0_15px_rgba(189,236,0,0.4)]">2</div>
                  <span className="font-label-sm text-label-sm text-tertiary-container">Payment</span>
                </div>
                
                <div className="relative z-10 flex flex-col items-center gap-xs">
                  <div className="w-8 h-8 rounded-full bg-surface-variant border-2 border-outline-variant text-on-surface-variant flex items-center justify-center font-bold">3</div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Review</span>
                </div>
              </div>

              {/* Payment Form */}
              <form className="flex flex-col gap-md">
                <h2 className="font-headline-md text-headline-md text-primary mt-sm">Payment Method</h2>
                {/* Card Selection */}
                <div className="grid grid-cols-2 gap-sm mb-sm">
                  <button className="glass-panel p-md rounded-lg flex items-center justify-center gap-sm border-primary-container shadow-[0_0_15px_rgba(0,242,255,0.2)] bg-surface-container-high" type="button">
                    <span className="material-symbols-outlined text-primary-container">credit_card</span>
                    <span className="font-label-md text-label-md text-primary-container">Credit Card</span>
                  </button>
                  <button className="glass-panel p-md rounded-lg flex items-center justify-center gap-sm hover:bg-surface-container-high transition-colors text-on-surface-variant" type="button">
                    <span className="material-symbols-outlined">account_balance_wallet</span>
                    <span className="font-label-md text-label-md">Crypto Wallet</span>
                  </button>
                </div>

                <div className="flex flex-col gap-xs">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Card Number</label>
                  <div className="relative">
                    <input className="input-focus bg-[#050506] border border-outline-variant/30 w-full rounded-lg py-md px-md pl-12 text-on-surface font-body-md" placeholder="0000 0000 0000 0000" type="text" />
                    <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline">credit_card</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-md">
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Expiry Date</label>
                    <input className="input-focus bg-[#050506] border border-outline-variant/30 w-full rounded-lg py-md px-md text-on-surface font-body-md" placeholder="MM/YY" type="text" />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">CVC</label>
                    <input className="input-focus bg-[#050506] border border-outline-variant/30 w-full rounded-lg py-md px-md text-on-surface font-body-md" placeholder="123" type="text" />
                  </div>
                </div>

                <div className="flex flex-col gap-xs mt-sm">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Cardholder Name</label>
                  <input className="input-focus bg-[#050506] border border-outline-variant/30 w-full rounded-lg py-md px-md text-on-surface font-body-md" placeholder="J. Doe" type="text" />
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="md:col-span-5 flex flex-col gap-lg">
            <div className="glass-panel rounded-xl p-xl shadow-2xl flex flex-col gap-md sticky top-xl">
              <h2 className="font-headline-md text-headline-md text-primary border-b border-outline-variant/30 pb-sm mb-sm">Order Summary</h2>
              
              {/* Items */}
              <div className="flex flex-col gap-md mb-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-sm">
                    <div className="w-12 h-12 rounded bg-surface-container-highest flex items-center justify-center border border-outline-variant/50">
                      <span className="material-symbols-outlined text-secondary">sports_esports</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md text-on-surface">Neon Nexus Pro Pass</span>
                      <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mt-1">Digital Item</span>
                    </div>
                  </div>
                  <span className="font-headline-md text-headline-md text-primary">$49.99</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-sm">
                    <div className="w-12 h-12 rounded bg-surface-container-highest flex items-center justify-center border border-outline-variant/50">
                      <span className="material-symbols-outlined text-primary-container">diamond</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md text-on-surface">1000 Nexus Credits</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant mt-1">In-Game Currency</span>
                    </div>
                  </div>
                  <span className="font-headline-md text-headline-md text-primary">$9.99</span>
                </div>
              </div>

              {/* Coupon Input */}
              <div className="flex gap-sm mb-md">
                <input className="input-focus bg-[#050506] border border-outline-variant/30 flex-grow rounded-lg py-sm px-md text-on-surface font-body-sm" placeholder="Enter Coupon Code" type="text" />
                <button className="bg-surface-container-high hover:bg-surface-bright text-primary-container font-label-md text-label-md px-md rounded-lg transition-colors border border-outline-variant/30">Apply</button>
              </div>

              {/* Totals */}
              <div className="flex flex-col gap-sm border-t border-outline-variant/30 pt-md">
                <div className="flex justify-between items-center text-on-surface-variant">
                  <span className="font-body-md text-body-md">Subtotal</span>
                  <span className="font-body-md text-body-md">$59.98</span>
                </div>
                <div className="flex justify-between items-center text-on-surface-variant">
                  <span className="font-body-md text-body-md">Taxes</span>
                  <span className="font-body-md text-body-md">$4.20</span>
                </div>
                <div className="flex justify-between items-center mt-sm">
                  <span className="font-headline-md text-headline-md text-on-surface">Total</span>
                  <span className="font-headline-xl text-headline-xl text-primary drop-shadow-[0_0_10px_rgba(0,242,255,0.5)]">$64.18</span>
                </div>
              </div>

              {/* Action */}
              <button 
                type="button"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-primary-container to-blue-500 text-on-primary-container font-headline-md text-headline-md py-md rounded-lg mt-md hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(0,242,255,0.4)] uppercase tracking-wider disabled:opacity-50 disabled:hover:scale-100"
                onClick={handleCheckout}
              >
                {isPending ? "Processing..." : "Confirm Payment"}
              </button>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-sm mt-sm text-outline font-label-sm text-label-sm opacity-70">
                <span className="material-symbols-outlined text-[16px]">lock</span>
                <span>256-bit Secure SSL Encryption</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === "success" && (
        <div className="w-full max-w-2xl relative z-20" id="success-view">
          <div className="absolute inset-0 bg-surface/80 backdrop-blur-[40px] rounded-2xl z-0 border border-outline-variant/20 shadow-[0_0_50px_rgba(189,236,0,0.15)]"></div>
          <div className="relative z-10 p-xxl flex flex-col items-center text-center gap-xl">
            {/* Large Neon Checkmark */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 bg-tertiary-container rounded-full blur-[40px] opacity-40"></div>
              <div className="w-24 h-24 rounded-full bg-tertiary-container/20 border-2 border-tertiary-container flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(189,236,0,0.6)]">
                <span className="material-symbols-outlined text-[64px] text-tertiary-container drop-shadow-[0_0_10px_rgba(189,236,0,0.8)]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
            </div>
            
            {/* Text Content */}
            <div>
              <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-md">Payment Successful!</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mx-auto">Your digital assets have been securely delivered to your account inventory.</p>
            </div>

            {/* Transaction Details Block */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-md w-full max-w-sm flex flex-col gap-xs text-left shadow-inner">
              <div className="flex justify-between items-center">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Transaction ID</span>
                <span className="font-label-md text-label-md text-primary font-mono">#{transactionId || 'NX-88392A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Date</span>
                <span className="font-label-md text-label-md text-on-surface">Oct 24, 2024</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Total Amount</span>
                <span className="font-headline-md text-headline-md text-tertiary-container">$64.18</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-md w-full justify-center mt-md">
              <button className="glass-panel border-outline-variant hover:border-primary-container text-primary-container font-headline-md text-headline-md py-md px-xl rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,242,255,0.2)] flex items-center justify-center gap-sm">
                <span className="material-symbols-outlined">download</span>
                Download Receipt
              </button>
              <Link href="/" className="bg-surface-container-highest hover:bg-surface-bright text-on-surface font-headline-md text-headline-md py-md px-xl rounded-lg transition-colors duration-300 border border-outline-variant/30 flex items-center justify-center">
                Return to Home
              </Link>
            </div>
            
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-md opacity-60">A confirmation email has been sent to your registered address.</p>
          </div>
        </div>
      )}
    </main>
  );
}
