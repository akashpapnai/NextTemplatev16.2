import { getSession } from "@/lib/session";
import ProfilePage from "@/app/(protected)/profile/UserData";

// app/profile/page.tsx  ← no "use client"
export default async function Page() {
  const user = await getSession();
  console.log("User in ProfilePage:", user);
  return <ProfilePage user={user} />;
}