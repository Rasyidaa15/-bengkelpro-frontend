import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ icon, title, value, trend, trendValue }) => {
  const isUp = trend === 'up';

  return (
    <div className="bg-surface rounded-2xl p-6 border border-border hover:border-crimson-400/40 transition-all card-hover">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-muted">{title}</p>
          <p className="text-2xl font-bold text-text-primary mt-1">{value}</p>
        </div>
        <div className="p-3 rounded-xl bg-crimson-400/10 text-crimson-400 border border-crimson-400/20">
          {icon}
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1 mt-3">
          {isUp ? <TrendingUp size={14} className="text-emerald-400" /> : <TrendingDown size={14} className="text-red-400" />}
          <span className={`text-xs font-medium ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
            {trendValue}
          </span>
          <span className="text-xs text-text-muted">dari bulan lalu</span>
        </div>
      )}
      <div className="mt-4 h-8 flex items-end gap-0.5">
        {[40, 60, 45, 80, 55, 70, 90, 65, 85, 50, 75, 95].slice(0, 8).map((h, i) => (
          <div
            key={i}
            className="w-full rounded-sm transition-all"
            style={{
              height: `${h * 0.3 + 10}%`,
              backgroundColor: isUp ? '#E23D3F' : '#6B6F75',
              opacity: 0.3 + (i / 8) * 0.5,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default StatsCard;