
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link , useNavigate} from "react-router-dom";
import { Eye, EyeOff, BarChart3 } from "lucide-react";
import {isValidEmail} from "./SignUp";
import axios from "axios";
import {useAuth} from "@/context/AuthContext";
import  API_BASE_URL from "@/utils/api";


const Login = () => {
  const {login} = useAuth();
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
    const trimedEmail = formData.email.trim();
    if(!isValidEmail(trimedEmail)){
      alert("Invalid Email")
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
        navigate('/dashboard');
      } else {
        login(user);
        navigate('/verify-email');
      }
      

      

    } catch (error) {
      setLoading(false);
      const message =
      error?.response?.data?.detail ||  // if backend uses FastAPI's HTTPException
      error?.response?.data?.message || // custom message field
      error?.response?.data?.error ||   // generic error field
      "Login failed. Please try again.";

    if (message.toLowerCase().includes("Invalid")) {
      setError("Invalid Email or Password");
    } else {
      setError("Invalid Email or Password");
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
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your MeetingROI account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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
            </div>
          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
            <Button
            className="w-full"
            disabled={loading}
            >
        {loading ? "Signing in..." : "Sign In"}
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
  );
};

export default Login;
