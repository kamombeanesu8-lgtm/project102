import React from 'react';

const CommunityHub = () => {
  return (
    <div className="p-6 sm:p-8 animate-fade-in" data-testid="community-page">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        ✨ Community Intelligence Hub
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Access trending insights and community-driven intelligence.
      </p>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500">Feature implementation in progress...</p>
      </div>
    </div>
  );
};

export default CommunityHub;