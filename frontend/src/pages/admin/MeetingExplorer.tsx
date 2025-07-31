import { useState, useMemo } from "react";
import { Modal } from "@/components/Modal"; // Assuming this Modal component is also responsive
import { formatCurrency, getProductivityColor } from "@/utils/currencyFormater";
import { mockMeetings } from "@/utils/generate_meetings";
import { ChevronLeft , ChevronRight , Search } from "lucide-react";

// 3. Meeting Explorer
const MeetingExplorer = ({ meetings, isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterProductivity, setFilterProductivity] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const meetingsPerPage = 10;

  // Memoize unique meeting types and departments for filter dropdowns
  const allMeetingTypes = useMemo(() => ['All', ...new Set(mockMeetings.map(m => m.type))].sort(), []);
  const allDepartments = useMemo(() => ['All', ...new Set(mockMeetings.map(m => m.department))].sort(), []);

  // Filter meetings based on selected criteria
  const filteredMeetings = useMemo(() => {
    let filtered = meetings;

    if (searchTerm) {
      filtered = filtered.filter(m =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.agendaSummary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterType !== 'All') {
      filtered = filtered.filter(m => m.type === filterType);
    }
    if (filterDepartment !== 'All') {
      filtered = filtered.filter(m => m.department === filterDepartment);
    }
    if (filterProductivity !== 'All') {
      // Convert string to boolean for comparison if isProductive is boolean
      // Assuming isProductive is a string "Productive" or "Not Productive"
      filtered = filtered.filter(m => m.isProductive === filterProductivity);
    }
    if (startDate) {
      filtered = filtered.filter(m => new Date(m.date) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(m => new Date(m.date) <= new Date(endDate));
    }
    return filtered;
  }, [meetings, searchTerm, filterType, filterDepartment, filterProductivity, startDate, endDate]);

  // Calculate pagination details
  const indexOfLastMeeting = currentPage * meetingsPerPage;
  const indexOfFirstMeeting = indexOfLastMeeting - meetingsPerPage;
  const currentMeetings = filteredMeetings.slice(indexOfFirstMeeting, indexOfLastMeeting);
  const totalPages = Math.ceil(filteredMeetings.length / meetingsPerPage);

  // Handle viewing meeting details in a modal
  const handleViewDetails = (meeting) => {
    setSelectedMeeting(meeting);
    setIsModalOpen(true);
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Meeting Explorer</h2>

      {/* Filters and Search Section */}
      <div className="bg-white w-full dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300
                  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"> {/* Adjusted grid for better responsiveness */}
        
        {/* Search Input - Spans full width on all screens */}
        <div className="col-span-full"> 
          <label htmlFor="search" className="sr-only">Search Meetings</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              id="search"
              placeholder="Search by title, agenda, department..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Dropdowns and Date Pickers - Stack on small, then two columns, then four */}
        <div>
          <label htmlFor="filterType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Meeting Type</label>
          <select
            id="filterType"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            {allMeetingTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="filterDepartment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
          <select
            id="filterDepartment"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            {allDepartments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="filterProductivity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Productivity</label>
          <select
            id="filterProductivity"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
            value={filterProductivity}
            onChange={(e) => setFilterProductivity(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Productive">Productive</option>
            <option value="Not Productive">Not Productive</option>
          </select>
        </div>
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
          <input
            type="date"
            id="startDate"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
          <input
            type="date"
            id="endDate"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Meeting Table Section */}
      <div className="bg-white w-full dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        {/* Added overflow-x-auto to make table scrollable horizontally on small screens */}
        <div className="overflow-x-auto"> 
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"> {/* Added min-w-full */}
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cost</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Duration</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Outcome</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ROI Score</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Productivity</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Departments</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentMeetings.length > 0 ? (
                currentMeetings.map((meeting) => (
                  <tr key={meeting.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{meeting.id}</td>
                    <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{meeting.title}</td>
                    <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{meeting.date}</td>
                    <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{formatCurrency(meeting.estimatedCost)}</td>
                    <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{meeting.duration} min</td>
                    <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{meeting.outcome}</td>
                    <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{meeting.roiScore}</td>
                    <td className="px-2 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getProductivityColor(meeting.isProductive)}`}>
                        {meeting.isProductive}
                      </span>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{meeting.department}</td>
                    <td className="px-2 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(meeting)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-2 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No meetings found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        <div className="flex justify-center items-center space-x-2 py-4"> {/* Added padding for spacing */}
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <ChevronLeft size={20} />
          </button>
          {/* Render pagination buttons dynamically */}
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm 
                ${currentPage === i + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}
                transition-colors duration-200`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Meeting Details Modal (Ensure your Modal component is also responsive) */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Meeting Details">
        {selectedMeeting && (
          <div className="space-y-3 text-gray-800 dark:text-gray-200 text-sm"> {/* Added text styling for modal content */}
            <p><strong>ID:</strong> {selectedMeeting.id}</p>
            <p><strong>Title:</strong> {selectedMeeting.title}</p>
            <p><strong>Date:</strong> {selectedMeeting.date}</p>
            <p><strong>Type:</strong> {selectedMeeting.type}</p>
            <p><strong>Department:</strong> {selectedMeeting.department}</p>
            <p><strong>Tool:</strong> {selectedMeeting.tool}</p>
            <p><strong>Duration:</strong> {selectedMeeting.duration} min</p>
            <p><strong>Attendees:</strong> {selectedMeeting.attendees}</p>
            <p><strong>Estimated Cost:</strong> {formatCurrency(selectedMeeting.estimatedCost)}</p>
            <p><strong>Productivity Score:</strong> {selectedMeeting.productivityScore}</p>
            <p><strong>Productivity:</strong> <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getProductivityColor(selectedMeeting.isProductive)}`}>{selectedMeeting.isProductive}</span></p>
            <p><strong>Outcome:</strong> {selectedMeeting.outcome}</p>
            <p><strong>ROI Score:</strong> {selectedMeeting.roiScore}</p>
            <p><strong>Agenda Summary:</strong> {selectedMeeting.agendaSummary}</p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default MeetingExplorer;