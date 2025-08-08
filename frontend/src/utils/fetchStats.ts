import axios from "axios";
import API_BASE_URL from "@/utils/api"; // Update path if needed

export interface OverviewData {
  total_estimated_cost: number;
  total_meeting_analyzed: number;
  total_roi: number;
  total_estimated_value_gain: number;
  total_productive_meetings: number;
}

export interface RecentPrediction {
  id: number;
  title: string;
  result: string;
  confidence: number;
  date: string;
}

export interface UserUsage{
  predictions_used: number;
  max_predictions_per_month: number;
}
interface FetchStatsResponse {
  overview: OverviewData;
  recentPredictions: RecentPrediction[];
  userUsage: UserUsage;
}

export const fetchStats = async (userId: string): Promise<FetchStatsResponse> => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/meeting_statistics/${userId}`);
    const o = res.data.overview;
    const userData = res.data.user_usage;
    const preds = res.data.recent_predictions;

    const overview: OverviewData = {
      total_estimated_cost: o.total_estimated_cost || 0,
      total_meeting_analyzed: o.total_meeting_analyzed || 0,
      total_roi: o.total_roi || 0,
      total_estimated_value_gain: o.total_estimated_value_gain || 0,
      total_productive_meetings: o.total_productive_meetings || 0,
    };
    const userUsage: UserUsage = {
      predictions_used: userData.predictions_used || 0,
      max_predictions_per_month: userData.max_predictions_per_month || 0,

    };

    const recentPredictions: RecentPrediction[] =
      preds.length === 0
        ? [
            {
              id: 1,
              title: "Weekly Sync",
              result: "Productive",
              confidence: 85,
              date: new Date().toISOString().split("T")[0],
            },
          ]
        : preds.map((p: any, index: number) => ({
            id: index + 1,
            title: p.meeting_title,
            result: p.is_productive ? "Productive" : "Not Productive",
            confidence: Number(p.confidence_score),
            date: p.date,
          }));

    return { overview, recentPredictions, userUsage };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    throw error;
  }
};
