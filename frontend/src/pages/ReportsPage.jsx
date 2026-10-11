import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, Eye, RefreshCw, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { analysisAPI, reportsAPI } from '../services/api';
import Navbar from '../components/Navbar';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await analysisAPI.getHistory({ page: 1 });
        const list = res.data.results || res.data || [];
        setReports(list);
      } catch (err) {
        console.error('Failed to fetch reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleDownloadPDF = async (id, title) => {
    try {
      const res = await reportsAPI.download(id);
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `jobshield_dossier_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert('Could not download PDF report.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col cyber-grid">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        <div className="border-b border-slate-800 pb-5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-cyan-400" />
            Generated PDF Reports & Dossiers
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Download formal, executive-ready PDF cybersecurity risk assessments for any analyzed job posting.
          </p>
        </div>

        {loading ? (
          <div className="p-16 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-cyan-400 mb-3" />
            <span className="text-xs font-mono">Loading report dossiers...</span>
          </div>
        ) : reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((item) => {
              const isCrit = item.risk_level?.toLowerCase() === 'critical';
              const isHigh = item.risk_level?.toLowerCase() === 'high';
              const isMed = item.risk_level?.toLowerCase() === 'moderate';

              const badgeColor = isCrit
                ? 'bg-red-500/10 text-red-400 border-red-500/30'
                : isHigh
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : isMed
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

              return (
                <div
                  key={item.id}
                  className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                        DOSSIER #{item.id}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${badgeColor}`}>
                        {item.risk_level} Risk
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mb-1 truncate">
                      {item.job_title}
                    </h3>
                    <p className="text-xs text-slate-400 mb-3">
                      Target: <span className="text-slate-200">{item.company_name}</span>
                    </p>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs mb-4">
                      <span className="text-slate-400">Score & Assessment:</span>
                      <span className="font-mono font-bold text-white">
                        {item.risk_score}/100 ({item.prediction})
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadPDF(item.id, item.job_title)}
                      className="flex-1 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" /> Download PDF
                    </button>
                    <Link
                      to={`/analysis/${item.id}`}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors"
                      title="Inspect Dossier"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-16 text-center text-slate-500 bg-[#0f172a] rounded-2xl border border-slate-800">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No Reports Available</h3>
            <p className="text-xs text-slate-400 mb-4">Run an analysis first to generate a printable security report.</p>
            <Link
              to="/analyze"
              className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs"
            >
              Analyze a Job
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReportsPage;
