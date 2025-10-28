import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Zap,
  Brain,
  FileText,
  Globe,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, activitiesRes] = await Promise.all([
        axiosInstance.get('/dashboard/stats'),
        axiosInstance.get('/dashboard/activities')
      ]);
      
      setStats(statsRes.data);
      setActivities(activitiesRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  const revenueProgress = stats ? (stats.monthly_revenue / stats.revenue_target) * 100 : 0;

  return (
    <div className="p-6 sm:p-8 animate-fade-in" data-testid="dashboard-page">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's what's happening with your business today.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stat-card" data-testid="metric-revenue">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm text-green-600 font-medium">+12.5%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            ${stats?.monthly_revenue?.toLocaleString() || '0'}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Monthly Revenue</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${revenueProgress}%` }}></div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {revenueProgress.toFixed(0)}% of ${stats?.revenue_target?.toLocaleString()} goal
          </p>
        </div>

        <div className="stat-card" data-testid="metric-customers">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm text-green-600 font-medium">+8.2%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {stats?.active_customers || 0}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Active Customers</p>
        </div>

        <div className="stat-card" data-testid="metric-growth">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm text-green-600 font-medium">Trending</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {stats?.growth_rate || 0}%
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Growth Rate</p>
        </div>

        <div className="stat-card" data-testid="metric-ai-efficiency">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
              <Zap className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <span className="text-sm text-green-600 font-medium">Excellent</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {stats?.ai_efficiency || 0}%
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">AI Efficiency</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* AI Business Insights */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            🤖 AI Business Insights
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                Revenue Optimization Opportunity
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Consider upselling to top 20% of customers - potential 15% revenue increase
              </p>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                Customer Churn Risk Alert
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                3 key accounts showing reduced engagement - immediate action recommended
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                Market Expansion Suggestion
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Healthcare sector shows 40% growth potential based on your capabilities
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-3">
            {activities.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white font-medium">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/ai-features/emotion"
            className="p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
            data-testid="quick-action-emotion-ai"
          >
            <Brain className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2" />
            <p className="font-medium text-gray-900 dark:text-white">Emotion AI</p>
          </Link>
          
          <Link
            to="/ai-features/persona"
            className="p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
            data-testid="quick-action-persona"
          >
            <Users className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2" />
            <p className="font-medium text-gray-900 dark:text-white">Generate Persona</p>
          </Link>
          
          <Link
            to="/ai-features/funding"
            className="p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
            data-testid="quick-action-funding"
          >
            <FileText className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2" />
            <p className="font-medium text-gray-900 dark:text-white">Find Funding</p>
          </Link>
          
          <Link
            to="/ai-features/community"
            className="p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
            data-testid="quick-action-community"
          >
            <Globe className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2" />
            <p className="font-medium text-gray-900 dark:text-white">Community Intel</p>
          </Link>
        </div>
      </div>

      {/* Business Goals */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Business Goals
        </h2>
        <div className="space-y-4">
          {[
            { name: 'Monthly Revenue Target', current: 145000, target: 200000 },
            { name: 'Customer Acquisition', current: 324, target: 500 },
            { name: 'Market Expansion', current: 2, target: 5 }
          ].map((goal, idx) => {
            const progress = (goal.current / goal.target) * 100;
            return (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {goal.name}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {goal.current.toLocaleString()} / {goal.target.toLocaleString()}
                  </span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;