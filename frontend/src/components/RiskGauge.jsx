import React from 'react';

const RiskGauge = ({ score = 0, level = 'Low', size = 200 }) => {
  const radius = 70;
  const strokeWidth = 14;
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = '#10b981'; // Green
  let glowClass = 'glow-safe';
  let badgeBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

  if (score >= 75) {
    color = '#ef4444'; // Red
    glowClass = 'glow-danger';
    badgeBg = 'bg-red-500/20 text-red-300 border-red-500/40';
  } else if (score >= 50) {
    color = '#f59e0b'; // Amber
    glowClass = 'shadow-[0_0_25px_-5px_rgba(245,158,11,0.3)]';
    badgeBg = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
  } else if (score >= 25) {
    color = '#38bdf8'; // Cyan
    glowClass = 'glow-cyan';
    badgeBg = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`relative flex items-center justify-center rounded-full p-2 ${glowClass}`}>
        <svg height={size} width={size} className="transform -rotate-90">
          {/* Background track */}
          <circle
            stroke="#1e293b"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Active progress */}
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>

        {/* Center label */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-4xl md:text-5xl font-black tracking-tight text-white font-mono">
            {score}
          </span>
          <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold mt-0.5">
            / 100
          </span>
        </div>
      </div>

      <div className={`mt-3 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${badgeBg}`}>
        {level} Risk Level
      </div>
    </div>
  );
};

export default RiskGauge;
