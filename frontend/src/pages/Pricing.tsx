
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
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
    },
    {
      name: "Pro",
      price: "$29",
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
    },
    {
      name: "Business",
      price: "$99",
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
    },
  ];

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
            <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''}`}>
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
                <CardDescription className="mt-2">{plan.description}</CardDescription>
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
                      <span className={`text-sm ${feature.included ? 'text-gray-900' : 'text-gray-400'}`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  {plan.name === "Enterprise" ? (
                    <Link to="/contact">
                      <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                        {plan.cta}
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/signup">
                      <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                        {plan.cta}
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                question: "Can I change plans at any time?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges."
              },
              {
                question: "What happens if I exceed my monthly limit?",
                answer: "On the Free plan, you'll need to upgrade to continue using the service. On paid plans, we'll notify you before you reach your limit."
              },
              {
                question: "Do you offer annual discounts?",
                answer: "Yes! Annual plans receive a 20% discount. Contact us for more details about annual billing."
              },
              {
                question: "Is there a free trial for paid plans?",
                answer: "Yes, all paid plans come with a 14-day free trial. No credit card required to start."
              },
            ].map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
