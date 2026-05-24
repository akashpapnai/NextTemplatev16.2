"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyOtpAction, sendOtpAction } from "@/lib/auth.actions";
import { Suspense } from "react";

const OTP_LENGTH = 6;

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mobile = searchParams.get("mobile") ?? "";

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [resendMsg, setResendMsg] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(30);
  const [isPending, startTransition] = useTransition();
  const [isResending, startResendTransition] = useTransition();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Redirect if no mobile in URL
  useEffect(() => {
    if (!mobile) router.replace("/login");
  }, [mobile, router]);

  // Countdown for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const otp = digits.join("");

  const handleDigitChange = (index: number, value: string) => {
    const char = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    setError(null);

    if (char && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (otp.length < OTP_LENGTH) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }
    startTransition(async () => {
      const result = await verifyOtpAction(mobile, otp);
      if (result?.error) setError(result.error);
    });
  };

  const handleResend = () => {
    setResendMsg(null);
    setError(null);
    setDigits(Array(OTP_LENGTH).fill(""));
    startResendTransition(async () => {
      const result = await sendOtpAction(mobile);
      if (result.error) {
        setError(result.error);
      } else {
        setResendMsg("OTP resent successfully.");
        setCooldown(30);
      }
    });
  };

  const maskedMobile = mobile ? `${mobile.slice(0, 2)}${"*".repeat(mobile.length - 4)}${mobile.slice(-2)}` : "";

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">Verify OTP</h2>
        <p className="text-sm text-slate-400 mt-1">
          Enter the 6-digit code sent to{" "}
          <span className="text-slate-200 font-medium">+91 {maskedMobile}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OTP boxes */}
        <div className="flex gap-2 justify-between" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              disabled={isPending}
              className={`w-11 h-13 text-center text-lg font-semibold rounded-xl border bg-white/5 text-white transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                ${d ? "border-indigo-400/60" : "border-white/10"}
                ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
              style={{ height: "3.25rem" }}
            />
          ))}
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {resendMsg && (
          <p className="text-sm text-emerald-400">{resendMsg}</p>
        )}

        <button
          type="submit"
          disabled={isPending || otp.length < OTP_LENGTH}
          className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/40 disabled:cursor-not-allowed text-white font-medium rounded-xl py-3 text-sm transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isPending ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Verifying…
            </>
          ) : (
            "Verify & Sign in"
          )}
        </button>

        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-sm text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            ← Change number
          </button>
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || isResending}
            className="text-sm text-indigo-400 hover:text-indigo-300 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {isResending
              ? "Resending…"
              : cooldown > 0
              ? `Resend in ${cooldown}s`
              : "Resend OTP"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="text-slate-400 text-sm">Loading…</div>}>
      <VerifyOtpForm />
    </Suspense>
  );
}