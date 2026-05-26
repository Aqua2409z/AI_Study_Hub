interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  trend?: string;
  backgroundColor?: string;
}

export default function StatCard({
  icon,
  value,
  label,
  trend,
  backgroundColor = "bg-blue-100",
}: StatCardProps) {
  return (
    <div className="liquid-glass rounded-[20px] p-6 flex flex-col gap-4">
      {/* Icon và Value */}
      <div className="flex items-start gap-4">
        <div className={`${backgroundColor} rounded-lg p-3 flex items-center justify-center w-16 h-16`}>
          <div className="text-2xl">{icon}</div>
        </div>
        <div>
          <p className="text-3xl font-grotesk font-bold text-cream">{value}</p>
          <p className="text-cream/60 text-sm font-mono">{label}</p>
        </div>
      </div>

      {/* Trend */}
      {trend && (
        <div className="text-neon text-xs font-mono">
          ↑ {trend}
        </div>
      )}
    </div>
  );
}