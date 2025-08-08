import React, {useEffect, useState } from 'react';
import {
  User as UserIcon,
  Mail,
  Calendar,
  Shield,
  CreditCard,
  Download,
  Trash2,
  Key,
  CheckCircle,
  XCircle,
  Edit,
  Save,
  ArrowLeft,
  Lock,
  LockKeyhole,
  Info,
  ExternalLink,
  Database // ✅ Fixed missing icon import
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"; // ✅ Using your imported UI buttoimprt 
import { useAuth } from "@/context/AuthContext";
import {formatDate } from "@/utils/currencyFormater";
// Mock User Data (replace with actual data from your AuthContext or API)
const mockUser = {
  full_name: "John Doe",
  email: "john.doe@example.com",
  email_verified: true,
  member_since: "2023-01-15",
  subscription_plan: "Pro Plan",
  plan_expires: "2026-01-15",
  last_payment: "2024-06-10",
  payment_method: "Visa **** 1234",
  two_factor_enabled: false,
};

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [olduser, setUser] = useState(mockUser);
  const {user , loading} = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedName, setEditedName] = useState(olduser.full_name);
  const [checking, setChecking] = useState(true);
  useEffect(() => {
      if(loading) return;
      if (!user) {
        navigate("/login");
        return;
      }
      if (!user.email_verified) {
        navigate("/verify-email");
        return;
    }
      setChecking(false); // Passed all checks
    }, [user, loading, navigate]);

  const handleSaveProfile = () => {
    setUser(prevUser => ({ ...prevUser, full_name: editedName }));
    setIsEditingProfile(false);
    alert("Profile updated successfully!");
  };

  const handleChangePassword = () => {
    alert("Password change initiated. Check your email for instructions.");
  };

  const handleToggle2FA = () => {
    const new2FAStatus = !olduser.two_factor_enabled;
    setUser(prevUser => ({ ...prevUser, two_factor_enabled: new2FAStatus }));
    alert(`Two-Factor Authentication ${new2FAStatus ? 'enabled' : 'disabled'}.`);
  };

  const handleExportData = () => {
    alert("Your data export has started. You will receive a link via email shortly.");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      alert("Account deletion process initiated. We're sad to see you go!");
      navigate('/logout');
    }
  };
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading User Profile...
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 font-inter text-gray-800 antialiased py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-4xl font-extrabold text-gray-900">User Profile</h1>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg space-y-10">

          {/* Profile Overview */}
          <div className="flex items-center space-x-6 border-b pb-6 border-gray-200">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-5xl font-bold">
              <UserIcon size={60} />
            </div>
            <div>
              {isEditingProfile ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="text-3xl font-bold text-gray-900 border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button onClick={handleSaveProfile} className="ml-2">
                    <Save size={20} />
                  </Button>
                  <Button variant="outline" onClick={() => { setIsEditingProfile(false); setEditedName(olduser.full_name); }}>
                    <XCircle size={20} />
                  </Button>
                </div>
              ) : (
                <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                  {user.full_name}
                  <Button variant="ghost" onClick={() => setIsEditingProfile(true)} className="ml-2 p-1 h-auto">
                    <Edit size={20} className="text-gray-500 hover:text-blue-600" />
                  </Button>
                </h2>
              )}
              <p className="text-lg text-gray-600 flex items-center mt-1">
                <Mail size={20} className="mr-2 text-gray-500" /> {user.email}
                {olduser.email_verified ? (
                  <span className="ml-2 text-green-500 flex items-center text-sm">
                    <CheckCircle size={16} className="mr-1" /> Verified
                  </span>
                ) : (
                  <span className="ml-2 text-red-500 flex items-center text-sm">
                    <XCircle size={16} className="mr-1" /> Not Verified
                  </span>
                )}
              </p>
              <p className="text-md text-gray-500 flex items-center mt-1">
                <Calendar size={20} className="mr-2 text-gray-500" /> Member since: {user.created_at}
              </p>
            </div>
          </div>

          {/* Account Security */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
              <Shield size={28} className="mr-3 text-purple-600" /> Account Security
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                <h4 className="text-xl font-medium text-gray-800 mb-3 flex items-center">
                  <Lock size={20} className="mr-2 text-gray-600" /> Password
                </h4>
                <p className="text-gray-700 mb-4">
                  Regularly update your password to keep your account secure.
                </p>
                <Button variant="outline" onClick={handleChangePassword} className="w-full">
                  Change Password
                </Button>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                <h4 className="text-xl font-medium text-gray-800 mb-3 flex items-center">
                  <LockKeyhole size={20} className="mr-2 text-gray-600" /> Two-Factor Authentication
                </h4>
                <p className="text-gray-700 mb-4">
                  Add an extra layer of security to your account.
                </p>
                <Button
                  variant={olduser.two_factor_enabled ? "destructive" : "default"}
                  onClick={handleToggle2FA}
                  className="w-full"
                >
                  {olduser.two_factor_enabled ? "Disable 2FA" : "Enable 2FA"}
                </Button>
              </div>
            </div>
          </div>

          {/* Subscription & Billing */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
              <CreditCard size={28} className="mr-3 text-teal-600" /> Subscription & Billing
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                <div>
                  <p className="font-medium">Current Plan:</p>
                  <p className="text-lg font-semibold text-blue-600">{user.subscription_plan}</p>
                </div>
                <div>
                  <p className="font-medium">Plan Expires:</p>
                  <p>{formatDate(user.plan_expires)}</p>
                </div>
                <div>
                  <p className="font-medium">Last Payment:</p>
                  <p>{user.last_payment}</p>
                </div>
                <div>
                  <p className="font-medium">Payment Method:</p>
                  <p>{user.payment_method}</p>
                </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <Button variant="default" className="flex-1">
                  Manage Subscription
                </Button>
                <Button variant="outline" className="flex-1">
                  Billing History
                </Button>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
              <Database size={28} className="mr-3 text-orange-600" /> Data Management
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                <h4 className="text-xl font-medium text-gray-800 mb-3 flex items-center">
                  <Download size={20} className="mr-2 text-gray-600" /> Export Data
                </h4>
                <p className="text-gray-700 mb-4">
                  Download a copy of your meeting data and analytics.
                </p>
                <Button variant="outline" onClick={handleExportData} className="w-full">
                  Request Data Export
                </Button>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                <h4 className="text-xl font-medium text-gray-800 mb-3 flex items-center">
                  <Trash2 size={20} className="mr-2 text-gray-600" /> Delete Account
                </h4>
                <p className="text-gray-700 mb-4">
                  Permanently delete your account and all associated data. This action is irreversible.
                </p>
                <Button variant="destructive" onClick={handleDeleteAccount} className="w-full">
                  Delete My Account
                </Button>
              </div>
            </div>
          </div>

          {/* Help/Support */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
              <Info size={28} className="mr-3 text-gray-600" /> Need Help?
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-700 mb-4">
                If you have any questions or need assistance with your account, please visit our help center or contact support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact" className="flex-1">
                  <Button variant="outline" className="w-full flex items-center justify-center">
                    Contact Support <ExternalLink size={16} className="ml-2" />
                  </Button>
                </Link>
                <a href="https://support.example.com" target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="outline" className="w-full flex items-center justify-center">
                    Visit Help Center <ExternalLink size={16} className="ml-2" />
                  </Button>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfile;