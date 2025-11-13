interface StatsCardProps {
  label: string;
  value: number | string;
  icon: string;
  subtitle?: string;
  trend?: string;
}

const StatsCard = ({ label, value, icon, subtitle, trend }: StatsCardProps) => {
  return (
    <div className="glass-card rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 glow-hover">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">
            {label}
          </p>
          <p className="text-4xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mt-2">
            {value}
          </p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="text-5xl float-animation">{icon}</div>
      </div>
      {trend && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
          <span className="text-green-500 font-semibold text-sm">{trend}</span>
          <span className="text-gray-500 text-xs">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
