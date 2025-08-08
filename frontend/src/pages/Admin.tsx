import React, { useState, useEffect, useCallback } from 'react';
import {
  Home, BarChart2, DollarSign, Users, Settings, Menu, X,
  Layers, FileText, CreditCard, Moon, Sun, Bell, Key
} from 'lucide-react';

import { useAuth } from "@/context/AuthContext";
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
import Prediction from './Prediction'; // Assuming this is for a general prediction page
import MakePrediction from './admin/MakePrediction'; // Assuming this is an admin-specific prediction tool

// A generic skeleton component to display while content loads
const PageSkeleton = ({ pageKey }) => {
  // Common shimmering effect styles
  const shimmerStyles = `
    @keyframes shimmer {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }
    .shimmer-effect {
      background: linear-gradient(90deg, 
        rgba(255, 255, 255, 0) 0%, 
        rgba(255, 255, 255, 0.2) 20%, 
        rgba(255, 255, 255, 0.5) 60%, 
        rgba(255, 255, 255, 0) 100%
      );
      animation: shimmer 1.5s infinite linear;
      pointer-events: none;
    }
    .dark .shimmer-effect {
      background: linear-gradient(90deg, 
        rgba(255, 255, 255, 0) 0%, 
        rgba(255, 255, 255, 0.05) 20%, 
        rgba(255, 255, 255, 0.1) 60%, 
        rgba(255, 255, 255, 0) 100%
      );
    }
  `;

  const renderSpecificSkeleton = () => {
    switch (pageKey) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-6 relative z-20"></div>
            
            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg relative z-20"></div>
              ))}
            </div>

            {/* Chart Area Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg relative z-20"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg relative z-20"></div>
            </div>

            {/* Recent Activity/Table Skeleton */}
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg relative z-20"></div>
          </div>
        );
      case 'meetings':
        return (
          <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-6 relative z-20"></div>

            {/* Filters and Search Section Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="col-span-full h-10 bg-gray-300 dark:bg-gray-700 rounded relative z-20"></div>
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded relative z-20"></div>
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded relative z-20"></div>
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded relative z-20"></div>
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded relative z-20"></div>
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded relative z-20"></div>
            </div>

            {/* Table Skeleton */}
            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 space-y-3 relative z-20">
              <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded w-full"></div> {/* Table Header */}
              {[...Array(7)].map((_, i) => ( // More rows for a table
                <div key={i} className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
              ))}
            </div>

            {/* Pagination Skeleton */}
            <div className="flex justify-center items-center space-x-2 mt-6 relative z-20">
              <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            </div>
          </div>
        );
      case 'prediction':
      case 'analytics':
      case 'upload':
      case 'reports':
      case 'teams':
      case 'api-integrations':
      case 'cost-forecast':
      case 'notifications':
      case 'billing':
      case 'settings':
      default:
        // Generic skeleton for other pages
        return (
          <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-6 relative z-20"></div>
            
            {/* Content Blocks Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg relative z-20"></div>
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg relative z-20"></div>
            </div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg relative z-20"></div>
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg relative z-20"></div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 rounded-lg bg-white dark:bg-gray-800 shadow-md relative overflow-hidden">
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 shimmer-effect z-10"></div>
      {renderSpecificSkeleton()}
      <style>{shimmerStyles}</style> {/* Apply shimmer styles */}
    </div>
  );
};


const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showContent, setShowContent] = useState(true); // Controls opacity of content
  const [loadingPage, setLoadingPage] = useState(false); // New state for skeleton loading
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
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

  const CurrentThemeIcon = isDarkMode ? Sun : Moon;

  // Render the content page based on currentPage
  const renderPage = useCallback(() => {
    switch (currentPage) {
      case 'dashboard':
        return <AnalyticsDashboard meetings={mockMeetings} isDarkMode={isDarkMode} />;
      case 'prediction':
        return <MakePrediction />; // Assuming MakePrediction is the correct component for 'prediction'
      case 'meetings':
        return <MeetingExplorer meetings={mockMeetings} isDarkMode={isDarkMode} />;
      case 'analytics':
        return <AIEngineInsights isDarkMode={isDarkMode} />;
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
  }, [currentPage, isDarkMode]);

  // Handles navigation with smooth hide/show animation of content and skeleton loading
  const handleNavClick = (pageKey: string) => {

    setIsSidebarOpen(false); // Close sidebar on mobile
    
    setLoadingPage(true); // Immediately show skeleton

    // After a short delay (300ms) for the old content to fade out,
    // switch the page content and then fade in the new content.
    setTimeout(() => {
      setCurrentPage(pageKey);
      // A small additional delay to ensure the new component has mounted
      // before the skeleton is hidden and content is shown.
      setTimeout(() => {
        setLoadingPage(false); // Hide skeleton
        setShowContent(true); // Show new content
      }, 100); // This delay can be adjusted if content takes longer to render
    }, 300); // This delay controls how long the old content fades out
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 font-inter transition-colors duration-300">

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg z-50 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        transition-transform duration-300 ease-in-out border-r border-gray-200 dark:border-gray-700`}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-400">MeetingROI</h2>
        </div>

        <nav className="mt-1 space-y-2 px-1">
          {[
            { key: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
            { key: 'prediction', label: 'Prediction', icon: <BarChart2 size={20} /> },
            { key: 'meetings', label: 'Meeting Explorer', icon: <Layers size={20} /> },
            { key: 'analytics', label: 'AI Insights & Analytics', icon: <BarChart2 size={20} /> },
            { key: 'reports', label: 'Custom Reports', icon: <FileText size={20} /> },
            { key: 'teams', label: 'Teams & Departments', icon: <Users size={20} /> },
            { key: 'api-integrations', label: 'API & Integrations', icon: <Key size={20} /> },
            { key: 'cost-forecast', label: 'Cost Forecast', icon: <DollarSign size={20} /> },
            { key: 'notifications', label: 'Notifications', icon: <Bell size={20} /> },
            { key: 'billing', label: 'Billing', icon: <CreditCard size={20} /> },
            { key: 'settings', label: 'Settings & Access', icon: <Settings size={20} /> },
          ].map(({ key, label, icon }) => (
            <a
              key={key}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(key);
              }}
              className={`flex items-center p-3 rounded-lg
                ${currentPage === key
                  ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-100'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
                text-sm transition-colors duration-200`}
            >
              {React.cloneElement(icon, { className: 'mr-3' })} {label}
            </a>
          ))}
        </nav>

        <div className="absolute bottom-6 w-full px-1 ml-[80%]">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-[40px] flex items-center justify-center p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 font-medium transition-colors duration-200"
          >
            <CurrentThemeIcon size={25} className={`mr-1 ${isDarkMode ? 'text-yellow-500' : 'text-blue-500'}`} />
          </button>
        </div>
      </aside>

      {/* Main Content + Navbar */}
      <div className="flex-1 flex flex-col md:ml-64">

        {/* Sticky Navbar */}
        <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm p-4 flex items-center justify-between md:justify-end border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 md:hidden">
            {currentPage.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 dark:text-gray-200 font-medium">{user?.full_name}</span>
            <div className="w-10 h-10 rounded-full bg-indigo-200 dark:bg-indigo-700 flex items-center justify-center text-indigo-800 dark:text-indigo-200 font-bold">
              {(user?.full_name || "").charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Animated Content */}
        <main
          className={`flex-1 p-6 overflow-x-hidden bg-gray-100 dark:bg-gray-900 transition-colors duration-100
             ease-in-out // Increased duration for smoother fade
            ${showContent ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
          style={{ minHeight: 'calc(100vh - 64px)' }} // to keep full height minus navbar height approx.
        >
          {loadingPage ? <PageSkeleton pageKey={currentPage} /> : renderPage()}
        </main>
      </div>

      {/* Overlay when sidebar is open on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
