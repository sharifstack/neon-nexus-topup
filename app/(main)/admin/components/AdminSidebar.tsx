"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  FileText,
  ShieldAlert
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, href: '/admin' },
  { name: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, href: '/admin/analytics' },
  { name: 'Inventory', icon: <Package className="w-5 h-5" />, href: '/admin/inventory' },
  { name: 'Orders', icon: <ShoppingCart className="w-5 h-5" />, href: '/admin/orders' },
  { name: 'Users', icon: <Users className="w-5 h-5" />, href: '/admin/users' },
  { name: 'Settings', icon: <Settings className="w-5 h-5" />, href: '/admin/settings' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col p-md space-y-sm bg-surface-container-lowest/90 dark:bg-surface-container-lowest/90 backdrop-blur-2xl text-primary dark:text-primary font-label-md text-label-md h-[calc(100vh-5rem)] w-64 fixed left-0 top-20 z-40 border-r border-outline-variant/10 shadow-2xl overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-md mb-xl px-sm pt-sm mt-4">
        <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center border border-primary/30 shadow-[0_0_10px_rgba(0,242,255,0.2)]">
          <ShieldAlert className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="font-headline-sm text-headline-sm font-bold text-primary">Admin Panel</h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant">Nexus Control</p>
        </div>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name}
              href={item.href}
              className={`flex items-center gap-md px-md py-sm rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-primary-container text-on-primary-container font-bold shadow-[0_0_15px_rgba(0,242,255,0.3)]' 
                  : 'text-on-surface-variant hover:bg-surface-variant/30 hover:translate-x-1'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      {/* CTA */}
      <div className="mt-auto pt-lg border-t border-outline-variant/10 pb-sm">
        <button className="w-full py-sm px-md bg-surface-variant/50 hover:bg-primary/10 text-primary border border-primary/20 rounded-lg font-label-md text-label-md flex items-center justify-center gap-sm transition-all hover:shadow-[0_0_15px_rgba(0,242,255,0.2)]">
          <FileText className="w-4 h-4" />
          Generate Report
        </button>
      </div>
    </aside>
  );
}
