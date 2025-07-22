import {
  Button,
} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react"; // Removed BarChart3 as it's not in the image style
import { useEffect, useState } from "react";
import API_BASE_URL from "@/utils/api";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(60);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Auto-send verification email on page load
  useEffect(() => {
    if (token) {
      resendEmail(); // auto trigger
    }
  }, []);

  // Countdown timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const resendEmail = async () => {
    if (loading || !token) return;

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/send-verification-email`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Verification email sent.");
        setCountdown(60); // Start countdown again
      } else {
        setError(data.detail || "Failed to send email.");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const checkVerified = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = await res.json();
      if (user?.email_verified) {
        navigate("/dashboard");
      } else {
        setError("Email not verified yet. Please check your email or resend.");
      }
    } catch {
      setError("Error checking verification status. Please try again.");
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

          <h1 className="text-4xl font-bold mb-2 z-10">Almost There!</h1>
          <p className="text-lg mb-8 z-10">Verify your email to continue</p>
          <p className="text-sm opacity-80 z-10">WWW.MEETINGROI.COM</p>
        </div>

        {/* Right Section - Verification Content Style */}
        <Card className="flex-1 bg-white p-8 flex flex-col justify-center rounded-none md:rounded-r-3xl md:rounded-bl-none rounded-b-3xl">
          <CardHeader className="text-center p-0 mb-6">
            <h2 className="text-lg text-purple-600 font-semibold mb-1">Action Required!</h2>
            <CardTitle className="text-2xl font-bold text-gray-900">Verify Your Email</CardTitle>
            <CardDescription className="text-sm text-gray-500 mt-1">
              We've sent a verification email to your inbox.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-gray-600 text-sm">
                Check your inbox and click the verification link to activate your account.
              </p>
              <p className="text-sm text-gray-500">
                Didn’t receive the email? Check your spam folder or request a new one.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full h-10 text-base font-semibold rounded-md
                           bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
                           text-white shadow-lg transition-all duration-300 transform hover:scale-105
                           relative overflow-hidden"
                onClick={resendEmail}
                disabled={countdown > 0 || loading}
              >
                {loading ? (
                  <>
                    <span className="absolute inset-0 flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                    <span className="opacity-0">Sending...</span>
                  </>
                ) : (
                  countdown > 0
                    ? `Resend in ${countdown}s`
                    : "Resend Verification Email"
                )}
              </Button>

              <Button 
                variant="outline" 
                className="w-full h-10 text-base font-semibold rounded-md
                           border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700
                           transition-all duration-300 transform hover:scale-105"
                onClick={checkVerified}
              >
                I've Verified My Email
              </Button>

              <Link to="/login" className="w-full">
                <Button variant="ghost" className="w-full text-sm text-gray-600 hover:text-gray-900">
                  Back to Login
                </Button>
              </Link>
            </div>

            {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;