import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert, Sparkles, Building2, User, Globe, DollarSign,
  Briefcase, MapPin, Mail, AlertCircle, FileText, Check, ArrowRight
} from 'lucide-react';
import { analysisAPI } from '../services/api';
import Navbar from '../components/Navbar';
import AIProcessingModal from '../components/AIProcessingModal';

const SAMPLE_JOBS = [
  {
    label: "Safe Genuine Job: Senior Python Engineer (Stripe)",
    data: {
      job_title: "Senior Python Backend Engineer",
      company_name: "Stripe, Inc.",
      job_description: "We are looking for a Senior Python Developer with strong Django, PostgreSQL, and AWS experience. You will architect high-throughput APIs, lead system design discussions, and mentor junior engineers in a collaborative engineering culture.",
      salary_min: 135000,
      salary_max: 160000,
      currency: "USD",
      location: "San Francisco, CA",
      employment_type: "Full-time",
      experience: "5+ years",
      company_website: "https://stripe.com",
      recruiter_name: "Elena Vance",
      recruiter_email: "recruiting@stripe.com",
      job_portal: "LinkedIn",
      job_url: "https://stripe.com/jobs/senior-python",
      contact_number: "",
      additional_notes: "Found on official corporate careers site."
    }
  },
  {
    label: "Critical Scam: Registration Fee & Free Mail (Apex)",
    data: {
      job_title: "URGENT: Work From Home Data Entry Assistant - Instant Hire!",
      company_name: "Apex Worldwide Consultants",
      job_description: "URGENT HIRING! Immediate joining available. Earn $45/hour from home with no prior experience needed! High weekly guaranteed payout. To register your position and receive your company equipment, a one-time refundable registration fee of $150 must be sent via wire transfer or gift card immediately. Limited spots remaining! Apply now!",
      salary_min: 85000,
      salary_max: 120000,
      currency: "USD",
      location: "Remote",
      employment_type: "Full-time",
      experience: "No experience",
      company_website: "http://apex-jobs-free.xyz",
      recruiter_name: "Mark Smith",
      recruiter_email: "apex.hiring.manager@gmail.com",
      job_portal: "Telegram",
      job_url: "",
      contact_number: "+1 800-555-0199",
      additional_notes: "Contact requested communication over Telegram @apex_hr"
    }
  },
  {
    label: "High Risk Phishing: Recruiter Domain Mismatch (AWS Impersonation)",
    data: {
      job_title: "Cloud Security Architect",
      company_name: "Amazon Web Services",
      job_description: "Amazon Web Services is seeking a Cloud Security Architect to design zero-trust multi-cloud security architectures. Send CV for rapid evaluation. Our direct coordinator will schedule an interview.",
      salary_min: 150000,
      salary_max: 185000,
      currency: "USD",
      location: "Remote",
      employment_type: "Full-time",
      experience: "5+ years",
      company_website: "https://aws.amazon.com",
      recruiter_name: "David Vance",
      recruiter_email: "aws-talent-acquisition@gmail.com",
      job_portal: "Indeed",
      job_url: "https://aws.amazon.com/careers",
      contact_number: "",
      additional_notes: "Recruiter emailed from Gmail claiming to represent AWS enterprise recruitment."
    }
  },
  {
    label: "Critical Scam: Unrealistic Salary & Check Deposit (Wealth Syndicate)",
    data: {
      job_title: "Executive Courier & Financial Assistant",
      company_name: "Private Wealth Syndicate",
      job_description: "Urgent hiring! Earn $5,000/week working 2 hours per day from home. No interview required! Task involves receiving cashier checks, depositing them into your personal bank account, and forwarding funds via crypto. Guaranteed income!",
      salary_min: 180000,
      salary_max: 250000,
      currency: "USD",
      location: "New York, NY",
      employment_type: "Part-time",
      experience: "None",
      company_website: "",
      recruiter_name: "Alexander Kane",
      recruiter_email: "kane.wealth.mgmt@yahoo.com",
      job_portal: "Direct Email",
      job_url: "",
      contact_number: "",
      additional_notes: "Requires sharing bank routing details upfront."
    }
  }
];

const AnalyzeJobPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    job_title: '',
    company_name: '',
    job_description: '',
    salary_min: '',
    salary_max: '',
    currency: 'USD',
    location: '',
    employment_type: 'Full-time',
    experience: '',
    company_website: '',
    recruiter_name: '',
    recruiter_email: '',
    job_portal: '',
    job_url: '',
    contact_number: '',
    additional_notes: '',
  });

  const [errors, setErrors] = useState({});
  const [analyzing, setAnalyzing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleLoadSample = (sample) => {
    setFormData(sample.data);
    setErrors({});
  };

  const validate = () => {
    const errs = {};
    if (!formData.job_title.trim()) errs.job_title = 'Job title is required.';
    if (!formData.company_name.trim()) errs.company_name = 'Company name is required.';
    if (!formData.job_description.trim()) {
      errs.job_description = 'Job description is required.';
    } else if (formData.job_description.trim().length < 20) {
      errs.job_description = 'Job description must be at least 20 characters for meaningful analysis.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setAnalyzing(true);

    try {
      // Minimum duration for smooth AI visualization presentation
      const [res] = await Promise.all([
        analysisAPI.analyze({
          ...formData,
          salary_min: formData.salary_min ? parseFloat(formData.salary_min) : null,
          salary_max: formData.salary_max ? parseFloat(formData.salary_max) : null,
        }),
        new Promise((r) => setTimeout(r, 2600)) // ensure UX animation finishes
      ]);

      if (res.data && res.data.success) {
        navigate(`/analysis/${res.data.data.id}`);
      } else {
        setErrors({ form: res.data?.message || 'Analysis could not be completed.' });
        setAnalyzing(false);
      }
    } catch (err) {
      console.error('Analysis error:', err);
      const apiErr = err.response?.data;
      if (apiErr?.errors) {
        setErrors(apiErr.errors);
      } else {
        setErrors({ form: apiErr?.message || 'Server error occurred during analysis.' });
      }
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col cyber-grid">
      <Navbar />

      <AIProcessingModal isOpen={analyzing} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            AI Scam Intelligence Scanner
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Analyze a Job Posting
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Submit job listing details to initiate multi-factor scam indicator detection, domain verification, and NLP risk calculation.
          </p>
        </div>

        {/* Load Sample Job Quick Buttons */}
        <div className="mb-8 bg-[#0f172a] border border-cyan-500/20 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              Pre-Configured Test Samples (For Quick Demonstration)
            </span>
            <span className="text-[11px] text-slate-400">Click any preset to auto-fill</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SAMPLE_JOBS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLoadSample(sample)}
                className="text-left p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-200 transition-all flex items-center justify-between group"
              >
                <span className="truncate pr-2 font-medium">{sample.label}</span>
                <span className="text-[11px] text-cyan-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  Load →
                </span>
              </button>
            ))}
          </div>
        </div>

        {errors.form && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION 1: JOB DETAILS */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-800 pb-3">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              1. Job & Company Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Job Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleChange}
                  placeholder="e.g. Senior Software Engineer"
                  className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors ${
                    errors.job_title ? 'border-red-500' : 'border-slate-700'
                  }`}
                />
                {errors.job_title && (
                  <span className="text-red-400 text-[11px] mt-1 block">{errors.job_title}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Company Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  placeholder="e.g. Stripe, Inc."
                  className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors ${
                    errors.company_name ? 'border-red-500' : 'border-slate-700'
                  }`}
                />
                {errors.company_name && (
                  <span className="text-red-400 text-[11px] mt-1 block">{errors.company_name}</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Job Description <span className="text-red-400">*</span>
              </label>
              <textarea
                name="job_description"
                rows={6}
                value={formData.job_description}
                onChange={handleChange}
                placeholder="Paste the complete job posting text, responsibilities, and requirements here..."
                className={`w-full p-3.5 bg-slate-900 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors ${
                  errors.job_description ? 'border-red-500' : 'border-slate-700'
                }`}
              />
              {errors.job_description && (
                <span className="text-red-400 text-[11px] mt-1 block">{errors.job_description}</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Remote / New York"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Employment Type
                </label>
                <select
                  name="employment_type"
                  value={formData.employment_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Temporary">Temporary</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Experience Required
                </label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g. 3-5 years, or None"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: SALARY METRICS */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-800 pb-3">
              <DollarSign className="w-4 h-4 text-cyan-400" />
              2. Compensation Structure (Salary Analysis)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Minimum Salary
                </label>
                <input
                  type="number"
                  name="salary_min"
                  value={formData.salary_min}
                  onChange={handleChange}
                  placeholder="e.g. 80000"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Maximum Salary
                </label>
                <input
                  type="number"
                  name="salary_max"
                  value={formData.salary_max}
                  onChange={handleChange}
                  placeholder="e.g. 120000"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="CAD">CAD ($)</option>
                  <option value="AUD">AUD ($)</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3: RECRUITER & DIGITAL VERIFICATION */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-800 pb-3">
              <Globe className="w-4 h-4 text-cyan-400" />
              3. Verification Targets (Digital Footprint)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Company Website URL
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="company_website"
                    value={formData.company_website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Recruiter Contact Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="recruiter_email"
                    value={formData.recruiter_email}
                    onChange={handleChange}
                    placeholder="recruiter@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Recruiter Name
                </label>
                <input
                  type="text"
                  name="recruiter_name"
                  value={formData.recruiter_name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Job Portal / Source
                </label>
                <input
                  type="text"
                  name="job_portal"
                  value={formData.job_portal}
                  onChange={handleChange}
                  placeholder="e.g. LinkedIn, Telegram, Email"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Job Posting URL (Optional)
                </label>
                <input
                  type="text"
                  name="job_url"
                  value={formData.job_url}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* SUBMIT ACTION */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={analyzing}
              className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <ShieldAlert className="w-4 h-4" />
              Analyze Job Posting
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AnalyzeJobPage;
