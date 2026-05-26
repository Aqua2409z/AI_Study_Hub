interface StatItem {
  label: string;
  value: string;
  change: string;
  color?: string;
}

interface StatsOverviewProps {
  stats: StatItem[];
  timePeriod?: string;
}

export default function StatsOverview({
  stats,
  timePeriod = "7 ngày qua",
}: StatsOverviewProps) {
  return (
    <div className="liquid-glass rounded-[20px] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-grotesk font-bold text-cream">Thống kê học tập</h3>
        <button className="text-cream/60 hover:text-cream text-sm font-mono transition">
          {timePeriod} ↓
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white/5 rounded-lg p-4">
            <p className="text-cream/60 text-xs font-mono mb-2">{stat.label}</p>
            <p className={`text-2xl font-grotesk font-bold ${stat.color || "text-cream"}`}>
              {stat.value}
            </p>
            <p className="text-neon text-xs font-mono mt-2">
              ↑ {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Chart Placeholder */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="h-24 bg-white/5 rounded-lg flex items-center justify-center">
          <p className="text-cream/40 text-xs font-mono">Biểu đồ thống kê (Chart)</p>
        </div>
      </div>
    </div>
  );
}