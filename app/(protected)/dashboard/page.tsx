import { getSession } from "@/lib/session";
import { logoutAction } from "@/lib/auth.actions";

export default async function DashboardPage() {
  const user = await getSession();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top nav */}
      <header className="border-b border-white/5 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className="font-semibold text-sm text-white">
              {process.env.NEXT_PUBLIC_APP_NAME ?? "MyApp"}
            </span>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Welcome back{user?.FirstName ? `, ${user.FirstName}` : ""}. You&apos;re authenticated.
          </p>
        </div>

        {/* Session card */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-300">Session</span>
            </div>
            <p className="text-xs text-slate-500 mb-1">Mobile</p>
            <p className="text-sm font-medium text-white">{user?.MobileNumber ?? "—"}</p>
            {user?.UserId && (
              <>
                <p className="text-xs text-slate-500 mb-1 mt-3">User ID</p>
                <p className="text-xs font-mono text-slate-300 truncate">{user.UserId}</p>
              </>
            )}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-300">Auth</span>
            </div>
            <p className="text-xs text-slate-500 mb-1">Token type</p>
            <p className="text-sm font-medium text-white">HttpOnly Cookie</p>
            <p className="text-xs text-slate-500 mb-1 mt-3">Refresh</p>
            <p className="text-sm text-slate-300">Handled by middleware</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-300">Stack</span>
            </div>
            <ul className="space-y-1.5">
              {["Next.js 15 (App Router)", "TypeScript", "Tailwind CSS", "Server Actions"].map((item) => (
                <li key={item} className="text-sm text-slate-300 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-slate-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}