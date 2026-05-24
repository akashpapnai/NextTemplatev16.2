// app/(protected)/layout.tsx

import { redirect } from "next/navigation";
import { hasSession, getSession } from "@/lib/session";
import { logoutAction } from "@/lib/auth.actions";
import Link from "next/link";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await hasSession();

  if (!authenticated) {
    redirect("/login");
  }

  const user = await getSession();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/5 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            <span className="font-semibold text-sm text-white">
              {process.env.NEXT_PUBLIC_APP_NAME ?? "MyApp"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">
              <Link href="/profile" className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
                {user?.FirstName}
              </Link>
            </span>

            <form action={logoutAction}>
              <button
                type="submit"
                className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {children}
      </main>
    </div>
  );
}