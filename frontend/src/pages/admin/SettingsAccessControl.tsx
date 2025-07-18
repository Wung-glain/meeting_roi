import { useState } from "react";
import { UserPlus } from "lucide-react";

// 10. Settings & Access Control
const SettingsAccessControl = () => {
  const [roleBasedAccess, setRoleBasedAccess] = useState('Enabled');
  const [language, setLanguage] = useState('English');
  const [themeOption, setThemeOption] = useState('System Default'); // 'System Default', 'Light', 'Dark'

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Viewer');

  const handleInvite = (e) => {
    e.preventDefault();
    console.log(`Inviting ${inviteEmail} with role ${inviteRole}`);
    alert(`Invitation sent to ${inviteEmail} (Mock)`);
    setInviteEmail('');
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Settings & Access Control</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Role-Based Permissions</h3>
          <p className="text-gray-700 dark:text-gray-200 mb-4">
            Control what each user can see and do on the platform.
          </p>
          <div className="flex items-center justify-between">
            <label htmlFor="roleAccess" className="text-gray-700 dark:text-gray-200">Status</label>
            <select
              id="roleAccess"
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              value={roleBasedAccess}
              onChange={(e) => setRoleBasedAccess(e.target.value)}
            >
              <option value="Enabled">Enabled</option>
              <option value="Disabled">Disabled</option>
            </select>
          </div>
          <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
            Manage Roles
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Invite Team Members</h3>
          <form onSubmit={handleInvite} className="space-y-4">
            <div>
              <label htmlFor="inviteEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                id="inviteEmail"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="inviteRole" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
              <select
                id="inviteRole"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
              >
                <option value="Viewer">Viewer</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center">
              <UserPlus size={20} className="mr-2" /> Send Invitation
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">General Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="language" className="text-gray-700 dark:text-gray-200">Language</label>
            <select
              id="language"
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="English">English</option>
              <option value="French">French</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="themeOption" className="text-gray-700 dark:text-gray-200">Theme</label>
            <select
              id="themeOption"
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              value={themeOption}
              onChange={(e) => setThemeOption(e.target.value)}
            >
              <option value="System Default">System Default</option>
              <option value="Light">Light</option>
              <option value="Dark">Dark</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsAccessControl;