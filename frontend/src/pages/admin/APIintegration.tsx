import { useState } from 'react';
import { Plus } from "lucide-react";



//API Key & Integration Management
const APIIntegrationManagement = () => {
  const [apiKeys, setApiKeys] = useState([
    { id: 'key_123abc', name: 'Main Application Key', created: '2024-01-15', lastUsed: '2025-07-10', status: 'Active' },
    { id: 'key_456def', name: 'Reporting Service Key', created: '2024-03-20', lastUsed: '2025-07-01', status: 'Active' },
    { id: 'key_789ghi', name: 'Development Sandbox', created: '2024-05-01', lastUsed: 'N/A', status: 'Revoked' },
  ]);

  const generateNewKey = () => {
    const newKey = `key_${Math.random().toString(36).substring(2, 10)}`;
    setApiKeys(prev => [...prev, {
      id: newKey,
      name: `New Key ${prev.length + 1}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      status: 'Active'
    }]);
    alert(`New API Key generated: ${newKey}`);
    // In a real app: API call to backend to generate and store key
  };

  const revokeKey = (id) => {
    if (window.confirm(`Are you sure you want to revoke key ${id}?`)) {
      setApiKeys(prev => prev.map(key => key.id === id ? { ...key, status: 'Revoked' } : key));
      alert(`Key ${id} revoked. (Mock)`);
      // In a real app: API call to backend to revoke key
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">API Key & Integration Management</h2>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Your API Keys</h3>
        <button onClick={generateNewKey} className="mb-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
          <Plus size={20} className="mr-2" /> Generate New API Key
        </button>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Key ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created On</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Used</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {apiKeys.map(key => (
                <tr key={key.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-gray-200">{key.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{key.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{key.created}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{key.lastUsed}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      key.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100'
                    }`}>
                      {key.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {key.status === 'Active' && (
                      <button
                        onClick={() => revokeKey(key.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 mt-10">Integrations</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300 text-center">
          <img src="https://placehold.co/60x60/4285F4/FFFFFF/png?text=Google" alt="Google Calendar" className="mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Google Calendar</h4>
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">Sync meeting details for automatic analysis.</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">Connect</button>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300 text-center">
          <img src="https://placehold.co/60x60/0078D4/FFFFFF/png?text=Outlook" alt="Outlook" className="mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Outlook Calendar</h4>
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">Integrate with your Microsoft ecosystem.</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">Connect</button>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300 text-center">
          <img src="https://placehold.co/60x60/4A154B/FFFFFF/png?text=Slack" alt="Slack" className="mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Slack</h4>
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">Receive notifications and insights directly in Slack.</p>
          <button className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg">Connect</button>
        </div>
      </div>
    </>
  );
};

export default APIIntegrationManagement;