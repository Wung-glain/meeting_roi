import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import Prediction from "./pages/Prediction";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import About from  "./pages/About";
import PrivacyPolicy from  "./pages/legal/Privacy";
import TermsAndConditions from "./pages/legal/Terms";
import SecurityPolicy from "./pages/legal/Security";
import RefundPolicy from  "./pages/legal/Refund";
import CookiePolicy from "./pages/legal/CookiePolicy";
import CookieBanner from "./pages/legal/CookiesBanner";
import ContactPage from "./pages/Contact";
import Features from   "./pages/Features";
import Blog from "./pages/Blogs";
import APIAccess from "./pages/APIAccess";
import UserProfile from "./pages/user/UserProfile";
import BillingAndPlans from "./pages/user/BillingsAndPlans";
import APICredentials from "./pages/user/APICredentials";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CookieBanner />
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/billing" element={<BillingAndPlans />} />
            <Route path="/api-credentials" element={<APICredentials />} />
            <Route path="/predict" element={<Prediction />} />
            <Route path="/api" element={<APIAccess />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/refund" element={<RefundPolicy />} />
            <Route path="/security" element={<SecurityPolicy />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
