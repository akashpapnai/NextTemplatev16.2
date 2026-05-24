import { ApiResponse } from "@/types/auth";

const BACKEND_URL = process.env.BACKEND_URL!;

type SendOtpApiResponse = {
  Sent: boolean;
};

export async function sendOTPToPhone(
  mobileNumber: string
): Promise<{
  success: boolean;
  error: string | null;
  data?: SendOtpApiResponse["Sent"];
}> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/Authorization/SendOTPToPhone`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          MobileNumber: mobileNumber,
        }),

        cache: "no-store",
      }
    );

    const data: ApiResponse<SendOtpApiResponse> = await res.json();

    console.log("Send OTP Response:", data);

    if (!res.ok || !data.Status) {
      return {
        success: false,
        error:
          data.Message ??
          "Failed to send OTP.",
      };
    }

    return {
      success: true,
      error: null,
      data: data.Data?.Sent,
    };
  } catch {
    return {
      success: false,
      error:
        "Network error. Please check your connection.",
    };
  }
}