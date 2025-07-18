import { useState } from "react";
import { Info, CheckCircle, AlertTriangle } from "lucide-react";

const NotificationsAlerts = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'alert', message: 'High-cost unproductive meeting scheduled: "Q3 Budget Review" ($850)', date: '2025-07-15', read: false, icon: <AlertTriangle size={20} className="text-orange-500" /> },
    { id: 2, type: 'info', message: 'Your monthly report is ready for download.', date: '2025-07-14', read: true, icon: <Info size={20} className="text-blue-500" /> },
    { id: 3, type: 'alert', message: 'Productivity dropped by 5% in Marketing Dept. last week.', date: '2025-07-12', read: false, icon: <AlertTriangle size={20} className="text-red-500" /> },
    { id: 4, type: 'success', message: 'New feature "Custom Report Builder" is now live!', date: '2025-07-10', read: true, icon: <CheckCircle size={20} className="text-green-500" /> },
  ]);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [slackNotifications, setSlackNotifications] = useState(false);
  const [inAppNotifications, setInAppNotifications] = useState(true);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Notifications & Alerts</h2>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Your Alerts</h3>
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-4">No new notifications.</p>
          ) : (
            notifications.map(notification => (
              <div key={notification.id} className={`flex items-center p-4 rounded-lg border ${notification.read ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600' : 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700'} transition-colors duration-200`}>
                <div className="mr-3">{notification.icon}</div>
                <div className="flex-1">
                  <p className={`font-medium ${notification.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-gray-100'}`}>{notification.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{notification.date}</p>
                </div>
                <div className="flex space-x-2">
                  {!notification.read && (
                    <button onClick={() => markAsRead(notification.id)} className="text-sm text-blue-600 hover:underline dark:text-blue-400">Mark as Read</button>
                  )}
                  <button onClick={() => deleteNotification(notification.id)} className="text-sm text-red-600 hover:underline dark:text-red-400">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Notification Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="emailNotifs" className="text-gray-700 dark:text-gray-200">Email Notifications</label>
            <input type="checkbox" id="emailNotifs" checked={emailNotifications} onChange={(e) => setEmailNotifications(e.target.checked)} className="h-5 w-5 rounded text-indigo-600 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600" />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="slackNotifs" className="text-gray-700 dark:text-gray-200">Slack Notifications</label>
            <input type="checkbox" id="slackNotifs" checked={slackNotifications} onChange={(e) => setSlackNotifications(e.target.checked)} className="h-5 w-5 rounded text-indigo-600 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600" />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="inAppNotifs" className="text-gray-700 dark:text-gray-200">In-App Notifications</label>
            <input type="checkbox" id="inAppNotifs" checked={inAppNotifications} onChange={(e) => setInAppNotifications(e.target.checked)} className="h-5 w-5 rounded text-indigo-600 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600" />
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationsAlerts;