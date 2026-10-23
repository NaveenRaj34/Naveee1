import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldAlert, ShieldCheck, Download, ArrowLeft, RefreshCw,
  Cpu, FileText, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp,
  ExternalLink, Sparkles, AlertOctagon, Share2
} from 'lucide-react';
import { analysisAPI, reportsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import RiskGauge from '../components/RiskGauge';
import PredictionCard from '../components/PredictionCard';
import VerificationCard from '../components/VerificationCard';
import SalaryAnalysisCard from '../components/SalaryAnalysisCard';
import RiskFactorCard from '../components/RiskFactorCard';
import RecommendationCard from '../components/RecommendationCard';

const AnalysisResultPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await analysisAPI.getDetail(id);
        if (res.data && res.data.success) {
          setData(res.data.data);
        } else {
          setError('Analysis record could not be loaded.');
        }
      } catch (err) {
        console.error('Failed to load analysis:', err);
        setError('Error retrieving analysis record.');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  const handleDownloadPDF = async () => {
    setDownloading(true);
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
    } catch (err) {
      console.error('Failed to download PDF report:', err);
      alert('Could not download PDF report.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col cyber-grid">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
          <span className="text-xs text-slate-400 font-mono">Retrieving risk analysis dossier...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col cyber-grid">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-red-500/30 rounded-2xl p-8 max-w-md text-center">
            <AlertOctagon className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Analysis Not Found</h3>
            <p className="text-xs text-slate-400 mb-6">{error || 'Record does not exist.'}</p>
            <Link
              to="/analyze"
              className="px-5 py-2.5 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs"
            >
              Start New Analysis
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const score = data.risk_score || 0;
  const level = data.risk_level || 'Low';
  const isSuspicious = data.prediction?.toLowerCase() === 'suspicious' || data.prediction?.toLowerCase() === 'fake';

  const xai = data.explainable_ai || {};
  const reasons = xai.reasons || [];
  const factors = data.risk_factors || [];
  const recs = data.recommendations || [];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col cyber-grid">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Navigation Breadcrumb & Download CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <Link
            to="/history"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to History
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/analyze"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              Analyze Another Job
            </Link>
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {downloading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" /> Download PDF Report
                </>
              )}
            </button>
          </div>
        </div>

        {/* TOP SECTION: Hero Risk Header */}
        <div className="bg-[#0f172a]/95 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 8 Cols: Job Meta + Big Verdict */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                VERIFIED SECURITY DOSSIER #{data.id}
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {data.job_title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-300 font-medium">
                  <span className="text-cyan-400 font-bold">{data.company_name}</span>
                  <span>•</span>
                  <span>{data.location || 'Location Unspecified'}</span>
                  <span>•</span>
                  <span>{data.employment_type || 'Full-time'}</span>
                  <span>•</span>
                  <span className="font-mono text-slate-400">{new Date(data.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Status Banner */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 text-sm font-bold ${
                  isSuspicious
                    ? 'bg-red-500/10 text-red-400 border-red-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}>
                  {isSuspicious ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  {isSuspicious ? 'LIKELY SUSPICIOUS / FRAUDULENT' : 'GENUINE CORPORATE LISTING'}
                </div>

                <div className="text-xs text-slate-400 font-mono">
                  MODEL CONFIDENCE: <span className="text-white font-bold">{data.confidence}%</span>
                </div>

                <div className="text-[11px] font-mono px-2.5 py-1 rounded-md border flex items-center gap-1.5 font-semibold">
                  {data.ml_result?.is_fallback ? (
                    <span className="text-amber-400 border-amber-500/30 bg-amber-500/10 px-2 py-0.5 rounded">
                      HEURISTIC FALLBACK
                    </span>
                  ) : (
                    <span className="text-cyan-400 border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      LIVE ML MODEL PREDICTION
                    </span>
                  )}
                </div>
              </div>

              {/* Summary Sentence */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-4">
                {xai.summary || 'Multi-factor evaluation complete.'}
              </p>
            </div>

            {/* Right 4 Cols: Dynamic Risk Score Gauge */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                AGGREGATE RISK INDEX
              </span>
              <RiskGauge score={score} level={level} size={180} />
            </div>
          </div>
        </div>

        {/* EXPLAINABLE AI: WHY DID THE SYSTEM GIVE THIS RESULT? */}
        <div className="bg-[#0f172a] border border-cyan-500/20 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Why Did the System Give This Result?</h3>
              <p className="text-xs text-slate-400">Explainable AI trace directly mapped to detected features</p>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            {reasons.map((reason, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200"
              >
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <span className="leading-relaxed">{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CONTRIBUTING FACTORS BREAKDOWN */}
        {factors && factors.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Traceable Contributing Risk Factors</h3>
                <p className="text-xs text-slate-400">Exact additive point contributions yielding the {score}/100 score</p>
              </div>
              <span className="text-xs font-mono text-slate-400">{factors.length} Factors Triggered</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {factors.map((f, idx) => (
                <RiskFactorCard key={idx} factor={f} />
              ))}
            </div>
          </div>
        )}

        {/* VERIFICATION & SALARY ANALYSIS GRIDS */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Verification & Market Integrity</h3>
          <VerificationCard
            companyVerification={data.company_verification}
            recruiterVerification={data.recruiter_verification}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PredictionCard
            prediction={data.prediction}
            confidence={data.confidence}
            modelName={data.ml_result?.model_name}
            version={data.ml_result?.model_version}
            isFallback={data.ml_result?.is_fallback}
            modelStatus={data.ml_result?.model_status}
          />

          <SalaryAnalysisCard
            salaryAnalysis={data.salary_analysis}
            currency={data.currency}
          />
        </div>

        {/* ACTIONABLE SAFETY RECOMMENDATIONS */}
        {recs && recs.length > 0 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white">Prioritized Safety Recommendations</h3>
              <p className="text-xs text-slate-400">Protecting candidates from predatory or fraudulent recruitment</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recs.map((r, idx) => (
                <RecommendationCard key={idx} recommendation={r} />
              ))}
            </div>
          </div>
        )}

        {/* EXPANDABLE TECHNICAL DETAILS */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="w-full p-5 text-left flex items-center justify-between text-sm font-semibold text-slate-300 hover:text-white"
          >
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Technical AI & Architecture Details (For Academic Evaluation)</span>
            </div>
            {showTechnicalDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showTechnicalDetails && (
            <div className="p-5 border-t border-slate-800 bg-slate-900/60 space-y-4 text-xs font-mono text-slate-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block mb-1">ALGORITHM</span>
                  <span className="text-white font-bold">Random Forest Classifier</span>
                  <span className="text-[10px] text-slate-400 block mt-1">100 Estimators • Gini Criterion</span>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block mb-1">FEATURE EXTRACTION</span>
                  <span className="text-white font-bold">TF-IDF Vectorizer</span>
                  <span className="text-[10px] text-slate-400 block mt-1">N-grams (1,2) • Sublinear TF</span>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block mb-1">PIPELINE VERSION</span>
                  <span className="text-white font-bold">JobShield v1.0.0</span>
                  <span className="text-[10px] text-slate-400 block mt-1">Serialized Pickle Artifact</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] leading-relaxed">
                <span className="text-slate-500 block mb-1 font-bold">INFERENCE PIPELINE EXECUTION:</span>
                Raw Description → Lowercase & Punctuation Cleanup → Stopwords Filtered → TF-IDF Transformation → RF Probability Vector: [P(Genuine)={100 - data.confidence}%, P(Scam)={data.confidence}%] → Cross-Domain Correlation → Heuristic Rule Evaluation → Traceable Factor Aggregation.
              </div>
            </div>
          )}
        </div>

        {/* Legal Disclaimer */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-500">
          JobShield AI is a decision-support platform designed to highlight scam indicators. It does not provide legal guarantees. Always conduct independent employer verification before sharing sensitive documents.
        </div>
      </main>
    </div>
  );
};

export default AnalysisResultPage;
