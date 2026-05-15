import Link from "next/link";
import connectToDatabase from "@/lib/mongodb";
import Game from "@/models/Game";

export const dynamic = 'force-dynamic';

export default async function Home() {
  await connectToDatabase();
  
  // Fetch dynamic data
  const featuredGames = await Game.find({ isFeatured: true, isActive: true }).lean().limit(6);
  const flashDeals = await Game.find({ isFlashDeal: true, isActive: true }).lean().limit(3);
  
  return (
    <div className="max-w-container-max mx-auto px-gutter py-xxl flex flex-col gap-xxl w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[500px] md:h-[600px] rounded-xl overflow-hidden glass-panel flex items-center p-xl md:p-xxl">
        <img alt="Hero background" className="absolute inset-0 w-full h-full object-cover opacity-40 z-0 mix-blend-screen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPTnAfI5fcP19daZym7-6IdvZo-ldJvQLul5yNQYiVr165tY0zCBP0CSLus_fSZVnw9Dd1SGOwDfVM0cFCiuYZepauQWtwcRYRAmNuih5VgnrXOjqo465u-BtSjjp3HJvZexI0NPMw6kS8viJRsROyncGX-QarosWvFS5hMbpq8OPYz3H2nzR30EiVd_-zRv0xyEzet3XRHWdV8fZ2GG-SIWieZfvDmku4PrBgzEn_Xu6v-puAQQj0jjt6mksBIyVgDv0E9TpmMeM" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10"></div>
        <div className="relative z-20 flex flex-col items-start gap-md max-w-2xl">
          <div className="bg-tertiary text-on-tertiary-container font-label-md text-label-md px-sm py-xs rounded uppercase tracking-widest inline-block mb-sm">20% OFF Limited Time</div>
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary leading-tight">Dominate the <br/><span className="text-primary-container">Battlefield</span></h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg">Instant top-ups for PUBG Mobile, Valorant, and more. Secure, fast, and built for champions.</p>
          <Link href="/marketplace" className="bg-gradient-to-r from-primary-container to-[#00aaff] text-on-primary-container font-headline-md text-headline-md px-xl py-md rounded-lg btn-glow inline-block transition-all hover:scale-105 active:scale-95">Enter Marketplace</Link>
        </div>
      </section>

      {/* Dynamic Flash Deals Section */}
      {flashDeals.length > 0 && (
        <section className="w-full">
          <div className="flex items-center justify-between mb-xl">
            <h2 className="font-headline-xl text-headline-xl text-primary flex items-center gap-sm">
              <span className="material-symbols-outlined text-secondary animate-pulse">bolt</span>
              Flash Deals
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {flashDeals.map((game: any) => (
              <GameCard key={game._id} game={game} badge="Flash Deal" badgeColor="bg-secondary" />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="w-full">
        <div className="flex items-center justify-between mb-xl">
          <h2 className="font-headline-xl text-headline-xl text-primary">Categories</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-md md:gap-lg">
          <CategoryCard icon="sports_esports" label="Battle Royale" color="text-primary-container" />
          <CategoryCard icon="sports_soccer" label="Sports" color="text-secondary" />
          <CategoryCard icon="swords" label="RPG" color="text-tertiary" />
          <CategoryCard icon="groups" label="MOBA" color="text-primary" />
        </div>
      </section>

      {/* Featured Games Grid */}
      <section className="w-full">
        <div className="flex items-center justify-between mb-xl">
          <h2 className="font-headline-xl text-headline-xl text-primary">Featured Titles</h2>
          <Link className="font-label-md text-label-md text-primary-container hover:text-primary transition-colors flex items-center gap-xs" href="/marketplace">
            View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {featuredGames.map((game: any) => (
            <GameCard key={game._id} game={game} />
          ))}
        </div>
      </section>
    </div>
  );
}

function CategoryCard({ icon, label, color }: { icon: string, label: string, color: string }) {
  return (
    <div className="glass-panel p-lg rounded-xl flex flex-col items-center justify-center gap-sm glow-hover cursor-pointer transition-all duration-300 hover:border-primary/40">
      <span className={`material-symbols-outlined text-4xl ${color}`}>{icon}</span>
      <span className="font-label-md text-label-md text-on-surface uppercase tracking-tight">{label}</span>
    </div>
  );
}

function GameCard({ game, badge, badgeColor = "bg-primary" }: { game: any, badge?: string, badgeColor?: string }) {
  const minPrice = game.packages?.length > 0 
    ? Math.min(...game.packages.map((p: any) => p.price)) 
    : 0;

  return (
    <div className="glass-panel rounded-xl overflow-hidden glow-hover transition-all duration-300 group flex flex-col h-full border border-white/5">
      <div className="relative h-48 w-full overflow-hidden">
        <img alt={game.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={game.bannerImage || game.coverImage} />
        {(badge || game.tag) && (
          <div className={`absolute top-sm right-sm ${badgeColor} text-on-surface font-label-sm text-label-sm px-sm py-xs rounded uppercase z-10 shadow-lg`}>
            {badge || game.tag}
          </div>
        )}
      </div>
      <div className="p-lg flex flex-col flex-grow relative">
        <div className="absolute -top-10 left-lg w-16 h-16 rounded-lg bg-surface border border-outline-variant/30 overflow-hidden shadow-2xl transition-transform group-hover:-translate-y-1">
          <img src={game.coverImage} className="w-full h-full object-cover" alt="" />
        </div>
        <div className="mt-sm flex-grow flex flex-col">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-xs group-hover:text-primary transition-colors">{game.name}</h3>
          <p className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-xs mb-md">
            <span className="material-symbols-outlined text-[16px] text-tertiary">bolt</span> 
            Instant Delivery
          </p>
          <div className="flex justify-between items-end mt-auto pt-md border-t border-white/5">
            <div>
              <span className="font-label-sm text-label-sm text-outline opacity-60">Starting from</span>
              <div className="font-headline-md text-headline-md text-primary-container">${minPrice.toFixed(2)}</div>
            </div>
            <Link href={`/topup/${game.slug}`} className="bg-primary-container/10 text-primary-container border border-primary-container/30 hover:bg-primary-container hover:text-on-primary-container font-label-md text-label-md px-md py-sm rounded-lg transition-all hover:scale-105">
              Top Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
