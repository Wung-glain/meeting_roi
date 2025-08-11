import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStats, OverviewData, RecentPrediction, UserUsage } from "../utils/fetchStats";
import {formatDate} from "@/utils/currencyFormater";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { BarChart3, ThumbsUp, TrendingUp, Users, DollarSign, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";


const Dashboard = () => {
  const { user, loading } = useAuth();
  console.log(user)
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const getFirstName = (fullName = "") => {
    return fullName.trim().split(" ")[0];
  };
  const [overview, setOverview] = useState<OverviewData>({
    total_estimated_cost: 0,
    total_meeting_analyzed: 0,
    total_roi: 0,
    total_estimated_value_gain: 0,
    total_productive_meetings: 0,
  });
  const [userD, setUserD] = useState<UserUsage>({
    predictions_used: 0,
    max_predictions_per_month: 0,
  });

  const [recentPredictions, setRecentPredictions] = useState<RecentPrediction[]>([]);

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
    if (!user.email_verified) return navigate("/verify-email");
    if (user.subscription_plan === "free") return navigate("/predict");

    const loadStats = async () => {
      try {
        const { overview, recentPredictions, userUsage } = await fetchStats(user.user_id);
        setOverview(overview);
        setUserD(userUsage);
        console.log(overview);
        console.log(recentPredictions);
        console.log(userUsage);
        setRecentPredictions(recentPredictions);
      } catch (err) {
        // Optional: show toast
      } finally {
        setChecking(false);
      }
    };

    loadStats();
  }, [user, loading, navigate]);

  if (checking) {
    return <div>Loading dashboard...</div>;
  }

  const stats = {
    predictionsUsed: userD.predictions_used,
    monthlyLimit: userD.max_predictions_per_month,
    costSavings: overview.total_estimated_value_gain,
    lastPredictions: recentPredictions,
  };
const prodMeetings = (overview.total_productive_meetings == 0) ? 0 : (overview.total_productive_meetings/overview.total_meeting_analyzed) * 100 
  return (
    <div className="min-h-screen bg-gray-200">
      <div className="container mx-auto px-20 py-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back {getFirstName(user?.full_name || "User")}
          </h1>
          <p className="text-gray-600">
            Here's your meeting productivity overview
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

            <StatCard
              icon={<TrendingUp />}
              title="Predictions Used"
              value={`${stats.predictionsUsed}/${stats.monthlyLimit}`}
              colorClass="text-green-500"
              description={`${((stats.predictionsUsed / stats.monthlyLimit) * 100).toFixed(0)}% of monthly limit`}
            />
            <StatCard
              icon={<DollarSign />}
              title="Cost Savings"
              value={`${stats.costSavings.toLocaleString()}`}
              colorClass="text-green-500"
              description="Estimated Value gain from meetings based on meeting input data"
            />
            <StatCard
              icon={<BarChart3 />}
              title="Meetings Analyzed"
              value={stats.predictionsUsed}
              colorClass="text-green-500"
              description="Total Meetings Analyzed this Month"
            />
        <StatCard
          icon={<TrendingUp />}
          title="ROI"
          value={`${overview.total_roi.toLocaleString()}`}
          colorClass="text-blue-500"
          description="Total return on investment"
        />
        <StatCard
          icon={<DollarSign />}
          title="Total Meeting Cost"
          value={`${overview.total_estimated_cost.toLocaleString()}`}
          colorClass="text-red-500"
          description="Total Cost of Meetings"
        />
        <StatCard
          icon={<ThumbsUp />}
          title="Productive Meetings %"
          value={`${prodMeetings.toFixed(2)}%`}
          colorClass="text-green-500"
          description="Based on identified inefficiencies"
        />
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
                    <div
                      key={prediction.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{prediction.title}</h4>
                        <p className="text-sm text-gray-500">{formatDate(prediction.date)}</p>
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
                        <p className="text-xs text-gray-500 mt-1">
                          {prediction.confidence}% confidence
                        </p>
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
