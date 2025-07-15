// Features.tsx
import React from 'react';
import { Calculator, BarChart2, CheckSquare, Lightbulb } from 'lucide-react';

const Features: React.FC = () => { // Explicitly typing the functional component
  const featureList = [
    {
      icon: <Calculator size={48} className="text-indigo-500" />,
      title: "Real-time Meeting Cost Calculator",
      description: "Instantly calculate the financial cost of your meetings based on attendee salaries and duration, helping you understand the true investment."
    },
    {
      icon: <BarChart2 size={48} className="text-green-500" />,
      title: "AI-Powered Productivity Analysis",
      description: "Our robust AI model predicts meeting productivity (Productive/Not Productive) based on key factors like agenda clarity, attendees, and duration."
    },
    {
      icon: <CheckSquare size={48} className="text-blue-500" />,
      title: "Action Item Tracking & Follow-up",
      description: "Seamlessly track action items during meetings and ensure accountability, driving projects forward and maximizing outcomes."
    },
    {
      icon: <Lightbulb size={48} className="text-yellow-500" />,
      title: "Agenda Clarity Scoring",
      description: "Receive insights into the clarity of your meeting agendas, a critical factor for productive discussions and efficient decision-making."
    }
  ];

  return (
    <section className="bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-6">Features That Drive Efficiency</h2>
      <p className="text-lg text-center text-gray-600 mb-12 max-w-3xl mx-auto">
        MeetingROI provides a suite of powerful tools designed to transform your meetings from time sinks into productive powerhouses.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {featureList.map((feature, index) => (
          <div
            key={index}
            className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center border border-gray-200"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
            <p className="text-gray-700 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;