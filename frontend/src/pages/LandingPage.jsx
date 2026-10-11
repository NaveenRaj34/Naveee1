import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, ShieldAlert, ShieldCheck, Cpu, Globe, Mail, DollarSign,
  AlertTriangle, CheckCircle2, ArrowRight, Sparkles, ChevronDown, ChevronUp,
  FileText, ExternalLink, Lock, Users, Zap
} from 'lucide-react';
import Navbar from '../components/Navbar';
import RiskGauge from '../components/RiskGauge';

const FAQS = [
  {
    q: "How does JobShield AI detect fraudulent job offers?",
    a: "JobShield AI implements a multi-factor risk assessment pipeline. It combines NLP (TF-IDF vectorization) and an ensemble Random Forest classifier with digital footprint verification (HTTPS check, domain syntax, DNS reachability), recruiter email domain cross-referencing, rule-based salary anomaly analysis, and predatory keyword pattern matching."
  },
  {
    q: "Why doesn't the system simply say 'Fake' or 'Real'?",
    a: "Employment fraud is nuanced. Rather than providing a blunt binary verdict, JobShield AI computes a 0-100 Risk Score with traceable factors and explainable reasons. This transparent approach enables job seekers to understand precisely why a listing is flagged (e.g. upfront fee requests or recruiter domain mismatches)."
  },
  {
    q: "Does a free email provider (e.g., Gmail) automatically mean a job is a scam?",
    a: "No. While reputable enterprise recruiters almost always use corporate domains, early-stage startups and small businesses sometimes use Gmail or Outlook. JobShield AI treats free mail providers as an elevated risk factor rather than conclusive proof, balancing it against other indicators."
  },
  {
    q: "Is my personal data saved when I analyze a job posting?",
    a: "JobShield AI evaluates job descriptions for predatory patterns and never requires you to enter personal passwords, OTPs, or financial credentials. The platform strongly advises users never to transmit sensitive banking details to unverified recruiters."
  }
];

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col cyber-grid">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading and CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                Next-Gen Employment Cybersecurity Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
                Is That Job Offer <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
                  Really Safe?
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Use AI to analyze job postings, verify recruiters and companies, detect scam indicators,
                and understand your employment risk before you apply.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/analyze"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all group"
                >
                  <ShieldAlert className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  Analyze a Job
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-semibold text-sm border border-slate-700/80 flex items-center justify-center gap-2 transition-all"
                >
                  How It Works
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Zero False-Certainty Guarantee
                </span>
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  Random Forest + TF-IDF NLP
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-blue-400" />
                  Private & Secure
                </span>
              </div>
            </div>

            {/* Right Column: High-Tech Security Visual */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md bg-[#0f172a]/90 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="text-xs font-mono text-slate-400 ml-2">JobShield Threat Analyzer</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    LIVE DEMO
                  </span>
                </div>

                {/* Simulated Sample Job */}
                <div className="py-4 space-y-3">
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 font-mono block">SIMULATED POSTING TARGET</span>
                    <h4 className="text-sm font-bold text-white mt-0.5">Work-From-Home Data Assistant</h4>
                    <span className="text-xs text-slate-300">Apex Consulting • $85,000/yr (No Experience)</span>
                  </div>

                  <div className="flex items-center justify-center py-2">
                    <RiskGauge score={88} level="Critical" size={170} />
                  </div>

                  {/* Detected markers */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300">
                      <span className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Registration Fee Detected ($150 wire)
                      </span>
                      <span className="font-mono font-bold">+25 pts</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-300">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        Recruiter Email Mismatch (@gmail.com)
                      </span>
                      <span className="font-mono font-bold">+20 pts</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 text-center">
                  <Link
                    to="/analyze"
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1"
                  >
                    Run your own job posting through JobShield <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Statistics */}
      <section className="py-12 bg-[#0a0f1d] border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <span className="block text-3xl md:text-4xl font-extrabold text-white font-mono">12,480+</span>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1 block">Jobs Analyzed</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <span className="block text-3xl md:text-4xl font-extrabold text-red-400 font-mono">3,840+</span>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1 block">Scams Detected</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <span className="block text-3xl md:text-4xl font-extrabold text-emerald-400 font-mono">8,640+</span>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1 block">Companies Verified</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <span className="block text-3xl md:text-4xl font-extrabold text-cyan-400 font-mono">15,200+</span>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1 block">Job Seekers Protected</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
            COMPREHENSIVE MULTI-FACTOR DEFENSE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Engineered to Expose Deceptive Employment Offers
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            Scammers use increasingly sophisticated phrasing. JobShield AI inspects the full context—combining machine learning, web verification, and financial heuristics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-105 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">AI Job Scam Detection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Trained Random Forest Classifier with TF-IDF n-gram vectorization trained to detect deceptive terminology, pressure phrasing, and fraud patterns.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5 group-hover:scale-105 transition-transform">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Company Verification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Validates digital web presence, HTTPS security implementation, suspicious TLD patterns (.xyz, .tk), and live network accessibility.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-105 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Recruiter Verification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cross-references recruiter email domains against company web addresses to flag impersonation and public freemail providers.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-105 transition-transform">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Salary Anomaly Analysis</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Identifies exaggerated compensation boundaries, inverted ranges, and 'earn huge money with no experience' bait tactics.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Explainable AI (XAI)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Provides transparent, evidence-based reasoning answering exactly WHY a job was flagged, avoiding black-box ambiguity.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-5 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Dynamic Safety Advisory</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tailors prioritized defense recommendations based on detected vulnerabilities—such as fee refusal or identity theft precautions.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[#0a0f1d] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
              SIMPLE 5-STEP PROCESS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              How JobShield AI Analyzes Your Job Offer
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              Fast, explainable verification pipeline designed to protect job seekers in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { step: "01", title: "Paste Job Details", desc: "Input job description, salary, company website, and recruiter email into the form." },
              { step: "02", title: "AI Analyzes Text", desc: "NLP pipeline tokenizes text and runs Random Forest classification model." },
              { step: "03", title: "Verify Entity", desc: "System checks HTTPS status, domain reputation, and recruiter address match." },
              { step: "04", title: "Compute Risk", desc: "Traceable scoring engine tallies evidence factors to yield 0-100 score." },
              { step: "05", title: "Review Guidance", desc: "Receive transparent reasons, danger alerts, and candidate safety recommendations." },
            ].map((s, idx) => (
              <div key={idx} className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
                <div>
                  <span className="font-mono text-3xl font-black text-cyan-500/20 block mb-2">{s.step}</span>
                  <h4 className="text-sm font-bold text-white mb-1.5">{s.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all"
            >
              Analyze Your First Job Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Understanding Job Scam Analysis
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-sm sm:text-base font-semibold text-slate-200 hover:text-white"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-cyan-400" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-[#050810] border-t border-slate-800 py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-300">JobShield AI</span>
            <span>— Detect. Verify. Stay Safe.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/analyze" className="hover:text-slate-300">Analyze</Link>
            <Link to="/login" className="hover:text-slate-300">Sign In</Link>
            <Link to="/register" className="hover:text-slate-300">Register</Link>
          </div>

          <div>
            <span>Final-Year Engineering Project • AI Cybersecurity Platform</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
