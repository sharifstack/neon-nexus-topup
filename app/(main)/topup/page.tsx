export default function TopUp() {
  return (
    <div className="w-full max-w-container-max mx-auto px-gutter py-xxl grid grid-cols-1 md:grid-cols-12 gap-xl">
      {/* Left Column: Info & Banner */}
      <div className="md:col-span-5 flex flex-col gap-xl">
        {/* Game Banner */}
        <div className="rounded-xl overflow-hidden glass-panel relative group">
          <div className="aspect-video w-full bg-surface-container-high relative">
            <img alt="PUBG Mobile Banner" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD15agPeCt3oImyOlHdAn64ufc7lcm_beY5yQENEDpBczchyDCkX_6h2dXvCJ-2u9xy2Ok06OdW2W8cx1_5RWh6tylmaLPFfqZmcqz0hZLC8Imd-nCjuBjBKvGme2HuQUSchAOLoDVUg6QaTwIIKjXXOr01PWwuSjJDfCSisfFf7ksLmG0zBvlsgNVgwm359nApHSc9auf1oh9decLdQZzC4S75-Dr_ABm0vkjH5slu611mN_KgHuzcCM7GxuWglwK5YUxwWX5o27U" />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-90"></div>
            <div className="absolute bottom-md left-md">
              <h1 className="font-headline-xl text-headline-xl text-primary drop-shadow-lg">PUBG Mobile</h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-sm">Instant UC Top-Up</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="glass-panel rounded-xl p-lg">
          <h2 className="font-headline-md text-headline-md text-primary mb-md">About This Game</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-md">Dominate the battleground with instant UC delivery. Upgrade your Royale Pass, unlock premium crates, and customize your arsenal with exclusive weapon finishes. Neon Nexus guarantees secure and immediate delivery directly to your account.</p>
        </div>

        {/* How to Buy */}
        <div className="glass-panel rounded-xl p-lg">
          <h2 className="font-headline-md text-headline-md text-primary mb-md">How to Top Up</h2>
          <ul className="space-y-md font-body-md text-body-md text-on-surface-variant">
            <li className="flex items-start gap-sm">
              <span className="material-symbols-outlined text-secondary mt-xs">looks_one</span>
              <span>Enter your Player ID.</span>
            </li>
            <li className="flex items-start gap-sm">
              <span className="material-symbols-outlined text-secondary mt-xs">looks_two</span>
              <span>Select your desired UC package.</span>
            </li>
            <li className="flex items-start gap-sm">
              <span className="material-symbols-outlined text-secondary mt-xs">looks_3</span>
              <span>Choose your preferred payment method.</span>
            </li>
            <li className="flex items-start gap-sm">
              <span className="material-symbols-outlined text-secondary mt-xs">looks_4</span>
              <span>Complete the transaction and receive UC instantly!</span>
            </li>
          </ul>
        </div>

        {/* Support Box */}
        <div className="glass-panel rounded-xl p-lg border-l-4 border-l-tertiary-fixed">
          <div className="flex items-center gap-md mb-sm">
            <span className="material-symbols-outlined text-tertiary-fixed text-3xl">support_agent</span>
            <h3 className="font-headline-md text-headline-md text-tertiary-fixed">24/7 Support</h3>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Having trouble with your top-up? Our elite support squad is standing by to assist you immediately.</p>
          <button className="mt-md text-tertiary-fixed font-label-md text-label-md hover:underline flex items-center gap-xs">
            Contact Support <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Right Column: Purchase Panel */}
      <div className="md:col-span-7">
        <div className="glass-panel rounded-xl p-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border-t border-t-primary/20">
          
          {/* Step 1: User ID */}
          <div className="mb-xl">
            <div className="flex items-center gap-sm mb-md">
              <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">1</div>
              <h2 className="font-headline-md text-headline-md text-on-surface">Player Identity</h2>
            </div>
            <div className="flex gap-md">
              <div className="relative flex-grow">
                <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline">badge</span>
                <input className="w-full bg-[#050506] border border-outline-variant rounded-lg py-md pl-12 pr-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors font-body-md text-body-md placeholder-outline-variant" placeholder="Enter Player ID" type="text" />
              </div>
              <button className="bg-surface-variant text-on-surface-variant font-label-md text-label-md px-lg py-md rounded-lg hover:bg-surface-bright transition-colors border border-outline-variant/30">
                Verify
              </button>
            </div>
            <p className="text-xs text-outline mt-sm flex items-center gap-xs"><span className="material-symbols-outlined text-[14px]">info</span> To find your Player ID, tap your avatar in the top left corner of the main screen.</p>
          </div>

          {/* Step 2: Select Package */}
          <div className="mb-xl">
            <div className="flex items-center gap-sm mb-md">
              <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">2</div>
              <h2 className="font-headline-md text-headline-md text-on-surface">Select Payload</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
              <div className="glass-panel rounded-lg p-md text-center cursor-pointer hover:scale-105 transition-all duration-200 border-outline-variant/30 hover:border-primary group">
                <div className="flex justify-center mb-sm">
                  <span className="material-symbols-outlined text-4xl text-primary group-hover:text-primary-container drop-shadow-[0_0_10px_rgba(0,242,255,0.5)]">monetization_on</span>
                </div>
                <div className="font-headline-md text-headline-md text-on-surface mb-xs">60 UC</div>
                <div className="font-label-sm text-label-sm text-outline mb-sm">+ 0 Bonus</div>
                <div className="font-label-md text-label-md text-primary">$0.99</div>
              </div>
              <div className="glass-panel rounded-lg p-md text-center cursor-pointer hover:scale-105 transition-all duration-200 border-outline-variant/30 hover:border-primary group">
                <div className="flex justify-center mb-sm">
                  <span className="material-symbols-outlined text-4xl text-primary group-hover:text-primary-container drop-shadow-[0_0_10px_rgba(0,242,255,0.5)]">monetization_on</span>
                </div>
                <div className="font-headline-md text-headline-md text-on-surface mb-xs">325 UC</div>
                <div className="font-label-sm text-label-sm text-tertiary-fixed mb-sm">+ 25 Bonus</div>
                <div className="font-label-md text-label-md text-primary">$4.99</div>
              </div>
              <div className="glass-panel rounded-lg p-md text-center cursor-pointer scale-105 border-primary relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-secondary text-on-secondary text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider">Best Value</div>
                <div className="flex justify-center mb-sm mt-xs">
                  <span className="material-symbols-outlined text-4xl text-primary-container drop-shadow-[0_0_15px_rgba(0,242,255,0.8)]">toll</span>
                </div>
                <div className="font-headline-md text-headline-md text-on-surface mb-xs">660 UC</div>
                <div className="font-label-sm text-label-sm text-tertiary-fixed mb-sm">+ 60 Bonus</div>
                <div className="font-label-md text-label-md text-primary">$9.99</div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-container shadow-[0_0_10px_rgba(0,242,255,1)]"></div>
              </div>
              <div className="glass-panel rounded-lg p-md text-center cursor-pointer hover:scale-105 transition-all duration-200 border-outline-variant/30 hover:border-primary group">
                <div className="flex justify-center mb-sm">
                  <span className="material-symbols-outlined text-4xl text-primary group-hover:text-primary-container drop-shadow-[0_0_10px_rgba(0,242,255,0.5)]">diamond</span>
                </div>
                <div className="font-headline-md text-headline-md text-on-surface mb-xs">1800 UC</div>
                <div className="font-label-sm text-label-sm text-tertiary-fixed mb-sm">+ 300 Bonus</div>
                <div className="font-label-md text-label-md text-primary">$24.99</div>
              </div>
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className="mb-xl">
            <div className="flex items-center gap-sm mb-md">
              <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">3</div>
              <h2 className="font-headline-md text-headline-md text-on-surface">Payment Gateway</h2>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-md">
              <div className="glass-panel rounded-lg p-sm flex items-center justify-center h-16 cursor-pointer border-outline-variant/30 hover:border-primary">
                <span className="font-label-md text-label-md text-on-surface">bKash</span>
              </div>
              <div className="glass-panel rounded-lg p-sm flex items-center justify-center h-16 cursor-pointer border-primary relative overflow-hidden">
                <span className="font-label-md text-label-md text-on-surface font-bold">Nagad</span>
                <div className="absolute inset-0 bg-primary/10"></div>
              </div>
              <div className="glass-panel rounded-lg p-sm flex items-center justify-center h-16 cursor-pointer border-outline-variant/30 hover:border-primary">
                <span className="font-label-md text-label-md text-on-surface">Visa</span>
              </div>
              <div className="glass-panel rounded-lg p-sm flex items-center justify-center h-16 cursor-pointer border-outline-variant/30 hover:border-primary">
                <span className="font-label-md text-label-md text-on-surface">PayPal</span>
              </div>
              <div className="glass-panel rounded-lg p-sm flex items-center justify-center h-16 cursor-pointer border-outline-variant/30 hover:border-primary">
                <span className="font-label-md text-label-md text-on-surface">Crypto</span>
              </div>
            </div>
          </div>

          {/* Step 4: Summary */}
          <div className="bg-[#050506] rounded-xl p-lg border border-outline-variant/20 mb-xl">
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-md border-b border-outline-variant/20 pb-sm">Transmission Summary</h3>
            <div className="flex justify-between items-center mb-sm font-body-md text-body-md">
              <span className="text-on-surface">660 UC Package</span>
              <span className="text-on-surface">$9.99</span>
            </div>
            <div className="flex justify-between items-center mb-md font-body-sm text-body-sm">
              <span className="text-outline">Gateway Fee (Nagad)</span>
              <span className="text-outline">$0.20</span>
            </div>
            <div className="flex justify-between items-center pt-md border-t border-outline-variant/20">
              <span className="font-headline-md text-headline-md text-on-surface">Total</span>
              <span className="font-headline-lg text-headline-lg text-primary drop-shadow-[0_0_10px_rgba(0,242,255,0.5)]">$10.19</span>
            </div>
          </div>

          {/* Step 5: Complete */}
          <button className="w-full bg-gradient-to-r from-primary-container to-blue-500 text-on-primary-container font-headline-md text-headline-md py-lg rounded-xl hover:scale-[1.02] transition-transform duration-300 flex items-center justify-center gap-md shadow-[0_0_30px_rgba(0,242,255,0.4)]">
            <span className="material-symbols-outlined text-3xl">bolt</span>
            INITIATE TRANSFER
          </button>
        </div>
      </div>
    </div>
  );
}
