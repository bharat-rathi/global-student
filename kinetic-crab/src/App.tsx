import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { Button } from './components/ui/Button';
import { useAuthStore } from './store/useAuthStore';
import { MainLayout } from './components/layout/MainLayout';
import { StudentRegister } from './features/auth/StudentRegister';
import { StudentLogin } from './features/auth/StudentLogin';
import { ParentVerify } from './features/auth/ParentVerify';
import { ParentDashboard } from './features/dashboard/ParentDashboard';
import { StudentDashboard } from './features/dashboard/StudentDashboard';
import { TopicList } from './features/learn/TopicList';
import { TopicView } from './features/learn/TopicView';
import { AdminLogin } from './features/admin/AdminLogin';
import { AdminDashboard } from './features/admin/AdminDashboard';

// Placeholders
const LandingPage = () => {
  const { loginAsDemoStudent } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
      <h1 className="text-6xl font-bold tracking-tight">
        Become a <span className="text-gradient">Global Citizen</span>
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl">
        Master Math and Science with a gamified curriculum from the world's best education systems.
      </p>
      <div className="flex gap-4">
        <Link to="/register">
          <Button size="lg" className="text-lg px-8">Get Started</Button>
        </Link>
        <Button 
          variant="outline" 
          size="lg" 
          className="text-lg px-8"
          onClick={() => {
            loginAsDemoStudent();
            navigate('/dashboard');
          }}
        >
            🚀 Try Demo
        </Button>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<StudentLogin />} />
          <Route path="register" element={<StudentRegister />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="learn/:subject" element={<TopicList />} />
          <Route path="learn/:subject/:topicId" element={<TopicView />} />
          <Route path="parent/verify" element={<ParentVerify />} />
          <Route path="parent/dashboard" element={<ParentDashboard />} />
          <Route path="admin/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
