import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, ShieldAlert, User, LogOut, Menu, X, BarChart3, History, FileText, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          {/* Logo */}
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
                JobShield<span className="text-cyan-400">AI</span>
              </span>
              <span className="text-[10px] block font-mono text-slate-400 -mt-1 tracking-wider uppercase">
                Detect • Verify • Protect
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/analyze"
                className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/analyze') ? 'text-cyan-400 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                Analyze Job
              </Link>
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/dashboard') ? 'text-cyan-400 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-slate-400" />
                Dashboard
              </Link>
              <Link
                to="/history"
                className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/history') ? 'text-cyan-400 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                <History className="w-4 h-4 text-slate-400" />
                History
              </Link>
              <Link
                to="/reports"
                className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/reports') ? 'text-cyan-400 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4 text-slate-400" />
                Reports
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`text-sm font-medium px-2 py-0.5 rounded border border-purple-500/30 text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 transition-colors`}
                >
                  Admin Console
                </Link>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors ${
                  isActive('/') ? 'text-cyan-400 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Home
              </Link>
              <Link
                to="/analyze"
                className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/analyze') ? 'text-cyan-400 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                Analyze Job
              </Link>
              <a
                href="/#features"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="/#how-it-works"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                How It Works
              </a>
            </div>
          )}

          {/* User actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-xs font-medium text-slate-200">{user?.name || user?.email}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800/50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                {location.pathname === '/login' ? (
                  <Link
                    to="/register"
                    className="text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-4 py-2 rounded-lg shadow-md shadow-cyan-500/20 transition-all font-semibold"
                  >
                    Create Account
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-4 py-2 rounded-lg shadow-md shadow-cyan-500/20 transition-all font-semibold"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-400 hover:text-white p-2 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0a0f1d] px-4 pt-3 pb-5 space-y-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/analyze"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-cyan-400 hover:bg-slate-800 rounded-md font-semibold"
              >
                Analyze Job
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800 rounded-md"
              >
                Dashboard
              </Link>
              <Link
                to="/history"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800 rounded-md"
              >
                History
              </Link>
              <Link
                to="/reports"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800 rounded-md"
              >
                Reports
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-purple-400 hover:bg-slate-800 rounded-md"
                >
                  Admin Console
                </Link>
              )}
              <div className="pt-4 border-t border-slate-800 flex justify-between items-center px-3">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs text-slate-300 hover:text-white"
                >
                  {user?.name || user?.email}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-red-400 flex items-center gap-1 font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 space-y-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800 rounded-md"
              >
                Home
              </Link>
              <Link
                to="/analyze"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-cyan-400 hover:bg-slate-800 rounded-md font-semibold"
              >
                Analyze Job
              </Link>
              <a
                href="/#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800 rounded-md"
              >
                Features
              </a>
              <a
                href="/#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800 rounded-md"
              >
                How It Works
              </a>
              <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 px-3 text-slate-200 border border-slate-700 rounded-lg text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 px-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-lg text-sm"
                >
                  Create Account
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
