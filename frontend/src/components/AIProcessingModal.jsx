import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cpu, Check, Loader2, Sparkles, AlertCircle } from 'lucide-react';

const STEPS = [
  "Validating posting schema & structural metadata...",
  "Preprocessing job text & tokenizing features...",
  "Running Random Forest & TF-IDF NLP model...",
  "Scanning suspicious keywords & predatory patterns...",
  "Verifying company website HTTPS & domain reputation...",
  "Verifying recruiter email domain against employer...",
  "Running rule-based salary anomaly analysis...",
  "Calculating composite 0-100 risk score...",
  "Synthesizing explainable AI & safety recommendations..."
];

const AIProcessingModal = ({ isOpen }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const progress = Math.min(100, Math.round(((currentStepIndex + 1) / STEPS.length) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
      <div className="bg-[#0f172a] border border-cyan-500/30 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl shadow-cyan-500/10 relative overflow-hidden">
        {/* Animated Cyber Glow Background */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Cpu className="w-6 h-6 animate-spin text-cyan-400" style={{ animationDuration: '4s' }} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              JobShield AI Engine Active
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Multi-factor deep fraud analysis in progress...
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 mb-6">
          <div className="flex justify-between text-xs font-mono text-cyan-400">
            <span>PIPELINE EXECUTION</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-2 rounded-lg text-xs transition-all ${
                  isCurrent
                    ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-medium'
                    : isCompleted
                    ? 'text-slate-400'
                    : 'text-slate-600'
                }`}
              >
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <Check className="w-3 h-3" />
                    </div>
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700" />
                  )}
                </div>
                <span className="truncate">{step}</span>
              </div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Decision-Support Intelligence
          </span>
          <span className="font-mono text-slate-500">v1.0.0 RF-NLP</span>
        </div>
      </div>
    </div>
  );
};

export default AIProcessingModal;
