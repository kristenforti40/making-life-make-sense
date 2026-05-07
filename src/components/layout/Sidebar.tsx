'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Inbox,
  PenLine,
  BookOpen,
  Dumbbell,
  Users,
  Calendar,
  Mail,
  FileText,
  Settings,
  Sparkles,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/inbox', label: 'Inbox', icon: Inbox },
  { href: '/writing', label: 'Writing', icon: PenLine },
  { href: '/lsat', label: 'LSAT', icon: BookOpen },
  { href: '/workouts', label: 'Workouts', icon: Dumbbell },
  { href: '/people', label: 'People', icon: Users },
];

const INTEGRATION_ITEMS = [
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/gmail', label: 'Gmail', icon: Mail },
  { href: '/docs', label: 'Docs', icon: FileText },
];

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  active: boolean;
}

function NavItem({ href, label, icon: Icon, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 group ${
        active
          ? 'bg-[#2a2420] text-[#e8dcc8]'
          : 'text-[#9a8a78] hover:text-[#e8dcc8] hover:bg-[#1e1b17]'
      }`}
    >
      <Icon
        size={15}
        strokeWidth={active ? 2 : 1.5}
      />
      <span className={active ? 'font-medium' : ''}>{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 h-screen sticky top-0 flex flex-col bg-[#0e0c0a] border-r border-[#1e1b17] py-6 px-3">
      {/* Logo */}
      <div className="px-3 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#c4855a] flex items-center justify-center">
            <Sparkles size={14} className="text-[#0e0c0a]" strokeWidth={2} />
          </div>
          <div>
            <p className="text-[#e8dcc8] text-sm font-semibold leading-tight">Life OS</p>
            <p className="text-[#5a4e42] text-[10px] leading-tight">command center</p>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={pathname === item.href}
          />
        ))}
      </nav>

      {/* Integrations */}
      <div className="mt-6 pt-6 border-t border-[#1e1b17]">
        <p className="px-3 mb-2 text-[10px] uppercase tracking-widest text-[#5a4e42] font-medium">
          Integrations
        </p>
        <nav className="flex flex-col gap-0.5">
          {INTEGRATION_ITEMS.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={pathname === item.href}
            />
          ))}
        </nav>
      </div>

      {/* Settings at bottom */}
      <div className="mt-auto pt-6 border-t border-[#1e1b17]">
        <NavItem
          href="/settings"
          label="Settings"
          icon={Settings}
          active={pathname === '/settings'}
        />
      </div>
    </aside>
  );
}
