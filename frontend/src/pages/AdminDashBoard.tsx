import React, { useState, useEffect } from 'react';
import {
  Home,
  BarChart2,
  DollarSign,
  Users,
  Clock,
  ThumbsUp,
  TrendingUp,
  Settings,
  LogOut,
  Menu,
  X,
  Calendar,
  Layers,
  FileText,
  CreditCard,
  ChevronRight,
  ChevronLeft,
 
  Info,
  Moon,
  Sun,
  User, // Added User icon for profile
  UploadCloud, // Added UploadCloud for bulk upload
  PieChart // Added PieChart for analytics
} from 'lucide-react';
import {
  BarChart,
  
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart as RechartsPieChart, // Renamed to avoid conflict with Lucide icon
  Pie,
  Cell
} from 'recharts';
import { useAuth } from '@/context/AuthContext';

// --- Mock Data Generation ---
const generateMockMeetings = (count) => {
  const meetings = [];
  const meetingTypes = ['Stand-Up', 'Brainstorm', 'Planning', 'Client Call', 'Review', 'Strategy'];
  const departments = ['Engineering', 'Product', 'Marketing', 'Sales', 'HR', 'Finance'];
  const tools = ['Zoom', 'Google Meet', 'MS Teams', 'In-person'];

  for (let i = 0; i < count; i++) {
    const duration = Math.floor(Math.random() * (120 - 15 + 1)) + 15; // 15 to 120 minutes
    const attendees = Math.floor(Math.random() * (20 - 2 + 1)) + 2; // 2 to 20 attendees
    const avgSalary = Math.floor(Math.random() * (150000 - 50000 + 1)) + 50000;
    const estimatedCost = (duration / 60) * attendees * (avgSalary / (52 * 40)); // Simple cost calc
    const productivityScore = Math.floor(Math.random() * (100 - 40 + 1)) + 40; // 40 to 100
    const isProductive = productivityScore >= 70 ? 'Productive' : 'Not Productive';
    const date = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);

    meetings.push({
      id: `M${String(i + 1).padStart(4, '0')}`,
      title: `Meeting ${i + 1} - ${meetingTypes[Math.floor(Math.random() * meetingTypes.length)]}`,
      date: date.toISOString().split('T')[0],
      duration,
      attendees,
      estimatedCost: parseFloat(estimatedCost.toFixed(2)),
      productivityScore,
      isProductive,
      type: meetingTypes[Math.floor(Math.random() * meetings.length)], // Corrected index for meetingTypes
      department: departments[Math.floor(Math.random() * departments.length)],
      tool: tools[Math.floor(Math.random() * tools.length)],
    });
  }
  return meetings;
};

const mockMeetings = generateMockMeetings(100); // Generate 100 mock meetings

// --- Utility Functions ---
const formatCurrency = (amount) => `$${amount.toFixed(2)}`;

// --- Dashboard Components ---

// Overview Card Component
const StatCard = ({ icon, title, value, description, colorClass }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-center space-x-4 border border-gray-200 dark:border-gray-700 transition-colors duration-300`}>
    <div className={`p-3 rounded-full ${colorClass} bg-opacity-20`}>
      {React.cloneElement(icon, { size: 28, className: colorClass })}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</h3>
      {description && <p className="text-xs text-gray-400 dark:text-gray-500">{description}</p>}
    </div>
  </div>
);

// Recent Meetings Table
const RecentMeetingsTable = ({ meetings }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Recent Meetings</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Duration</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Attendees</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cost</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Productivity</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {meetings.slice(0, 10).map((meeting) => ( // Show last 10 meetings
            <tr key={meeting.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{meeting.title}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{meeting.date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{meeting.duration} min</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{meeting.attendees}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{formatCurrency(meeting.estimatedCost)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  meeting.isProductive === 'Productive' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100'
                }`}>
                  {meeting.isProductive}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Full Meetings List Page Component
const MeetingsListPage = ({ meetings }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const meetingsPerPage = 10;

  const indexOfLastMeeting = currentPage * meetingsPerPage;
  const indexOfFirstMeeting = indexOfLastMeeting - meetingsPerPage;
  const currentMeetings = meetings.slice(indexOfFirstMeeting, indexOfLastMeeting);

  const totalPages = Math.ceil(meetings.length / meetingsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">All Meetings</h3>
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Attendees</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cost</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Productivity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Department</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {currentMeetings.map((meeting) => (
              <tr key={meeting.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{meeting.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{meeting.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{meeting.duration} min</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{meeting.attendees}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{formatCurrency(meeting.estimatedCost)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    meeting.isProductive === 'Productive' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100'
                  }`}>
                    {meeting.isProductive}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{meeting.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{meeting.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          <ChevronLeft size={20} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={`px-4 py-2 rounded-lg font-medium ${
              currentPage === i + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

// Bulk Agenda File Upload Component
const BulkUploadSection = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
    setUploadStatus('');
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setUploadStatus('Please select files to upload.');
      return;
    }

    setUploadStatus('Uploading...');
    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('agenda_files', file); // 'agenda_files' should match your backend's expected field name
    });

    try {
      // Replace with your actual backend upload endpoint
      // Example: await axios.post('/api/upload-agendas', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      console.log('Simulating upload for:', selectedFiles.map(f => f.name));
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

      setUploadStatus(`Successfully uploaded ${selectedFiles.length} files.`);
      setSelectedFiles([]);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus('Upload failed. Please try again.');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
        <UploadCloud size={24} className="mr-2 text-purple-500" /> Bulk Agenda File Upload
      </h3>
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center mb-4 hover:border-indigo-500 transition-colors duration-200">
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="bulk-agenda-upload"
          accept=".pdf,.doc,.docx,.txt"
        />
        <label htmlFor="bulk-agenda-upload" className="cursor-pointer flex flex-col items-center">
          <UploadCloud size={48} className="text-gray-400 dark:text-gray-500 mb-2" />
          <p className="text-gray-600 dark:text-gray-400">Drag & drop files here, or click to browse</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">(PDF, DOCX, TXT - Max 5MB per file)</p>
        </label>
      </div>
      {selectedFiles.length > 0 && (
        <div className="mb-4">
          <p className="text-gray-700 dark:text-gray-200 font-medium mb-2">Selected Files:</p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 max-h-40 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <li key={index} className="flex items-center justify-between text-sm">
                <span>{file.name}</span>
                <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        onClick={handleUpload}
        disabled={selectedFiles.length === 0 || uploadStatus === 'Uploading...'}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploadStatus === 'Uploading...' ? 'Uploading...' : 'Upload Selected Files'}
      </button>
      {uploadStatus && uploadStatus !== 'Uploading...' && (
        <p className={`mt-2 text-center text-sm ${uploadStatus.includes('Successfully') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {uploadStatus}
        </p>
      )}
    </div>
  );
};

// Productivity Distribution Pie Chart
const ProductivityPieChart = ({ meetings, isDarkMode }) => { // Accept isDarkMode as prop
  const productivityCounts = meetings.reduce((acc, meeting) => {
    acc[meeting.isProductive] = (acc[meeting.isProductive] || 0) + 1;
    return acc;
  }, {});

  const data = [
    { name: 'Productive', value: productivityCounts['Productive'] || 0 },
    { name: 'Not Productive', value: productivityCounts['Not Productive'] || 0 },
  ];

  const COLORS = ['#4CAF50', '#FF5722']; // Green for Productive, Orange/Red for Not Productive

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Productivity Distribution</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
                contentStyle={{
                    backgroundColor: isDarkMode ? '#4a5568' : '#ffffff',
                    borderColor: isDarkMode ? '#4a5568' : '#e2e8f0',
                    borderRadius: '8px',
                    color: isDarkMode ? '#e2e8f0' : '#333333'
                }}
                itemStyle={{ color: isDarkMode ? '#e2e8f0' : '#333333' }}
                labelStyle={{ color: isDarkMode ? '#e2e8f0' : '#333333' }}
            />
            <Legend />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};


// --- Main Dashboard Component (App.tsx) ---
const AdminDashBoard = () => {
  const {user} = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard'); // State to manage current page/section
  const fullName = user?.full_name || "";
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

  // Calculate dashboard stats
  const totalMeetings = mockMeetings.length;
  const totalDuration = mockMeetings.reduce((sum, m) => sum + m.duration, 0);
  const totalAttendees = mockMeetings.reduce((sum, m) => sum + m.attendees, 0);
  const totalCost = mockMeetings.reduce((sum, m) => sum + m.estimatedCost, 0);
  const productiveMeetings = mockMeetings.filter(m => m.isProductive === 'Productive').length;
  const avgDuration = totalMeetings > 0 ? (totalDuration / totalMeetings).toFixed(0) : 0;
  const avgAttendees = totalMeetings > 0 ? (totalAttendees / totalMeetings).toFixed(0) : 0;
  const avgCostPerMeeting = totalMeetings > 0 ? (totalCost / totalMeetings) : 0;
  const productivityRate = totalMeetings > 0 ? ((productiveMeetings / totalMeetings) * 100).toFixed(0) : 0;

  // Data for bar chart: Meetings by Type
  const meetingsByType = mockMeetings.reduce((acc, meeting) => {
    acc[meeting.type] = (acc[meeting.type] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(meetingsByType).map(type => ({
    name: type,
    Meetings: meetingsByType[type],
  }));

  // Determine the current theme icon component
  const CurrentThemeIcon = isDarkMode ? Sun : Moon;

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 font-inter transition-colors duration-300">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out border-r border-gray-200 dark:border-gray-700`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-400">MeetingROI</h2>
        </div>
        <nav className="mt-8 space-y-2 px-4">
          <a
            href="#"
            onClick={() => setCurrentPage('dashboard')}
            className={`flex items-center p-3 rounded-lg ${currentPage === 'dashboard' ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-100' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'} font-medium transition-colors duration-200`}
          >
            <Home size={20} className="mr-3" /> Dashboard
          </a>
          <a
            href="#"
            onClick={() => setCurrentPage('meetings')}
            className={`flex items-center p-3 rounded-lg ${currentPage === 'meetings' ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-100' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'} font-medium transition-colors duration-200`}
          >
            <Layers size={20} className="mr-3" /> Meetings
          </a>
          <a
            href="#"
            onClick={() => setCurrentPage('analytics')}
            className={`flex items-center p-3 rounded-lg ${currentPage === 'analytics' ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-100' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'} font-medium transition-colors duration-200`}
          >
            <BarChart2 size={20} className="mr-3" /> Analytics
          </a>
          <a
            href="#"
            onClick={() => setCurrentPage('upload')}
            className={`flex items-center p-3 rounded-lg ${currentPage === 'upload' ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-100' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'} font-medium transition-colors duration-200`}
          >
            <UploadCloud size={20} className="mr-3" /> Bulk Upload
          </a>
          <a href="#" className="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors duration-200">
            <Users size={20} className="mr-3 text-teal-500" /> Users
          </a>
          <a href="#" className="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors duration-200">
            <CreditCard size={20} className="mr-3 text-orange-500" /> Billing
          </a>
          <a href="#" className="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors duration-200">
            <Settings size={20} className="mr-3 text-gray-500" /> Settings
          </a>
        </nav>
        <div className="absolute bottom-6 w-full px-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full flex items-center justify-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 font-medium transition-colors duration-200"
          >
            <CurrentThemeIcon size={20} className={`mr-2 ${isDarkMode ? 'text-yellow-500' : 'text-blue-500'}`} />
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button className="w-full flex items-center justify-center p-3 mt-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors duration-200">
            <LogOut size={20} className="mr-2" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex items-center justify-between md:justify-end border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 md:hidden">{currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 dark:text-gray-200 font-medium">{fullName}</span>
            <div className="w-10 h-10 rounded-full bg-indigo-200 dark:bg-indigo-700 flex items-center justify-center text-indigo-800 dark:text-indigo-200 font-bold">{fullName.charAt(0).toUpperCase()}</div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
          {currentPage === 'dashboard' && (
            <>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Meeting Overview</h2>

              {/* User Profile Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300 flex items-center space-x-4">
                <User size={48} className="text-blue-500 dark:text-blue-400" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Welcome, {fullName}!</h3>
                  <p className="text-gray-600 dark:text-gray-400">Manage your MeetingROI platform effectively.</p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
                <StatCard
                  icon={<Layers />}
                  title="Total Meetings"
                  value={totalMeetings}
                  colorClass="text-indigo-500"
                  description="Meetings rated Productive"
                />
                <StatCard
                  icon={<Clock />}
                  title="Avg. Duration"
                  value={`${avgDuration} min`}
                  colorClass="text-blue-500"
                  description="Meetings rated Productive"
                />
                <StatCard
                  icon={<Users />}
                  title="Avg. Attendees"
                  value={avgAttendees}
                  colorClass="text-purple-500"
                  description="Meetings rated Productive"
                />
                <StatCard
                  icon={<DollarSign />}
                  title="Avg. Cost/Meeting"
                  value={formatCurrency(avgCostPerMeeting)}
                  colorClass="text-red-500"
                  description="Meetings rated Productive"
                />
                <StatCard
                  icon={<ThumbsUp />}
                  title="Productivity Rate"
                  value={`${productivityRate}%`}
                  colorClass="text-green-500"
                  description="Meetings rated Productive"
                />
              </div>

              {/* Charts and Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart: Meetings by Type */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Meetings by Type</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" className="dark:stroke-gray-700" />
                        <XAxis dataKey="name" stroke="#6b7280" className="dark:stroke-gray-300" />
                        <YAxis stroke="#6b7280" className="dark:stroke-gray-300" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isDarkMode ? '#4a5568' : '#ffffff',
                            borderColor: isDarkMode ? '#4a5568' : '#e2e8f0',
                            borderRadius: '8px',
                            color: isDarkMode ? '#e2e8f0' : '#333333'
                          }}
                          itemStyle={{ color: isDarkMode ? '#e2e8f0' : '#333333' }}
                          labelStyle={{ color: isDarkMode ? '#e2e8f0' : '#333333' }}
                        />
                        <Legend />
                        <Bar dataKey="Meetings" fill="#4f46e5" radius={[10, 10, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Productivity Distribution Pie Chart */}
                <ProductivityPieChart meetings={mockMeetings} isDarkMode={isDarkMode} />
              </div>

              {/* Recent Meetings Table */}
              <div className="mt-6">
                <RecentMeetingsTable meetings={mockMeetings} />
              </div>
            </>
          )}

          {currentPage === 'meetings' && (
            <>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">All Meetings</h2>
              <MeetingsListPage meetings={mockMeetings} />
            </>
          )}

          {currentPage === 'analytics' && (
            <>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Detailed Analytics</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col justify-center items-center text-center border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                    <BarChart2 size={48} className="text-gray-400 dark:text-gray-500 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Advanced Meeting Trends</h3>
                    <p className="text-gray-600 dark:text-gray-400">Coming soon: In-depth analysis of meeting trends over time.</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col justify-center items-center text-center border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                    <Users size={48} className="text-gray-400 dark:text-gray-500 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">User & Departmental Insights</h3>
                    <p className="text-gray-600 dark:text-gray-400">Coming soon: Breakdowns by user, team, and department productivity.</p>
                </div>
              </div>
            </>
          )}

          {currentPage === 'upload' && (
            <>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Bulk Agenda Upload</h2>
              <BulkUploadSection />
            </>
          )}

        </main>
      </div>
    </div>
  );
};

export default AdminDashBoard;
