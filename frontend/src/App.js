import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'sonner';
import './index.css';
import './App.css';

// Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Finance from './pages/Finance';
import Sales from './pages/Sales';
import Analytics from './pages/Analytics';
import AIFeatures from './pages/AIFeatures';
import EmotionAI from './pages/EmotionAI';
import PersonaGenerator from './pages/PersonaGenerator';
import EdgeAI from './pages/EdgeAI';
import FundingCompliance from './pages/FundingCompliance';
import BusinessDNA from './pages/BusinessDNA';
import CommunityHub from './pages/CommunityHub';
import Integrations from './pages/Integrations';
import Settings from './pages/Settings';

// Layout
import Layout from './components/Layout';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/finance"
        element={
          <ProtectedRoute>
            <Layout>
              <Finance />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/sales"
        element={
          <ProtectedRoute>
            <Layout>
              <Sales />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Layout>
              <Analytics />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/ai-features"
        element={
          <ProtectedRoute>
            <Layout>
              <AIFeatures />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/ai-features/emotion"
        element={
          <ProtectedRoute>
            <Layout>
              <EmotionAI />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/ai-features/persona"
        element={
          <ProtectedRoute>
            <Layout>
              <PersonaGenerator />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/ai-features/edge"
        element={
          <ProtectedRoute>
            <Layout>
              <EdgeAI />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/ai-features/funding"
        element={
          <ProtectedRoute>
            <Layout>
              <FundingCompliance />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/ai-features/dna"
        element={
          <ProtectedRoute>
            <Layout>
              <BusinessDNA />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/ai-features/community"
        element={
          <ProtectedRoute>
            <Layout>
              <CommunityHub />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/integrations"
        element={
          <ProtectedRoute>
            <Layout>
              <Integrations />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
