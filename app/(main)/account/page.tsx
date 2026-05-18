import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import connectMongo from "@/lib/mongodb";
import Order from "@/models/Order";
import { redirect } from "next/navigation";
import ProfileSettings from "./ProfileSettings";
import { formatPrice } from "@/lib/currency";

export default async function Account() {
  const user = await getSessionUser();
  if (!user) {
    redirect('/login');
  }

  await connectMongo();

  // Fetch actual recent transactions for this user securely
  const transactions = await Order.find({ userId: user._id || user.id })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('gameId', 'name slug iconImage coverImage bannerImage category')
    .lean();

  return (
    <div className="flex-1 w-full max-w-container-max mx-auto px-gutter py-xl flex flex-col gap-xl">
      {/* Header: User Profile Card */}
      <section className="relative bg-surface-container-low/40 backdrop-blur-2xl border border-outline-variant/30 rounded-xl overflow-hidden shadow-2xl">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="p-xl flex flex-col md:flex-row items-center gap-xl relative z-10">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface-variant shadow-[0_0_30px_rgba(0,242,255,0.2)] group-hover:border-primary transition-colors duration-500">
              <img alt="User Avatar Large" className="w-full h-full object-cover" src={user.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.email}`} />
            </div>
            <div className="absolute bottom-0 right-0 bg-surface text-primary border border-primary/50 rounded-full p-xs shadow-[0_0_10px_rgba(0,242,255,0.4)]">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left flex flex-col gap-sm">
            <div className="flex flex-col md:flex-row items-center gap-md justify-center md:justify-start">
              <h1 className="font-headline-lg text-headline-lg text-on-surface">{user.name}</h1>
              <span className="bg-secondary-container/20 text-secondary border border-secondary/30 rounded-full px-md py-xs font-label-sm text-label-sm uppercase tracking-wider backdrop-blur-md">Operative</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">{user.email}</p>
          </div>
          <div className="flex gap-lg border-t md:border-t-0 md:border-l border-outline-variant/30 pt-md md:pt-0 md:pl-lg w-full md:w-auto justify-center md:justify-start">
            <div className="flex flex-col gap-xs">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Rewards</span>
              <div className="font-headline-lg text-headline-lg text-tertiary flex items-center gap-sm">
                <span className="material-symbols-outlined text-[28px]">military_tech</span>
                {user.points} PTS
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-lg">
          {/* Recent Transactions */}
          <section className="bg-surface-container-low/40 backdrop-blur-xl border border-outline-variant/30 rounded-xl p-lg flex flex-col gap-md">
            <div className="flex justify-between items-center mb-sm">
              <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">receipt_long</span>
                Recent Transactions
              </h2>
            </div>
            
            <div className="flex flex-col gap-sm">
              {transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-xl border border-dashed border-outline-variant/30 rounded-xl bg-surface/20">
                  <span className="material-symbols-outlined text-4xl text-outline-variant mb-md">receipt_long</span>
                  <p className="text-on-surface-variant font-medium text-sm mb-4">No transactions yet.</p>
                  <Link href="/" className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-lg py-2 rounded-lg font-bold text-sm transition-colors shadow-sm">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                transactions.map((tx: any) => {
                  const txId = tx.transactionId || tx._id.toString();
                  const game = tx.gameId;
                  const gameName = game?.name || 'Deleted Game';
                  const gameImage = game?.iconImage || game?.coverImage || game?.bannerImage;
                  
                  return (
                  <div key={tx._id.toString()} className="flex items-center justify-between p-md rounded-xl bg-surface-container-low/50 hover:bg-surface-variant/30 transition-all border border-outline-variant/10 hover:border-outline-variant/30 group">
                    <div className="flex items-center gap-md">
                      <div className="w-12 h-12 rounded-lg bg-surface-container overflow-hidden flex items-center justify-center text-primary border border-white/5 shadow-sm flex-shrink-0">
                        {gameImage ? (
                          <img src={gameImage} alt={gameName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>sports_esports</span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                          {gameName} — {tx.packageName}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          {tx.gamePlayerId && (
                            <span className="font-medium text-[10px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded uppercase tracking-wider">
                              ID: {tx.gamePlayerId}
                            </span>
                          )}
                          <span className="font-medium text-[11px] text-outline-variant flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                            {new Date(tx.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end flex-shrink-0 ml-4">
                      <span className="font-bold text-base text-on-surface tracking-tight">{formatPrice(tx.amount, 'BDT')}</span>
                      {tx.pointsEarned > 0 ? (
                        <span className="font-bold text-[10px] text-tertiary flex items-center gap-1 mt-1">
                          <span className="material-symbols-outlined text-[14px]">military_tech</span>
                          +{tx.pointsEarned} PTS
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] text-outline-variant mt-1">
                          #{txId.slice(-6).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                )})
              )}
            </div>
          </section>

          {/* Profile Settings (Client Component) */}
          <ProfileSettings user={user} />
        </div>

        {/* Right Column (Favorites) */}
        <div className="flex flex-col gap-lg">
          <section className="bg-surface-container-low/40 backdrop-blur-xl border border-outline-variant/30 rounded-xl p-lg flex flex-col gap-md h-full">
            <div className="flex justify-between items-center mb-sm">
              <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-sm">
                <span className="material-symbols-outlined text-secondary">favorite</span>
                My Favorites
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-md">
              <div className="relative group rounded-lg overflow-hidden aspect-[3/4] cursor-pointer">
                <img alt="Game 1" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSRobYcw3QISHR-VnLoofIoPblaBppBL_AMSajOuB2FbZBXxFfqemCE0CECLwPDF_pwNXQ-w0vnvNYiYgAi9RmxAw5ACtkRWlLWI70rGoQHibAx2rqe1OcMO4wWo61IjHVToccGcDOAXO_4a-ajMYra9idiA1EZVxFwlBZDVvHbJqvpkaBCWsVvXkQ5D7apZ1gaVsxTrpVGHZvcbbZGJrf5HGbU03D7mRZGOVQYh6t2I4nEfVb19S1-6ltS1b6Odf4GFVEVgGJDsI" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                <div className="absolute inset-0 border border-white/10 rounded-lg group-hover:border-secondary/50 group-hover:shadow-[inset_0_0_20px_rgba(255,172,232,0.3)] transition-all"></div>
                <div className="absolute bottom-0 left-0 p-sm w-full flex flex-col gap-xs">
                  <span className="font-label-md text-label-md text-on-surface truncate">Neon Overdrive 2</span>
                  <div className="flex items-center gap-xs text-secondary">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                    <span className="font-label-sm text-label-sm">Launch</span>
                  </div>
                </div>
              </div>

              <div className="relative group rounded-lg overflow-hidden aspect-[3/4] cursor-pointer">
                <img alt="Game 2" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdKGNKJxq5KXfkK3sljfiBp-GEmATzQ7asS7XAJhAMraMB1E_8YxajCpppQPsYvSnn6HGJDaTogt4uXXqX2TjXHjMmE_JmNyjmHkLbT3vLZ-Gw_QXOji9k_h6lNl6lwHQD2mKtRE53p0GL7oxrtarHJzqJ4pSPRt1C9rxrzs6363nZnHP0McdO1D71tgPlVsKSocP7A_ypYjz3Mdh_xjQ6EP7qRmGCl-AwR0c6GAKq4NYP9M5e-p8VarvdxxeAH2JGfQMQ7TD_LeQ" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                <div className="absolute inset-0 border border-white/10 rounded-lg group-hover:border-primary/50 group-hover:shadow-[inset_0_0_20px_rgba(0,242,255,0.3)] transition-all"></div>
                <div className="absolute bottom-0 left-0 p-sm w-full flex flex-col gap-xs">
                  <span className="font-label-md text-label-md text-on-surface truncate">Cyber Strike</span>
                  <div className="flex items-center gap-xs text-primary">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                    <span className="font-label-sm text-label-sm">Launch</span>
                  </div>
                </div>
              </div>

              <div className="relative group rounded-lg overflow-hidden aspect-[3/4] cursor-pointer">
                <img alt="Game 3" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQ7X5MifoAN0Q9qIHWtz2Uurnhgtc3N5hO_YoVF38mfYd8zj18R2hhuooVv9eRTrxZuxrHcKMfuxgSB4l6Amll7b4-phj_BLax0oCUCocKeje2yGO-4txRQvaB5u75qfzlchg-GLhNwYqcWYSgc71LkhRU_oxmHK1rJKFgd80KUuFjuwZutryD_w_AR6UF2oFxrKxsY_ni_PA9FKPw0wRylhqm6zwc3YxeXKko1asHtB-v9_tXIgonxkdom5v797NfaDTG6-ieQKA" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                <div className="absolute inset-0 border border-white/10 rounded-lg group-hover:border-tertiary/50 group-hover:shadow-[inset_0_0_20px_rgba(195,244,0,0.3)] transition-all"></div>
                <div className="absolute bottom-0 left-0 p-sm w-full flex flex-col gap-xs">
                  <span className="font-label-md text-label-md text-on-surface truncate">Apex Command</span>
                  <div className="flex items-center gap-xs text-tertiary">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                    <span className="font-label-sm text-label-sm">Launch</span>
                  </div>
                </div>
              </div>

              <div className="relative group rounded-lg overflow-hidden aspect-[3/4] cursor-pointer bg-surface border border-dashed border-outline-variant hover:border-primary hover:bg-surface-variant/30 transition-all flex flex-col items-center justify-center gap-sm">
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:text-primary group-hover:shadow-[0_0_15px_rgba(0,242,255,0.4)] transition-all">
                  <span className="material-symbols-outlined text-[28px]">add</span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant group-hover:text-primary transition-colors">Find Games</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
