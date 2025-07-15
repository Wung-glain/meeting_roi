import React from 'react';
import { Key, Code } from 'lucide-react';

const APIAccess: React.FC = () => { // Explicitly typing the functional component
  const exampleRequest = `
POST /predict
Content-Type: application/json
X-API-Key: YOUR_API_KEY_HERE

{
  "time_block": "Afternoon",
  "remote": false,
  "tool": "Google Meet",
  "meeting_type": "Planning",
  "duration": 60,
  "attendees": 5,
  "agenda_clarity": 8,
  "has_action_items": true,
  "departments": 1,
  "roles": "Executive;Manager;Developer",
  "average_annual_salary": 85000.0
}
`;

  const exampleResponse = `
HTTP/1.1 200 OK
Content-Type: application/json

{
  "predicted_productivity": "Productive",
  "estimated_meeting_cost": 425.00
}
`;

  const copyToClipboard = (text: string) => { // Type 'text' parameter
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      alert('Code copied to clipboard!'); // Using alert as per instructions for iFrame compatibility
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
    document.body.removeChild(textarea);
  };

  return (
    <section className="bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-6">API Access for Developers</h2>
      <p className="text-lg text-center text-gray-600 mb-12 max-w-3xl mx-auto">
        Integrate MeetingROI's powerful prediction capabilities directly into your applications. Our API allows you to programmatically analyze meeting data and get insights.
      </p>

      <div className="space-y-10">
        {/* Endpoint Details */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Code size={28} className="mr-3 text-purple-600" /> API Endpoint
          </h3>
          <p className="text-gray-700 mb-2">
            Our primary prediction endpoint is available via a POST request:
          </p>
          <code className="block bg-gray-100 text-gray-800 p-3 rounded-lg font-mono text-sm overflow-x-auto">
            POST /predict
          </code>
          <p className="text-gray-700 mt-4">
            This endpoint provides both productivity prediction and estimated cost for a given meeting.
          </p>
        </div>

        {/* Authentication */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Key size={28} className="mr-3 text-red-600" /> Authentication
          </h3>
          <p className="text-gray-700 mb-2">
            Access to our API requires an API Key, which must be sent in the `X-API-Key` header for every request.
          </p>
          <code className="block bg-gray-100 text-gray-800 p-3 rounded-lg font-mono text-sm overflow-x-auto">
            X-API-Key: YOUR_API_KEY_HERE
          </code>
          <button
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors duration-200"
          >
            Get Your API Key
          </button>
        </div>

        {/* Example Request */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Code size={28} className="mr-3 text-teal-600" /> Example Request
          </h3>
          <pre className="bg-gray-800 text-white p-4 rounded-lg font-mono text-sm overflow-x-auto relative">
            <button
              onClick={() => copyToClipboard(exampleRequest)}
              className="absolute top-2 right-2 bg-gray-600 hover:bg-gray-700 text-white text-xs py-1 px-3 rounded-md"
            >
              Copy
            </button>
            <code>{exampleRequest.trim()}</code>
          </pre>
        </div>

        {/* Example Response */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Code size={28} className="mr-3 text-orange-600" /> Example Response
          </h3>
          <pre className="bg-gray-800 text-white p-4 rounded-lg font-mono text-sm overflow-x-auto relative">
            <button
              onClick={() => copyToClipboard(exampleResponse)}
              className="absolute top-2 right-2 bg-gray-600 hover:bg-gray-700 text-white text-xs py-1 px-3 rounded-md"
            >
              Copy
            </button>
            <code>{exampleResponse.trim()}</code>
          </pre>
        </div>
      </div>
    </section>
  );
};

export default APIAccess;