import { useState } from "react";
import { Save, X , FileText, Database , BarChart3, LineChart, PieChart, DollarSign} from "lucide-react";

const CustomReportBuilder = () => {
  const [widgets, setWidgets] = useState([]);
  const [reportName, setReportName] = useState('');

  const addWidget = (type) => {
    const newWidget = {
      id: Date.now(),
      type: type,
      // In a real app, you'd have more complex configs for each widget type
    };
    setWidgets(prev => [...prev, newWidget]);
  };

  const removeWidget = (id) => {
    setWidgets(prev => prev.filter(widget => widget.id !== id));
  };

  const saveReport = () => {
    if (!reportName.trim()) {
      alert("Please enter a report name.");
      return;
    }
    console.log(`Saving report "${reportName}" with widgets:`, widgets);
    alert(`Report "${reportName}" saved successfully! (Mock)`);
    // In a real app: API call to save report configuration
  };

  const exportReport = (format) => {
    console.log(`Exporting report to ${format}. (Mock)`);
    alert(`Report exported to ${format}! (Mock)`);
    // In a real app: Trigger backend endpoint for PDF/CSV generation
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Custom Report Builder</h2>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Report Configuration</h3>
        <div className="mb-4">
          <label htmlFor="reportName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Report Name</label>
          <input
            type="text"
            id="reportName"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            placeholder="e.g., Q3 Meeting Performance"
          />
        </div>
        <div className="mb-4">
          <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Add Widgets:</h4>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => addWidget('BarChart')} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center"><BarChart3 size={18} className="mr-2"/> Bar Chart</button>
            <button onClick={() => addWidget('PieChart')} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center"><PieChart size={18} className="mr-2"/> Pie Chart</button>
            <button onClick={() => addWidget('LineChart')} className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg flex items-center"><LineChart size={18} className="mr-2"/> Line Chart</button>
            <button onClick={() => addWidget('KPIs')} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center"><DollarSign size={18} className="mr-2"/> KPIs</button>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={saveReport} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center disabled:opacity-50" disabled={!reportName.trim() || widgets.length === 0}>
            <Save size={20} className="mr-2" /> Save Custom Report
          </button>
          <button onClick={() => exportReport('PDF')} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
            <FileText size={20} className="mr-2" /> Export to PDF
          </button>
          <button onClick={() => exportReport('CSV')} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
            <Database size={20} className="mr-2" /> Export to CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {widgets.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300 lg:col-span-2 text-center text-gray-500 dark:text-gray-400">
            <p className="text-lg">Add widgets above to start building your custom report.</p>
          </div>
        )}
        {widgets.map(widget => (
          <div key={widget.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300 relative">
            <button onClick={() => removeWidget(widget.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
              <X size={20} />
            </button>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">{widget.type} Widget (Placeholder)</h4>
            <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400">
              <p>Content for {widget.type} goes here</p>
            </div>
            {/* In a real app, render actual chart components based on widget.type */}
          </div>
        ))}
      </div>
    </>
  );
};



export default CustomReportBuilder;
