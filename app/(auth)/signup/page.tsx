"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { sendSignupOtpAction } from "@/lib/auth.actions";
import { sendOTPToPhone } from "@/lib/otp";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    userName: "",
    firstName: "",
    middleName: "",
    lastName: "",

    mobileNumber: "",
    email: "",

    address: "",

    countryId: 1,
    stateId: 1,
    cityId: 1,

    pinCode: "",

    genderId: 1,
  });

  const [error, setError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (
    e: React.SubmitEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError(null);

    if (!form.userName.trim()) {
      setError("Username is required.");
      return;
    }

    if (!form.firstName.trim()) {
      setError("First name is required.");
      return;
    }

    if (!form.lastName.trim()) {
      setError("Last name is required.");
      return;
    }

    if (!form.mobileNumber.trim()) {
      setError("Mobile number is required.");
      return;
    }

    if (!form.email.trim()) {
      setError("Email is required.");
      return;
    }

    startTransition(async () => {
      const result = await sendSignupOtpAction(form);

      if (result.error) {
        setError(result.error);
        return;
      }

      await sendOTPToPhone(form.mobileNumber);

      router.push(
        `/verify-otp?mobile=${encodeURIComponent(
          form.mobileNumber
        )}&type=signup`
      );
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">
          Create Account / <button className="text-indigo-300 hover:text-indigo-400 transition cursor-pointer" type="button" onClick={() => router.push("/login")}>
            Login
          </button>
        </h2>

        <p className="text-sm text-slate-400 mt-1">
          Create your account using mobile OTP verification.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Username
          </label>

          <input
            type="text"
            name="userName"
            value={form.userName}
            onChange={handleChange}
            placeholder="akash123"
            disabled={isPending}
            className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            First Name
          </label>

          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="Akash"
            disabled={isPending}
            className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Middle Name */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Middle Name
          </label>

          <input
            type="text"
            name="middleName"
            value={form.middleName}
            onChange={handleChange}
            placeholder="Kumar"
            disabled={isPending}
            className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Last Name
          </label>

          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Sharma"
            disabled={isPending}
            className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Mobile Number
          </label>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
              +91
            </span>

            <input
              type="tel"
              name="mobileNumber"
              value={form.mobileNumber}
              onChange={handleChange}
              placeholder="9876543210"
              disabled={isPending}
              className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="akash@gmail.com"
            disabled={isPending}
            className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Address
          </label>

          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Your address"
            disabled={isPending}
            className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Pincode */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Pincode
          </label>

          <input
            type="text"
            name="pinCode"
            value={form.pinCode}
            onChange={handleChange}
            placeholder="250001"
            disabled={isPending}
            className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <svg
              className="w-4 h-4 text-red-400 mt-0.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>

            <p className="text-sm text-red-400">
              {error}
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/40 disabled:cursor-not-allowed text-white font-medium rounded-xl py-3 text-sm transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isPending ? (
            <>
              <svg
                className="animate-spin w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />

                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>

              Sending OTP...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>
    </div>
  );
}