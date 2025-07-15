// PrivacyPolicy.tsx
import React from 'react';
import { Shield, Lock, FileText, UserCheck } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <section className="bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-6">Privacy Policy</h2>
      <p className="text-lg text-center text-gray-600 mb-12 max-w-3xl mx-auto">
        Your privacy is critically important to us. This Privacy Policy outlines the types of information we collect, how we use it, and the measures we take to protect your data.
      </p>

      <div className="space-y-10">
        {/* Information We Collect */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <FileText size={28} className="mr-3 text-blue-600" /> Information We Collect
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            We collect information to provide better services to all our users. The types of information we collect include:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>**Personal Identification Information:** Name, email address, contact number (if provided via contact forms).</li>
            <li>**Meeting Data:** Details about meetings such as duration, number of attendees, roles, departments, agenda clarity, and estimated cost (as provided by users for analysis).</li>
            <li>**Technical Data:** IP address, browser type, operating system, and usage patterns when you interact with our website and API.</li>
          </ul>
        </div>

        {/* How We Use Your Information */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <UserCheck size={28} className="mr-3 text-green-600" /> How We Use Your Information
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            We use the information we collect for various purposes, including:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>To provide and maintain our services, including meeting cost calculation and productivity analysis.</li>
            <li>To improve, personalize, and expand our services.</li>
            <li>To understand and analyze how you use our services.</li>
            <li>To develop new products, services, features, and functionality.</li>
            <li>To communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the service, and for marketing and promotional purposes.</li>
            <li>For compliance with legal obligations.</li>
          </ul>
        </div>

        {/* Data Security */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Lock size={28} className="mr-3 text-red-600" /> Data Security
          </h3>
          <p className="text-gray-700 leading-relaxed">
            We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information. These measures include data encryption, secure servers, and access controls. However, no method of transmission over the Internet or method of electronic storage is 100% secure.
          </p>
        </div>

        {/* Your Rights */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Shield size={28} className="mr-3 text-purple-600" /> Your Rights
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Depending on your location, you may have certain rights regarding your personal data, including the right to access, correct, or delete your data. Please contact us to exercise these rights.
          </p>
        </div>

        {/* Changes to this Policy */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <FileText size={28} className="mr-3 text-gray-700" /> Changes to this Policy
          </h3>
          <p className="text-gray-700 leading-relaxed">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </div>
      </div>

      <p className="text-md text-center text-gray-600 mt-12">
        Last updated: July 14, 2025
      </p>
    </section>
  );
};

export default PrivacyPolicy;