import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Loader2, KeyRound, RefreshCw, Inbox, ShieldCheck, ExternalLink } from 'lucide-react';

interface StoredInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
  deliveryStatus: string;
}

interface EmailStatus {
  provider: string;
  userEmail: string;
  activeMethod: string;
  hasAppPassword: boolean;
  connected: boolean;
  oauthError?: string | null;
  totalInquiriesReceived: number;
}

export const Contact: React.FC = () => {
  const [searchParams] = useSearchParams();
  const authSuccess = searchParams.get('auth') === 'success';
  const authError = searchParams.get('auth_error');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [websiteHoneypot, setWebsiteHoneypot] = useState(''); // Anti-spam honeypot

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // Email status & Inquiries state
  const [emailStatus, setEmailStatus] = useState<EmailStatus | null>(null);
  const [inquiries, setInquiries] = useState<StoredInquiry[]>([]);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<{ success: boolean; message: string } | null>(null);

  // App Password setup
  const [appPasswordInput, setAppPasswordInput] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  // Refresh Token setup
  const [refreshTokenInput, setRefreshTokenInput] = useState('');
  const [savingRefreshToken, setSavingRefreshToken] = useState(false);

  const fetchStatusAndInquiries = async () => {
    try {
      const [statusRes, inqRes] = await Promise.all([
        fetch('/api/email/status'),
        fetch('/api/inquiries')
      ]);

      if (statusRes.ok) {
        const sData = await statusRes.json();
        setEmailStatus(sData);
      }
      if (inqRes.ok) {
        const iData = await inqRes.json();
        setInquiries(iData.inquiries || []);
      }
    } catch (err) {
      console.warn('Failed to fetch status:', err);
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    fetchStatusAndInquiries();
  }, []);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) {
      errs.name = 'Please provide your full name (at least 2 characters)';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errs.email = 'Please provide a valid email address';
    }

    if (!message.trim() || message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || undefined,
          message: message.trim(),
          website: websiteHoneypot
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry');
      }

      setSuccessMessage(data.message || 'Your inquiry has been received. Our concierge will get back to you within 24 hours.');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      fetchStatusAndInquiries();
    } catch (err: any) {
      setServerError(err.message || 'Failed to submit inquiry. Please try again or email us directly.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendTestEmail = async () => {
    setTestEmailLoading(true);
    setTestEmailResult(null);

    try {
      const res = await fetch('/api/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: 'ashishtring@gmail.com' })
      });

      const data = await res.json();
      if (data.success) {
        setTestEmailResult({
          success: true,
          message: `Success! Test email delivered via ${data.method === 'smtp_app_password' ? 'Gmail SMTP' : 'Gmail API'} (ID: ${data.messageId}). Check your inbox at ashishtring@gmail.com!`
        });
      } else {
        setTestEmailResult({
          success: false,
          message: `Dispatch deferred: ${data.error || 'Unknown error'}. See instructions below to configure instant delivery.`
        });
      }
      fetchStatusAndInquiries();
    } catch (err: any) {
      setTestEmailResult({
        success: false,
        message: err.message || 'Failed to send test email.'
      });
    } finally {
      setTestEmailLoading(false);
    }
  };

  const handleSaveAppPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appPasswordInput.trim()) return;

    setSavingPassword(true);
    try {
      const res = await fetch('/api/email/configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appPassword: appPasswordInput.trim() })
      });

      const data = await res.json();
      if (data.success) {
        setAppPasswordInput('');
        await fetchStatusAndInquiries();
        await handleSendTestEmail();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSaveRefreshToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refreshTokenInput.trim()) return;

    setSavingRefreshToken(true);
    try {
      const res = await fetch('/api/email/configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refreshTokenInput.trim() })
      });

      const data = await res.json();
      if (data.success) {
        setRefreshTokenInput('');
        await fetchStatusAndInquiries();
        await handleSendTestEmail();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingRefreshToken(false);
    }
  };

  return (
    <div className="bg-[#FBF9F5] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Contact Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Business Details */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="text-xs uppercase tracking-wider text-[#C87A55] font-semibold mb-2">
                Host Concierge & Support
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B3B2B]">
                We’re Here for Your Stay
              </h1>
              <p className="mt-3 text-sm text-[#4A5568] leading-relaxed">
                Whether you are a homestay owner inquiring about bulk amenity procurement, custom laser engraving for brass keys, or a traveler wanting to know more about our pieces, our concierge team welcomes your inquiry.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-white border border-[#E8E3D9] flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#F3EFE6] text-[#1B3B2B] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#1B3B2B]" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#1F2421]">
                    Owner & Concierge Email
                  </h3>
                  <a href="mailto:ashishtring@gmail.com" className="text-xs text-[#C87A55] hover:underline font-medium">
                    ashishtring@gmail.com
                  </a>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">Direct host inbox</p>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-white border border-[#E8E3D9] flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#F3EFE6] text-[#1B3B2B] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#C87A55]" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#1F2421]">
                    Call Our Desk
                  </h3>
                  <a href="tel:+918049102800" className="text-xs text-[#1B3B2B] font-semibold hover:underline">
                    +91 (80) 4910 2800
                  </a>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">Mon–Sat, 9:30 AM to 6:30 PM IST</p>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-white border border-[#E8E3D9] flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#F3EFE6] text-[#1B3B2B] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#1B3B2B]" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#1F2421]">
                    Property Studios
                  </h3>
                  <p className="text-xs text-[#4A5568] leading-relaxed">
                    12th Main, HAL 2nd Stage, Indiranagar, Bangalore, Karnataka 560038
                  </p>
                  <p className="text-[11px] text-[#6B7280] mt-1">
                    Regional Workshop: Stuart Hill, Madikeri, Coorg 571201
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-2xl border border-[#E8E3D9] shadow-sm">
            <h2 className="font-serif text-xl font-bold text-[#1B3B2B] mb-2">
              Send an Inquiry
            </h2>
            <p className="text-xs text-[#6B7280] mb-6">
              Fill out the form below. Inquiries are instantly recorded in the Concierge Inbox.
            </p>

            {successMessage && (
              <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Message Delivered to Concierge</strong>
                  <span>{successMessage}</span>
                </div>
              </div>
            )}

            {serverError && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Submission Notice</strong>
                  <span>{serverError}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Leave blank</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={websiteHoneypot}
                  onChange={e => setWebsiteHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Radhika Menon"
                  className={`w-full px-3.5 py-2.5 rounded-md border text-sm text-[#1F2421] focus:outline-none focus:ring-1 focus:ring-[#1B3B2B] ${
                    errors.name ? 'border-red-400 bg-red-50/30' : 'border-[#E8E3D9] bg-[#FBF9F5]'
                  }`}
                />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="radhika@example.com"
                    className={`w-full px-3.5 py-2.5 rounded-md border text-sm text-[#1F2421] focus:outline-none focus:ring-1 focus:ring-[#1B3B2B] ${
                      errors.email ? 'border-red-400 bg-red-50/30' : 'border-[#E8E3D9] bg-[#FBF9F5]'
                    }`}
                  />
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                    Phone / WhatsApp (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-md border border-[#E8E3D9] bg-[#FBF9F5] text-sm text-[#1F2421] focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                  How can we help your homestay? *
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Tell us about your property, products you're interested in, or host advisory requirements..."
                  className={`w-full px-3.5 py-2.5 rounded-md border text-sm text-[#1F2421] focus:outline-none focus:ring-1 focus:ring-[#1B3B2B] ${
                    errors.message ? 'border-red-400 bg-red-50/30' : 'border-[#E8E3D9] bg-[#FBF9F5]'
                  }`}
                />
                {errors.message && <p className="text-xs text-red-600 mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-md bg-[#1B3B2B] hover:bg-[#2A563F] text-[#FBF9F5] text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Dispatching message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Hospitality Inquiry</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* OWNER CONCIERGE INBOX & GMAIL DELIVERY CENTER */}
        <div className="bg-white rounded-2xl border border-[#E8E3D9] shadow-sm p-8 sm:p-10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E3D9] pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1B3B2B] text-white flex items-center justify-center">
                <Inbox className="w-5 h-5 text-[#C87A55]" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-[#1B3B2B]">
                  Owner Concierge Center & Email Delivery
                </h2>
                <p className="text-xs text-[#6B7280]">
                  Target Owner Inbox: <strong className="text-[#1F2421]">ashishtring@gmail.com</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSendTestEmail}
                disabled={testEmailLoading}
                className="px-4 py-2 rounded-md bg-[#1B3B2B] text-white text-xs font-medium hover:bg-[#2A563F] transition-colors flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {testEmailLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
                <span>Send Test Email to ashishtring@gmail.com</span>
              </button>
              <button
                onClick={fetchStatusAndInquiries}
                className="p-2 rounded-md border border-[#E8E3D9] text-[#6B7280] hover:bg-[#F3EFE6] transition-colors cursor-pointer"
                aria-label="Refresh inquiries"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Test Email Result Banner */}
          {testEmailResult && (
            <div className={`p-4 rounded-lg text-xs flex items-start gap-3 border ${
              testEmailResult.success 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              {testEmailResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <strong className="block font-semibold">
                  {testEmailResult.success ? 'Delivery Confirmed' : 'Delivery Notice'}
                </strong>
                <p className="mt-0.5 leading-relaxed">{testEmailResult.message}</p>
              </div>
            </div>
          )}

          {/* Diagnosis & Setup Solutions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Solution A: Gmail App Password (Immediate 100% Guaranteed Delivery) */}
            <div className="p-6 rounded-xl bg-[#F8F6F0] border border-[#E8E3D9] space-y-4">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4.5 h-4.5 text-[#1B3B2B]" />
                <h3 className="font-serif text-base font-bold text-[#1B3B2B]">
                  Instant Setup: Gmail App Password (Recommended)
                </h3>
              </div>
              <p className="text-xs text-[#4A5568] leading-relaxed">
                Google requires an App Password for backend SMTP sending. It takes 60 seconds and works permanently without token expirations:
              </p>
              <ol className="text-xs text-[#4A5568] list-decimal pl-4 space-y-1">
                <li>Go to <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="text-[#C87A55] underline font-medium inline-flex items-center gap-0.5">myaccount.google.com/apppasswords <ExternalLink className="w-3 h-3" /></a></li>
                <li>Sign in with <strong>ashishtring@gmail.com</strong> (ensure 2-Step Verification is on).</li>
                <li>Enter App name <em>"AShK Stays"</em> and click <strong>Create</strong>.</li>
                <li>Copy the 16-character code (e.g. <code>abcd efgh ijkl mnop</code>) and paste below:</li>
              </ol>

              <form onSubmit={handleSaveAppPassword} className="flex gap-2 pt-2">
                <input
                  type="password"
                  value={appPasswordInput}
                  onChange={e => setAppPasswordInput(e.target.value)}
                  placeholder="Paste 16-character App Password"
                  className="flex-1 px-3 py-2 text-xs rounded-md border border-[#E8E3D9] bg-white text-[#1F2421] focus:ring-1 focus:ring-[#1B3B2B]"
                />
                <button
                  type="submit"
                  disabled={savingPassword || !appPasswordInput.trim()}
                  className="px-4 py-2 rounded-md bg-[#1B3B2B] text-white text-xs font-semibold hover:bg-[#2A563F] disabled:opacity-50 cursor-pointer"
                >
                  {savingPassword ? 'Verifying...' : 'Save & Send Test'}
                </button>
              </form>

              {emailStatus?.hasAppPassword && (
                <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Gmail App Password is active & connected!</span>
                </div>
              )}
            </div>

            {/* Solution B: Google OAuth Diagnosis & Refresh */}
            <div className="p-6 rounded-xl bg-white border border-[#E8E3D9] space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-[#C87A55]" />
                <h3 className="font-serif text-base font-bold text-[#1B3B2B]">
                  Alternative: Google OAuth 2.0
                </h3>
              </div>
              <div className="space-y-2 text-xs text-[#4A5568]">
                <div>
                  <span className="text-[#6B7280]">Client ID: </span>
                  <code className="text-[11px] bg-[#F3EFE6] px-1 py-0.5 rounded text-[#1F2421]">Configured in Environment</code>
                </div>
                <div>
                  <span className="text-[#6B7280]">Status: </span>
                  {emailStatus?.connected && !emailStatus.hasAppPassword ? (
                    <span className="font-semibold text-emerald-700">Connected via OAuth</span>
                  ) : (
                    <span className="font-semibold text-amber-700">Token Mismatch (unauthorized_client)</span>
                  )}
                </div>
                <p className="leading-relaxed text-[11px] text-[#6B7280]">
                  Google returned <strong>unauthorized_client</strong> because the refresh token was generated under Google Playground's default ID rather than your custom Client ID.
                </p>
                <p className="leading-relaxed text-[11px] text-[#6B7280]">
                  To regenerate with your Client ID: In OAuth Playground, click the ⚙️ gear icon, check <em>"Use your own OAuth credentials"</em>, enter your Client ID & Secret, authorize, and paste the new Refresh Token below:
                </p>
              </div>

              <form onSubmit={handleSaveRefreshToken} className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={refreshTokenInput}
                  onChange={e => setRefreshTokenInput(e.target.value)}
                  placeholder="Paste new Refresh Token (1//...)"
                  className="flex-1 px-3 py-2 text-xs rounded-md border border-[#E8E3D9] bg-white text-[#1F2421] focus:ring-1 focus:ring-[#1B3B2B]"
                />
                <button
                  type="submit"
                  disabled={savingRefreshToken || !refreshTokenInput.trim()}
                  className="px-4 py-2 rounded-md bg-[#1B3B2B] text-white text-xs font-semibold hover:bg-[#2A563F] disabled:opacity-50 cursor-pointer"
                >
                  {savingRefreshToken ? 'Saving...' : 'Update Token'}
                </button>
              </form>
            </div>
          </div>

          {/* In-App Live Inquiries List (Guaranteeing zero lost messages!) */}
          <div className="pt-6 border-t border-[#E8E3D9] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base font-bold text-[#1B3B2B]">
                  Live Guest Inquiries Received ({inquiries.length})
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Every message submitted on this website is stored here and in PostgreSQL:
                </p>
              </div>
            </div>

            {inquiries.length === 0 ? (
              <div className="p-8 text-center bg-[#FBF9F5] rounded-xl border border-dashed border-[#E8E3D9] text-xs text-[#6B7280]">
                No inquiries submitted yet. Fill out the form above to submit your first inquiry!
              </div>
            ) : (
              <div className="divide-y divide-[#E8E3D9] border border-[#E8E3D9] rounded-xl overflow-hidden bg-white">
                {inquiries.map((inq, idx) => (
                  <div key={inq.id || idx} className="p-4 hover:bg-[#FBF9F5] transition-colors space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                      <div>
                        <strong className="text-sm font-serif font-bold text-[#1F2421]">{inq.name}</strong>
                        <span className="mx-2 text-[#9CA3AF]">·</span>
                        <a href={`mailto:${inq.email}`} className="text-[#C87A55] font-medium hover:underline">{inq.email}</a>
                        {inq.phone && (
                          <>
                            <span className="mx-2 text-[#9CA3AF]">·</span>
                            <span className="text-[#6B7280]">{inq.phone}</span>
                          </>
                        )}
                      </div>
                      <span className="text-[11px] text-[#9CA3AF]">
                        {new Date(inq.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                      </span>
                    </div>
                    <p className="text-xs text-[#4A5568] bg-[#F8F6F0] p-3 rounded-md font-normal leading-relaxed">
                      "{inq.message}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
