import React from 'react';

const Analytics = () => {
  return (
    <div className="p-6 sm:p-8 animate-fade-in" data-testid="analytics-page">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        📊 Analytics
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Business intelligence and insights.
      </p>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500">Analytics module coming soon...</p>
      </div>
    </div>
  );
};

export default Analytics;