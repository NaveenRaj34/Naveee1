import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col cyber-grid">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <span className="font-mono text-3xl font-black text-cyan-400 block mb-1">404</span>
          <h2 className="text-xl font-bold text-white mb-2">Endpoint Not Found</h2>
          <p className="text-xs text-slate-400 mb-6">
            The requested resource could not be located in the security telemetry directory.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Safety
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
