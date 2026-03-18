"use client";

import { useState } from "react";
import Image from "next/image";
import HeroBackground from "@/components/HeroBackground";
import ContactModal from "@/components/ContactModal";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="relative w-screen h-screen overflow-hidden flex flex-col">
        <HeroBackground />

        {/* Nav */}
        <nav className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-6">
          <Image
            src="/logo.png"
            alt="Beach Events"
            width={120}
            height={32}
            className=""
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
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
          {/* New site coming soon pill */}
          <span className="pill mb-8">New site coming soon</span>

          <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl leading-[1.1] uppercase">
            We put sand where
            <br />
            it doesn&apos;t belong.
          </h1>
          <p className="mt-6 text-base sm:text-lg text-white/60 whitespace-nowrap">
            Beach builds, brand activations and sport environments across the UK.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-10 bg-amber-500 hover:bg-amber-400 text-black font-semibold py-3.5 px-10 rounded-full transition-colors text-sm sm:text-base"
          >
            Get in touch &rarr;
          </button>
        </div>

        {/* Footer — pinned to bottom of viewport */}
        <div className="relative z-10 flex items-center justify-center px-6 sm:px-10 py-6">
          <p className="text-xs text-white/30">
            &copy; 2026 Beach Events
          </p>
        </div>
      </section>

      {/* Contact Modal */}
      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
