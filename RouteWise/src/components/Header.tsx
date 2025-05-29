import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  children?: ReactNode;
  className?: string;
}

export default function Header({ children, className = '' }: HeaderProps) {
  return (
    <header className={`bg-[#021952] ${className}`}>
      <div className="container mx-auto px-6 pt-8 pb-12 flex flex-col gap-4">
        <Link to="/" className="flex items-center gap-2 text-white">
        </Link>

        {children}
      </div>
    </header>
  );
}
