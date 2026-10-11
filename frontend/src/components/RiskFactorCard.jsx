import React from 'react';
import { AlertTriangle, AlertOctagon, Info, ShieldAlert } from 'lucide-react';

const RiskFactorCard = ({ factor }) => {
  const { name, factor_type, severity = 'MEDIUM', score_contribution = 0, explanation } = factor;

  let badgeColor = 'bg-amber-500/10 text-amber-300 border-amber-500/30';
  let Icon = AlertTriangle;

  if (severity === 'CRITICAL') {
    badgeColor = 'bg-red-500/10 text-red-300 border-red-500/30';
    Icon = AlertOctagon;
  } else if (severity === 'HIGH') {
    badgeColor = 'bg-orange-500/10 text-orange-300 border-orange-500/30';
    Icon = AlertTriangle;
  } else if (severity === 'LOW') {
    badgeColor = 'bg-slate-500/10 text-slate-300 border-slate-500/30';
    Icon = Info;
  }

  return (
    <div className="bg-[#131e36]/90 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all flex flex-col justify-between">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg border ${badgeColor}`}>
            <Icon className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-slate-100">{name}</h4>
        </div>
        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 whitespace-nowrap">
          +{score_contribution} pts
        </span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed pl-8">
        {explanation}
      </p>

      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 pl-8">
        <span className="uppercase tracking-wider font-mono text-[10px] text-slate-500">
          TYPE: {factor_type.replace('_', ' ')}
        </span>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${badgeColor}`}>
          {severity}
        </span>
      </div>
    </div>
  );
};

export default RiskFactorCard;
