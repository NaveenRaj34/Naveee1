import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert, ShieldCheck, BarChart3, TrendingUp, AlertTriangle,
  CheckCircle2, ArrowRight, PlusCircle, Clock, Eye, FileText, Loader2, Sparkles
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { dashboardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await dashboardAPI.getStats();
        if (res.data && res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard statistics:', err);
        setError('Unable to load latest dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col cyber-grid">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <span className="text-xs text-slate-400 font-mono">Loading telemetry & risk metrics...</span>
        </div>
      </div>
    );
  }

  const s = stats || {};
  const total = s.total_analyses || 0;
  const critical = s.critical_risk || 0;
  const high = s.high_risk || 0;
  const medium = s.medium_risk || 0;
  const low = s.low_risk || 0;
  const genuine = s.genuine_jobs || 0;
  const suspicious = s.suspicious_jobs || 0;

  const riskData = s.risk_distribution || [
    { name: 'Low Risk', value: low, color: '#10b981' },
    { name: 'Moderate', value: medium, color: '#38bdf8' },
    { name: 'High Risk', value: high, color: '#f59e0b' },
    { name: 'Critical', value: critical, color: '#ef4444' },
  ];

  const trendData = s.trend || [];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col cyber-grid">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-slate-900/90 via-[#0f172a]/90 to-blue-950/40 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1">
              SECURITY TELEMETRY CONSOLE
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome, {user?.name || 'Security Analyst'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-xl">
              Inspect suspicious postings, verify recruiter credentials, and assess AI-driven scam probability.
            </p>
          </div>

          <Link
            to="/analyze"
            className="relative z-10 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all flex-shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            Analyze New Job
          </Link>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Scanned</span>
            <div className="text-2xl font-bold font-mono text-white mt-1">{total}</div>
            <span className="text-[10px] text-slate-500">Postings</span>
          </div>

          <div className="bg-[#0f172a] border border-red-500/20 rounded-xl p-4">
            <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wider">Critical Risk</span>
            <div className="text-2xl font-bold font-mono text-red-400 mt-1">{critical}</div>
            <span className="text-[10px] text-slate-500">Score 75-100</span>
          </div>

          <div className="bg-[#0f172a] border border-amber-500/20 rounded-xl p-4">
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">High Risk</span>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1">{high}</div>
            <span className="text-[10px] text-slate-500">Score 50-74</span>
          </div>

          <div className="bg-[#0f172a] border border-cyan-500/20 rounded-xl p-4">
            <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">Moderate</span>
            <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">{medium}</div>
            <span className="text-[10px] text-slate-500">Score 25-49</span>
          </div>

          <div className="bg-[#0f172a] border border-emerald-500/20 rounded-xl p-4">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Low Risk</span>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{low}</div>
            <span className="text-[10px] text-slate-500">Score 0-24</span>
          </div>

          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Model Scams</span>
            <div className="text-2xl font-bold font-mono text-orange-400 mt-1">{suspicious}</div>
            <span className="text-[10px] text-slate-500">Flagged by NLP</span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Risk Distribution Chart */}
          <div className="lg:col-span-5 bg-[#0f172a] border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                Risk Tier Distribution
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">All Postings</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#131e36', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={(value) => <span className="text-xs text-slate-300 font-medium">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Analysis Trend Chart */}
          <div className="lg:col-span-7 bg-[#0f172a] border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Weekly Analysis Activity Trend
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">Last 7 Days</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorAnalyses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#131e36', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#38bdf8' }}
                  />
                  <Area type="monotone" dataKey="analyses" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#colorAnalyses)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Analyses Table */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Recent Scam Evaluations</h3>
              <p className="text-xs text-slate-400">Latest inspected employment opportunities</p>
            </div>
            <Link
              to="/history"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              View Full History <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/60 uppercase font-mono text-[10px] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Job Title</th>
                  <th className="px-5 py-3.5">Company</th>
                  <th className="px-5 py-3.5">ML Prediction</th>
                  <th className="px-5 py-3.5">Risk Score</th>
                  <th className="px-5 py-3.5">Risk Level</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {s.recent_analyses && s.recent_analyses.length > 0 ? (
                  s.recent_analyses.map((job) => {
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
                      <tr key={job.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-5 py-4 font-semibold text-white max-w-[220px] truncate">
                          {job.job_title}
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
                          <Link
                            to={`/analysis/${job.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 rounded border border-slate-700 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="px-5 py-8 text-center text-slate-500">
                      No analyses recorded yet. Click "Analyze New Job" to scan your first posting.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
