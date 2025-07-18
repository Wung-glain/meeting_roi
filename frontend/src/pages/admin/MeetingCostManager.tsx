import { useEffect, useState } from "react";
import { formatCurrency } from "@/utils/currencyFormater";
// 7. Meeting Cost Forecast Tool
const MeetingCostForecastTool = () => {
  const [duration, setDuration] = useState(60);
  const [attendees, setAttendees] = useState(5);
  const [avgSalary, setAvgSalary] = useState(75000);
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [potentialSavings, setPotentialSavings] = useState(0);

  useEffect(() => {
    // Calculate cost based on inputs
    const hourlyCostPerPerson = avgSalary / (52 * 40); // Assuming 40 hours/week
    const cost = (duration / 60) * attendees * hourlyCostPerPerson;
    setEstimatedCost(parseFloat(cost.toFixed(2)));

    // Mock potential savings (e.g., 20% if duration reduced by 10 mins)
    const reducedDuration = Math.max(0, duration - 10); // Simulate reducing by 10 mins
    const costAfterReduction = (reducedDuration / 60) * attendees * hourlyCostPerPerson;
    setPotentialSavings(parseFloat((cost - costAfterReduction).toFixed(2)));

  }, [duration, attendees, avgSalary]);

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Meeting Cost Forecast Tool</h2>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Simulate Meeting Parameters</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="forecastDuration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (minutes)</label>
              <input
                type="number"
                id="forecastDuration"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min="1"
              />
            </div>
            <div>
              <label htmlFor="forecastAttendees" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number of Attendees</label>
              <input
                type="number"
                id="forecastAttendees"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                value={attendees}
                onChange={(e) => setAttendees(Number(e.target.value))}
                min="1"
              />
            </div>
            <div>
              <label htmlFor="forecastSalary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Average Annual Salary ($)</label>
              <input
                type="number"
                id="forecastSalary"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                value={avgSalary}
                onChange={(e) => setAvgSalary(Number(e.target.value))}
                min="10000"
              />
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600 flex flex-col justify-center items-center text-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Forecast Results</h3>
          <div className="space-y-3">
            <p className="text-gray-700 dark:text-gray-200 text-lg">
              Estimated Cost: <span className="font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(estimatedCost)}</span>
            </p>
            <p className="text-gray-700 dark:text-gray-200 text-lg">
              Potential Savings (by optimizing): <span className="font-bold text-green-600 dark:text-green-400">{formatCurrency(potentialSavings)}</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              This forecast assumes a 10-minute reduction in meeting duration.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MeetingCostForecastTool;