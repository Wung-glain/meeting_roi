import { useState } from "react";
import { Brain, DollarSign, Lightbulb, ClipboardList, Loader2} from "lucide-react";


// 2. AI-Powered Insights Section
const AIEngineInsights = ({ isDarkMode }) => {
  const [insightLoading, setInsightLoading] = useState(false);
  const [generatedInsight, setGeneratedInsight] = useState('');

  const mockInsights = [
    {
      id: 1,
      title: "High-Cost Meetings in Engineering",
      suggestion: "Engineering department's weekly stand-ups have an average cost of $350. Consider reducing duration by 15 mins or limiting attendees to core team.",
      confidence: "92%",
      icon: <DollarSign size={24} className="text-red-500" />
    },
    {
      id: 2,
      title: "Improve Agenda Clarity for Brainstorms",
      suggestion: "Meetings flagged as 'Brainstorm' show lower productivity when agenda clarity is below 7/10. Implement mandatory pre-meeting agenda sharing.",
      confidence: "88%",
      icon: <Lightbulb size={24} className="text-yellow-500" />
    },
    {
      id: 3,
      title: "Action Item Follow-up Gap",
      suggestion: "25% of 'Planning' meetings lack recorded action items. Implement a post-meeting action item tracking system to ensure accountability.",
      confidence: "95%",
      icon: <ClipboardList size={24} className="text-blue-500" />
    },
  ];

  const generateAIInsight = async () => {
    setInsightLoading(true);
    setGeneratedInsight('');
    // Simulate API call to Gemini for insight generation
    // In a real app, you'd send relevant meeting data to your backend,
    // which then calls the Gemini API.
    const prompt = "Generate a concise, actionable insight about meeting productivity based on the following mock data: [mockMeetings data goes here, or a summary]. Focus on cost reduction or productivity increase.";
    const apiKey = ""; // Canvas will provide this at runtime for Gemini models

    try {
      const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts.length > 0) {
        setGeneratedInsight(result.candidates[0].content.parts[0].text);
      } else {
        setGeneratedInsight("Failed to generate insight. Please try again.");
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setGeneratedInsight("Error generating insight. Check console for details.");
    } finally {
      setInsightLoading(false);
    }
  };


  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">AI-Powered Insights</h2>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {mockInsights.map(insight => (
          <div key={insight.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center mb-3">
              {insight.icon}
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 ml-3">{insight.title}</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{insight.suggestion}</p>
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <span>Confidence: <span className="font-bold text-indigo-600 dark:text-indigo-400">{insight.confidence}</span></span>
              <button className="text-blue-500 hover:underline text-sm">Learn More</button>
            </div>
          </div>
        ))}
      </div>

      {/* GPT-generated insights */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
          <Brain size={24} className="mr-2 text-green-500" /> Generate Custom Insight
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Click below to get a unique AI-generated insight based on your overall meeting data patterns.
        </p>
        <button
          onClick={generateAIInsight}
          disabled={insightLoading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {insightLoading ? (
            <span className="flex items-center">
              <Loader2 className="animate-spin mr-2" size={20} /> Generating...
            </span>
          ) : (
            'Generate Insight'
          )}
        </button>
        {generatedInsight && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Generated Insight:</h4>
            <p className="text-gray-700 dark:text-gray-300">{generatedInsight}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default AIEngineInsights;