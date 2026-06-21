"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Award,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  RefreshCcw,
  Printer,
  Copy,
  Check,
  FileText,
  Search,
  FileCheck,
} from "lucide-react";

interface ExtractionResultsProps {
  data: {
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
  };
  onReset: () => void;
}

interface RoleProfile {
  name: string;
  requiredSkills: string[];
}

const ROLE_PROFILES: Record<string, RoleProfile> = {
  software_engineer: {
    name: "General Software Engineer",
    requiredSkills: ["Python", "Java", "C++", "JavaScript", "TypeScript", "SQL", "Git", "Docker", "REST API", "CI/CD", "PostgreSQL", "React"],
  },
  frontend_developer: {
    name: "Frontend Developer",
    requiredSkills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML", "CSS", "JavaScript", "Redux", "Zustand", "Jest", "Cypress", "Figma", "UI/UX Design"],
  },
  backend_developer: {
    name: "Backend Developer",
    requiredSkills: ["Python", "Node.js", "Go", "PostgreSQL", "Docker", "Kubernetes", "AWS", "Redis", "Django", "FastAPI", "SQL", "MongoDB", "NestJS", "Express.js", "REST API", "GraphQL", "RabbitMQ", "Kafka", "Microservices"],
  },
  data_scientist: {
    name: "Data Scientist",
    requiredSkills: ["Python", "Machine Learning", "Data Analysis", "Pandas", "NumPy", "Scikit-Learn", "TensorFlow", "PyTorch", "Deep Learning", "SQL", "AWS", "Kubernetes", "NLTK", "SpaCy"],
  },
  product_manager: {
    name: "Product Manager",
    requiredSkills: ["Project Management", "Agile", "Scrum", "Data Analysis", "SQL", "Figma", "UI/UX Design", "REST API", "AWS"],
  },
};

const ExtractionResults: React.FC<ExtractionResultsProps> = ({ data, onReset }) => {
  const [selectedRole, setSelectedRole] = useState<string>("software_engineer");
  const [atsScore, setAtsScore] = useState<number>(0);
  const [matchedSkills, setMatchedSkills] = useState<string[]>([]);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  
  // Job Description Matcher State
  const [jobDescription, setJobDescription] = useState<string>("");
  const [jdMatchScore, setJdMatchScore] = useState<number | null>(null);
  const [jdMatches, setJdMatches] = useState<string[]>([]);
  const [jdMissing, setJdMissing] = useState<string[]>([]);
  
  // Copy state
  const [copied, setCopied] = useState(false);

  // Stop words for job description processing
  const stopWords = new Set([
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at",
    "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can", "can't", "cannot",
    "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", "few",
    "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll",
    "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll",
    "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most",
    "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our",
    "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't",
    "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there",
    "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too",
    "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't",
    "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's",
    "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself",
    "yourselves", "the", "we", "our", "required", "requirements", "requirements:", "duties", "qualifications", "responsibilities",
    "role", "team", "experience", "candidate", "work", "join", "help", "build", "develop", "working", "using", "plus",
    "strong", "ability", "skills", "knowledge", "years", "understanding", "preferred"
  ]);

  // Calculate ATS dynamic scores based on selected role
  useEffect(() => {
    const profile = ROLE_PROFILES[selectedRole];
    if (!profile) return;

    const resumeSkillsLower = new Set(data.skills.map((s) => s.toLowerCase()));
    
    // Find intersections
    const matched = profile.requiredSkills.filter(
      (skill) => resumeSkillsLower.has(skill.toLowerCase())
    );
    const missing = profile.requiredSkills.filter(
      (skill) => !resumeSkillsLower.has(skill.toLowerCase())
    );

    setMatchedSkills(matched);
    setMissingSkills(missing);

    // Calculate score
    let score = 40; // Base score (formatting, contact info exist)
    if (data.contact.email !== "Not found") score += 10;
    if (data.contact.phone !== "Not found") score += 10;
    if (data.name !== "Not found") score += 10;
    
    const skillRatio = profile.requiredSkills.length > 0 
      ? (matched.length / profile.requiredSkills.length) 
      : 1;
    
    score += Math.round(skillRatio * 30);
    setAtsScore(Math.min(score, 100));
  }, [selectedRole, data]);

  // Handle client-side Job Description matching
  const handleJdMatch = () => {
    if (!jobDescription.trim()) {
      setJdMatchScore(null);
      return;
    }

    // Basic tokenization
    const jdWords = jobDescription
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !stopWords.has(word));

    // Combine skills and keywords from parsed resume
    const resumeTerms = new Set([
      ...data.skills.map((s) => s.toLowerCase()),
      ...data.keywords.map((k) => k.toLowerCase()),
      ...data.entities.ORG.map((o) => o.name.toLowerCase())
    ]);

    // Unique JD keywords
    const uniqueJdWords = Array.from(new Set(jdWords));

    // Find matches
    const matches = uniqueJdWords.filter((word) => {
      // Direct or fuzzy sub-match
      return Array.from(resumeTerms).some((term) => term.includes(word) || word.includes(term));
    });

    const missing = uniqueJdWords.filter((word) => {
      return !Array.from(resumeTerms).some((term) => term.includes(word) || word.includes(term));
    });

    // Take top 8 matching/missing for display
    setJdMatches(matches.slice(0, 10));
    setJdMissing(missing.filter(w => w.length > 3).slice(0, 10));

    const matchRatio = uniqueJdWords.length > 0 ? (matches.length / uniqueJdWords.length) : 0;
    const score = Math.round(matchRatio * 100);
    setJdMatchScore(score);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 stroke-emerald-500";
    if (score >= 50) return "text-amber-500 stroke-amber-500";
    return "text-rose-500 stroke-rose-500";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-emerald-50 text-emerald-800 border-emerald-200";
    if (score >= 50) return "bg-amber-50 text-amber-800 border-amber-200";
    return "bg-rose-50 text-rose-800 border-rose-200";
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn print-container">
      
      {/* Top Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-premium print-card">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
              <User size={28} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                Processed Profile
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1.5">{data.name}</h2>
              <div className="flex flex-wrap gap-4 mt-2.5 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                  <Mail size={13} className="text-blue-500" />
                  {data.contact.email}
                </span>
                <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                  <Phone size={13} className="text-emerald-500" />
                  {data.contact.phone}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto no-print">
            <button
              onClick={copyToClipboard}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-sm"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              {copied ? "Copied!" : "Copy JSON"}
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-sm"
            >
              <Printer size={14} />
              Print Report
            </button>
            <button
              onClick={onReset}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100/80 rounded-xl transition-all"
            >
              <RefreshCcw size={14} />
              Reset Scan
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Score & Optimization Dashboard */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* ATS Optimization Dashboard Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-premium flex flex-col md:flex-row items-center gap-8 print-card">
            
            {/* SVG Score Ring */}
            <div className="relative w-36 h-36 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="text-slate-100 stroke-current"
                  strokeWidth="8"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className={`stroke-current ${getScoreColor(atsScore)} transition-all duration-500`}
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * atsScore) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-slate-900 tracking-tight">{atsScore}%</span>
                <span className="text-[9px] font-black uppercase text-slate-400 mt-0.5 tracking-wider">ATS Score</span>
              </div>
            </div>

            {/* Score Details & Target Role Selector */}
            <div className="flex-grow w-full text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h3 className="text-lg font-black text-slate-900">Target Role Matcher</h3>
                
                {/* Target Role Selector */}
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm no-print"
                >
                  {Object.entries(ROLE_PROFILES).map(([key, profile]) => (
                    <option key={key} value={key}>
                      {profile.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <p className="mt-2 text-xs text-slate-400 font-semibold leading-relaxed">
                We score your resume matching density against core expectations for a <strong className="text-slate-800">{ROLE_PROFILES[selectedRole]?.name}</strong>.
              </p>

              {/* Status Tags */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-bold">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[10px] text-slate-400 block mb-0.5">MATCHED SKILLS</span>
                  <span className="text-base text-emerald-600 font-extrabold">{matchedSkills.length}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[10px] text-slate-400 block mb-0.5">MISSING SKILLS</span>
                  <span className={`text-base font-extrabold ${missingSkills.length === 0 ? 'text-emerald-600' : 'text-amber-500'}`}>
                    {missingSkills.length}
                  </span>
                </div>
                <div className={`p-3 border rounded-xl col-span-2 sm:col-span-1 ${getScoreBgColor(atsScore)}`}>
                  <span className="text-[10px] opacity-75 block mb-0.5">ATS INDEX</span>
                  <span className="text-base font-extrabold">
                    {atsScore >= 80 ? "Optimized" : atsScore >= 50 ? "Needs Work" : "Unoptimized"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Skills Board */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-premium flex flex-col gap-6 print-card">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Award className="text-blue-600" size={20} />
                Skill Density Match
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                Comparing your parsed profile against required capabilities for <strong className="text-slate-700">{ROLE_PROFILES[selectedRole]?.name}</strong>.
              </p>
            </div>

            {/* Matched Skills */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-wider text-emerald-600 mb-3.5 flex items-center gap-1.5">
                <CheckCircle2 size={13} /> Matched Skills ({matchedSkills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {matchedSkills.length > 0 ? (
                  matchedSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100/60 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic font-semibold">No direct skills matched for this profile.</span>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-wider text-amber-500 mb-3.5 flex items-center gap-1.5">
                <AlertTriangle size={13} /> Missing Keywords ({missingSkills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {missingSkills.length > 0 ? (
                  missingSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3.5 py-1.5 bg-amber-50 text-amber-700 border border-amber-100/60 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 size={12} fill="currentColor" className="text-white" /> Complete match! Zero missing keywords.
                  </span>
                )}
              </div>
              {missingSkills.length > 0 && (
                <p className="text-[10px] text-slate-400 font-bold mt-3 leading-relaxed">
                  💡 Recommendation: Integrate these terms into your summary or projects sections to increase your ATS match score.
                </p>
              )}
            </div>
          </div>

          {/* Interactive Job Description Matcher */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-premium flex flex-col gap-5 print-card no-print">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <FileCheck className="text-indigo-600" size={20} />
                Job Description Matcher
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                Paste the job description you're applying to, and analyze how well your CV aligns with the specific posting.
              </p>
            </div>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste Job Description / Requirements here..."
              rows={4}
              className="w-full p-4 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
            />

            <div className="flex justify-between items-center gap-4">
              <button
                onClick={handleJdMatch}
                className="px-5 py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-md shadow-indigo-500/10 flex items-center gap-1.5"
              >
                <Search size={14} /> Match Resume
              </button>

              {jdMatchScore !== null && (
                <div className={`px-4 py-2 border rounded-xl flex items-center gap-2.5 text-xs font-bold ${getScoreBgColor(jdMatchScore)}`}>
                  <span>JD Alignment:</span>
                  <span className="text-base font-black">{jdMatchScore}%</span>
                </div>
              )}
            </div>

            {/* Match / Missing terms */}
            {jdMatchScore !== null && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 text-left animate-fadeIn">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h4 className="text-[10px] font-black uppercase text-emerald-600 mb-2.5 flex items-center gap-1">
                    <CheckCircle2 size={12} /> JD Matches Found
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {jdMatches.length > 0 ? (
                      jdMatches.map((word, i) => (
                        <span key={i} className="px-2 py-1 bg-white text-emerald-700 border border-emerald-100 rounded-md text-[10px] font-bold">
                          {word}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">None found</span>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h4 className="text-[10px] font-black uppercase text-rose-500 mb-2.5 flex items-center gap-1">
                    <AlertTriangle size={12} /> Important Missing Terms
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {jdMissing.length > 0 ? (
                      jdMissing.map((word, i) => (
                        <span key={i} className="px-2 py-1 bg-white text-rose-700 border border-rose-100 rounded-md text-[10px] font-bold">
                          {word}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-emerald-600 font-bold">Excellent overlap!</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Identified Entities & Extracted Keywords */}
        <div className="flex flex-col gap-8">
          
          {/* Identified Entities Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-premium flex flex-col gap-6 print-card">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Building className="text-emerald-500" size={20} />
                Identified Entities
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                Extracted metadata and classifications mapped via local spaCy.
              </p>
            </div>

            {/* Organizations */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Briefcase size={12} /> Organizations & Companies
              </h4>
              <div className="space-y-2">
                {data.entities.ORG.length > 0 ? (
                  data.entities.ORG.map((org, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                      <span className="text-xs font-bold text-slate-800">{org.name}</span>
                      <div className="flex items-center gap-2">
                        {/* Custom Confidence Bar */}
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden no-print">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${org.confidence * 100}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                          {(org.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic font-semibold">None identified</p>
                )}
              </div>
            </div>

            {/* Locations */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <MapPin size={12} /> Locations (GPE)
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {data.entities.GPE.length > 0 ? (
                  data.entities.GPE.map((loc, index) => (
                    <span key={index} className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100/50 rounded-xl text-xs font-bold shadow-sm">
                      {loc}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic font-semibold">None identified</p>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Calendar size={12} /> Dates & Durations
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {data.entities.DATE.length > 0 ? (
                  data.entities.DATE.map((date, index) => (
                    <span key={index} className="px-3 py-1.5 bg-orange-50 text-orange-700 border border-orange-100/50 rounded-xl text-xs font-bold shadow-sm">
                      {date}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic font-semibold">None identified</p>
                )}
              </div>
            </div>
          </div>

          {/* Top Professional Keywords Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-premium flex flex-col gap-5 print-card">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <FileText className="text-orange-500" size={20} />
                Key Phrases
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                Most frequent professional phrases extracted from text blocks.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {data.keywords.length > 0 ? (
                data.keywords.map((kw, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100/50 hover:border-slate-300 transition-all group cursor-default"
                  >
                    <div className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-400 text-xs font-bold group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                      {index + 1}
                    </div>
                    <span className="text-xs font-bold text-slate-700">{kw}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic font-semibold">No key phrases extracted.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtractionResults;
