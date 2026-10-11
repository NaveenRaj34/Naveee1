import React from 'react';
import { CheckCircle2, AlertTriangle, Cpu, Sparkles } from 'lucide-react';

const PredictionCard = ({ prediction = 'Genuine', confidence = 50, modelName = 'JobShield RF', version = '1.0.0' }) => {
  const isSuspicious = prediction?.toLowerCase() === 'suspicious' || prediction?.toLowerCase() === 'fake';

  const badgeColor = isSuspicious
    ? 'bg-red-500/10 text-red-400 border-red-500/30'
    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

  const Icon = isSuspicious ? AlertTriangle : CheckCircle2;

  return (
    <div className="bg-[#131e36]/90 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
          <Cpu className="w-4 h-4 text-cyan-400" />
          NLP & Machine Learning Classifier
        </div>
        <span className="text-[11px] font-mono text-slate-500">v{version}</span>
      </div>

      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <span className="text-xs text-slate-400 block mb-1">Model Assessment</span>
          <div className="flex items-center gap-2">
            <span className={`text-xl font-bold ${isSuspicious ? 'text-red-400' : 'text-emerald-400'}`}>
              {isSuspicious ? 'Likely Suspicious' : 'Genuine Listing'}
            </span>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 font-bold text-xs ${badgeColor}`}>
          <Icon className="w-4 h-4" />
          {confidence}% Confidence
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] text-slate-400 font-mono">
          <span>Inference Certainty</span>
          <span>{confidence}%</span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isSuspicious ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-cyan-500 to-emerald-500'
            }`}
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
        TF-IDF vector representation evaluated across 3,000 n-gram features and classified via Random Forest ensemble.
      </p>
    </div>
  );
};

export default PredictionCard;
