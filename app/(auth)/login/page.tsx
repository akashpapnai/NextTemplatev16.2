"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { sendOtpAction } from "@/lib/auth.actions";

export default function LoginPage() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const cleaned = mobile.replace(/\D/g, "");
    if (cleaned.length < 10) {
      setError("Please enter a valid mobile number.");
      return;
    }

    startTransition(async () => {
      const result = await sendOtpAction(cleaned);
      if (result.error) {
        setError(result.error);
      } else {
        // Pass mobile via query param to the OTP page
        router.push(`/verify-otp?mobile=${encodeURIComponent(cleaned)}`);
      }
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">Sign in /  <button className="text-indigo-300 hover:text-indigo-400 transition cursor-pointer" type="button" onClick={() => router.push("/signup")}>
          Sign Up
        </button></h2>
        <p className="text-sm text-slate-400 mt-1">
          We&apos;ll send a one-time password to your mobile.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="mobile" className="block text-sm font-medium text-slate-300 mb-1.5">
            Mobile number
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm select-none">
              +91
            </span>
            <input
              id="mobile"
              type="tel"
              inputMode="numeric"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="98765 43210"
              maxLength={15}
              className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              required
              disabled={isPending}
            />
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending || !mobile}
          className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/40 disabled:cursor-not-allowed text-white font-medium rounded-xl py-3 text-sm transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isPending ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sending OTP…
            </>
          ) : (
            "Send OTP"
          )}
        </button>
      </form>
    </div>
  );
} 