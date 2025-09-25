import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/Layout/AppLayout';
import { ChatBot } from '@/components/AIAssistant/ChatBot';
import { Dashboard } from '@/pages/Dashboard';
import { Projects } from '@/pages/Projects';
import { ProjectDetail } from '@/pages/ProjectDetail';
import { Workspace } from '@/pages/Workspace';
import { Registry } from '@/pages/Registry';
import { DataSources } from '@/pages/DataSources';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/registry" element={<Registry />} />
          <Route path="/data" element={<DataSources />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
        </Routes>
        <ChatBot />
        <Toaster />
      </AppLayout>
    </Router>
  );
}

export default App;