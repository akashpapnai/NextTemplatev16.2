import { cookies } from "next/headers";
import { apiFetch } from "./api";
import type { ApiResponse, User } from "@/types/auth";

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("AuthToken");

  if (!authToken) return null;

  const { data, error } = await apiFetch<ApiResponse<User>>("/api/v1/Authorization/GetProfileDetails");

  if (error || !data) return null;

  return data.Data;
}

export async function hasSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return !!cookieStore.get("AuthToken");
}
