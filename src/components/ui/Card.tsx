import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-[#1a1714] border border-[#2a2420] rounded-2xl p-5',
        onClick && 'cursor-pointer hover:bg-[#1f1c18] transition-colors duration-150',
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-[#e8dcc8] text-sm font-semibold">{title}</h3>
        {subtitle && <p className="text-[#9a8a78] text-xs mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'peach' | 'sage' | 'amber' | 'rose' | 'muted';
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const variants = {
    default: 'bg-[#2a2420] text-[#9a8a78]',
    peach: 'bg-[#3d2a1e] text-[#c4855a]',
    sage: 'bg-[#1e2e20] text-[#7a9e7e]',
    amber: 'bg-[#2e2614] text-[#c4a55a]',
    rose: 'bg-[#2e1e1e] text-[#c47a7a]',
    muted: 'bg-[#1e1b17] text-[#5a4e42]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wide',
        variants[variant]
      )}
    >
      {children}
    </span>
  );
}
