import React from 'react';

const Sales = () => {
  return (
    <div className="p-6 sm:p-8 animate-fade-in" data-testid="sales-page">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        📊 Sales
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Sales pipeline and lead management.
      </p>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500">Sales module coming soon...</p>
      </div>
    </div>
  );
};

export default Sales;