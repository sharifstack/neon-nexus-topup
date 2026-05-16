import Link from "next/link";
import { getSessionUser } from '@/lib/auth';
import { logout } from '@/app/actions/auth';
import NavbarClient from './NavbarClient';
import LanguageSwitcher from './LanguageSwitcher';
import NavbarAuthLinks from './NavbarAuthLinks';

export default async function Navbar() {
  const user = await getSessionUser();

  return (
    <nav className="bg-surface/80 dark:bg-surface/80 backdrop-blur-xl docked full-width top-0 sticky z-50 border-b border-outline-variant/20 shadow-[0_0_20px_rgba(0,242,255,0.1)] transition-transform duration-150">
      <div className="flex justify-between items-center w-full px-gutter max-w-container-max mx-auto h-20">
        {/* Brand */}
        <Link href="/marketplace" className="font-headline-md text-headline-md font-extrabold tracking-tighter text-primary dark:text-primary-container flex items-center gap-sm cursor-pointer hover:scale-105 transition-all duration-300">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>token</span>
          NEON NEXUS
        </Link>

        {/* Links (Desktop) */}
        <NavbarClient user={user} />

        {/* Right actions */}
        <div className="flex items-center gap-md">
          <LanguageSwitcher />

          {user ? (
            <>
              <button className="hidden md:flex p-sm text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-variant/30 relative">
                <span className="material-symbols-outlined">notifications</span>
              </button>

              {/* Points Balance — clickable link to /points */}
              <Link
                href="/points"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all group relative overflow-hidden"
                title="Go to Points Store"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                <span className="font-black text-xs tracking-wider uppercase">
                  {(user.points || 0).toLocaleString()}
                </span>
              </Link>

              <div className="flex items-center gap-sm ml-sm border-l border-outline-variant/30 pl-sm">
                <Link href="/account" className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/30 cursor-pointer hover:border-primary transition-colors">
                  <img alt="User Avatar" className="w-full h-full object-cover" src={user.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuDX4iH3_wJYd2jJNAoKdJVj3WUzu_Xn18zWBzYQ5e3HC1OAp7Uy8PYuKptthHt3TRE-_39dIthT_pTISMs6xkAo1HiU_kgvY7C-CRNzaTbjG4Xa_5OHiRaATL5zSxuZxOKKT1wXBQlGX7cyVajukVSOzYYc1VUGW3L-7qAmPcuC3dWwjUw8JdnrIVhakPgRDlPzmQdbUZY9tcneiHtdj-s0DVJRRgiXR1zBVRxi4cdw6HIFWI-ZV7KYsFuCRb61rAAvHsjf_GnACHY"} />
                </Link>
                <form action={logout}>
                  <button type="submit" className="p-sm text-on-surface-variant hover:text-error transition-colors rounded-full hover:bg-error/10" title="Logout">
                    <span className="material-symbols-outlined">logout</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <NavbarAuthLinks />
          )}
        </div>
      </div>
    </nav>
  );
}
