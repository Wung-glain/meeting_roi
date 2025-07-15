import React from 'react';

const CookiePolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-gray-800 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Cookie Policy</h1>

      <p>
        This Cookie Policy explains how MeetingROI uses cookies and similar technologies to recognize you when you visit our site. It explains what these technologies are and why we use them.
      </p>

      <h2 className="text-2xl font-semibold">1. What Are Cookies?</h2>
      <p>
        Cookies are small data files placed on your device that allow us to recognize your browser and store preferences or other information.
      </p>

      <h2 className="text-2xl font-semibold">2. Why We Use Cookies</h2>
      <ul className="list-disc list-inside space-y-2">
        <li><strong>Authentication:</strong> To remember your login status and sessions.</li>
        <li><strong>Preferences:</strong> To store your language or theme settings.</li>
        <li><strong>Analytics:</strong> To understand how users interact with our app (e.g., via Google Analytics).</li>
        <li><strong>Performance:</strong> To monitor system health and performance metrics.</li>
      </ul>

      <h2 className="text-2xl font-semibold">3. Managing Cookies</h2>
      <p>
        You can manage or disable cookies using your browser settings. However, some functionality of MeetingROI may be affected.
      </p>

      <h2 className="text-2xl font-semibold">4. Third-Party Cookies</h2>
      <p>
        We may use third-party tools that set cookies (e.g., Stripe, Google Analytics). These providers have their own cookie policies.
      </p>

      <h2 className="text-2xl font-semibold">5. Consent</h2>
      <p>
        By using MeetingROI, you consent to our use of cookies. You may opt-in or manage cookie preferences on your first visit.
      </p>

      <p>Last updated: July 2025</p>
    </div>
  );
};

export default CookiePolicy;
