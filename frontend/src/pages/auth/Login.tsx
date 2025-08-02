import { useEffect,  useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link , useNavigate} from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // Removed BarChart3 as it's not in the image style
import {isValidEmail} from "./SignUp"; // Assuming SignUp is in the same directory or accessible
import axios from "axios";
import {useAuth} from "@/context/AuthContext";
import API_BASE_URL from "@/utils/api";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const { toast } = useToast();
  const {user, login} = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
 
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors
    const trimedEmail = formData.email.trim();
    if(!isValidEmail(trimedEmail)){
      toast({
          title: "Invalid Email",
          description: "Invalid Email address",
          variant: "destructive",
      });
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, formData);

      const data = response.data;
      console.log(data);
      // Save token and user info
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data));
      const user = JSON.parse(localStorage.getItem("user") || "null");
      // Redirect based on verification status
      
      if (data.email_verified) {
        login(user);
            const fetchAndRedirect = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/auth/get-plan/${user.user_id}`);
        const plan = res.data.plan_name;
        const plan_expiration = res.data.current_period_end;

        // Optional: update AuthContext with the plan
        login({ ...user, subscription_plan: plan, plan_expires: plan_expiration });
      } catch (err) {
        console.error("Error fetching user plan:", err);
      }
    };

    fetchAndRedirect();
        navigate('/dashboard');
      } else {
        login(user);
        navigate('/verify-email');
      }
      
    } catch (error) {
      setLoading(false);
      const message =
      error?.response?.data?.detail || 
      error?.response?.data?.message || 
      error?.response?.data?.error || 
      "Login failed. Please try again.";

    if (message.toLowerCase().includes("invalid")) {
    toast({
      title: "Login Failed",
      description: "Invalid username or password",
      variant: "destructive",
    });
    } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password",
          variant: "destructive",
        });// Keeping this consistent with your original error handling
    }

    console.error("Login error:", message);
  } finally {
      setLoading(false); // Ensure loading is false even if navigation happens
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

          <h1 className="text-4xl font-bold mb-2 z-10">Welcome Back!</h1>
          <p className="text-lg mb-8 z-10">Sign In To Your Account</p>
          <p className="text-sm opacity-80 z-10">WWW.MEETINGSROI.COM</p>
        </div>

        {/* Right Section - Login Form Style */}
        <Card className="flex-1 bg-white p-8 flex flex-col justify-center rounded-none md:rounded-r-3xl md:rounded-bl-none rounded-b-3xl">
          <CardHeader className="text-center p-0 mb-6">
            <h2 className="text-lg text-blue-600 font-bold mb-1">Hello!</h2>
            <CardTitle className="text-2xl font-bold text-gray-900">Login Your Account</CardTitle>
            <CardDescription className="text-sm text-gray-500 mt-1">
              Sign in to your MeetingROI account
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleLogin} className="space-y-4">
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
              
              <div className="space-y-1">
                <Label htmlFor="password" className="text-sm">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="h-8 text-sm" // Reduced height
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
              </div>
              
              {/* Error message display */}
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>} 

              <Button
                type="submit"
                className="w-full h-10 text-base font-semibold rounded-md
                           bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
                           text-white shadow-lg transition-all duration-300 transform hover:scale-105
                           relative overflow-hidden" // Added relative and overflow-hidden for loading animation
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
                    <span className="opacity-0">Signing in...</span> {/* Hidden text for button width */}
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot your password?
              </Link>
              <div className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-600 hover:underline">
                  Create Account
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;