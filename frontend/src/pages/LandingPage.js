import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles, Zap, Shield, TrendingUp, Users, Brain } from 'lucide-react';
import { toast } from 'sonner';

const LandingPage = () => {
  const { handleSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Check for session_id in URL fragment
    const hash = location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const sessionId = params.get('session_id');
      
      if (sessionId && !processing) {
        processSession(sessionId);
      }
    }
  }, [location]);

  const processSession = async (sessionId) => {
    setProcessing(true);
    try {
      const success = await handleSession(sessionId);
      if (success) {
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
        toast.success('Welcome to AI Business Suite!');
        navigate('/dashboard');
      } else {
        toast.error('Authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('Session processing error:', error);
      toast.error('Authentication error. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleLogin = () => {
    const redirectUrl = `${window.location.origin}/dashboard`;
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  if (processing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navbar */}
      <nav className="border-b border-gray-200/50 dark:border-gray-700/50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              AI Business Suite
            </span>
          </div>
          <button
            onClick={handleLogin}
            className="pill-button bg-blue-600 text-white hover:bg-blue-700"
            data-testid="login-btn"
          >
            Sign in with Google
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center animate-fade-in">
        <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
          ✨ AI-Powered Business Management
        </div>
        
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          Transform Your Business
          <br />
          <span className="gradient-text">with AI Intelligence</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
          Comprehensive AI-powered platform for business intelligence, team management,
          client profiling, compliance, and community insights.
        </p>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleLogin}
            className="pill-button bg-blue-600 text-white hover:bg-blue-700 text-lg px-8 py-4"
            data-testid="get-started-btn"
          >
            Get Started Free
          </button>
          <button className="pill-button bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 text-lg px-8 py-4 hover:shadow-lg">
            View Demo
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Brain,
              title: 'Emotion & Team AI',
              description: 'Analyze team emotions and track performance to prevent burnout'
            },
            {
              icon: Users,
              title: 'Client Persona Generator',
              description: 'Generate detailed B2B client personas for sales and marketing'
            },
            {
              icon: Zap,
              title: 'Offline AI (Edge Mode)',
              description: 'Run AI models locally for privacy and offline capabilities'
            },
            {
              icon: Shield,
              title: 'Funding & Compliance',
              description: 'Discover funding opportunities and ensure regulatory compliance'
            },
            {
              icon: TrendingUp,
              title: 'Business DNA Engine',
              description: 'Create unique business profile for personalized recommendations'
            },
            {
              icon: Sparkles,
              title: 'Community Intelligence',
              description: 'Access trending insights and community-driven intelligence'
            }
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl glass-effect card-hover"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="p-12 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-8 text-blue-50">
            Join thousands of businesses using AI to transform their operations.
          </p>
          <button
            onClick={handleLogin}
            className="pill-button bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4"
            data-testid="cta-btn"
          >
            Start Your Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2025 AI Business Suite. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;