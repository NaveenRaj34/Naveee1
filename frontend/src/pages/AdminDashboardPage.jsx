import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert, Users, Database, BarChart3, AlertOctagon,
  CheckCircle2, RefreshCw, Eye, ShieldCheck, Activity
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, Legend } from 'recharts';
import { adminAPI } from '../services/api';
import Navbar from '../components/Navbar';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await adminAPI.getStats();
        if (res.data && res.data.success) {
          setStats(res.data.data);
        } else {
          setError(res.data?.message || 'Access denied');
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
        setError('Failed to load administrative telemetry.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col cyber-grid">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
          <span className="text-xs text-slate-400 font-mono">Loading administrative control plane...</span>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col cyber-grid">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-red-500/30 rounded-2xl p-8 max-w-md text-center">
            <AlertOctagon className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Access Denied</h3>
            <p className="text-xs text-slate-400 mb-6">{error || 'Admin credentials required.'}</p>
            <Link to="/dashboard" className="px-5 py-2.5 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs">
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const s = stats || {};
  const commonFactors = (s.common_risk_factors || []).map((f) => ({
    name: f.factor_name.length > 20 ? f.factor_name.substring(0, 20) + '...' : f.factor_name,
    fullName: f.factor_name,
    count: f.count,
    severity: f.severity,
  }));

  const pieData = [
    { name: 'Genuine Postings', value: s.genuine_jobs || 0, color: '#10b981' },
    { name: 'Suspicious / Scams', value: s.suspicious_jobs || 0, color: '#ef4444' },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col cyber-grid">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Header */}
        <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              RESTRICTED ADMIN CONSOLE
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              System Administration & Global Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Platform-wide telemetry, user registry, and scam indicator intelligence.
            </p>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold border border-purple-500/30 bg-purple-500/10 text-purple-300 self-start sm:self-auto">
            ADMIN LEVEL 1
          </span>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Registered Users</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-black font-mono text-white">{s.total_users}</div>
            <span className="text-[10px] text-slate-500">Active accounts</span>
          </div>

          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Analyses</span>
              <Database className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-black font-mono text-white">{s.total_analyses}</div>
            <span className="text-[10px] text-slate-500">Global records</span>
          </div>

          <div className="bg-[#0f172a] border border-red-500/20 rounded-xl p-5">
            <div className="flex items-center justify-between text-red-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Critical Threats</span>
              <AlertOctagon className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-3xl font-black font-mono text-red-400">{s.critical_risk_jobs}</div>
            <span className="text-[10px] text-slate-500">Score 75-100</span>
          </div>

          <div className="bg-[#0f172a] border border-emerald-500/20 rounded-xl p-5">
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Genuine Jobs</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black font-mono text-emerald-400">{s.genuine_jobs}</div>
            <span className="text-[10px] text-slate-500">Passed checks</span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Most Common Risk Factors */}
          <div className="lg:col-span-7 bg-[#0f172a] border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                Most Common Scam Indicators Across All Jobs
              </h3>
              <span className="text-[11px] font-mono text-slate-400">Trigger Frequency</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={commonFactors} layout="vertical">
                  <XAxis type="number" stroke="#64748b" fontSize={11} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={10} width={130} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#131e36', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#38bdf8' }}
                  />
                  <Bar dataKey="count" fill="#38bdf8" radius={[0, 4, 4, 0]}>
                    {commonFactors.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.severity === 'CRITICAL' ? '#ef4444' : entry.severity === 'HIGH' ? '#f59e0b' : '#38bdf8'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Genuine vs Suspicious Proportion */}
          <div className="lg:col-span-5 bg-[#0f172a] border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                Genuine vs Suspicious Distribution
              </h3>
              <span className="text-[11px] font-mono text-slate-400">ML Predictions</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
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
        </div>

        {/* Global Recent Analyses Table */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-base font-bold text-white">System-Wide Audit Log</h3>
            <span className="text-xs font-mono text-slate-400">Live Database Feed</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 uppercase font-mono text-[10px] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">ID</th>
                  <th className="px-5 py-3.5">Job Title</th>
                  <th className="px-5 py-3.5">Company</th>
                  <th className="px-5 py-3.5">Prediction</th>
                  <th className="px-5 py-3.5">Risk Score</th>
                  <th className="px-5 py-3.5">Level</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {s.recent_analyses && s.recent_analyses.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4 font-mono text-slate-400">#{job.id}</td>
                    <td className="px-5 py-4 font-semibold text-white max-w-[200px] truncate">{job.job_title}</td>
                    <td className="px-5 py-4 text-slate-300">{job.company_name}</td>
                    <td className="px-5 py-4 font-medium">{job.prediction}</td>
                    <td className="px-5 py-4 font-mono font-bold text-white">{job.risk_score}/100</td>
                    <td className="px-5 py-4 uppercase text-[10px] font-bold">{job.risk_level}</td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        to={`/analysis/${job.id}`}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 rounded border border-slate-700"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
