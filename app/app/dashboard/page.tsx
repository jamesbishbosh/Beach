import { createServerComponentClient } from "@/lib/supabase-server";

export default async function DashboardPage() {
  const supabase = createServerComponentClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get first name from allowed_users
  const { data: allowedUser } = await supabase
    .from("allowed_users")
    .select("name")
    .eq("email", user?.email ?? "")
    .single();

  const firstName = allowedUser?.name?.split(" ")[0] || "there";

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center max-w-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Welcome back, {firstName}.
        </h2>
        <p className="text-sm text-gray-400">More coming soon.</p>
      </div>
    </div>
  );
}
