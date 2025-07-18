import React from "react";
// StatCard Component
export const StatCard = ({ icon, title, value, description, colorClass }) => (
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