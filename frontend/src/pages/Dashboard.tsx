import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Users, DollarSign, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const { user , loading} = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  const getFirstName = (fullName = "") => {
    return fullName.trim().split(" ")[0];
  };

  useEffect(() => {
    if(loading) return;
    if (!user) {
      navigate("/login");
      return;
    }

    if (!user.email_verified) {
      navigate("/verify-email");
      return;
    }

    setChecking(false); // Passed all checks
  }, [user, loading, navigate]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading dashboard...
      </div>
    );
  }

  const stats = {
    predictionsUsed: 47,
    monthlyLimit: 100,
    costSavings: 2450,
    lastPredictions: [
      { id: 1, title: "Weekly Standup", result: "Productive", confidence: 87, date: "2024-01-15" },
      { id: 2, title: "Strategy Meeting", result: "Not Productive", confidence: 92, date: "2024-01-14" },
      { id: 3, title: "Team Retrospective", result: "Productive", confidence: 78, date: "2024-01-13" },
      { id: 4, title: "Client Review", result: "Productive", confidence: 95, date: "2024-01-12" },
      { id: 5, title: "Planning Session", result: "Not Productive", confidence: 83, date: "2024-01-11" },
    ]
  };

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="container mx-auto px-20 py-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back {getFirstName(user?.full_name || "User")}
          </h1>
          <p className="text-gray-600">Here's your meeting productivity overview</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Predictions Used</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.predictionsUsed}/{stats.monthlyLimit}
              </div>
              <p className="text-xs text-muted-foreground">
                {((stats.predictionsUsed / stats.monthlyLimit) * 100).toFixed(0)}% of monthly limit
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.costSavings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Estimated time saved this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-muted-foreground">Personal prediction accuracy</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meetings Analyzed</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">Total meetings this month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Predictions</CardTitle>
                <CardDescription>Your last 5 meeting predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.lastPredictions.map((prediction) => (
                    <div key={prediction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{prediction.title}</h4>
                        <p className="text-sm text-gray-500">{prediction.date}</p>
                      </div>
                      <div className="text-right">
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            prediction.result === "Productive"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {prediction.result}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{prediction.confidence}% confidence</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Get started with your next prediction</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link to="/predict">
                  <Button className="w-full" size="lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Make a Prediction
                  </Button>
                </Link>
                <Link to="/bulk">
                  <Button variant="outline" className="w-full">
                    Bulk Upload
                  </Button>
                </Link>
                <Link to="/api">
                  <Button variant="outline" className="w-full">
                    API Access
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>ROI Trends</CardTitle>
                <CardDescription>Your productivity over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Chart visualization coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
