import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Info } from 'lucide-react';

const RecommendationCard = ({ recommendation }) => {
  const { title = 'Safety Advisory', recommendation: text, severity = 'INFO' } = recommendation;

  let badgeColor = 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
  let Icon = Info;

  if (severity === 'CRITICAL') {
    badgeColor = 'bg-red-500/10 text-red-300 border-red-500/30';
    Icon = ShieldAlert;
  } else if (severity === 'HIGH') {
    badgeColor = 'bg-amber-500/10 text-amber-300 border-amber-500/30';
    Icon = AlertTriangle;
  } else if (severity === 'LOW') {
    badgeColor = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
    Icon = ShieldCheck;
  }

  return (
    <div className="bg-[#131e36]/90 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all flex items-start gap-3.5">
      <div className={`p-2 rounded-lg border flex-shrink-0 mt-0.5 ${badgeColor}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h4 className="text-sm font-semibold text-slate-100">{title}</h4>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${badgeColor}`}>
            {severity}
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
};

export default RecommendationCard;
