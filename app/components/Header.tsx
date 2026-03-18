interface HeaderProps {
  title: string;
  userInitials: string;
}

export default function Header({ title, userInitials }: HeaderProps) {
  return (
    <header className="h-14 sm:h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 pl-16 lg:pl-8 sm:px-8">
      <h1 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h1>
      <div
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-brand-teal flex items-center justify-center text-white text-xs font-semibold"
        aria-label={`User: ${userInitials}`}
      >
        {userInitials}
      </div>
    </header>
  );
}
