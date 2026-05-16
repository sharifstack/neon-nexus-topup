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
      <div className="flex justify-between items-center w-full px-gutter max-w-container-max mx-auto h-16 md:h-20">
        {/* Brand */}
        <Link href="/marketplace" className="font-headline-md text-lg md:text-headline-md font-extrabold tracking-tighter text-primary dark:text-primary-container flex items-center gap-2 md:gap-sm cursor-pointer hover:scale-105 transition-all duration-300 whitespace-nowrap">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>token</span>
          NEON NEXUS
        </Link>

        {/* Links (Desktop) */}
        <NavbarClient user={user} />

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-4">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          {user ? (
            <div className="flex items-center gap-md">
              <button className="hidden md:flex p-sm text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-variant/30 relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-[#0d1117] hidden lg:block" />
              </button>

              {/* Points Balance — clickable link to /points */}
              <Link
                href="/points"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/50 transition-all group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                <span className="font-black text-xs tracking-wider uppercase">
                  {(user.points || 0).toLocaleString()}
                </span>
              </Link>

              <div className="flex items-center gap-sm ml-sm border-l border-outline-variant/30 pl-sm">
                <Link href="/account" className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/30 cursor-pointer hover:border-primary transition-colors hidden md:block">
                  <img 
                    alt="User Avatar" 
                    className="w-full h-full object-cover" 
                    src={user.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.email}`} 
                  />
                </Link>
                <form action={logout} className="hidden md:block">
                  <button type="submit" className="p-sm text-on-surface-variant hover:text-error transition-colors rounded-full hover:bg-error/10" title="Logout">
                    <span className="material-symbols-outlined">logout</span>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <NavbarAuthLinks />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
