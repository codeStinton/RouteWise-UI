import type { ReactNode } from 'react';
import Footer from './Footer';

interface LayoutProps {
  hero: ReactNode;
  children: ReactNode;
}

export default function Layout({ hero, children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {hero}
      <main className="flex-1 bg-white">{children}</main>
      <Footer />
    </div>
  );
}
