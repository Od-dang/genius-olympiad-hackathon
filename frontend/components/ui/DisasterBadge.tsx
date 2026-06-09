import { RiskLevel } from '@/types';

interface Props {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
}

const BADGE_STYLE: Record<RiskLevel, string> = {
  NONE:     'bg-gray-700    text-gray-200   border border-gray-500',
  LOW:      'bg-green-600   text-green-100  border border-green-400',
  MODERATE: 'bg-yellow-500  text-yellow-950 border border-yellow-300 font-bold',
  HIGH:     'bg-orange-500  text-white       border border-orange-300',
  CRITICAL: 'bg-red-600     text-white       border border-red-400   animate-pulse',
};

export default function DisasterBadge({ level, size = 'md' }: Props) {
  const sizeClass = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3.5 py-1.5 text-sm font-bold',
  }[size];

  return (
    <span
      className={`inline-block rounded-full uppercase tracking-wider ${sizeClass} ${BADGE_STYLE[level]}`}
    >
      {level}
    </span>
  );
}
