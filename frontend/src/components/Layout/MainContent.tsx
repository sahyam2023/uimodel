import { ReactNode } from 'react';

interface MainContentProps {
  children: ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  return (
    <main className="flex-1 overflow-auto bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </main>
  );
}