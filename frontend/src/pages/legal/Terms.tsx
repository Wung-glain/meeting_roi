import React from 'react';
import { FileText, Gavel, Users, Info, Scale } from 'lucide-react';

const TermsAndConditions: React.FC = () => {
  return (
    <section className="bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-6">Terms and Conditions</h2>
      <p className="text-lg text-center text-gray-600 mb-12 max-w-3xl mx-auto">
        Welcome to MeetingROI. These Terms and Conditions govern your use of our website and services. By accessing or using our services, you agree to be bound by these Terms.
      </p>

      <div className="space-y-10">
        {/* Introduction */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <FileText size={28} className="mr-3 text-blue-600" /> Introduction
          </h3>
          <p className="text-gray-700 leading-relaxed">
            These Terms of Service ("Terms") govern your use of the MeetingROI website and any related services provided by MeetingROI ("we", "us", or "our"). Our Service is designed to help organizations analyze and improve meeting productivity and cost efficiency.
          </p>
        </div>

        {/* Acceptance of Terms */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Gavel size={28} className="mr-3 text-red-600" /> Acceptance of Terms
          </h3>
          <p className="text-gray-700 leading-relaxed">
            By accessing or using the Service, you signify your agreement to these Terms. If you do not agree to these Terms, you may not access or use the Service. These Terms apply to all visitors, users, and others who access or use the Service.
          </p>
        </div>

        {/* Use of Service */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Users size={28} className="mr-3 text-green-600" /> Use of Service
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            You agree to use the Service only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the Service. Prohibited behavior includes harassing or causing distress or inconvenience to any other user, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within our Service.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>You must be at least 18 years old to use the Service.</li>
            <li>You are responsible for maintaining the confidentiality of your account and password.</li>
            <li>You agree to provide accurate and complete information when registering for and using the Service.</li>
          </ul>
        </div>

        {/* Intellectual Property */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Info size={28} className="mr-3 text-purple-600" /> Intellectual Property
          </h3>
          <p className="text-gray-700 leading-relaxed">
            The Service and its original content, features, and functionality are and will remain the exclusive property of MeetingROI and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of MeetingROI.
          </p>
        </div>

        {/* Disclaimers and Limitation of Liability */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Scale size={28} className="mr-3 text-orange-600" /> Disclaimers & Limitation of Liability
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            The Service is provided on an "AS IS" and "AS AVAILABLE" basis. MeetingROI makes no warranties, expressed or implied, and hereby disclaims all other warranties. In no event shall MeetingROI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>
        </div>

        {/* Governing Law */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Gavel size={28} className="mr-3 text-blue-600" /> Governing Law
          </h3>
          <p className="text-gray-700 leading-relaxed">
            These Terms shall be governed and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
          </p>
        </div>

        {/* Changes to Terms */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <FileText size={28} className="mr-3 text-gray-700" /> Changes to Terms
          </h3>
          <p className="text-gray-700 leading-relaxed">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Info size={28} className="mr-3 text-teal-600" /> Contact Us
          </h3>
          <p className="text-gray-700 leading-relaxed">
            If you have any questions about these Terms, please contact us at info@meetingroi.com.
          </p>
        </div>
      </div>

      <p className="text-md text-center text-gray-600 mt-12">
        Last updated: July 14, 2025
      </p>
    </section>
  );
};

export default TermsAndConditions;