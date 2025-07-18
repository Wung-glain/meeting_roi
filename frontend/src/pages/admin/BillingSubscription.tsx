import { formatCurrency } from "@/utils/currencyFormater";



const BillingSubscription = () => {
  const currentPlan = "Business Plan";
  const predictionsUsed = 8500; // Mock data
  const predictionsLimit = "Unlimited";
  const monthlySavings = 1250.75; // Mock data
  const lastInvoiceDate = "2025-07-01";
  const nextBillingDate = "2025-08-01";

  const invoices = [
    { id: 'INV-2025-07', date: '2025-07-01', amount: 99.00, status: 'Paid' },
    { id: 'INV-2025-06', date: '2025-06-01', amount: 99.00, status: 'Paid' },
    { id: 'INV-2025-05', date: '2025-05-01', amount: 99.00, status: 'Paid' },
  ];

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Billing & Subscription</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Current Plan</h3>
          <p className="text-gray-700 dark:text-gray-200 text-lg mb-2">
            You are currently on the <span className="font-bold text-indigo-600 dark:text-indigo-400">{currentPlan}</span>.
          </p>
          <p className="text-gray-700 dark:text-gray-200 text-sm">
            Predictions Used This Month: <span className="font-bold">{predictionsUsed}</span> / {predictionsLimit}
          </p>
          <p className="text-gray-700 dark:text-gray-200 text-sm mt-1">
            Next Billing Date: <span className="font-bold">{nextBillingDate}</span>
          </p>
          <button className="mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">
            Manage Subscription
          </button>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Meeting Savings Summary</h3>
          <p className="text-gray-700 dark:text-gray-200 text-lg mb-2">
            Total Estimated Savings This Month: <span className="font-bold text-green-600 dark:text-green-400">{formatCurrency(monthlySavings)}</span>
          </p>
          <p className="text-gray-700 dark:text-gray-200 text-sm">
            Based on optimized meeting practices and AI insights.
          </p>
          <button className="mt-6 bg-blue-600 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
            View Detailed Savings Report
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Past Invoices</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Invoice ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {invoices.map(invoice => (
                <tr key={invoice.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{invoice.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{invoice.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{formatCurrency(invoice.amount)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      invoice.status === 'Paid' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default BillingSubscription;
