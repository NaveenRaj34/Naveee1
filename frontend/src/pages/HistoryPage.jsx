import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  History, Search, Filter, Eye, Download, Trash2, ArrowUpDown,
  AlertTriangle, CheckCircle2, RefreshCw, ChevronLeft, ChevronRight, PlusCircle
} from 'lucide-react';
import { analysisAPI, reportsAPI } from '../services/api';
import Navbar from '../components/Navbar';

const TABS = [
  { label: 'All', value: '' },
  { label: 'Critical Risk', value: 'Critical', type: 'risk' },
  { label: 'High Risk', value: 'High', type: 'risk' },
  { label: 'Moderate', value: 'Moderate', type: 'risk' },
  { label: 'Low Risk', value: 'Low', type: 'risk' },
  { label: 'Suspicious ML', value: 'Suspicious', type: 'pred' },
  { label: 'Genuine ML', value: 'Genuine', type: 'pred' },
];

const HistoryPage = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [feedback, setFeedback] = useState({ text: '', type: '' });
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = { page };
      if (search) params.search = search;
      if (activeTab.type === 'risk') params.risk_level = activeTab.value;
      if (activeTab.type === 'pred') params.prediction = activeTab.value;

      const res = await analysisAPI.getHistory(params);
      if (res.data) {
        // DRF Paginated Response: { count, next, previous, results }
        const results = res.data.results || res.data;
        setAnalyses(results);
        if (res.data.count) {
          setTotalCount(res.data.count);
          setTotalPages(Math.ceil(res.data.count / 10));
        } else {
          setTotalCount(results.length);
          setTotalPages(1);
        }
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, activeTab]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchHistory();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this analysis record?')) return;
    try {
      await analysisAPI.deleteAnalysis(id);
      setFeedback({ text: 'Record deleted successfully.', type: 'success' });
      fetchHistory();
    } catch (err) {
      setFeedback({ text: 'Failed to delete analysis record.', type: 'error' });
    }
  };

  const handleDownloadPDF = async (id) => {
    setDownloadingId(id);
    setFeedback({ text: '', type: '' });
    try {
      const res = await reportsAPI.download(id);
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `jobshield_analysis_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setFeedback({ text: `Report #${id} downloaded successfully.`, type: 'success' });
    } catch (err) {
      setFeedback({ text: `Could not download PDF report for #${id}.`, type: 'error' });
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col cyber-grid">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
              <History className="w-7 h-7 text-cyan-400" />
              Analysis History & Audit Log
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Complete archive of evaluated job listings, risk calculations, and reports.
            </p>
          </div>

          <Link
            to="/analyze"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 inline-flex items-center gap-2 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" /> Analyze New Job
          </Link>
        </div>

        {feedback.text && (
          <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}>
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Search & Tabs Toolbar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search job title or company..."
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </form>

            <span className="text-xs text-slate-400 font-mono">
              Total Records: <strong className="text-white">{totalCount}</strong>
            </span>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {TABS.map((tab, idx) => {
              const isSelected = activeTab.label === tab.label;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveTab(tab);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 uppercase font-mono text-[10px] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Target Job Title</th>
                  <th className="px-5 py-3.5">Company Name</th>
                  <th className="px-5 py-3.5">ML Prediction</th>
                  <th className="px-5 py-3.5">Risk Score</th>
                  <th className="px-5 py-3.5">Risk Level</th>
                  <th className="px-5 py-3.5">Date Analyzed</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-5 py-12 text-center text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto text-cyan-400 mb-2" />
                      Loading history log...
                    </td>
                  </tr>
                ) : analyses && analyses.length > 0 ? (
                  analyses.map((job) => {
                    const isCrit = job.risk_level?.toLowerCase() === 'critical';
                    const isHigh = job.risk_level?.toLowerCase() === 'high';
                    const isMed = job.risk_level?.toLowerCase() === 'moderate';

                    const badgeColor = isCrit
                      ? 'bg-red-500/10 text-red-400 border-red-500/30'
                      : isHigh
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : isMed
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

                    return (
                      <tr key={job.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4 font-semibold text-white max-w-[220px] truncate">
                          <Link to={`/analysis/${job.id}`} className="hover:text-cyan-400 transition-colors">
                            {job.job_title}
                          </Link>
                        </td>
                        <td className="px-5 py-4 text-slate-300 max-w-[160px] truncate">
                          {job.company_name}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                            job.prediction === 'Suspicious' ? 'bg-red-500/10 text-red-300 border-red-500/20' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                          }`}>
                            {job.prediction}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono font-bold text-white">
                          {job.risk_score}/100
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeColor}`}>
                            {job.risk_level}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-400 font-mono text-[11px]">
                          {new Date(job.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/analysis/${job.id}`}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded border border-slate-700 transition-colors"
                              title="View Result"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => handleDownloadPDF(job.id)}
                              disabled={downloadingId === job.id}
                              className="p-1.5 bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 rounded border border-slate-700 transition-colors disabled:opacity-50"
                              title="Download PDF"
                            >
                              {downloadingId === job.id ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                              ) : (
                                <Download className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDelete(job.id)}
                              className="p-1.5 bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 rounded border border-slate-700 transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="px-5 py-10 text-center text-slate-500">
                      No analyses found matching the filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 disabled:opacity-40 transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 disabled:opacity-40 transition-colors flex items-center gap-1"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;
