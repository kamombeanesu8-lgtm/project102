import React from 'react';

const Integrations = () => {
  return (
    <div className="p-6 sm:p-8 animate-fade-in" data-testid="integrations-page">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        🔌 Integrations
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Connect external tools and services.
      </p>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500">Integrations module coming soon...</p>
      </div>
    </div>
  );
};

export default Integrations;