// APICredentials.tsx
import React, { useState, useEffect } from 'react';
import {
  Key,
  PlusCircle,
  Copy,
  Trash2,
  ArrowLeft,
  Info,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.tsx'; // Import from your AuthContext

// Basic Button component
const Button = ({
  children,
  onClick,
  variant = 'default',
  className = '',
  type = 'button',
  disabled = false
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'destructive' | 'ghost';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}) => {
  let baseClasses =
    'px-4 py-2 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  if (variant === 'default') {
    baseClasses += ' bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500';
  } else if (variant === 'outline') {
    baseClasses += ' border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-400';
  } else if (variant === 'destructive') {
    baseClasses += ' bg-red-600 hover:bg-red-700 text-white focus:ring-red-500';
  } else if (variant === 'ghost') {
    baseClasses += ' text-gray-700 hover:bg-gray-100';
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

// API Key type
interface ApiKey {
  id: string;
  key: string;
  created: string;
  lastUsed: string;
  status: 'active' | 'revoked';
}

// Mock keys
const mockApiKeys: ApiKey[] = [
  {
    id: 'key_abc123',
    key: 'sk-xxxxxxxxxxxxxxxxxxxxxxxabc123',
    created: '2024-01-01',
    lastUsed: '2024-07-10',
    status: 'active'
  },
  {
    id: 'key_def456',
    key: 'sk-xxxxxxxxxxxxxxxxxxxxxxxdef456',
    created: '2023-11-15',
    lastUsed: '2024-03-20',
    status: 'active'
  },
  {
    id: 'key_ghi789',
    key: 'sk-xxxxxxxxxxxxxxxxxxxxxxxyghi789',
    created: '2023-09-01',
    lastUsed: '2023-10-05',
    status: 'revoked'
  }
];

const APICredentials: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const generateNewApiKey = () => {
    const newKey: ApiKey = {
      id: `key_${Math.random().toString(36).substring(2, 10)}`,
      key: `sk-${Math.random().toString(36).substring(2, 25)}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      status: 'active'
    };
    setApiKeys((prev) => [...prev, newKey]);
    alert('New API Key generated! Copy it now — it won’t be shown again.');
  };

  const revokeApiKey = (id: string) => {
    if (window.confirm('Are you sure you want to revoke this API key?')) {
      setApiKeys((prev) =>
        prev.map((key) => (key.id === id ? { ...key, status: 'revoked' } : key))
      );
      alert('API Key revoked.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => alert('Copied to clipboard!'),
      () => alert('Failed to copy')
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-700">Loading API credentials or redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-inter text-gray-800 antialiased py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-4xl font-extrabold text-gray-900">API Credentials</h1>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg space-y-10">
          {/* API Keys */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold flex items-center">
              <Key size={28} className="mr-3 text-purple-600" /> Your API Keys
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="text-gray-700 mb-4">
                Manage your API keys for accessing MeetingROI programmatically.
              </p>
              <Button onClick={generateNewApiKey} className="w-full flex items-center justify-center mb-6">
                <PlusCircle size={18} className="mr-2" /> Generate New API Key
              </Button>

              {apiKeys.length ? (
                <div className="space-y-4">
                  {apiKeys.map((key) => (
                    <div
                      key={key.id}
                      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center"
                    >
                      <div className="flex-1 mb-3 sm:mb-0">
                        <p className="text-sm font-medium text-gray-500">Key ID: {key.id}</p>
                        <div className="flex items-center mt-1">
                          <code className="bg-gray-100 text-gray-800 p-1 rounded font-mono text-sm break-all">
                            {key.key}
                          </code>
                          <Button variant="ghost" onClick={() => copyToClipboard(key.key)} className="ml-2 p-1 h-auto">
                            <Copy size={16} className="text-gray-500 hover:text-blue-600" />
                          </Button>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                          Created: {key.created} | Last Used: {key.lastUsed}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            key.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {key.status}
                        </span>
                        {key.status === 'active' ? (
                          <Button
                            variant="destructive"
                            onClick={() => revokeApiKey(key.id)}
                            className="flex items-center text-xs px-3 py-1"
                          >
                            <Trash2 size={14} className="mr-1" /> Revoke
                          </Button>
                        ) : (
                          <Button variant="outline" disabled className="flex items-center text-xs px-3 py-1">
                            <RefreshCw size={14} className="mr-1" /> Revoked
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600">No API keys found. Generate one to begin.</p>
              )}
            </div>
          </div>

          {/* Documentation */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold flex items-center">
              <Info size={28} className="mr-3 text-gray-600" /> API Documentation
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="text-gray-700 mb-4">
                Read our API documentation to integrate MeetingROI into your tools.
              </p>
              <a href="/api" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full flex items-center justify-center">
                  View API Docs <ExternalLink size={16} className="ml-2" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APICredentials;
