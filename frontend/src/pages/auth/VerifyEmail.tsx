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
import { Mail, BarChart3 } from "lucide-react";
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
        setError("Email not verified yet.");
      }
    } catch {
      setError("Error checking verification.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <BarChart3 className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
          <CardDescription>We've sent you a verification email</CardDescription>
        </CardHeader>

        <CardContent className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-gray-600">
              Check your inbox and click the verification link to activate your account.
            </p>
            <p className="text-sm text-gray-500">
              Didn’t receive the email? Check your spam folder or request a new one.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full"
              onClick={resendEmail}
              disabled={countdown > 0 || loading}
            >
              {loading
                ? "Sending..."
                : countdown > 0
                ? `Resend in ${countdown}s`
                : "Resend Verification Email"}
            </Button>

            <Button variant="outline" className="w-full" onClick={checkVerified}>
              I've Verified My Email
            </Button>

            <Link to="/login">
              <Button variant="ghost" className="w-full text-sm">
                Back to Login
              </Button>
            </Link>
          </div>

          {message && <p className="text-green-600 text-sm">{message}</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
