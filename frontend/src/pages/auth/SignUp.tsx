import { useState, useEffect } from "react";
import API_BASE_URL from "@/utils/api";
import {
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, BarChart3 } from "lucide-react";
import axios from "axios";

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
const sanitizeFullName = (name) => name.replace(/[^a-zA-Z\s'-]/g, "").replace(/\s+/g, " ").trim();

const getPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  
  return score;
};

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    full_name: localStorage.getItem("full_name") || "",
    email: localStorage.getItem("email") || "",
    password: "",
    confirmPassword: "",
    plan: "free"
  });

  useEffect(() => {
    localStorage.setItem("full_name", formData.full_name);
    localStorage.setItem("email", formData.email);
  }, [formData.full_name, formData.email]);

  const passwordCriteria = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    number: /\d/.test(formData.password),
  };

  const allPasswordValid = Object.values(passwordCriteria).every(Boolean);
  const emailValid = isValidEmail(formData.email);
  const passwordsMatch = formData.password === formData.confirmPassword;
  const fullNameValid = sanitizeFullName(formData.full_name).length >= 2;
  const passwordStrength = getPasswordStrength(formData.password);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValid) return alert("Invalid email");
    if (!passwordsMatch) return alert("Passwords do not match");
    if (!allPasswordValid) return alert("Password doesn't meet criteria");

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, formData);
      alert("Registration successful!");
      localStorage.removeItem("full_name");
      localStorage.removeItem("email");
      navigate("/verify-email");
    } catch (error) {
      const message =
      error?.response?.data?.detail ||  // if backend uses FastAPI's HTTPException
      error?.response?.data?.message || // custom message field
      error?.response?.data?.error ||   // generic error field
      "Registration failed. Please try again.";

    if (message.toLowerCase().includes("email")) {
      alert("A User with that email already exists.");
    } else {
      alert(message);
    }

    console.error("Registration error:", message);
  }
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <BarChart3 className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Join MeetingROI and start optimizing your meetings</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className={`${fullNameValid ? "border-green-400" : "border-red-400"}`}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`${emailValid ? "border-green-400" : "border-red-400"}`}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="space-y-1 bg-white border rounded-md p-3">
                {renderCheck(passwordCriteria.length, "At least 8 characters")}
                {renderCheck(passwordCriteria.uppercase, "One uppercase letter")}
                {renderCheck(passwordCriteria.number, "One number")}
            
                <div className="h-2 bg-gray-200 rounded overflow-hidden">
                  <div
                    className={`h-2 transition-all duration-300 ${
                      passwordStrength <= 1
                        ? "w-1/4 bg-red-500"
                        : passwordStrength === 2
                        ? "w-2/4 bg-yellow-500"
                        : passwordStrength > 3
                        ? "w-3/4 bg-blue-500"
                        : "w-full bg-green-500"
                    }`}
                  ></div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`${passwordsMatch ? "border-green-400" : "border-red-400"}`}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan">Choose Plan (Optional)</Label>
              <Select
                value={formData.plan}
                onValueChange={(value) => setFormData({ ...formData, plan: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free Plan</SelectItem>
                  <SelectItem value="pro">Pro Plan ($29/month)</SelectItem>
                  <SelectItem value="business">Business Plan ($99/month)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={!(emailValid && allPasswordValid && passwordsMatch && fullNameValid)}>
              Create Account
            </Button>

            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign In
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
