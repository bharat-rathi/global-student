import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { StudentRegister } from './features/auth/StudentRegister';
import { StudentLogin } from './features/auth/StudentLogin';
import { ParentVerify } from './features/auth/ParentVerify';
import { ParentDashboard } from './features/dashboard/ParentDashboard';
import { StudentDashboard } from './features/dashboard/StudentDashboard';
import { TopicList } from './features/learn/TopicList';
import { TopicView } from './features/learn/TopicView';

// Placeholders
const LandingPage = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
    <h1 className="text-6xl font-bold tracking-tight">
      Become a <span className="text-gradient">Global Citizen</span>
    </h1>
    <p className="text-xl text-muted-foreground max-w-2xl">
      Master Math and Science with a gamified curriculum from the world's best education systems.
    </p>
  </div>
);

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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
