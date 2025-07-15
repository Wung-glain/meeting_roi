import React from 'react';

const SecurityPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-gray-800 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Security Policy</h1>

      <p>
        MeetingROI is committed to protecting your data with industry-leading security practices.
        We continuously monitor, test, and enhance our systems to keep your information secure.
      </p>

      <h2 className="text-2xl font-semibold">1. Data Encryption</h2>
      <p>
        All data transmitted between your browser and our servers is encrypted using TLS 1.2 or higher.
        Sensitive data is encrypted at rest using AES-256 encryption standards.
      </p>

      <h2 className="text-2xl font-semibold">2. Authentication & Access Control</h2>
      <p>
        We implement secure login with hashed passwords (bcrypt), JWT-based access tokens, and optional 2FA (coming soon).
        User access is role-based, and internal access is strictly limited.
      </p>

      <h2 className="text-2xl font-semibold">3. Monitoring & Incident Response</h2>
      <p>
        We maintain real-time logging and monitoring of our systems and respond promptly to potential security incidents.
        All incidents are reviewed, documented, and used to improve system resilience.
      </p>

      <h2 className="text-2xl font-semibold">4. Infrastructure & Hosting</h2>
      <p>
        MeetingROI is hosted on secure infrastructure providers (such as AWS/GCP) with strong physical and network safeguards in place.
      </p>

      <h2 className="text-2xl font-semibold">5. Responsible Disclosure</h2>
      <p>
        We welcome reports from the security community. Please contact us at <a href="mailto:security@meetingroi.com" className="text-blue-600 underline">security@meetingroi.com</a>
        if you discover a vulnerability.
      </p>

      <p>Last updated: July 2025</p>
    </div>
  );
};

export default SecurityPolicy;
