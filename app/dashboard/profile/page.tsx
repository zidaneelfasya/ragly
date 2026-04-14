import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileClient from "./profile-client";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/authentication");
  }

  // Define essential data
  const fullName = user.user_metadata?.full_name || "Enterprise User";
  const email = user.email || "";
  const phone = user.user_metadata?.phone || "";
  const avatarUrl = user.user_metadata?.avatar_url || "";
  const username = `@${email.split("@")[0]}`;
  const joinDate = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const profileData = {
    id: user.id,
    fullName,
    email,
    phone,
    avatarUrl,
    joinDate,
    username,
  };

  return <ProfileClient initialData={profileData} />;
}
