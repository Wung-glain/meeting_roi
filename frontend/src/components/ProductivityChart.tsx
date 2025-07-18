import { Tooltip, ResponsiveContainer, Legend,
  PieChart as RechartsPieChart, Pie, Cell
} from 'recharts';
// Productivity Pie Chart Component
const ProductivityPieChart = ({ meetings, isDarkMode }) => {
  const productiveMeetingsCount = meetings.filter(m => m.isProductive === 'Productive').length;
  const totalMeetings = meetings.length;
  const productivityData = [
    { name: 'Productive', value: productiveMeetingsCount },
    { name: 'Not Productive', value: totalMeetings - productiveMeetingsCount },
  ];
  const productivityColors = ['#4CAF50', '#FF5722']; // Green for productive, Orange for not productive

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Productivity Distribution</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={productivityData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {productivityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={productivityColors[index % productivityColors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: isDarkMode ? '#4a5568' : '#ffffff', borderColor: isDarkMode ? '#4a5568' : '#e2e8f0', borderRadius: '8px', color: isDarkMode ? '#e2e8f0' : '#333333' }}
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

export default ProductivityPieChart;