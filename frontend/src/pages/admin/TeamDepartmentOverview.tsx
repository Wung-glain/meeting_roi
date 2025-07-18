import { useMemo } from "react";
import { formatCurrency } from "@/utils/currencyFormater";

const TeamDepartmentOverview = ({ meetings }) => {
  const departments = useMemo(() => [...new Set(meetings.map(m => m.department))].sort(), [meetings]);

  const departmentStats = useMemo(() => {
    return departments.map(dept => {
      const deptMeetings = meetings.filter(m => m.department === dept);
      const totalDeptMeetings = deptMeetings.length;
      const totalDeptCost = deptMeetings.reduce((sum, m) => sum + m.estimatedCost, 0);
      const productiveDeptMeetings = deptMeetings.filter(m => m.isProductive === 'Productive').length;
      const productivityRate = totalDeptMeetings > 0 ? ((productiveDeptMeetings / totalDeptMeetings) * 100).toFixed(0) : 0;
      const avgDeptROI = totalDeptMeetings > 0 ? (deptMeetings.reduce((sum, m) => sum + m.roiScore, 0) / totalDeptMeetings).toFixed(2) : 0;

      return {
        name: dept as string,
        totalMeetings: totalDeptMeetings,
        totalCost: totalDeptCost,
        productivityRate: productivityRate,
        avgROI: avgDeptROI,
      };
    });
  }, [meetings, departments]);

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Team & Department Overview</h2>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Departmental Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Meetings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Productivity %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Avg. ROI</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {departmentStats.map(dept => (
                <tr key={dept.name}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{dept.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{dept.totalMeetings}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{formatCurrency(dept.totalCost)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{dept.productivityRate}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{dept.avgROI}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Compare Departments (Placeholder)</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Select departments to compare their meeting ROI and productivity side-by-side.
          </p>
          <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">Compare</button>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Assign Productivity Goals (Placeholder)</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Set and track productivity goals for specific teams or departments.
          </p>
          <button className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg">Set Goals</button>
        </div>
      </div>
    </>
  );
};

export default TeamDepartmentOverview;