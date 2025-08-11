import { useState, useEffect , useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { StatCard } from "@/components/StatCard";
import { fetchStats, OverviewData, UserUsage} from "@/utils/fetchStats";
import ProductivityPieChart from "@/components/ProductivityChart";
import { formatCurrency } from "@/utils/currencyFormater";
import { mockMeetings } from "@/utils/generate_meetings";

import {
  DollarSign,BarChart3,  ThumbsUp, TrendingUp,User, Save, 
 // Added Key, Loader2, and Brain import
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart as RechartsLineChart, Line
} from 'recharts';

// --- Dashboard Sections ---

// 1. Advanced Meeting Analytics Dashboard
const AnalyticsDashboard = ({ meetings, isDarkMode }) => {
  const {user, loading} = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);

  const [timeRange, setTimeRange] = useState('all'); // 'all', 'month', 'quarter', 'year'
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedMeetingType, setSelectedMeetingType] = useState('All');
  const [overview, setOverview] = useState<OverviewData>({
    total_estimated_cost: 0,
    total_meeting_analyzed: 0,
    total_roi: 0,
    total_estimated_value_gain: 0,
    total_productive_meetings: 0,
  });
  const [userD, setUserD] = useState<UserUsage>({
    predictions_used: 0,
    max_predictions_per_month: 0,
  });


  const filteredMeetings = useMemo(() => {
    let filtered = meetings;
    if (timeRange !== 'all') {
      const now = new Date();
      filtered = filtered.filter(m => {
        const meetingDate = new Date(m.date);
        if (timeRange === 'month') return meetingDate.getMonth() === now.getMonth() && meetingDate.getFullYear() === now.getFullYear();
        if (timeRange === 'quarter') {
          const currentQuarter = Math.floor(now.getMonth() / 3);
          const meetingQuarter = Math.floor(meetingDate.getMonth() / 3);
          return meetingQuarter === currentQuarter && meetingDate.getFullYear() === now.getFullYear();
        }
        if (timeRange === 'year') return meetingDate.getFullYear() === now.getFullYear();
        return true;
      });
    }
    if (selectedDepartment !== 'All') {
      filtered = filtered.filter(m => m.department === selectedDepartment);
    }
    if (selectedMeetingType !== 'All') {
      filtered = filtered.filter(m => m.type === selectedMeetingType);
    }
    return filtered;
  }, [meetings, timeRange, selectedDepartment, selectedMeetingType]);

  // KPIs
  const totalCost = filteredMeetings.reduce((sum, m) => sum + m.estimatedCost, 0);
  const productiveMeetingsCount = filteredMeetings.filter(m => m.isProductive === 'Productive').length;
  const totalFilteredMeetings = filteredMeetings.length;
  const productivityRate = totalFilteredMeetings > 0 ? ((productiveMeetingsCount / totalFilteredMeetings) * 100).toFixed(0) : 0;
  const avgROI = overview.total_meeting_analyzed > 0 
  ? (overview.total_roi / overview.total_meeting_analyzed).toFixed(2)
  : 0;
  // Mock monthly savings - in a real app, this would be calculated from improvements
  const monthlySavings = totalCost > 0 ? (totalCost * 0.15) : 0; // Removed .toFixed(2) here

  // Chart Data
  const meetingsByType = filteredMeetings.reduce((acc, meeting) => {
    acc[meeting.type] = (acc[meeting.type] || 0) + 1;
    return acc;
  }, {});
  const meetingsByDept = filteredMeetings.reduce((acc, meeting) => {
    acc[meeting.department] = (acc[meeting.department] || 0) + 1;
    return acc;
  }, {});
  // productivityData is now calculated inside ProductivityPieChart component
  const productivityColors = ['#4CAF50', '#FF5722'];

// Cost over time (mock monthly data)
const costOverTimeData = useMemo(() => {
  const monthlyCosts: Record<string, number> = {};

  filteredMeetings.forEach(m => {
    const monthYear = new Date(m.date).toLocaleString('en-US', { month: 'short', year: 'numeric' });
    monthlyCosts[monthYear] = (monthlyCosts[monthYear] || 0) + m.estimatedCost;
  });

  return Object.keys(monthlyCosts)
    .map(key => ({
      name: key,
      Cost: parseFloat(monthlyCosts[key].toFixed(2)),
      date: new Date(`${key} 1`) // Add a real date value like "Jul 2025 1"
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime()); // Sort by actual timestamp
}, [filteredMeetings]);


  const allDepartments = useMemo(() => ['All', ...new Set(mockMeetings.map(m => m.department))].sort(), []);
  const allMeetingTypes = useMemo(() => ['All', ...new Set(mockMeetings.map(m => m.type))].sort(), []);
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
    if (!user.email_verified) return navigate("/verify-email");
    if (user.subscription_plan === "free") return navigate("/predict");

    const loadStats = async () => {
      try {
        const { overview, userUsage } = await fetchStats(user.user_id);
        setOverview(overview);
        setUserD(userUsage);
        console.log(overview);
       
      } catch (err) {
        // Optional: show toast
      } finally {
        setChecking(false);
      }
    };

    loadStats();
  }, [user, loading, navigate]);
  const stats = {
    predictionsUsed: userD.predictions_used,
    monthlyLimit: userD.max_predictions_per_month,
    costSavings: overview.total_estimated_value_gain,
  };
  const prodMeetings = (overview.total_productive_meetings == 0) ? 0 : (overview.total_productive_meetings/overview.total_meeting_analyzed) * 100 
  if (checking) {
    return <div>Loading dashboard...</div>;
  }
  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Advanced Meeting Analytics</h2>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300 flex items-center space-x-4">
                <User size={48} className="text-blue-500 dark:text-blue-400" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Welcome, {user?.full_name}!</h3>
                  <p className="text-gray-600 dark:text-gray-400">Manage your MeetingROI platform effectively.</p>
                </div>
              </div>
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300 grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="timeRange" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time Range</label>
          <select
            id="timeRange"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="month">Current Month</option>
            <option value="quarter">Current Quarter</option>
            <option value="year">Current Year</option>
          </select>
        </div>
        <div>
          <label htmlFor="departmentFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
          <select
            id="departmentFilter"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            {allDepartments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="meetingTypeFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Meeting Type</label>
          <select
            id="meetingTypeFilter"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            value={selectedMeetingType}
            onChange={(e) => setSelectedMeetingType(e.target.value)}
          >
            {allMeetingTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">

            <StatCard
              icon={<TrendingUp />}
              title="Predictions Used"
              value={`${stats.predictionsUsed}/${stats.monthlyLimit}`}
              colorClass="text-green-500"
              description={`${((stats.predictionsUsed / stats.monthlyLimit) * 100).toFixed(0)}% of monthly limit`}
            />
            <StatCard
              icon={<DollarSign />}
              title="Cost Savings"
              value={`${stats.costSavings.toLocaleString()}`}
              colorClass="text-green-500"
              description="Estimated Value gain from meetings based on meeting input data"
            />
            <StatCard
              icon={<BarChart3 />}
              title="Meetings Analyzed"
              value={stats.predictionsUsed}
              colorClass="text-green-500"
              description="Total Meetings Analyzed this Month"
            />
        <StatCard
          icon={<TrendingUp />}
          title="ROI"
          value={`${overview.total_roi.toLocaleString()}`}
          colorClass="text-blue-500"
          description="Total return on investment"
        />
        <StatCard
          icon={<TrendingUp />}
          title="Average ROI"
          value={`${avgROI}`}
          colorClass="text-purple-500"
          description="Based on identified inefficiencies"
        />
        <StatCard
          icon={<DollarSign />}
          title="Total Meeting Cost"
          value={`${overview.total_estimated_cost.toLocaleString()}`}
          colorClass="text-red-500"
          description="Total Cost of Meetings"
        />
        <StatCard
          icon={<ThumbsUp />}
          title="Productive Meetings %"
          value={`${prodMeetings.toFixed(2)}%`}
          colorClass="text-green-500"
          description="Based on identified inefficiencies"
        />
        <StatCard
          icon={<Save />}
          title="Est. Monthly Savings"
          value={formatCurrency(monthlySavings)}
          colorClass="text-teal-500"
          description="Based on identified inefficiencies"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart: Meetings by Type */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Meetings by Type</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Object.keys(meetingsByType).map(type => ({ name: type, Meetings: meetingsByType[type] }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" className="dark:stroke-gray-700" />
                <XAxis dataKey="name" stroke="#6b7280" className="dark:stroke-gray-300" />
                <YAxis stroke="#6b7280" className="dark:stroke-gray-300" />
                <Tooltip
                  contentStyle={{ backgroundColor: isDarkMode ? '#4a5568' : '#ffffff', borderColor: isDarkMode ? '#4a5568' : '#e2e8f0', borderRadius: '8px', color: isDarkMode ? '#e2e8f0' : '#333333' }}
                  itemStyle={{ color: isDarkMode ? '#e2e8f0' : '#333333' }}
                  labelStyle={{ color: isDarkMode ? '#e2e8f0' : '#333333' }}
                />
                <Legend />
                <Bar dataKey="Meetings" fill="#4f46e5" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Meetings by Department */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Meetings by Department</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Object.keys(meetingsByDept).map(dept => ({ name: dept, Meetings: meetingsByDept[dept] }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" className="dark:stroke-gray-700" />
                <XAxis dataKey="name" stroke="#6b7280" className="dark:stroke-gray-300" />
                <YAxis stroke="#6b7280" className="dark:stroke-gray-300" />
                <Tooltip
                  contentStyle={{ backgroundColor: isDarkMode ? '#4a5568' : '#ffffff', borderColor: isDarkMode ? '#4a5568' : '#e2e8f0', borderRadius: '8px', color: isDarkMode ? '#e2e8f0' : '#333333' }}
                  itemStyle={{ color: isDarkMode ? '#e2e8f0' : '#333333' }}
                  labelStyle={{ color: isDarkMode ? '#e2e8f0' : '#333333' }}
                />
                <Legend />
                <Bar dataKey="Meetings" fill="#28a745" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart: Cost Over Time */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300 lg:col-span-2">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Meeting Cost Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={costOverTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" className="dark:stroke-gray-700" />
                <XAxis dataKey="name" stroke="#6b7280" className="dark:stroke-gray-300" />
                <YAxis stroke="#6b7280" className="dark:stroke-gray-300" />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: isDarkMode ? '#4a5568' : '#ffffff', borderColor: isDarkMode ? '#4a5568' : '#e2e8f0', borderRadius: '8px', color: isDarkMode ? '#e2e8f0' : '#333333' }}
                  itemStyle={{ color: isDarkMode ? '#e2e8f0' : '#333333' }}
                  labelStyle={{ color: isDarkMode ? '#e2e8f0' : '#333333' }}
                />
                <Legend />
                <Line type="monotone" dataKey="Cost" stroke="#ff5722" activeDot={{ r: 8 }} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Productivity Distribution Pie Chart */}
        <ProductivityPieChart meetings={filteredMeetings} isDarkMode={isDarkMode} />
      </div>
    </>
  );
};


export default AnalyticsDashboard;