import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Printer, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  FileText, 
  Sparkles, 
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Eye
} from 'lucide-react';

export const Resume: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [highlightNew, setHighlightNew] = useState(true);

  const rawResumeText = `ASHISH KUMAR TRIPATHI
Full Stack Developer | MERN Stack | React | Next.js | Node.js
8004485646 | ashishtring@gmail.com | Mayur Vihar-I, Delhi 110091
LinkedIn: linkedin.com/in/ashish-kumar-tripathi-aa67a8148 | GitHub: github.com/Ashish2614

PROFESSIONAL SUMMARY
Full Stack Developer with hands-on experience building responsive web applications and RESTful APIs using React.js, Next.js, Node.js, Express.js, MongoDB, Supabase PostgreSQL, and modern JavaScript/TypeScript. Skilled in authentication, role-based access control, CRUD workflows, relational data modeling, API integration, Git/GitHub collaboration, and cloud deployment. Focused on maintainable code, usable interfaces, and end-to-end delivery.

TECHNICAL SKILLS
Languages: JavaScript (ES6+), TypeScript, HTML5, CSS3, SQL
Frontend: React.js, Next.js, Redux Toolkit, Vite, Tailwind CSS, Bootstrap, responsive design, accessibility
Backend: Node.js, Express.js, REST APIs, authentication, JWT, role-based authorization, CRUD operations, Gmail Enquiry / Nodemailer Automation
Databases: MongoDB, Mongoose, Supabase PostgreSQL, Row Level Security (RLS)
Tools & Platforms: Git, GitHub, Postman, VS Code, Vercel, Render, Supabase, FormSubmit, Razorpay Payment Gateway, Gmail API
AI Development Tools: Google AI Studio, Codex, Antigravity

PROFESSIONAL EXPERIENCE
MERN Stack Developer Intern | S O INFOTECH (P) LTD. | 6 Months
• Contributed to ShopMart, a full-stack MERN e-commerce application, by developing responsive React interfaces and reusable UI components.
• Built and integrated RESTful APIs with Node.js and Express.js for products, categories, users, authentication, and cart workflows.
• Integrated MongoDB through Mongoose and implemented CRUD operations, API data handling, and frontend-backend integration.
• Used Git and GitHub for version control, collaboration, debugging, and iterative feature delivery.

Full Stack Developer | Freelance / Personal Projects
• Built and deployed full-stack applications end to end, including frontend interfaces, Express REST APIs, authentication, database integration, testing, Git workflows, and cloud deployment.

SELECTED PROJECTS
AShK Stays & Studios — Boutique E-Commerce & Hospitality Platform
React, TypeScript, Vite, Tailwind CSS, Express.js, Razorpay API, Gmail Enquiry / Nodemailer, Vercel
• Built and deployed a full-stack boutique e-commerce and property advisory platform featuring dynamic curated collections, interactive suite tours, cart drawer management, and responsive UI.
• Integrated Razorpay payment gateway supporting domestic UPI, Netbanking, and debit/credit cards with secure cryptographic signature verification, server-side price reconciliation, and order tracking.
• Engineered an automated Gmail enquiry and consultation booking pipeline with server-side validation, rate-limiting, honeypot spam protection, and real-time customer notifications.
• Configured responsive, accessible design with Tailwind CSS, client-side routing, and Vercel serverless deployment.
• GitHub: github.com/Ashish2614/AShK_-Studios | Deployment: Vercel / Live

OpsPilot - Business Operations & Help Desk SaaS
React, Vite, JavaScript, Express.js, Supabase PostgreSQL/Auth, RLS, REST APIs, Vercel, Render
• Built a role-aware internal help desk SaaS for admins, agents, and employees, including ticket lifecycle workflows, comments, assignment, dashboard analytics, and CSV export.
• Implemented Supabase Auth, PostgreSQL foreign keys and RLS, Express business logic, notifications, due-date jobs, responsive UI, and deployment-ready configuration.
• GitHub: github.com/Ashish2614/OpsPilot | Frontend: opspilot-green.vercel.app | Backend: opspilot-mua0.onrender.com

Krefzo Automation Website
Next.js, TypeScript, React, Tailwind CSS, Lucide, Vercel, FormSubmit
• Built and deployed a conversion-focused AI automation services website for lead generation and discovery-call bookings.
• Created responsive service, case study, FAQ, and contact flows with SEO metadata, Open Graph tags, JSON-LD schema, and reduced-motion support.
• GitHub: github.com/Ashish2614/automation_website | Live: automation-website-gray.vercel.app

HueCraft - Color Palette Generator
React, Vite, JavaScript, CSS, Browser APIs
• Built a responsive color tool with harmony modes, locked colors, HEX editing, clipboard actions, shareable URLs, exports, favorites, and recent history.
• Added dark mode, keyboard generation, accessibility, searchable FAQ guidance, and local-storage fallbacks.
• GitHub: github.com/Ashish2614/Color_Palette_Generator | Live: color-palette-generator-seven-rosy.vercel.app

ShopMart - E-commerce Application
React.js, Node.js, Express.js, MongoDB, Mongoose
• Developed product browsing, search, filtering, cart management, admin workflows, REST APIs, and MongoDB data models for products, categories, users, and authentication.

Devbhoomi Trails - Himalayan Travel Platform
React, Vite, JavaScript, Tailwind CSS, Supabase, Lucide React, Vercel
• Built and deployed a responsive travel platform for Himachal Pradesh and Uttarakhand with destination discovery, seasonal packages, itinerary modals, FAQs, and guided tour flows.
• Implemented a custom trip cost calculator, Supabase-backed booking and inquiry forms, WhatsApp booking handoff, responsive accessibility, and reusable component-driven UI.
• GitHub: github.com/Ashish2614/DevbhoomiTrails | Live: devbhoomi-trails.vercel.app

Global Vista - Country Explorer
React, Vite, JavaScript, REST Countries API, Wikimedia Commons, OpenStreetMap, Vercel
• Built a responsive country discovery platform with live search, flags, maps, favorites, time zones, languages, administrative divisions, and tourist places with real photographs.
• Implemented dark/light themes, accessible UI, animated profile sections, API fallbacks, live clocks, state/province search, and lazy-loaded destination imagery.
• GitHub: github.com/Ashish2614/Global_Vista | Live: vercel.com/ak-b08e/global-vista

Car Rental Website
React.js, JavaScript, Bootstrap, Swiper
• Developed a responsive car rental interface with reusable components, search and filtering, FAQ, contact sections, and interactive sliders.

HireFlow - Applicant Tracking System
React, Vite, JavaScript, Express.js, PostgreSQL-ready API, Vercel, Render
• Built a responsive recruitment SaaS interface for job discovery, recruiter dashboards, candidate applications, pipeline stages, interviews, notifications, and analytics.
• Implemented dark/light themes, timezone-aware recruiter greetings, responsive navigation, REST API foundations, SPA routing, and deployment-ready Vercel and Render configuration.
• GitHub: github.com/Ashish2614/HireFlow | Frontend: hire-flow-fawn-theta.vercel.app/ | Backend: hireflow-ddzt.onrender.com

ADDITIONAL STRENGTHS
Responsive web development | Component-driven architecture | API integration | Debugging and problem solving | Version control | AI-assisted development | Clean, maintainable code

EDUCATION
B.Tech in Electrical and Electronics Engineering | Sharda University | 2020 | CGPA: 8.4
M.A. in Public Administration | IGNOU | 2021-2024`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(rawResumeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = rawResumeText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([rawResumeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Ashish_Kumar_Tripathi_Full_Stack_Resume.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#1A1A1A] py-8 px-4 sm:px-6 lg:px-8 print:p-0 print:bg-white">
      {/* Top Action Bar (Hidden in Print) */}
      <div className="max-w-4xl mx-auto mb-6 print:hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-[#E2DDD5] shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B3B2B] hover:text-[#2A563F] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Studio</span>
              </Link>
              <span className="text-[#D1D5DB]">|</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#1B3B2B]/10 text-[#1B3B2B]">
                <Sparkles className="w-3 h-3 text-[#C87A55]" />
                Updated with AShK Studios, Google AI Studio, Razorpay & Gmail
              </span>
            </div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#1B3B2B]">
              Ashish Kumar Tripathi — Resume
            </h1>
            <p className="text-xs text-[#555]">
              ATS-Optimized Full Stack Developer Resume (React • Next.js • Node.js • Cloud)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Highlight Toggle */}
            <button
              onClick={() => setHighlightNew(prev => !prev)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                highlightNew 
                  ? 'bg-[#1B3B2B] text-white border-[#1B3B2B]' 
                  : 'bg-white text-[#4A5568] border-[#D1D5DB] hover:bg-gray-50'
              }`}
              title="Toggle highlights on newly added project and skills"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{highlightNew ? 'Highlighting New' : 'Show Normal'}</span>
            </button>

            {/* Print / Save PDF */}
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-lg bg-[#1B3B2B] text-white text-xs font-medium hover:bg-[#2A563F] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            {/* Copy Plain Text */}
            <button
              onClick={handleCopyText}
              className="px-3 py-2 rounded-lg bg-white border border-[#D1D5DB] text-[#1F2421] text-xs font-medium hover:bg-gray-50 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#6B7280]" />
                  <span>Copy ATS Text</span>
                </>
              )}
            </button>

            {/* Download Text */}
            <button
              onClick={handleDownloadTxt}
              className="px-3 py-2 rounded-lg bg-white border border-[#D1D5DB] text-[#1F2421] text-xs font-medium hover:bg-gray-50 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Download clean plain-text resume"
            >
              <Download className="w-3.5 h-3.5 text-[#6B7280]" />
              <span>.TXT</span>
            </button>

            {/* View Original PDF */}
            <a
              href="/assets/aistudio/Ashish_Updated_Full_Stack_Resume_Updated_d9f9c504.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg bg-white border border-[#D1D5DB] text-[#1F2421] text-xs font-medium hover:bg-gray-50 transition-colors flex items-center gap-1.5 shadow-xs"
              title="Open the uploaded PDF attachment"
            >
              <FileText className="w-3.5 h-3.5 text-[#6B7280]" />
              <span>Original PDF</span>
              <ExternalLink className="w-3 h-3 text-[#9CA3AF]" />
            </a>
          </div>
        </div>

        {/* Highlights banner */}
        {highlightNew && (
          <div className="mt-2.5 px-4 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>
                <strong>New items highlighted below:</strong> Added <strong>Google AI Studio</strong> (AI Tools), <strong>Razorpay</strong> & <strong>Gmail Enquiry</strong> (Skills), and the full <strong>AShK Stays & Studios</strong> production project.
              </span>
            </div>
            <button 
              onClick={() => setHighlightNew(false)}
              className="text-emerald-700 hover:text-emerald-900 font-semibold underline text-[11px] shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* The Printable / Viewable Resume Document */}
      <article 
        id="resume-document"
        className="max-w-4xl mx-auto bg-white p-8 sm:p-12 md:p-16 border border-[#E2DDD5] shadow-lg text-[#1A1A1A] font-sans antialiased leading-normal print:p-0 print:border-none print:shadow-none"
        style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif' }}
      >
        {/* Document Header */}
        <header className="border-b border-[#CCCCCC] pb-4 mb-5">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111111] uppercase mb-1">
            ASHISH KUMAR TRIPATHI
          </h1>
          <p className="text-sm sm:text-base font-semibold text-[#333333] mb-2">
            Full Stack Developer | MERN Stack | React | Next.js | Node.js
          </p>
          
          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs sm:text-[13px] text-[#444444]">
            <span className="inline-flex items-center gap-1 font-medium">
              <Phone className="w-3 h-3 text-[#666] print:hidden" />
              <span>8004485646</span>
            </span>
            <span className="text-[#999] font-normal">|</span>
            <span className="inline-flex items-center gap-1 font-medium">
              <Mail className="w-3 h-3 text-[#666] print:hidden" />
              <a href="mailto:ashishtring@gmail.com" className="hover:underline text-[#111]">ashishtring@gmail.com</a>
            </span>
            <span className="text-[#999] font-normal">|</span>
            <span className="inline-flex items-center gap-1 font-medium">
              <MapPin className="w-3 h-3 text-[#666] print:hidden" />
              <span>Mayur Vihar-I, Delhi 110091</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-[13px] text-[#444444] mt-1.5">
            <span className="inline-flex items-center gap-1 font-medium">
              <Linkedin className="w-3 h-3 text-[#0A66C2] print:hidden" />
              <span className="font-semibold text-[#222]">LinkedIn:</span>
              <a 
                href="https://linkedin.com/in/ashish-kumar-tripathi-aa67a8148" 
                target="_blank" 
                rel="noreferrer" 
                className="text-[#0B5C96] hover:underline"
              >
                linkedin.com/in/ashish-kumar-tripathi-aa67a8148
              </a>
            </span>
            <span className="text-[#999] font-normal">|</span>
            <span className="inline-flex items-center gap-1 font-medium">
              <Github className="w-3 h-3 text-[#111] print:hidden" />
              <span className="font-semibold text-[#222]">GitHub:</span>
              <a 
                href="https://github.com/Ashish2614" 
                target="_blank" 
                rel="noreferrer" 
                className="text-[#0B5C96] hover:underline"
              >
                github.com/Ashish2614
              </a>
            </span>
          </div>
        </header>

        {/* Section: Professional Summary */}
        <section className="mb-5">
          <h2 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[#111111] border-b border-[#CCCCCC] pb-1 mb-2">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-[12.5px] sm:text-[13px] leading-relaxed text-[#2D3748] text-justify">
            Full Stack Developer with hands-on experience building responsive web applications and RESTful APIs using React.js, Next.js, 
            Node.js, Express.js, MongoDB, Supabase PostgreSQL, and modern JavaScript/TypeScript. Skilled in authentication, role-based 
            access control, CRUD workflows, relational data modeling, API integration, Git/GitHub collaboration, and cloud deployment. Focused 
            on maintainable code, usable interfaces, and end-to-end delivery.
          </p>
        </section>

        {/* Section: Technical Skills */}
        <section className="mb-5">
          <h2 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[#111111] border-b border-[#CCCCCC] pb-1 mb-2">
            TECHNICAL SKILLS
          </h2>
          <div className="space-y-1 text-[12.5px] sm:text-[13px] leading-snug text-[#2D3748]">
            <p>
              <strong className="text-[#111111]">Languages:</strong> JavaScript (ES6+), TypeScript, HTML5, CSS3, SQL
            </p>
            <p>
              <strong className="text-[#111111]">Frontend:</strong> React.js, Next.js, Redux Toolkit, Vite, Tailwind CSS, Bootstrap, responsive design, accessibility
            </p>
            <p>
              <strong className="text-[#111111]">Backend:</strong> Node.js, Express.js, REST APIs, authentication, JWT, role-based authorization, CRUD operations
              {highlightNew ? (
                <span className="ml-1.5 px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300 font-semibold print:bg-transparent print:border-none print:p-0">
                  , Gmail Enquiry / Nodemailer Automation
                </span>
              ) : (
                <span>, Gmail Enquiry / Nodemailer Automation</span>
              )}
            </p>
            <p>
              <strong className="text-[#111111]">Databases:</strong> MongoDB, Mongoose, Supabase PostgreSQL, Row Level Security (RLS)
            </p>
            <p>
              <strong className="text-[#111111]">Tools & Platforms:</strong> Git, GitHub, Postman, VS Code, Vercel, Render, Supabase, FormSubmit
              {highlightNew ? (
                <span className="ml-1.5 px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold print:bg-transparent print:border-none print:p-0">
                  , Razorpay Payment Gateway, Gmail API
                </span>
              ) : (
                <span>, Razorpay Payment Gateway, Gmail API</span>
              )}
            </p>
            <p>
              <strong className="text-[#111111]">AI Development Tools:</strong>{' '}
              {highlightNew ? (
                <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold print:bg-transparent print:border-none print:p-0">
                  Google AI Studio
                </span>
              ) : (
                <span>Google AI Studio</span>
              )}
              {', '}Codex, Antigravity
            </p>
          </div>
        </section>

        {/* Section: Professional Experience */}
        <section className="mb-5">
          <h2 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[#111111] border-b border-[#CCCCCC] pb-1 mb-2">
            PROFESSIONAL EXPERIENCE
          </h2>

          <div className="space-y-4">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                <h3 className="text-[13px] sm:text-[13.5px] font-bold text-[#111111]">
                  MERN Stack Developer Intern | S O INFOTECH (P) LTD.
                </h3>
                <span className="text-xs text-[#555] font-semibold">6 Months</span>
              </div>
              <ul className="list-disc list-outside ml-4 space-y-1 text-[12px] sm:text-[12.5px] text-[#2D3748] leading-relaxed">
                <li>
                  Contributed to ShopMart, a full-stack MERN e-commerce application, by developing responsive React interfaces and reusable UI components.
                </li>
                <li>
                  Built and integrated RESTful APIs with Node.js and Express.js for products, categories, users, authentication, and cart workflows.
                </li>
                <li>
                  Integrated MongoDB through Mongoose and implemented CRUD operations, API data handling, and frontend-backend integration.
                </li>
                <li>
                  Used Git and GitHub for version control, collaboration, debugging, and iterative feature delivery.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-[13px] sm:text-[13.5px] font-bold text-[#111111] mb-1">
                Full Stack Developer | Freelance / Personal Projects
              </h3>
              <ul className="list-disc list-outside ml-4 space-y-1 text-[12px] sm:text-[12.5px] text-[#2D3748] leading-relaxed">
                <li>
                  Built and deployed full-stack applications end to end, including frontend interfaces, Express REST APIs, authentication, database integration, testing, Git workflows, and cloud deployment.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section: Selected Projects */}
        <section className="mb-5">
          <h2 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[#111111] border-b border-[#CCCCCC] pb-1 mb-3">
            SELECTED PROJECTS
          </h2>

          <div className="space-y-4">
            {/* NEW PROJECT: AShK Stays & Studios */}
            <div className={`p-3 -mx-3 rounded-lg transition-colors ${
              highlightNew ? 'bg-emerald-50/60 border border-emerald-200 print:bg-transparent print:border-none print:p-0 print:m-0' : ''
            }`}>
              <div className="flex flex-wrap items-baseline justify-between gap-1 mb-0.5">
                <h3 className="text-[13px] sm:text-[13.5px] font-bold text-[#111111]">
                  AShK Stays & Studios — Boutique E-Commerce & Hospitality Platform
                </h3>
                {highlightNew && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white tracking-wide uppercase print:hidden">
                    Newly Added Project
                  </span>
                )}
              </div>
              <p className="text-[11.5px] sm:text-[12px] text-[#666666] italic mb-1.5 font-medium">
                React, TypeScript, Vite, Tailwind CSS, Express.js, Razorpay API, Gmail Enquiry / Nodemailer, Vercel
              </p>
              <ul className="list-disc list-outside ml-4 space-y-1 text-[12px] sm:text-[12.5px] text-[#2D3748] leading-relaxed">
                <li>
                  Built and deployed a full-stack boutique e-commerce and property advisory platform featuring dynamic curated collections, interactive suite tours, cart drawer management, and responsive UI.
                </li>
                <li>
                  Integrated Razorpay payment gateway supporting domestic UPI, Netbanking, and debit/credit cards with secure cryptographic signature verification, server-side price reconciliation, and order tracking.
                </li>
                <li>
                  Engineered an automated Gmail enquiry and consultation booking pipeline with server-side validation, rate-limiting, honeypot spam protection, and real-time customer notifications.
                </li>
                <li>
                  Configured responsive, accessible design with Tailwind CSS, client-side routing, and Vercel serverless deployment.
                </li>
              </ul>
              <div className="mt-1 text-[11.5px] text-[#444444] font-medium">
                <span className="font-semibold text-[#111]">GitHub:</span>{' '}
                <a href="https://github.com/Ashish2614/AShK_-Studios" target="_blank" rel="noreferrer" className="text-[#0B5C96] hover:underline">
                  github.com/Ashish2614/AShK_-Studios
                </a>
              </div>
            </div>

            {/* OpsPilot */}
            <div>
              <h3 className="text-[13px] sm:text-[13.5px] font-bold text-[#111111]">
                OpsPilot — Business Operations & Help Desk SaaS
              </h3>
              <p className="text-[11.5px] sm:text-[12px] text-[#666666] italic mb-1.5 font-medium">
                React, Vite, JavaScript, Express.js, Supabase PostgreSQL/Auth, RLS, REST APIs, Vercel, Render
              </p>
              <ul className="list-disc list-outside ml-4 space-y-1 text-[12px] sm:text-[12.5px] text-[#2D3748] leading-relaxed">
                <li>
                  Built a role-aware internal help desk SaaS for admins, agents, and employees, including ticket lifecycle workflows, comments, assignment, dashboard analytics, and CSV export.
                </li>
                <li>
                  Implemented Supabase Auth, PostgreSQL foreign keys and RLS, Express business logic, notifications, due-date jobs, responsive UI, and deployment-ready configuration.
                </li>
              </ul>
              <div className="mt-1 text-[11.5px] text-[#444444] font-medium flex flex-wrap gap-x-3">
                <span>
                  <strong className="text-[#111]">GitHub:</strong>{' '}
                  <a href="https://github.com/Ashish2614/OpsPilot" target="_blank" rel="noreferrer" className="text-[#0B5C96] hover:underline">
                    github.com/Ashish2614/OpsPilot
                  </a>
                </span>
                <span>|</span>
                <span>
                  <strong className="text-[#111]">Frontend:</strong>{' '}
                  <a href="https://opspilot-green.vercel.app" target="_blank" rel="noreferrer" className="text-[#0B5C96] hover:underline">
                    opspilot-green.vercel.app
                  </a>
                </span>
                <span>|</span>
                <span>
                  <strong className="text-[#111]">Backend:</strong>{' '}
                  <a href="https://opspilot-mua0.onrender.com" target="_blank" rel="noreferrer" className="text-[#0B5C96] hover:underline">
                    opspilot-mua0.onrender.com
                  </a>
                </span>
              </div>
            </div>

            {/* Krefzo Automation */}
            <div>
              <h3 className="text-[13px] sm:text-[13.5px] font-bold text-[#111111]">
                Krefzo Automation Website
              </h3>
              <p className="text-[11.5px] sm:text-[12px] text-[#666666] italic mb-1.5 font-medium">
                Next.js, TypeScript, React, Tailwind CSS, Lucide, Vercel, FormSubmit
              </p>
              <ul className="list-disc list-outside ml-4 space-y-1 text-[12px] sm:text-[12.5px] text-[#2D3748] leading-relaxed">
                <li>
                  Built and deployed a conversion-focused AI automation services website for lead generation and discovery-call bookings.
                </li>
                <li>
                  Created responsive service, case study, FAQ, and contact flows with SEO metadata, Open Graph tags, JSON-LD schema, and reduced-motion support.
                </li>
              </ul>
              <div className="mt-1 text-[11.5px] text-[#444444] font-medium flex flex-wrap gap-x-3">
                <span>
                  <strong className="text-[#111]">GitHub:</strong>{' '}
                  <a href="https://github.com/Ashish2614/automation_website" target="_blank" rel="noreferrer" className="text-[#0B5C96] hover:underline">
                    github.com/Ashish2614/automation_website
                  </a>
                </span>
                <span>|</span>
                <span>
                  <strong className="text-[#111]">Live:</strong>{' '}
                  <a href="https://automation-website-gray.vercel.app" target="_blank" rel="noreferrer" className="text-[#0B5C96] hover:underline">
                    automation-website-gray.vercel.app
                  </a>
                </span>
              </div>
            </div>

            {/* HueCraft */}
            <div>
              <h3 className="text-[13px] sm:text-[13.5px] font-bold text-[#111111]">
                HueCraft — Color Palette Generator
              </h3>
              <p className="text-[11.5px] sm:text-[12px] text-[#666666] italic mb-1.5 font-medium">
                React, Vite, JavaScript, CSS, Browser APIs
              </p>
              <ul className="list-disc list-outside ml-4 space-y-1 text-[12px] sm:text-[12.5px] text-[#2D3748] leading-relaxed">
                <li>
                  Built a responsive color tool with harmony modes, locked colors, HEX editing, clipboard actions, shareable URLs, exports, favorites, and recent history.
                </li>
                <li>
                  Added dark mode, keyboard generation, accessibility, searchable FAQ guidance, and local-storage fallbacks.
                </li>
              </ul>
              <div className="mt-1 text-[11.5px] text-[#444444] font-medium flex flex-wrap gap-x-3">
                <span>
                  <strong className="text-[#111]">GitHub:</strong>{' '}
                  <a href="https://github.com/Ashish2614/Color_Palette_Generator" target="_blank" rel="noreferrer" className="text-[#0B5C96] hover:underline">
                    github.com/Ashish2614/Color_Palette_Generator
                  </a>
                </span>
                <span>|</span>
                <span>
                  <strong className="text-[#111]">Live:</strong>{' '}
                  <a href="https://color-palette-generator-seven-rosy.vercel.app" target="_blank" rel="noreferrer" className="text-[#0B5C96] hover:underline">
                    color-palette-generator-seven-rosy.vercel.app
                  </a>
                </span>
              </div>
            </div>

            {/* ShopMart */}
            <div>
              <h3 className="text-[13px] sm:text-[13.5px] font-bold text-[#111111]">
                ShopMart — E-commerce Application
              </h3>
              <p className="text-[11.5px] sm:text-[12px] text-[#666666] italic mb-1.5 font-medium">
                React.js, Node.js, Express.js, MongoDB, Mongoose
              </p>
              <ul className="list-disc list-outside ml-4 space-y-1 text-[12px] sm:text-[12.5px] text-[#2D3748] leading-relaxed">
                <li>
                  Developed product browsing, search, filtering, cart management, admin workflows, REST APIs, and MongoDB data models for products, categories, users, and authentication.
                </li>
              </ul>
            </div>

            {/* Devbhoomi Trails */}
            <div>
              <h3 className="text-[13px] sm:text-[13.5px] font-bold text-[#111111]">
                Devbhoomi Trails — Himalayan Travel Platform
              </h3>
              <p className="text-[11.5px] sm:text-[12px] text-[#666666] italic mb-1.5 font-medium">
                React, Vite, JavaScript, Tailwind CSS, Supabase, Lucide React, Vercel
              </p>
              <ul className="list-disc list-outside ml-4 space-y-1 text-[12px] sm:text-[12.5px] text-[#2D3748] leading-relaxed">
                <li>
                  Built and deployed a responsive travel platform for Himachal Pradesh and Uttarakhand with destination discovery, seasonal packages, itinerary modals, FAQs, and guided tour flows.
                </li>
                <li>
                  Implemented a custom trip cost calculator, Supabase-backed booking and inquiry forms, WhatsApp booking handoff, responsive accessibility, and reusable component-driven UI.
                </li>
              </ul>
              <div className="mt-1 text-[11.5px] text-[#444444] font-medium flex flex-wrap gap-x-3">
                <span>
                  <strong className="text-[#111]">GitHub:</strong>{' '}
                  <a href="https://github.com/Ashish2614/DevbhoomiTrails" target="_blank" rel="noreferrer" className="text-[#0B5C96] hover:underline">
                    github.com/Ashish2614/DevbhoomiTrails
                  </a>
                </span>
                <span>|</span>
                <span>
                  <strong className="text-[#111]">Live:</strong>{' '}
                  <a href="https://devbhoomi-trails.vercel.app" target="_blank" rel="noreferrer" className="text-[#0B5C96] hover:underline">
                    devbhoomi-trails.vercel.app
                  </a>
                </span>
              </div>
            </div>

            {/* Global Vista */}
            <div>
              <h3 className="text-[13px] sm:text-[13.5px] font-bold text-[#111111]">
                Global Vista — Country Explorer
              </h3>
              <p className="text-[11.5px] sm:text-[12px] text-[#666666] italic mb-1.5 font-medium">
                React, Vite, JavaScript, REST Countries API, Wikimedia Commons, OpenStreetMap, Vercel
              </p>
              <ul className="list-disc list-outside ml-4 space-y-1 text-[12px] sm:text-[12.5px] text-[#2D3748] leading-relaxed">
                <li>
                  Built a responsive country discovery platform with live search, flags, maps, favorites, time zones, languages, administrative divisions, and tourist places with real photographs.
                </li>
                <li>
                  Implemented dark/light themes, accessible UI, animated profile sections, API fallbacks, live clocks, state/province search, and lazy-loaded destination imagery.
                </li>
              </ul>
              <div className="mt-1 text-[11.5px] text-[#444444] font-medium flex flex-wrap gap-x-3">
                <span>
                  <strong className="text-[#111]">GitHub:</strong>{' '}
                  <a href="https://github.com/Ashish2614/Global_Vista" target="_blank" rel="noreferrer" className="text-[#0B5C96] hover:underline">
                    github.com/Ashish2614/Global_Vista
                  </a>
                </span>
                <span>|</span>
                <span>
                  <strong className="text-[#111]">Live:</strong>{' '}
                  <a href="https://vercel.com/ak-b08e/global-vista" target="_blank" rel="noreferrer" className="text-[#0B5C96] hover:underline">
                    vercel.com/ak-b08e/global-vista
                  </a>
                </span>
              </div>
            </div>

            {/* Car Rental Website */}
            <div>
              <h3 className="text-[13px] sm:text-[13.5px] font-bold text-[#111111]">
                Car Rental Website
              </h3>
              <p className="text-[11.5px] sm:text-[12px] text-[#666666] italic mb-1.5 font-medium">
                React.js, JavaScript, Bootstrap, Swiper
              </p>
              <ul className="list-disc list-outside ml-4 space-y-1 text-[12px] sm:text-[12.5px] text-[#2D3748] leading-relaxed">
                <li>
                  Developed a responsive car rental interface with reusable components, search and filtering, FAQ, contact sections, and interactive sliders.
                </li>
              </ul>
            </div>

            {/* HireFlow */}
            <div>
              <h3 className="text-[13px] sm:text-[13.5px] font-bold text-[#111111]">
                HireFlow — Applicant Tracking System
              </h3>
              <p className="text-[11.5px] sm:text-[12px] text-[#666666] italic mb-1.5 font-medium">
                React, Vite, JavaScript, Express.js, PostgreSQL-ready API, Vercel, Render
              </p>
              <ul className="list-disc list-outside ml-4 space-y-1 text-[12px] sm:text-[12.5px] text-[#2D3748] leading-relaxed">
                <li>
                  Built a responsive recruitment SaaS interface for job discovery, recruiter dashboards, candidate applications, pipeline stages, interviews, notifications, and analytics.
                </li>
                <li>
                  Implemented dark/light themes, timezone-aware recruiter greetings, responsive navigation, REST API foundations, SPA routing, and deployment-ready Vercel and Render configuration.
                </li>
              </ul>
              <div className="mt-1 text-[11.5px] text-[#444444] font-medium flex flex-wrap gap-x-3">
                <span>
                  <strong className="text-[#111]">GitHub:</strong>{' '}
                  <a href="https://github.com/Ashish2614/HireFlow" target="_blank" rel="noreferrer" className="text-[#0B5C96] hover:underline">
                    github.com/Ashish2614/HireFlow
                  </a>
                </span>
                <span>|</span>
                <span>
                  <strong className="text-[#111]">Frontend:</strong>{' '}
                  <a href="https://hire-flow-fawn-theta.vercel.app" target="_blank" rel="noreferrer" className="text-[#0B5C96] hover:underline">
                    hire-flow-fawn-theta.vercel.app
                  </a>
                </span>
                <span>|</span>
                <span>
                  <strong className="text-[#111]">Backend:</strong>{' '}
                  <a href="https://hireflow-ddzt.onrender.com" target="_blank" rel="noreferrer" className="text-[#0B5C96] hover:underline">
                    hireflow-ddzt.onrender.com
                  </a>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Additional Strengths */}
        <section className="mb-5">
          <h2 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[#111111] border-b border-[#CCCCCC] pb-1 mb-2">
            ADDITIONAL STRENGTHS
          </h2>
          <p className="text-[12.5px] sm:text-[13px] text-[#2D3748] leading-relaxed">
            Responsive web development | Component-driven architecture | API integration | Debugging and problem solving | Version control | AI-assisted development | Clean, maintainable code
          </p>
        </section>

        {/* Section: Education */}
        <section className="mb-2">
          <h2 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[#111111] border-b border-[#CCCCCC] pb-1 mb-2">
            EDUCATION
          </h2>
          <div className="space-y-1 text-[12.5px] sm:text-[13px] text-[#2D3748]">
            <p>
              <strong className="text-[#111111]">B.Tech in Electrical and Electronics Engineering</strong> | Sharda University | 2020 | CGPA: 8.4
            </p>
            <p>
              <strong className="text-[#111111]">M.A. in Public Administration</strong> | IGNOU | 2021-2024
            </p>
          </div>
        </section>
      </article>

      {/* Floating Action Button for easy quick printing / copying on mobile */}
      <div className="fixed bottom-6 right-6 flex items-center gap-2 print:hidden z-30">
        <button
          onClick={handlePrint}
          className="px-4 py-2.5 rounded-full bg-[#1B3B2B] text-white font-medium text-xs shadow-lg hover:bg-[#2A563F] transition-all flex items-center gap-2 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span className="hidden sm:inline">Save as PDF</span>
        </button>
      </div>
    </div>
  );
};

export default Resume;
