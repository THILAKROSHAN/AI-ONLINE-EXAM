import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AIGenerator from '../../components/ai/AIGenerator';
import AIConfig from '../../components/ai/AIConfig';
import { ROLES } from '../../utils/constants/roles';

const AIGeneratorPage = () => {
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState('generator');

  const tabs = [
    { id: 'generator', label: 'Question Generator' },
    { id: 'config', label: 'AI Configuration' },
  ];

  const canConfigure = userData?.role === ROLES.SUPER_ADMIN || 
                       userData?.role === ROLES.ORGANIZATION_ADMIN;

  return (
    <div className="container-custom py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          AI Question Generator
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Generate questions using Google's Gemini AI
        </p>
      </div>

      {canConfigure && (
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary-600 border-b-2 border-primary-600 dark:text-primary-400 dark:border-primary-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'generator' && <AIGenerator />}
      {activeTab === 'config' && canConfigure && <AIConfig />}
    </div>
  );
};

export default AIGeneratorPage;