import Link from "next/link";
import { getSessionUser } from '@/lib/auth';
import { logout } from '@/app/actions/auth';

export default async function Navbar() {
  const user = await getSessionUser();

  return (
    <nav className="bg-surface/80 dark:bg-surface/80 backdrop-blur-xl docked full-width top-0 sticky z-50 border-b border-outline-variant/20 shadow-[0_0_20px_rgba(0,242,255,0.1)] transition-transform duration-150">
      <div className="flex justify-between items-center w-full px-gutter max-w-container-max mx-auto h-20">
        {/* Brand */}
        <Link href="/" className="font-headline-md text-headline-md font-extrabold tracking-tighter text-primary dark:text-primary-container flex items-center gap-sm cursor-pointer hover:scale-105 transition-all duration-300">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>token</span>
          NEON NEXUS
        </Link>
        {/* Links (Desktop) */}
        <div className="hidden md:flex items-center gap-xl">
          <Link className="font-body-md text-body-md text-on-surface-variant dark:text-on-surface-variant hover:text-primary hover:scale-105 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,242,255,0.4)]" href="/marketplace">Marketplace</Link>
          <Link className="font-body-md text-body-md text-on-surface-variant dark:text-on-surface-variant hover:text-primary hover:scale-105 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,242,255,0.4)]" href="/deals">Promos</Link>
          {user?.role === "admin" && (
            <Link className="font-body-md text-body-md text-on-surface-variant dark:text-on-surface-variant hover:text-primary hover:scale-105 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,242,255,0.4)]" href="/admin">Admin</Link>
          )}
          {user && (
            <Link className="font-body-md text-body-md text-on-surface-variant dark:text-on-surface-variant hover:text-primary hover:scale-105 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,242,255,0.4)]" href="/account">Wallet</Link>
          )}
        </div>
        {/* Actions */}
        <div className="flex items-center gap-md">
          {user ? (
            <>
              <button className="hidden md:flex p-sm text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-variant/30 relative">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button className="hidden md:flex p-sm text-on-surface-variant hover:text-tertiary transition-colors rounded-full hover:bg-surface-variant/30 flex items-center gap-xs">
                <span className="material-symbols-outlined">stars</span>
                <span className="font-label-md text-label-md">{user.points} PTS</span>
              </button>
              <Link href="/topup" className="bg-primary-container text-on-primary-container px-lg py-sm rounded-full font-label-md text-label-md hover:scale-105 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,242,255,0.4)]">
                Top Up
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
            <>
              <Link href="/login" className="text-on-surface-variant hover:text-primary font-label-md text-label-md px-md py-sm transition-colors">
                Login
              </Link>
              <Link href="/register" className="bg-primary-container text-on-primary-container px-lg py-sm rounded-full font-label-md text-label-md hover:scale-105 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,242,255,0.4)]">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
