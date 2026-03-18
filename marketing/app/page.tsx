"use client";

import { useState } from "react";
import Image from "next/image";
import HeroBackground from "@/components/HeroBackground";
import ContactModal from "@/components/ContactModal";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="relative w-full h-dvh overflow-hidden flex flex-col">
        <HeroBackground />

        {/* Nav */}
        <nav
          className="relative z-10 flex items-center justify-between px-4 sm:px-10 py-4 sm:py-6"
          aria-label="Main navigation"
        >
          <Image
            src="/logo.png"
            alt="Beach Events"
            width={120}
            height={32}
            className="w-[90px] sm:w-[120px] h-auto"
            priority
          />
          <a
            href="https://app.beach-events.co.uk/login"
            className="text-xs sm:text-sm text-white/50 hover:text-white transition-colors tracking-widest uppercase"
          >
            Login
          </a>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 text-center">
          <span className="pill mb-6 sm:mb-8">New site coming soon</span>

          <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl leading-[1.1] uppercase">
            Sand. Spectacle. Sport.
          </h1>
          <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-white/60 max-w-xl px-2">
            Beach builds, brand experiences and sport infrastructure.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-8 sm:mt-10 bg-amber-500 hover:bg-amber-400 text-black font-semibold py-3 sm:py-3.5 px-8 sm:px-10 rounded-full transition-colors text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-black"
          >
            Get in touch &rarr;
          </button>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-center px-4 sm:px-10 py-4 sm:py-6">
          <p className="text-xs text-white/30">
            &copy; 2026 Beach Events
          </p>
        </div>
      </section>

      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
