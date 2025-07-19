import { ReactNode } from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-calm">
      <div className="max-w-4xl mx-auto">
        <header className="hidden md:block">
          <Navigation />
        </header>
        
        <main className="pb-20 md:pb-8 px-4 md:px-6">
          {children}
        </main>
        
        <div className="md:hidden">
          <Navigation />
        </div>
      </div>
    </div>
  );
};

export default Layout;