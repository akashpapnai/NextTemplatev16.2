"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { ApiResponse, SendOtpResponse, VerifyOtpResponse } from "@/types/auth";
import { sendOTPToPhone } from "./otp";

type SignupPayload = {
  userName: string;
  firstName: string;
  middleName?: string;
  lastName: string;

  mobileNumber: string;
  email: string;

  address?: string;

  countryId: number;
  stateId: number;
  cityId: number;

  pinCode?: string;

  genderId: number;
};

type SignUpResponse = {
  Authorized: boolean;
  MobileNumber: string;
}

const BACKEND_URL = process.env.BACKEND_URL!;

export async function sendOtpAction(
  mobile: string
): Promise<{ error: string | null }> {
  try {
    console.log(`${BACKEND_URL}/Authorization/Login`);
    const res = await fetch(`${BACKEND_URL}/Authorization/Login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ MobileNumber: mobile }),
      cache: "no-store",
    });

    const data: SendOtpResponse = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { error: data.message ?? `Failed to send OTP. Try again.` };
    }

    await sendOTPToPhone(mobile);

    return { error: null };
  } catch {
    return { error: `Network error. Please check your connection.` };
  }
}

export async function verifyOtpAction(
  mobile: string,
  otp: string
): Promise<{ error: string | null }> {
  let setCookieHeaders: string[] = [];

  try {
    const res = await fetch(`${BACKEND_URL}/Authorization/VerifyOTP`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ MobileNumber: mobile, OTP: otp }),
      cache: "no-store",
    });

    const data: VerifyOtpResponse = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { error: data.message ?? "Invalid OTP. Please try again." };
    }

    // Collect Set-Cookie headers from backend to forward to browser
    setCookieHeaders = res.headers.getSetCookie();
  } catch {
    return { error: `Network error. Please check your connection.` };
  }

  // Set each cookie that the backend returned
  if (setCookieHeaders.length > 0) {
    const cookieStore = await cookies();
    for (const raw of setCookieHeaders) {
      // Parse the raw Set-Cookie string
      const [nameValue, ...directives] = raw.split(";").map((s) => s.trim());
      const eqIdx = nameValue.indexOf("=");
      const name = nameValue.slice(0, eqIdx);
      const value = nameValue.slice(eqIdx + 1);

      const opts: Parameters<typeof cookieStore.set>[2] = {};

      for (const d of directives) {
        const lower = d.toLowerCase();
        if (lower === "httponly") opts.httpOnly = true;
        else if (lower === "secure") opts.secure = true;
        else if (lower === "samesite=strict") opts.sameSite = "strict";
        else if (lower === "samesite=lax") opts.sameSite = "lax";
        else if (lower === "samesite=none") opts.sameSite = "none";
        else if (lower.startsWith("max-age="))
          opts.maxAge = parseInt(d.split("=")[1]);
        else if (lower.startsWith("path=")) opts.path = d.split("=")[1];
        else if (lower.startsWith("expires="))
          opts.expires = new Date(d.split("=")[1]);
      }

      cookieStore.set(name, value, opts);
    }
  }

  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();

  // Optionally call backend logout endpoint
  try {
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    await fetch(`${BACKEND_URL}/Authorization/LogOut`, {
      method: "POST",
      headers: { cookie: cookieHeader },
      cache: "no-store",
    });
  } catch {
    // Silently fail — we clear cookies regardless
  }

  // Delete auth cookies
  cookieStore.delete("AuthToken");
  cookieStore.delete("RefreshToken");

  redirect("/login");
}

export async function sendSignupOtpAction(payload: SignupPayload): Promise<{ error: string | null }> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/Authorization/SignUp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserName: payload.userName,
          FirstName: payload.firstName,
          MiddleName: payload.middleName,
          LastName: payload.lastName,
          MobileNumber: payload.mobileNumber,
          Email: payload.email,
          Address: payload.address,
          CountryId: payload.countryId,
          StateId: payload.stateId,
          CityId: payload.cityId,
          PinCode: payload.pinCode,
          GenderId: payload.genderId,
        }),
        cache: "no-store",
      }
    );

    const data: ApiResponse<SignUpResponse> = await res.json();
    
    if (!res.ok) {
      return {
        error: data.Message,
      };
    }

    return {
      error: null,
    };
  } catch {
    return {
      error: "Network error. Please check your connection.",
    };
  }
}