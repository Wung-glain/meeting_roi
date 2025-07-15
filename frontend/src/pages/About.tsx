
import React from 'react';
import { Users, Target, Rocket } from 'lucide-react'; // Example icons

const About: React.FC = () => {
  return (
    <section className="bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-6">About MeetingROI</h2>
      <p className="text-lg text-center text-gray-600 mb-12 max-w-3xl mx-auto">
        At MeetingROI, we believe that every meeting should be an investment, not an expense. Our mission is to transform how organizations perceive and conduct meetings, turning them into highly productive and cost-effective collaborations.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {/* Our Mission */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200 flex flex-col items-center">
          <Target size={48} className="text-purple-600 mb-4" />
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">Our Mission</h3>
          <p className="text-gray-700 leading-relaxed">
            To empower businesses with data-driven insights and tools to optimize meeting efficiency, reduce unnecessary costs, and foster a culture of productive collaboration.
          </p>
        </div>

        {/* Our Vision */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200 flex flex-col items-center">
          <Rocket size={48} className="text-indigo-600 mb-4" />
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">Our Vision</h3>
          <p className="text-gray-700 leading-relaxed">
            To be the leading platform for meeting analytics and optimization, helping organizations worldwide unlock their full potential through effective communication.
          </p>
        </div>

        {/* Our Team */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200 flex flex-col items-center">
          <Users size={48} className="text-green-600 mb-4" />
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">Our Team</h3>
          <p className="text-gray-700 leading-relaxed">
            We are a dedicated team of data scientists, software engineers, and productivity experts passionate about solving the challenges of modern workplace meetings.
          </p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose MeetingROI?</h3>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          With our cutting-edge AI models for productivity prediction and precise cost calculation, MeetingROI provides actionable insights that go beyond simple time tracking. We help you identify patterns, optimize resources, and ensure every meeting contributes positively to your bottom line.
        </p>
      </div>
    </section>
  );
};

export default About;