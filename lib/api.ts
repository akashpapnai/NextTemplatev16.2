import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL!;

type FetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<{ data: T | null; error: string | null; status: number }> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const { body, ...rest } = options;

  try {
    const res = await fetch(`${BACKEND_URL}${path}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
        ...rest.headers,
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      cache: "no-store",
    });

    const text = await res.text();
    let data: T | null = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }

    return { data, error: res.ok ? null : text || "Request failed", status: res.status };
  } catch (err) {
    console.error(`[apiFetch] ${path}`, err);
    return { data: null, error: "Network error", status: 0 };
  }
}

export async function apiClientFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<{ data: T | null; error: string | null; status: number }> {
  const { body, ...rest } = options;

  try {
    const res = await fetch(`/api/proxy${path}`, {
      ...rest,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...rest.headers,
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

    const text = await res.text();
    let data: T | null = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }

    return { data, error: res.ok ? null : text || "Request failed", status: res.status };
  } catch (err) {
    console.error(`[apiClientFetch] ${path}`, err);
    return { data: null, error: "Network error", status: 0 };
  }
}
