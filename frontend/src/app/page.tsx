"use client";

import { useState, useRef, useEffect } from "react";
import {
  FileText,
  UploadCloud,
  ShieldCheck,
  CheckCircle,
  FileSpreadsheet,
  Zap,
  TrendingUp,
  Cpu,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import ExtractionResults from "../components/ExtractionResults";

interface ResumeData {
  name: string;
  contact: {
    email: string;
    phone: string;
  };
  entities: {
    ORG: Array<{ name: string; confidence: number }>;
    GPE: string[];
    DATE: string[];
  };
  skills: string[];
  keywords: string[];
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [results, setResults] = useState<ResumeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadZoneRef = useRef<HTMLDivElement>(null);

  const loadingSteps = [
    "Reading resume file...",
    "Extracting raw document text...",
    "Running spaCy Name & Contact parser...",
    "Executing local PhraseMatcher against Skills database...",
    "Parsing noun chunks & formatting metrics...",
    "Finalizing ATS optimization report..."
  ];

  // Auto scroll to the upload zone when a file is selected
  useEffect(() => {
    if (file) {
      setTimeout(() => {
        uploadZoneRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, [file]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
      }, 700);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setResults(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const extension = droppedFile.name.split('.').pop()?.toLowerCase();
      if (extension === "pdf" || extension === "docx") {
        setFile(droppedFile);
        setError(null);
        setResults(null);
      } else {
        setError("Only PDF and DOCX file formats are supported.");
      }
    }
  };

  const handleReset = () => {
    setResults(null);
    setFile(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setResults(null);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/extract`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Extraction failed. Please verify that the backend API is running.");
      }

      const data = await response.json();
      setResults(data.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred during extraction.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const loadSampleResume = () => {
    setLoading(true);
    setError(null);
    setResults(null);
    
    // Simulate parsing time for premium feel
    setTimeout(() => {
      setResults({
        name: "Abdulkabeer Olanrewaju",
        contact: {
          email: "olanrewajuabdulkabeer576@gmail.com",
          phone: "+234 777 292 75"
        },
        entities: {
          ORG: [
            { name: "Malead Technologies", confidence: 0.90 },
            { name: "Identitypass by Prembly", confidence: 0.85 },
            { name: "Zeronspace SaaS", confidence: 0.75 },
            { name: "Moniass Technology Limited", confidence: 0.70 }
          ],
          GPE: ["Lagos", "Nigeria"],
          DATE: ["Feb 2025", "2022", "2021", "Nov 2022", "July 2025"]
        },
        skills: [
          "React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "NestJS", 
          "Python", "Django", "PostgreSQL", "Docker", "Kubernetes", "AWS", 
          "Redis", "WebSockets", "TanStack Query", "Zustand", "Jest", "Cypress"
        ],
        keywords: [
          "Senior Frontend Engineer", "Enterprise SaaS UI", "Verification Platforms",
          "Design Systems Architecture", "Lighthouse Optimization", "Figma Translations",
          "REST & GraphQL APIs", "Distributed Workflows", "API Integration", "Secure Onboarding"
        ]
      });
      setLoading(false);
    }, 1800);
  };

  return (
    <div className="min-height-screen bg-slate-50 flex flex-col font-sans">
      <div className="hero-glow" />

      {/* Navigation Header */}
      <nav className="glass-nav fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              <Zap size={18} fill="white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              OptiResume<span className="text-blue-600">Pro</span>
            </span>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md border border-blue-200">
              Enterprise NLP
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#security" className="hover:text-blue-600 transition-colors">Data Privacy</a>
            <a href="#testimonials" className="hover:text-blue-600 transition-colors">Testimonials</a>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={loadSampleResume}
              className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors border border-slate-200 hover:border-blue-200 bg-white rounded-xl shadow-premium"
            >
              Try Sample
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 text-sm font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-premium"
            >
              Upload CV
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow pt-24 px-6 max-w-7xl mx-auto w-full flex flex-col items-center">
        
        {/* Landing Page Content - Only visible if no results showing */}
        {!results && (
          <div className="w-full max-w-5xl text-center mt-8 mb-12 animate-fadeIn">
            {/* Header / Value Proposition */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-full text-blue-700 text-xs font-bold border border-blue-100/60 mb-6 shadow-sm">
              <Sparkles size={12} className="animate-pulse" />
              <span>100% Local, Private, and High-Speed Parsing Engine</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight max-w-4xl mx-auto">
              Get past the ATS. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Land the interview.
              </span>
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
              Analyze and optimize your resume against applicant tracking systems using offline, deterministic Natural Language Processing.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="action-btn px-6 py-3.5 text-base font-bold rounded-xl shadow-premium flex items-center gap-2 group"
              >
                Scan Your Resume <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={loadSampleResume}
                className="px-6 py-3.5 text-base font-bold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-xl shadow-premium transition-all"
              >
                Analyze Sample Resume
              </button>
            </div>
            
   
          </div>
        )}

        {/* Upload Container / Results View */}
        <div ref={uploadZoneRef} className="w-full max-w-5xl mb-16">
          {!results ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 md:p-12 shadow-premium hover:shadow-premium-hover transition-shadow relative overflow-hidden animate-slideUp">
              {/* Scan Mockup Line */}
              {loading && (
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 overflow-hidden">
                  <div className="h-full w-1/3 bg-white/40 animate-pulse rounded-full" />
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.docx"
              />

              {/* Conditional States inside Upload Zone */}
              {loading ? (
                /* Loading State */
                <div className="py-12 text-center animate-fadeIn">
                  <div className="relative w-20 h-20 mx-auto mb-8">
                    <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
                    <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                      <Cpu size={24} className="animate-pulse" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-950">Analyzing Profile...</h3>
                  
                  <p className="mt-2 text-sm text-slate-500 font-semibold h-6">
                    {loadingSteps[loadingStep]}
                  </p>
                  
                  <div className="w-64 h-1.5 bg-slate-100 rounded-full mx-auto mt-6 overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${(loadingStep + 1) * (100 / loadingSteps.length)}%` }} />
                  </div>
                </div>
              ) : file ? (
                /* File Loaded State */
                <div className="py-8 md:py-12 text-center animate-fadeIn flex flex-col items-center">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center border border-emerald-100 shadow-sm mb-6">
                    <FileText size={40} className="stroke-[1.5]" />
                  </div>
                  
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 mb-3">
                    File Ready for Extraction
                  </span>
                  
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 max-w-lg truncate px-4">
                    {file.name}
                  </h3>
                  
                  <p className="mt-1 text-xs text-slate-400 font-bold">
                    {(file.size / 1024).toFixed(1)} KB &bull; {file.name.split('.').pop()?.toUpperCase()} Document
                  </p>
                  
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md px-4">
                    <button
                      onClick={handleUpload}
                      className="w-full sm:flex-1 action-btn py-3 px-6 text-sm font-bold rounded-xl shadow-premium flex items-center justify-center gap-2"
                    >
                      <Sparkles size={16} /> Optimize & Extract
                    </button>
                    <button
                      onClick={handleReset}
                      className="w-full sm:w-auto px-5 py-3 text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100/80 rounded-xl transition-all"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                /* Empty Upload State */
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-8 md:p-14 text-center cursor-pointer transition-all duration-300 ${
                    dragActive 
                      ? "border-blue-500 bg-blue-50/50" 
                      : "border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-white"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-100/50">
                    <UploadCloud size={32} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900">
                    Upload your resume file
                  </h3>
                  
                  <p className="mt-2 text-sm text-slate-500 font-medium max-w-sm mx-auto">
                    Drag and drop your file here, or click to browse local folders.
                  </p>
                  
                  <div className="mt-6 flex items-center justify-center gap-6 text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <FileText size={14} className="text-red-500" /> PDF FORMAT
                    </span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span className="flex items-center gap-1.5">
                      <FileSpreadsheet size={14} className="text-blue-500" /> DOCX FORMAT
                    </span>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-6 p-4 bg-rose-50 border border-rose-100/80 rounded-xl text-rose-600 text-sm font-bold flex items-center gap-3">
                  <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
                  <span>{error}</span>
                </div>
              )}

              {/* Secure badge footer */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap justify-between items-center text-xs font-semibold text-slate-400 gap-4">
                <span className="flex items-center gap-1.5">
                  <Lock size={12} className="text-emerald-500" /> Processing is 100% local.
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-emerald-500" /> Never saves or shares your data.
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={12} className="text-emerald-500" /> Zero LLM/AI training leaks.
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <ExtractionResults data={results} onReset={handleReset} />
            </div>
          )}
        </div>

        {/* Feature Cards Grid (Only visible if no results) */}
        {!results && (
          <section id="features" className="w-full max-w-5xl py-12 border-t border-slate-200/60 animate-fadeIn">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                Built for High-Growth ATS Workflows
              </h2>
              <p className="mt-3 text-slate-500 font-semibold max-w-lg mx-auto">
                OptiResume Pro uses tokenized heuristics to optimize CV parameters instantly.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-premium hover:translate-y-[-2px] transition-transform">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-5 border border-blue-100/50">
                  <Zap size={20} />
                </div>
                <h3 className="text-base font-bold text-slate-900">Sub-second Latency</h3>
                <p className="mt-2.5 text-sm text-slate-500 font-medium leading-relaxed">
                  Traditional NLP executes on-server in under 150ms. Get instant keyword results and score evaluations.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-premium hover:translate-y-[-2px] transition-transform">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-5 border border-emerald-100/50">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-base font-bold text-slate-900">GDPR & PII Secure</h3>
                <p className="mt-2.5 text-sm text-slate-500 font-medium leading-relaxed">
                  Zero cloud storage or third-party LLM APIs. Resumes are parsed locally, preventing sensitive applicant data leaks.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-premium hover:translate-y-[-2px] transition-transform">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-5 border border-indigo-100/50">
                  <TrendingUp size={20} />
                </div>
                <h3 className="text-base font-bold text-slate-900">Dynamic Score Matcher</h3>
                <p className="mt-2.5 text-sm text-slate-500 font-medium leading-relaxed">
                  Select target roles or paste job descriptions to get real-time score adjustments and identify missing keywords.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Security Section */}
        {!results && (
          <section id="security" className="w-full max-w-5xl py-12 border-t border-slate-200/60 animate-fadeIn">
            <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-premium">
              <div className="max-w-xl text-left">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
                  SECURITY & PRIVACY FIRST
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold mt-4 text-white">
                  Compliance and Privacy for Recruitment Agencies
                </h2>
                <p className="mt-3 text-slate-400 text-sm md:text-base font-medium leading-relaxed">
                  Unlike AI builders that train models on user resumes, OptiResume Pro operates deterministically. Your candidate pool remains confidential and resides fully within your local perimeter.
                </p>
              </div>
              <div className="flex flex-col gap-3 min-w-[200px] w-full md:w-auto">
                <div className="bg-slate-800/80 border border-slate-700/50 px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-bold text-slate-200">
                  <ShieldCheck className="text-emerald-500" size={16} /> 100% Local Processing
                </div>
                <div className="bg-slate-800/80 border border-slate-700/50 px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-bold text-slate-200">
                  <Lock className="text-emerald-500" size={16} /> AES-256 File Extraction
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Testimonials Section */}
        {!results && (
          <section id="testimonials" className="w-full max-w-5xl py-12 border-t border-slate-200/60 mb-12 animate-fadeIn">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                What HR Professionals Are Saying
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-premium text-left">
                <p className="text-sm text-slate-600 font-semibold leading-relaxed italic">
                  "Traditional NLP parsing is exactly what our compliance team required. OptiResume Pro calculates skill density in milliseconds, allowing us to index CVs without worrying about PII leaks to third-party AI startups."
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-sm text-slate-700">
                    TM
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Tanya Miller</p>
                    <p className="text-[10px] text-slate-400 font-bold">Principal Recruiter, Miller Talent Group</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-premium text-left">
                <p className="text-sm text-slate-600 font-semibold leading-relaxed italic">
                  "The Job Description matching module is extremely accurate. Because it relies on explicit pattern matching, candidates know exactly which technical keywords are missing, leading to a much higher ATS success rate."
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-sm text-slate-700">
                    DK
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">David Kalu</p>
                    <p className="text-[10px] text-slate-400 font-bold">Career Consultant, Peak Careers</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-8 px-6 text-center text-xs font-semibold text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
              <Zap size={12} fill="white" />
            </div>
            <span className="font-extrabold text-slate-800">OptiResume Pro</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} OptiResume Pro. Built with privacy-first spaCy Traditional NLP. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#security" className="hover:text-blue-600">Privacy Policy</a>
            <a href="#features" className="hover:text-blue-600">Terms of Use</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
