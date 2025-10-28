import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Users, Zap, Shield, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

const AIFeatures = () => {
  const features = [
    {
      icon: Brain,
      title: 'Emotion & Team Performance AI',
      description: 'Analyze team emotions and track performance to prevent burnout with AI-powered insights.',
      path: '/ai-features/emotion',
      color: 'from-purple-500 to-pink-500',
      testId: 'feature-emotion-ai'
    },
    {
      icon: Users,
      title: 'AI Client Persona Generator',
      description: 'Generate detailed B2B client personas with stakeholder mapping and psychographic analysis.',
      path: '/ai-features/persona',
      color: 'from-blue-500 to-cyan-500',
      testId: 'feature-persona'
    },
    {
      icon: Zap,
      title: 'Offline AI (Edge Mode)',
      description: 'Run AI models locally for privacy and offline capabilities with response caching.',
      path: '/ai-features/edge',
      color: 'from-yellow-500 to-orange-500',
      testId: 'feature-edge-ai'
    },
    {
      icon: Shield,
      title: 'Funding & Compliance Assistant',
      description: 'Discover funding opportunities and ensure regulatory compliance across all categories.',
      path: '/ai-features/funding',
      color: 'from-green-500 to-emerald-500',
      testId: 'feature-funding'
    },
    {
      icon: TrendingUp,
      title: 'Business DNA Engine',
      description: 'Create unique business profile for personalized recommendations and benchmark comparisons.',
      path: '/ai-features/dna',
      color: 'from-red-500 to-pink-500',
      testId: 'feature-dna'
    },
    {
      icon: Sparkles,
      title: 'Community Intelligence Hub',
      description: 'Access trending insights, expert directory, and community-driven intelligence.',
      path: '/ai-features/community',
      color: 'from-indigo-500 to-purple-500',
      testId: 'feature-community'
    }
  ];

  return (
    <div className="p-6 sm:p-8 animate-fade-in" data-testid="ai-features-page">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          ✨ AI Features
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore our advanced AI-powered features to transform your business operations.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <Link
              key={idx}
              to={feature.path}
              data-testid={feature.testId}
              className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {feature.description}
              </p>
              
              <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:gap-2 transition-all">
                <span>Explore</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Info Banner */}
      <div className="mt-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Powered by GPT-5</h2>
        <p className="text-blue-50 mb-4">
          All AI features are powered by OpenAI's latest GPT-5 model for the most accurate and intelligent insights.
        </p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-blue-50">All systems operational</span>
        </div>
      </div>
    </div>
  );
};

export default AIFeatures;