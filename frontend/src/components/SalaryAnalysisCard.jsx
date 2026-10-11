import React from 'react';
import { DollarSign, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';

const SalaryAnalysisCard = ({ salaryAnalysis, currency = 'USD' }) => {
  const sa = salaryAnalysis || {};
  const isHighRisk = sa.risk_level?.toLowerCase() === 'high';
  const isMediumRisk = sa.risk_level?.toLowerCase() === 'medium';

  const badgeColor = isHighRisk
    ? 'bg-red-500/10 text-red-400 border-red-500/30'
    : isMediumRisk
    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

  const formatSalary = (val) => {
    if (!val) return 'Not Specified';
    return Number(val).toLocaleString();
  };

  return (
    <div className="bg-[#131e36]/90 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-300 text-sm font-semibold">
          <DollarSign className="w-4 h-4 text-cyan-400" />
          Rule-Based Salary Anomaly Analysis
        </div>
        <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${badgeColor}`}>
          {sa.risk_level || 'Low'} Salary Risk
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 text-xs bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
        <div>
          <span className="text-slate-400 block mb-0.5">Advertised Range</span>
          <span className="font-mono text-white font-semibold">
            {sa.min_salary || sa.max_salary
              ? `${currency} ${formatSalary(sa.min_salary)} - ${formatSalary(sa.max_salary)}`
              : 'Unspecified'}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Structural Anomaly Status</span>
          <span className="text-slate-200 font-medium truncate block">
            {sa.anomaly_status || 'Normal'}
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed mb-3">
        {sa.explanation || 'No salary anomalies flagged for this position.'}
      </p>

      <div className="text-[10px] text-slate-500 font-mono tracking-wider uppercase border-t border-slate-800/80 pt-2.5">
        Heuristic Boundary Check (Rule-Based Anomaly Detection)
      </div>
    </div>
  );
};

export default SalaryAnalysisCard;
