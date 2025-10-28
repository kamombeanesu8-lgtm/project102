import React, { useState } from 'react';
import axiosInstance from '../utils/axios';
import { useAuth } from '../contexts/AuthContext';
import { Brain, Send, TrendingUp, Users } from 'lucide-react';
import { toast } from 'sonner';

const EmotionAI = () => {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeEmotion = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/emotion/analyze', {
        user_id: user.id,
        text: text,
        context: null
      });
      
      setAnalysis(response.data);
      toast.success('Emotion analysis complete!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to analyze emotion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 animate-fade-in" data-testid="emotion-ai-page">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🧠 Emotion & Team Performance AI
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Analyze team emotions and track performance to prevent burnout.
        </p>

        {/* Input Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Analyze Text for Emotions
          </h3>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to analyze emotions (e.g., team communication, feedback, etc.)..."
            className="w-full h-32 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            data-testid="emotion-text-input"
          />
          <button
            onClick={analyzeEmotion}
            disabled={loading}
            className="mt-4 pill-button bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            data-testid="analyze-emotion-btn"
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Analyze Emotion</span>
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {analysis && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 animate-fade-in" data-testid="emotion-results">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Analysis Results
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {Object.entries(analysis.emotions).map(([emotion, score]) => (
                <div key={emotion} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium capitalize text-gray-900 dark:text-white">
                      {emotion}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {(score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${score * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-gray-900 dark:text-white">
                <strong>Dominant Emotion:</strong> {analysis.dominant_emotion}
              </p>
              <p className="text-sm text-gray-900 dark:text-white mt-2">
                <strong>Confidence:</strong> {(analysis.confidence * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionAI;