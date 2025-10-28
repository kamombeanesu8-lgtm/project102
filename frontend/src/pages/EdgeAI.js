import React from 'react';

const EdgeAI = () => {
  return (
    <div className="p-6 sm:p-8 animate-fade-in" data-testid="edge-ai-page">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        ⚡ Offline AI (Edge Mode)
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Run AI models locally for privacy and offline capabilities.
      </p>
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-8 text-center">
        <p className="text-yellow-800 dark:text-yellow-200 font-medium mb-2">
          🚧 Edge AI is currently mocked
        </p>
        <p className="text-yellow-700 dark:text-yellow-300 text-sm">
          This feature uses cloud AI for now. Full edge computing coming soon!
        </p>
      </div>
    </div>
  );
};

export default EdgeAI;