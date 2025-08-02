import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import API_BASE_URL from "@/utils/api";
import { CLIENT_SIDE_TOKEN, PRO_PRODUCT_ID, BUSINESS_PRODUCT_ID, CHECKOUT_CANCEL_URL, CHECKOUT_SUCC_URL } from "@/utils/product";

// Declare global Paddle object for TypeScript
declare global {
  interface Window {
    Paddle: any; // Paddle.js v2 type definition can be more specific if needed
  }
}

const Pricing = () => {
  const [paddleReady, setPaddleReady] = useState(false);
  const navigate = useNavigate();
const { toast } = useToast();
  const {user, loading, login} = useAuth();
  console.log(user);


  useEffect(() => {
    
    const waitForPaddle = () => {

      // Check if window.Paddle exists and has the expected v2 structure (e.g., Checkout object)
      if (window.Paddle && typeof window.Paddle.Checkout !== 'undefined') {
        // Paddle.Setup is already handled in index.html for v2 token.
        // No need to call window.Paddle.Setup({ vendor: ... }) here, as it's for v1.
        setPaddleReady(true);
      } else {
        setTimeout(waitForPaddle, 100);
      }
    };
    waitForPaddle();
  }, []);

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out MeetingROI",
      features: [
        { name: "10 predictions per month", included: true },
        { name: "Basic meeting analysis", included: true },
        { name: "Email support", included: true },
        { name: "CSV upload", included: false },
        { name: "API access", included: false },
        { name: "Advanced analytics", included: false },
        { name: "Priority support", included: false },
      ],
      cta: "Get Started",
      popular: false,
      // For free plans, productId can remain null or be a specific free plan ID if Paddle supports it.
      // We won't call Paddle.Checkout for null productId.
      productId: null,
    },
    {
      name: "Pro",
      price: "$25",
      period: "per month",
      description: "For teams and regular users",
      features: [
        { name: "500 predictions per month", included: true },
        { name: "Advanced meeting analysis", included: true },
        { name: "CSV upload & batch processing", included: true },
        { name: "API access", included: true },
        { name: "Basic analytics dashboard", included: true },
        { name: "Email support", included: true },
        { name: "Priority support", included: false },
      ],
      cta: "Start Pro Trial",
      popular: true,
      // Ensure this is a valid Price ID from your Paddle Dashboard (Sandbox if testing)
      productId: PRO_PRODUCT_ID,
    },
    {
      name: "Business",
      price: "$59",
      period: "per month",
      description: "For larger organizations",
      features: [
        { name: "Unlimited predictions", included: true },
        { name: "Advanced meeting analysis", included: true },
        { name: "CSV upload & batch processing", included: true },
        { name: "Full API access", included: true },
        { name: "Advanced analytics & reporting", included: true },
        { name: "Priority email support", included: true },
        { name: "Phone support", included: true },
      ],
      cta: "Start Business Trial",
      popular: false,
      // Ensure this is a valid Price ID from your Paddle Dashboard (Sandbox if testing)
      productId: BUSINESS_PRODUCT_ID,
    },
  ];

  const handleCheckout = (selectedPlanName: string, priceId: string | null) => {
  if (loading) return;

  if (!user) {
    navigate("/signup");
    return;
  }

  if (!user.email_verified) {
    navigate("/verify-email");
    return;
  }


  if (!paddleReady) {
    alert("Payment system is still loading. Please try again shortly.");
    return;
  }
  const currentPlanName = user.subscription_plan?.toLowerCase(); // e.g., "free", "pro", "business"
  const selectedPlan = selectedPlanName.toLowerCase();
  if(!priceId && user.subscription_plan === 'free'){
        toast({
      title: "Free Plan Activated",
      description: "You can start using MeetingROI immediately.",
    });
    return;
  }
  // ✅ Free plan click — skip checkout
  if (selectedPlan === 'free' && (user.subscription_plan === 'pro' || user.subscription_plan === 'business') ) {
    toast({
      title: "Already Subscribed",
      description: `You're already on the ${user.subscription_plan} plan. Please wait until it expires or choose another plan.`,
      variant: "destructive",
    });
    return;
  }

  // ✅ Prevent subscribing again to same plan if it hasn’t expired
  const planExpires = user.plan_expires ? new Date(user.plan_expires) : null;
  const now = new Date();
  const isPlanExpired = planExpires ? now > planExpires : true;  // ⛔️ Prevent subscribing again to the same plan if it's not expired
  if (!isPlanExpired && selectedPlanName.toLowerCase() === currentPlanName?.toLowerCase()) {
    toast({
      title: "Already Subscribed",
      description: `You're already on the ${selectedPlanName} plan. Please wait until it expires or choose another plan.`,
      variant: "destructive",
    });
    return;
  }
    if (window.Paddle) {
      window.Paddle.Checkout.open({
        settings: {
          displayMode: "overlay",
          theme: "light",
          locale: "en",
          
        },
        // CORRECTED: Use 'items' array with 'priceId' and 'quantity' for Paddle Billing (v2)
        items: [
          {
            priceId: priceId, // Use the priceId passed from the plan
            quantity: 1,      // Default quantity to 1 for subscription
          },
        ],
        // Optional: Pre-fill customer email if you have it
        customer: {
          email: "name@gmail.com" //User email
        },
        customData: {
          user_id: user.user_id, // attach your internal user_id here
        },
        // REQUIRED: Define success and cancel URLs for Paddle Billing (v2)
        // Updated to explicitly use localhost:8080

        // successCallback and closeCallback are also available for more control
    successCallback: () => {
      toast({
        title: "Subscribed!",
        description: "Your plan has been updated successfully.",
      });
      window.location.href = CHECKOUT_SUCC_URL;
    },
    closeCallback: () => {
      toast({
        title: "Checkout Cancelled",
        description: "You closed the subscription window.",
      });
    },
      });
    } else {
      alert("Paddle checkout failed to load or initialize.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600">
            Choose the plan that fits your needs. Upgrade or downgrade at any time.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${plan.popular ? "ring-2 ring-blue-500 scale-105" : ""}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                  <Star className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && (
                    <span className="text-gray-500 ml-1">/{plan.period}</span>
                  )}
                </div>
                <CardDescription className="mt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      {feature.included ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-gray-300" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handleCheckout(plan.name, plan.productId)}
                  >
                    {plan.cta}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
