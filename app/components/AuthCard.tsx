import Image from "next/image";

interface AuthCardProps {
  children: React.ReactNode;
}

export default function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.png"
            alt="Beach Events"
            width={140}
            height={38}
            priority
          />
        </div>

        {children}

        {/* Back to site */}
        <div className="mt-8 text-center">
          <a
            href="https://www.beach-events.co.uk"
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            &larr; Back to site
          </a>
        </div>
      </div>
    </div>
  );
}
