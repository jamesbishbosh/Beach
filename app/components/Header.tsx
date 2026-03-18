interface HeaderProps {
  title: string;
  userInitials: string;
}

export default function Header({ title, userInitials }: HeaderProps) {
  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-8">
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      <div className="w-9 h-9 rounded-full bg-brand-teal flex items-center justify-center text-white text-xs font-semibold">
        {userInitials}
      </div>
    </header>
  );
}
