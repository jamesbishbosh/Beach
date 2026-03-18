import { redirect } from "next/navigation";
import { createServerComponentClient } from "@/lib/supabase-server";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/login");
  }

  // Get user name from allowed_users
  const { data: allowedUser } = await supabase
    .from("allowed_users")
    .select("name")
    .eq("email", user.email)
    .single();

  const name = allowedUser?.name || user.email.split("@")[0];
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-brand-bg">
      <Sidebar userEmail={user.email} />
      <div className="ml-60">
        <Header title="Dashboard" userInitials={initials} />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
