import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MainContent } from './MainContent';

interface AppLayoutProps {
  children: ReactNode;
  isTraining: boolean;
}

export function AppLayout({ children, isTraining }: AppLayoutProps) {
  return (
    <div className="h-screen flex bg-slate-950">
      <Sidebar isTraining={isTraining} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <MainContent>{children}</MainContent>
      </div>
    </div>
  );
}