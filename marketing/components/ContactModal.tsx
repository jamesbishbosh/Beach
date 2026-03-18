"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const PROJECT_TYPES = [
  "Beach Build",
  "Brand Activation",
  "Sport Environment",
  "Something else",
];

const BUDGET_OPTIONS = [
  "Under \u00a35k",
  "\u00a35k\u2013\u00a315k",
  "\u00a315k\u2013\u00a350k",
  "\u00a350k+",
  "Not sure yet",
];

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormState = "idle" | "submitting" | "success" | "error";

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    projectType: "",
    budget: "",
    message: "",
  });
  const modalRef = useRef<HTMLDivElement>(null);

  const resetForm = useCallback(() => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      projectType: "",
      budget: "",
      message: "",
    });
    setFormState("idle");
    setErrorMessage("");
  }, []);

  // Close on escape + focus trapping
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      // Focus trap
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Focus first input on open
    const timer = setTimeout(() => {
      const firstInput = modalRef.current?.querySelector<HTMLElement>("input");
      firstInput?.focus();
    }, 50);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  // Auto-close after success
  useEffect(() => {
    if (formState === "success") {
      const timer = setTimeout(() => {
        onClose();
        resetForm();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [formState, onClose, resetForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setFormState("success");
    } catch (err) {
      setFormState("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (!isOpen) return null;

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-white placeholder:text-white/25 transition-colors";
  const selectClass =
    "w-full bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-white transition-colors appearance-none";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 modal-backdrop bg-black/80"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full sm:max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-y-auto modal-scroll bg-[#111] border-t sm:border border-white/10 rounded-t-2xl sm:rounded-2xl p-6 sm:p-10"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 flex items-center justify-center text-white/40 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-teal rounded-lg"
          aria-label="Close dialog"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M4 4l12 12M16 4L4 16" />
          </svg>
        </button>

        {formState === "success" ? (
          <div className="text-center py-12" role="status" aria-live="polite">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-brand-teal/20 flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0a7d8c"
                strokeWidth="2"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-medium">
              Thanks — we&apos;ll be in touch shortly.
            </p>
          </div>
        ) : (
          <>
            <h2 id="modal-title" className="text-xl sm:text-2xl font-semibold mb-1">
              Get in touch
            </h2>
            <p className="text-white/50 text-sm mb-6 sm:mb-8">
              Tell us about your event and we&apos;ll get back to you.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label htmlFor="fullName" className="block text-sm text-white/60 mb-1.5">
                  Full Name <span className="text-brand-teal" aria-hidden="true">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  aria-required="true"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm text-white/60 mb-1.5">
                  Email <span className="text-brand-teal" aria-hidden="true">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  aria-required="true"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm text-white/60 mb-1.5">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Optional"
                />
              </div>

              <div>
                <label htmlFor="projectType" className="block text-sm text-white/60 mb-1.5">
                  Project type
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className={selectClass}
                >
                  <option value="" className="bg-[#111]">Select...</option>
                  {PROJECT_TYPES.map((type) => (
                    <option key={type} value={type} className="bg-[#111]">{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="budget" className="block text-sm text-white/60 mb-1.5">
                  Approximate budget
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className={selectClass}
                >
                  <option value="" className="bg-[#111]">Select...</option>
                  {BUDGET_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#111]">{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm text-white/60 mb-1.5">
                  Message / brief
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  className={`${inputClass} resize-none`}
                  placeholder="Tell us about your project..."
                />
              </div>

              {formState === "error" && (
                <p className="text-red-400 text-sm" role="alert">{errorMessage}</p>
              )}

              <button
                type="submit"
                disabled={formState === "submitting"}
                className="w-full bg-brand-teal hover:bg-brand-teal-light text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-2 focus:ring-offset-[#111]"
              >
                {formState === "submitting" ? "Sending..." : "Send enquiry"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
