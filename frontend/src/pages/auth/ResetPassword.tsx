import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useSearchParams, useNavigate, Link } from "react-router-dom"; // Added Link import
import axios from "axios";
import { Eye, EyeOff, ArrowLeft } from "lucide-react"; // Removed BarChart3 as it's not in the image style
import API_BASE_URL from "@/utils/api";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [formData , setFormData] = useState({
    password:"",
    confirmPassword:"",
  })
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const passwordsMatch = formData.password === formData.confirmPassword;

  // Password strength criteria (copied from SignUp for consistency)
  const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    return score;
  };
  const passwordCriteria = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    number: /\d/.test(formData.password),
  };
  const allPasswordValid = Object.values(passwordCriteria).every(Boolean);
  const passwordStrength = getPasswordStrength(formData.password);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false); // For password criteria overlay

  const renderCheck = (condition, label) => (
    <div className="flex items-center gap-2 text-sm">
      {condition ? (
        <FaCheckCircle className="text-green-500" />
      ) : (
        <FaTimesCircle className="text-red-500" />
      )}
      {label}
    </div>
  );


  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setMessage(""); // Clear previous messages

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }
    if (!allPasswordValid) {
      setError("Password doesn't meet criteria.");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
        token,
        new_password: formData.password,
      });
      setMessage(res.data.msg || "Password reset successfully!");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-400 via-pink-50 to-blue-500">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        {/* Left Section - Welcome Page Style */}
        <div className="relative flex-1 bg-gradient-to-br from-blue-500 to-purple-600 p-8 flex flex-col items-center justify-center text-white text-center md:rounded-l-3xl md:rounded-tr-none rounded-t-3xl md:rounded-bl-3xl">
          {/* Abstract Shapes (simplified with Tailwind) */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400 opacity-30 rounded-full mix-blend-screen animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-400 opacity-30 rounded-full mix-blend-screen animate-pulse delay-100"></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-pink-400 opacity-30 rounded-full mix-blend-screen animate-pulse delay-200"></div>

          <h1 className="text-4xl font-bold mb-2 z-10">Reset Your Password</h1>
          <p className="text-lg mb-8 z-10">Get back into your account</p>
          <p className="text-sm opacity-80 z-10">WWW.MEETINGROI.COM</p>
        </div>

        {/* Right Section - Form Style */}
        <Card className="flex-1 bg-white p-8 flex flex-col justify-center rounded-none md:rounded-r-3xl md:rounded-bl-none rounded-b-3xl">
          <CardHeader className="text-center p-0 mb-6">
            <h2 className="text-lg text-purple-600 font-semibold mb-1">Hello!</h2>
            <CardTitle className="text-2xl font-bold text-gray-900">Password Reset</CardTitle>
            <CardDescription className="text-sm text-gray-500 mt-1">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleReset} className="space-y-4">
              <div className="space-y-1 relative"> {/* Added relative for password criteria positioning */}
                <Label htmlFor="password" className="text-sm">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="h-8 text-sm" // Reduced height
                    onFocus={() => setIsPasswordFocused(true)} // Set focus state
                    onBlur={() => setIsPasswordFocused(false)} // Clear focus state
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* Password Criteria Section - now conditionally rendered and absolutely positioned */}
                {isPasswordFocused && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-md p-3 shadow-lg z-10"> {/* Adjusted width, padding, and shadow */}
                    <div className="space-y-1">
                      {renderCheck(passwordCriteria.length, "At least 8 characters")}
                      {renderCheck(passwordCriteria.uppercase, "One uppercase letter")}
                      {renderCheck(passwordCriteria.number, "One number")}
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded overflow-hidden mt-2"> {/* Reduced height, increased margin-top */}
                      <div
                        className={`h-1.5 transition-all duration-300 ${
                          passwordStrength === 1
                            ? "w-1/3 bg-red-500" // Adjusted widths for 3 criteria
                            : passwordStrength === 2
                            ? "w-2/3 bg-yellow-500"
                            : passwordStrength === 3
                            ? "w-full bg-green-500"
                            : "w-0 bg-gray-200" // Initial state if no criteria met
                        }`}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="confirmPassword" className="text-sm">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`h-8 text-sm ${passwordsMatch ? "border-green-400" : "border-red-400"}`} // Reduced height
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
              {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

              <Button
                type="submit"
                className="w-full h-10 text-base font-semibold rounded-md
                           bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
                           text-white shadow-lg transition-all duration-300 transform hover:scale-105
                           relative overflow-hidden"
                disabled={loading || !allPasswordValid || !passwordsMatch} // Disable when loading or validation fails
              >
                {loading ? (
                  <>
                    <span className="absolute inset-0 flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                    <span className="opacity-0">Resetting Password...</span>
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/login" className="text-sm text-blue-600 hover:underline flex items-center justify-center">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;