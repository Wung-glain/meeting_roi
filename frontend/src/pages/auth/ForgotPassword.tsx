import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // Removed BarChart3 as it's not in the image style
import axios from 'axios';
import API_BASE_URL from "@/utils/api";

const ForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state
  const [error, setError] = useState(""); // New error state for display
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(""); // Clear previous errors
    
    // Basic email format validation (can be more robust if needed)
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      alert("Please enter a valid email address."); // Using alert as per original logic
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/request-password-reset`, formData);
      console.log(response.data);
      console.log("Success: Password reset email requested.");
      setIsSubmitted(true); // Set to true on successful request
    } catch (error) {
      const message =
        error?.response?.data?.detail || 
        error?.response?.data?.message || 
        error?.response?.data?.error || 
        "Failed to send reset link. Please try again.";
      setError(message); // Set error message
      console.error("Forgot password error:", message);
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  // Common layout for both states (form and submitted message)
  const commonLayout = (content) => (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-400 via-pink-50 to-blue-500">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        {/* Left Section - Welcome Page Style */}
        <div className="relative flex-1 bg-gradient-to-br from-blue-500 to-purple-600 p-8 flex flex-col items-center justify-center text-white text-center md:rounded-l-3xl md:rounded-tr-none rounded-t-3xl md:rounded-bl-3xl">
          {/* Abstract Shapes (simplified with Tailwind) */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400 opacity-30 rounded-full mix-blend-screen animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-400 opacity-30 rounded-full mix-blend-screen animate-pulse delay-100"></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-pink-400 opacity-30 rounded-full mix-blend-screen animate-pulse delay-200"></div>

          <h1 className="text-4xl font-bold mb-2 z-10">Forgot Password?</h1>
          <p className="text-lg mb-8 z-10">We'll help you get back in</p>
          <p className="text-sm opacity-80 z-10">WWW.MEETINGROI.COM</p>
        </div>

        {/* Right Section - Form/Message Style */}
        <Card className="flex-1 bg-white p-8 flex flex-col justify-center rounded-none md:rounded-r-3xl md:rounded-bl-none rounded-b-3xl">
          {content}
        </Card>
      </div>
    </div>
  );

  if (isSubmitted) {
    return commonLayout(
      <>
        <CardHeader className="text-center p-0 mb-6">
          <h2 className="text-lg text-purple-600 font-semibold mb-1">Success!</h2>
          <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
          <CardDescription className="text-sm text-gray-500 mt-1">
            We've sent a password reset link to <span className="font-semibold text-blue-600">{formData.email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 text-center space-y-4">
          <p className="text-gray-600 text-sm">
            Click the link in the email to reset your password. The link will expire in 24 hours.
          </p>
          <Link to="/login" className="w-full">
            <Button 
              variant="outline" 
              className="w-full h-10 text-base font-semibold rounded-md
                         border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700
                         transition-all duration-300 transform hover:scale-105"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Button>
          </Link>
        </CardContent>
      </>
    );
  }

  return commonLayout(
    <>
      <CardHeader className="text-center p-0 mb-6">
        <h2 className="text-lg text-purple-600 font-semibold mb-1">Hello!</h2>
        <CardTitle className="text-2xl font-bold text-gray-900">Forgot Password</CardTitle>
        <CardDescription className="text-sm text-gray-500 mt-1">
          Enter your email to receive a reset link
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email" className="text-sm">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="h-8 text-sm" // Reduced height
              required
            />
          </div>

          {/* Error message display */}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>} 

          <Button 
            type="submit" 
            className="w-full h-10 text-base font-semibold rounded-md
                       bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
                       text-white shadow-lg transition-all duration-300 transform hover:scale-105
                       relative overflow-hidden"
            disabled={loading} // Disable when loading
          >
            {loading ? (
              <>
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                <span className="opacity-0">Sending link...</span> {/* Hidden text for button width */}
              </>
            ) : (
              "Send Reset Link"
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
    </>
  );
};

export default ForgotPassword;