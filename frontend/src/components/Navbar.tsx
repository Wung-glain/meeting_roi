import { useState } from "react";
// Assuming Button component is correctly defined and styled with Tailwind
// FIX: Changed import path from alias to relative path
import { Button } from "./ui/button"; // Assuming Navbar is in src/components and ui/button is in src/components/ui
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  BarChart3,
  User,
  Settings,
  LogOut,
  LayoutDashboard, // New icon for Dashboard
  TrendingUp,
  Wallet,          // New icon for Billing
  KeyRound,        // New icon for API Credentials
  ChevronDown      // For dropdown arrow
} from "lucide-react";
// FIX: Changed import path from alias to relative path
import { useAuth } from "../context/AuthContext"; // Assuming Navbar is in src/components and AuthContext is in src/context

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false); // State for profile dropdown
  // State to hold the timeout ID for delaying dropdown close
  const [dropdownTimeoutId, setDropdownTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const getFirstName = (fullName = "") => {
    return fullName.trim().split(" ")[0];
  };
  const handleProPlanClick = () => {
    setIsProfileDropdownOpen(false);
    if (dropdownTimeoutId) clearTimeout(dropdownTimeoutId);
    if (user.subscription_plan === 'pro' || user.subscription_plan === 'business') {
      navigate("/dashboard"); // Or a specific Pro dashboard route
    } else {
      alert("You are on the Free plan. Upgrade to Pro to access this feature.");
      
    }
  };

  const handleBusinessPlanClick = () => {
    setIsProfileDropdownOpen(false);
    if (dropdownTimeoutId) clearTimeout(dropdownTimeoutId);
    if (user.email_verified) {
      alert("You are already on the Business plan.");
      navigate("/admin");
    } else {
      navigate("/pricing"); // Redirect to pricing page for upgrade
      
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsProfileDropdownOpen(false); // Close dropdown on logout
    if (dropdownTimeoutId) clearTimeout(dropdownTimeoutId); // Clear any pending timeout
  };

  // Function to open the dropdown
  const openProfileDropdown = () => {
    if (dropdownTimeoutId) {
      clearTimeout(dropdownTimeoutId); // Clear any pending close timeout
      setDropdownTimeoutId(null);
    }
    setIsProfileDropdownOpen(true);
  };

  // Function to close the dropdown with a delay
  const closeProfileDropdown = () => {
    const id = setTimeout(() => {
      setIsProfileDropdownOpen(false);
      setDropdownTimeoutId(null);
    }, 200); // 200ms delay
    setDropdownTimeoutId(id);
  };

  const navItems = [
    { name: "Home", path: user ? "/dashboard" : "/" },
    { name: "Pricing", path: "/pricing" },
    { name: "Features", path: "/features" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
    { name: "Blog", path: "/blog" }, // Added blog to main nav for visibility
  ];

  // Profile dropdown items for authenticated users
  const profileDropdownItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "My Profile", path: "/profile", icon: User },
    { name: "Billing & Plans", path: "/billing", icon: Wallet },
    { name: "API Credentials", path: "/api-credentials", icon: KeyRound },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 font-inter">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">MeetingROI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative
                  ${isActive(item.path) ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600" : ""}
                `}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth/Profile Section - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {!user || !user.email_verified ? (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-gray-700 hover:text-blue-600">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition-colors duration-200">Sign Up</Button>
                </Link>
              </>
            ) : (
              <div
                className="relative"
                // Use custom functions for mouse events
                onMouseEnter={openProfileDropdown}
                onMouseLeave={closeProfileDropdown}
              >
                <div className="flex items-center space-x-2 cursor-pointer select-none p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="w-9 h-9 rounded-full bg-blue-300 flex items-center justify-center border border-blue-300">
                    <User className="text-blue-600 w-5 h-5" />
                    
                  </div>
                  <span className="text-base font-medium text-gray-800">
                  {getFirstName(user?.full_name || "User")}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                      isProfileDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 animate-fadeIn z-50">
                    {/* Simple animation for dropdown */}
                    <style>{`
                      @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(-10px); }
                        to { opacity: 1; transform: translateY(0); }
                      }
                      .animate-fadeIn {
                        animation: fadeIn 0.2s ease-out forwards;
                      }
                    `}</style>
                    <div className="py-2">
                      {profileDropdownItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center transition-colors duration-150"
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            navigate(item.path);
                            if (dropdownTimeoutId) clearTimeout(dropdownTimeoutId); // Clear timeout on click
                          }}
                        >
                          <item.icon className="w-4 h-4 mr-2 text-gray-500" />
                          {item.name}
                        </Link>
                      ))}
                      {/* NEW: Pro Plan Dashboard Option */}
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center transition-colors duration-150"
                        onClick={handleProPlanClick}
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2 text-gray-500" />
                        Pro Plan Dashboard
                      </button>

                      {/* NEW: Upgrade to Business Plan Option */}
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center transition-colors duration-150"
                        onClick={handleBusinessPlanClick}
                      >
                        <TrendingUp className="w-4 h-4 mr-2 text-gray-500" />
                        Upgrade to Business Plan
                      </button>

                      <div className="border-t border-gray-100 my-1"></div> {/* Separator */}
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors duration-150"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4 mr-2 text-red-500" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-slideDown">
            {/* Simple animation for mobile menu */}
            <style>{`
              @keyframes slideDown {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .animate-slideDown {
                animation: slideDown 0.3s ease-out forwards;
              }
            `}</style>
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-gray-700 hover:text-blue-600 font-medium py-2 px-3 rounded-lg transition-colors duration-200
                    ${isActive(item.path) ? "bg-blue-50 text-blue-600" : ""}
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200 mt-4">
                {!user || !user.email_verified ? (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full text-gray-700 hover:text-blue-600 justify-start">
                        Login
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-start">Sign Up</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 px-3 py-2">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border border-blue-300">
                        <User className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-base font-medium text-gray-800">Hi, {getFirstName(user?.full_name || "User")}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                    </div>
                    {profileDropdownItems.map((item) => (
                      <Button
                        key={`mobile-${item.name}`}
                        variant="ghost"
                        className="w-full justify-start text-gray-700 hover:text-blue-600"
                        onClick={() => {
                          navigate(item.path);
                          setIsOpen(false);
                        }}
                      >
                        <item.icon className="w-4 h-4 mr-2 text-gray-500" />
                        {item.name}
                      </Button>
                    ))}
                    <Button
                      variant="destructive"
                      className="w-full justify-start bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
