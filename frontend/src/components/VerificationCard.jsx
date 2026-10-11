import React from 'react';
import { Globe, Mail, CheckCircle2, AlertTriangle, HelpCircle, Lock, Shield } from 'lucide-react';

const VerificationCard = ({ companyVerification, recruiterVerification }) => {
  const comp = companyVerification || {};
  const rec = recruiterVerification || {};

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'verified':
        return {
          color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: CheckCircle2,
          label: 'Verified'
        };
      case 'suspicious':
        return {
          color: 'bg-red-500/10 text-red-400 border-red-500/30',
          icon: AlertTriangle,
          label: 'Suspicious'
        };
      default:
        return {
          color: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
          icon: HelpCircle,
          label: status || 'Unverified'
        };
    }
  };

  const compBadge = getStatusBadge(comp.trust_status);
  const recBadge = getStatusBadge(rec.trust_status);

  const CompIcon = compBadge.icon;
  const RecIcon = recBadge.icon;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Company Verification Card */}
      <div className="bg-[#131e36]/90 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-slate-300 text-sm font-semibold">
              <Globe className="w-4 h-4 text-cyan-400" />
              Company Website Verification
            </div>
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold border flex items-center gap-1.5 ${compBadge.color}`}>
              <CompIcon className="w-3.5 h-3.5" />
              {compBadge.label}
            </span>
          </div>

          <div className="space-y-2 mb-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Claimed URL:</span>
              <span className="text-slate-200 font-mono truncate max-w-[200px]">
                {comp.website || 'None provided'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Transport Security:</span>
              <span className={`font-medium ${comp.https_status?.includes('HTTPS') ? 'text-emerald-400' : 'text-amber-400'}`}>
                {comp.https_status || 'Unchecked'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Domain Reputation:</span>
              <span className="text-slate-200 font-medium">
                {comp.domain_status || 'Unknown'}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {comp.explanation || 'No verification explanation available.'}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 uppercase tracking-wider font-mono">
          Scope: Digital Web Presence (Not Corporate Registry)
        </div>
      </div>

      {/* Recruiter Email Verification Card */}
      <div className="bg-[#131e36]/90 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-slate-300 text-sm font-semibold">
              <Mail className="w-4 h-4 text-cyan-400" />
              Recruiter Email Verification
            </div>
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold border flex items-center gap-1.5 ${recBadge.color}`}>
              <RecIcon className="w-3.5 h-3.5" />
              {recBadge.label}
            </span>
          </div>

          <div className="space-y-2 mb-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Recruiter Contact:</span>
              <span className="text-slate-200 font-mono truncate max-w-[200px]">
                {rec.recruiter_email || 'None provided'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Email Domain:</span>
              <span className="text-slate-200 font-mono">
                {rec.email_domain ? `@${rec.email_domain}` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Domain Alignment:</span>
              <span className={`font-medium ${rec.domain_match ? 'text-emerald-400' : 'text-red-400'}`}>
                {rec.domain_match ? 'Domain Matches Company' : 'Domain Mismatch / Unmatched'}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {rec.explanation || 'No recruiter verification explanation available.'}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 uppercase tracking-wider font-mono">
          Cross-Domain Correlation Engine
        </div>
      </div>
    </div>
  );
};

export default VerificationCard;
