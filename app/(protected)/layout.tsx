import { redirect } from "next/navigation";
import { hasSession } from "@/lib/session";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Double-check: middleware handles this, but this is a safety net
  const authenticated = await hasSession();
  if (!authenticated) redirect("/login");

  return <>{children}</>;
}