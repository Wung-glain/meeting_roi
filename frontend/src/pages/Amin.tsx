import React, { useState, useEffect, useCallback } from 'react';
import {
  Home, BarChart2, DollarSign, Users, Settings, LogOut, Menu, X,
  Calendar, Layers, FileText, CreditCard,  Moon, Sun, 
  Bell, 
 
 Key// Added Key, Loader2, and Brain import
} from 'lucide-react';

import {useAuth} from "@/context/AuthContext";
import APIIntegrationManagement from './admin/APIintegration';
import MeetingCostForecastTool from './admin/MeetingCostManager';
import AnalyticsDashboard from './admin/AnalyticDashboard';
import { mockMeetings } from '@/utils/generate_meetings';
import AIEngineInsights from './admin/AIEngineInsights';
import MeetingExplorer from './admin/MeetingExplorer';
import BillingSubscription from './admin/BillingSubscription';
import TeamDepartmentOverview from './admin/TeamDepartmentOverview';
import NotificationsAlerts from './admin/Notification';
import SettingsAccessControl from './admin/SettingsAccessControl';
import BulkUploadSection from './admin/BulkUpload';
import CustomReportBuilder from './admin/CustomReportBuilder';

// --- Main Admin Dashboard Component 
const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {user} = useAuth();
 const [currentPage, setCurrentPage] = useState('dashboard'); // State to manage current page/section
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Determine the current theme icon component
  const CurrentThemeIcon = isDarkMode ? Sun : Moon;

  const renderPage = useCallback(() => {
    switch (currentPage) {
      case 'dashboard':
        return <AnalyticsDashboard meetings={mockMeetings} isDarkMode={isDarkMode} />;
      case 'meetings':
        return <MeetingExplorer meetings={mockMeetings} isDarkMode={isDarkMode} />;
      case 'analytics':
        return <AIEngineInsights isDarkMode={isDarkMode} />; // AI Insights is now part of Analytics
      case 'upload':
        return <BulkUploadSection />;
      case 'reports':
        return <CustomReportBuilder />;
      case 'teams':
        return <TeamDepartmentOverview meetings={mockMeetings} />;
      case 'api-integrations':
        return <APIIntegrationManagement />;
      case 'cost-forecast':
        return <MeetingCostForecastTool />;
      case 'notifications':
        return <NotificationsAlerts />;
      case 'billing':
        return <BillingSubscription />;
      case 'settings':
        return <SettingsAccessControl />;
      default:
        return <AnalyticsDashboard meetings={mockMeetings} isDarkMode={isDarkMode} />;
    }
  }, [currentPage, isDarkMode]); // Re-render page if currentPage or isDarkMode changes

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 font-inter transition-colors duration-300">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out border-r border-gray-200 dark:border-gray-700`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-400">MeetingROI</h2>
        </div>
        <nav className="mt-1 space-y-2 px-1">
          <a href="#" onClick={() => setCurrentPage('dashboard')} className={`flex items-center p-3 rounded-lg ${currentPage === 'dashboard' ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-100' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'} text-sm transition-colors duration-200`}>
            <Home size={20} className="mr-3" /> Dashboard
          </a>
          <a href="#" onClick={() => setCurrentPage('meetings')} className={`flex items-center p-3 rounded-lg ${currentPage === 'meetings' ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-100' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'} text-sm transition-colors duration-200`}>
            <Layers size={20} className="mr-3" />Meeting Explorer
          </a>
          <a href="#" onClick={() => setCurrentPage('analytics')} className={`flex items-center p-3 rounded-lg ${currentPage === 'analytics' ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-100' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'} text-sm transition-colors duration-200`}>
            <BarChart2 size={20} className="mr-3" /> AI Insights & Analytics
          </a>
          <a href="#" onClick={() => setCurrentPage('reports')} className={`flex items-center p-3 rounded-lg ${currentPage === 'reports' ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-100' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'} text-sm transition-colors duration-200`}>
            <FileText size={20} className="mr-3" /> Custom Reports
          </a>
          <a href="#" onClick={() => setCurrentPage('teams')} className={`flex items-center p-3 rounded-lg ${currentPage === 'teams' ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-100' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'} text-sm transition-colors duration-200`}>
            <Users size={20} className="mr-3" /> Teams & Departments
          </a>
          <a href="#" onClick={() => setCurrentPage('api-integrations')} className={`flex items-center p-3 rounded-lg ${currentPage === 'api-integrations' ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-100' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'} text-sm transition-colors duration-200`}>
            <Key size={20} className="mr-3" /> API & Integrations
          </a>
          <a href="#" onClick={() => setCurrentPage('cost-forecast')} className={`flex items-center p-3 rounded-lg ${currentPage === 'cost-forecast' ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-100' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'} text-sm transition-colors duration-200`}>
            <DollarSign size={20} className="mr-3" /> Cost Forecast
          </a>
          <a href="#" onClick={() => setCurrentPage('notifications')} className={`flex items-center p-3 rounded-lg ${currentPage === 'notifications' ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-100' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'} text-sm transition-colors duration-200`}>
            <Bell size={20} className="mr-3" /> Notifications
          </a>
          <a href="#" onClick={() => setCurrentPage('billing')} className={`flex items-center p-3 rounded-lg ${currentPage === 'billing' ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-100' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'} text-sm transition-colors duration-200`}>
            <CreditCard size={20} className="mr-3" /> Billing
          </a>
          <a href="#" onClick={() => setCurrentPage('settings')} className={`flex items-center p-3 rounded-lg ${currentPage === 'settings' ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-100' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'} text-sm transition-colors duration-200`}>
            <Settings size={20} className="mr-3" /> Settings & Access
          </a>
        </nav>
        <div className="absolute bottom-6 w-full px-1 ml-[80%]">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-[40px] flex items-center justify-center p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 font-medium transition-colors duration-200"
          >
            <CurrentThemeIcon size={25} className={`mr-1 ${isDarkMode ? 'text-yellow-500' : 'text-blue-500'}`} />
            {isDarkMode ? '' : ''}
          </button>
          
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header */}
        <header className="bg-white overflow-x-hidden dark:bg-gray-800 shadow-sm p-4 flex items-center justify-between md:justify-end border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 md:hidden">{currentPage.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 dark:text-gray-200 font-medium">{user?.full_name}</span>
            <div className="w-10 h-10 rounded-full bg-indigo-200 dark:bg-indigo-700 flex items-center justify-center text-indigo-800 dark:text-indigo-200 font-bold">{(user?.full_name || "").charAt(0).toUpperCase()}</div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-x-hidden bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;
