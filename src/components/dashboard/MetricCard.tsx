import { Card } from '@/components/ui/Card';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  accent?: 'peach' | 'sage' | 'amber' | 'rose' | 'cream';
  trend?: 'up' | 'down' | 'flat';
}

const ACCENT_COLORS = {
  peach: { icon: 'text-[#c4855a]', bg: 'bg-[#3d2a1e]' },
  sage: { icon: 'text-[#7a9e7e]', bg: 'bg-[#1e2e20]' },
  amber: { icon: 'text-[#c4a55a]', bg: 'bg-[#2e2614]' },
  rose: { icon: 'text-[#c47a7a]', bg: 'bg-[#2e1e1e]' },
  cream: { icon: 'text-[#9a8a78]', bg: 'bg-[#2a2420]' },
};

export default function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = 'cream',
}: MetricCardProps) {
  const colors = ACCENT_COLORS[accent];

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-lg ${colors.bg} mb-3`}>
          <Icon size={14} className={colors.icon} strokeWidth={1.5} />
        </div>
      </div>
      <div className="text-2xl font-semibold text-[#e8dcc8] tracking-tight">{value}</div>
      <div className="text-xs text-[#9a8a78] mt-0.5 font-medium">{label}</div>
      {sub && <div className="text-[11px] text-[#5a4e42] mt-1">{sub}</div>}
    </Card>
  );
}
