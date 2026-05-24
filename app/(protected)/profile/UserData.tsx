"use client";
import { User } from "@/types/auth";
import { useState, useTransition } from "react";

export default function ProfilePage({ user }: { user: User | null }) {

  type Form = { firstName: string; lastName: string; email: string };
  const initialForm: Form = { firstName: user?.FirstName || "", lastName: user?.LastName || "", email: user?.Email || "" };
  
  const [form, setForm] = useState<Form>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [isPending, startTransition] = useTransition();

  async function saveProfile(_data: Form) { await new Promise(r => setTimeout(r, 1400)); }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await saveProfile(form);
      setSaved(true);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSaved(false);
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const initials = [form.firstName[0], form.lastName[0]].filter(Boolean).join("").toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s ease both; }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.12s; }
        .fade-up-3 { animation-delay: 0.19s; }
 
        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          color: #fff;
          border-radius: 12px;
          padding: 11px 16px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
          font-family: inherit;
          resize: none;
        }
        .field-input::placeholder { color: rgba(148,163,184,0.45); }
        .field-input:focus {
          border-color: rgba(99,102,241,0.6);
          background: rgba(99,102,241,0.06);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }
        .field-input:disabled { opacity: 0.5; cursor: not-allowed; }
 
        .field-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.04em;
          color: rgba(148,163,184,0.8);
          margin-bottom: 6px;
          text-transform: uppercase;
        }
 
        .save-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 28px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          background: #4f46e5;
          border: 1px solid rgba(99,102,241,0.5);
          cursor: pointer;
          transition: background 0.15s, transform 0.12s, box-shadow 0.2s;
        }
        .save-btn:hover:not(:disabled) {
          background: #4338ca;
          box-shadow: 0 4px 24px rgba(99,102,241,0.4);
          transform: translateY(-1px);
        }
        .save-btn:active:not(:disabled) { transform: scale(0.98); }
        .save-btn:disabled { opacity: 0.45; cursor: not-allowed; }
 
        .avatar-ring {
          border: 2px solid rgba(99,102,241,0.4);
          box-shadow: 0 0 0 4px rgba(99,102,241,0.08);
        }
 
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin 0.7s linear infinite; }
 
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.8); }
          60%  { transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        .pop-in { animation: popIn 0.35s ease both; }
      `}</style>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-120 h-120 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-2xl mx-auto px-6 py-14">

        <div className="mb-10 fade-up">
          <p className="text-xs font-semibold tracking-widest text-indigo-400 uppercase mb-2">Account</p>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Manage your personal information and how it appears.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="fade-up fade-up-1 bg-white/3 border border-white/[0.07] rounded-2xl p-6 flex items-center gap-5">
            {/* Avatar */}
            <div
              className="avatar-ring shrink-0 w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center text-xl font-bold text-indigo-300 select-none"
            >
              {initials}
            </div>
            {/* Name preview */}
            <div className="min-w-0">
              <p className="text-lg font-semibold truncate">
                {[form.firstName, form.lastName].filter(Boolean).join(" ") || "Your Name"}
              </p>
              <p className="text-sm text-slate-500 truncate">{form.email || "your@email.com"}</p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="fade-up fade-up-2 bg-white/3 border border-white/[0.07] rounded-2xl p-6 space-y-5">
            <div>
              <h2 className="text-base font-semibold">Personal Information</h2>
              <p className="text-slate-500 text-xs mt-0.5">Update your name and contact details.</p>
            </div>

            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="field-label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  disabled={isPending}
                  className="field-input"
                />
              </div>
              <div>
                <label className="field-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  disabled={isPending}
                  className="field-input"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="field-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                disabled={isPending}
                className="field-input"
              />
            </div>
          </div>

          {/* Footer actions */}
          <div className="fade-up fade-up-3 flex items-center justify-between gap-4 pt-1">
            {/* Save feedback */}
            <div className="text-sm h-5">
              {saved && (
                <span key={Date.now()} className="pop-in flex items-center gap-1.5 text-emerald-400">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Saved successfully
                </span>
              )}
            </div>

            <button type="submit" disabled={isPending} className="save-btn">
              {isPending ? (
                <>
                  <svg className="spinner" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Saving…
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  Save Details
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}