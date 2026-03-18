"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/AuthCard";
import { createClient } from "@/lib/supabase";

export default function VerifyPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("otp_email");
    if (!stored) {
      router.push("/login");
      return;
    }
    setEmail(stored);
    // Focus first input
    inputRefs.current[0]?.focus();
  }, [router]);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Backspace: clear current and move back
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || "";
    }
    setOtp(newOtp);

    // Focus the next empty input or last input
    const nextEmpty = newOtp.findIndex((v) => !v);
    inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: "email",
      });

      if (verifyError) {
        setError("Invalid or expired code. Try again.");
        setLoading(false);
        return;
      }

      // Check allowed_users
      const { data: allowedUser } = await supabase
        .from("allowed_users")
        .select("email")
        .eq("email", email)
        .single();

      if (!allowedUser) {
        await supabase.auth.signOut();
        sessionStorage.removeItem("otp_email");
        router.push("/login?error=not_authorised");
        return;
      }

      sessionStorage.removeItem("otp_email");
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");

    try {
      const supabase = createClient();
      await supabase.auth.signInWithOtp({ email });
      setResending(false);
    } catch {
      setError("Failed to resend code.");
      setResending(false);
    }
  };

  return (
    <AuthCard>
      <h1 className="text-xl font-bold text-center text-gray-900 mb-2">
        Check your email
      </h1>
      <p className="text-sm text-gray-400 text-center mb-6">
        We sent a 6-digit code to{" "}
        <span className="text-gray-600">{email}</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 6-box OTP input */}
        <div className="flex justify-between gap-2" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-full aspect-square max-w-[52px] border border-gray-200 rounded-lg text-center text-xl font-semibold text-gray-900 transition-colors"
              aria-label={`Digit ${i + 1}`}
            />
          ))}
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-teal hover:bg-brand-teal-light text-white font-semibold py-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Verify \u2192"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={handleResend}
          disabled={resending}
          className="text-xs text-gray-400 hover:text-brand-teal transition-colors disabled:opacity-50"
        >
          {resending ? "Sending..." : "Resend code"}
        </button>
      </div>
    </AuthCard>
  );
}
