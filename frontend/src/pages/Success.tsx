import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react"; // For a success icon
import { useAuth } from "@/context/AuthContext";
import API_BASE_URL from "@/utils/api";
import axios from "axios";
const Success: React.FC = () => {
  const navigate = useNavigate();
  const { user, login} = useAuth(); // Get user from AuthContext
  const [redirecting, setRedirecting] = useState(false);


  useEffect(() => {
    const fetchAndRedirect = async () => {
      if (!user?.user_id) return;

      try {
        const res = await axios.get(`${API_BASE_URL}/auth/get-plan/${user.user_id}`);
        const plan = res.data.plan_name;
        const plan_expiration = res.data.current_period_end;

        // Optional: update AuthContext with the plan
        login({ ...user, subscription_plan: plan, plan_expires: plan_expiration });

        setRedirecting(true);
        setTimeout(() => navigate("/dashboard"), 3000);
      } catch (err) {
        console.error("Error fetching user plan:", err);
        navigate("/pricing"); // fallback redirect
      }
    };

    fetchAndRedirect();
  }, [user, login, navigate]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)] bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 md:p-12 text-center max-w-md w-full animate-fade-in-up">
        <CheckCircle size={80} className="text-green-500 mx-auto mb-6 animate-bounce-in" />
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          Payment Successful!
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Thank you for subscribing to our premium plan.
          You now have access to all the exclusive features!
        </p>
        <p className="text-md text-gray-500 dark:text-gray-400">
          {redirecting ? "Redirecting you now..." : "Please wait..."}
        </p>
      </div>

      {/* Tailwind CSS keyframes for animations */}
      <style>{`
        @keyframes fadeInOut {
          0%, 100% { opacity: 0; transform: translateY(20px); }
          10%, 90% { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounceIn {
          0%, 20%, 40%, 60%, 80%, 100% {
            transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
          }
          0% {
            opacity: 0;
            transform: scale3d(0.3, 0.3, 0.3);
          }
          20% {
            transform: scale3d(1.1, 1.1, 1.1);
          }
          40% {
            transform: scale3d(0.9, 0.9, 0.9);
          }
          60% {
            opacity: 1;
            transform: scale3d(1.03, 1.03, 1.03);
          }
          80% {
            transform: scale3d(0.97, 0.97, 0.97);
          }
          100% {
            opacity: 1;
            transform: scale3d(1, 1, 1);
          }
        }
        .animate-fade-in-up {
          animation: fadeInOut 0.8s ease-out forwards;
        }
        .animate-bounce-in {
          animation: bounceIn 1s;
        }
      `}</style>
    </div>
  );
};

export default Success;
