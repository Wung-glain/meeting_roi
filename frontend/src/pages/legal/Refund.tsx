// RefundPolicy.tsx
import React from 'react';
import { DollarSign, Clock, FileText, XCircle } from 'lucide-react';

const RefundPolicy: React.FC = () => {
  return (
    <section className="bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-6">Refund Policy</h2>
      <p className="text-lg text-center text-gray-600 mb-12 max-w-3xl mx-auto">
        At MeetingROI, we are committed to providing valuable services. This Refund Policy outlines the conditions under which refunds may be issued for our services.
      </p>

      <div className="space-y-10">
        {/* General Policy */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <FileText size={28} className="mr-3 text-blue-600" /> General Policy
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Our refund policy is designed to be fair and transparent. We encourage you to thoroughly evaluate our services, including any free trials or demonstrations, before making a purchase.
          </p>
        </div>

        {/* Eligibility for Refund */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <DollarSign size={28} className="mr-3 text-green-600" /> Eligibility for Refund
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Refunds may be considered under the following circumstances:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>**Technical Issues:** If you experience persistent technical issues that prevent you from using our service effectively, and our support team is unable to resolve them within a reasonable timeframe.</li>
            <li>**Service Non-Delivery:** In the rare event that the service you paid for was not delivered or activated as promised.</li>
            <li>**Within Cooling-Off Period:** For certain subscription plans, a full refund may be available if requested within a specified cooling-off period (e.g., 7 or 14 days) from the date of purchase, provided the service has not been substantially used.</li>
          </ul>
        </div>

        {/* Non-Refundable Situations */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <XCircle size={28} className="mr-3 text-red-600" /> Non-Refundable Situations
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Refunds will generally NOT be issued for:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Change of mind or dissatisfaction after the cooling-off period has expired.</li>
            <li>Issues arising from your own technical environment or third-party software.</li>
            <li>Violation of our Terms and Conditions.</li>
            <li>Any services that have been fully rendered or consumed.</li>
          </ul>
        </div>

        {/* How to Request a Refund */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Clock size={28} className="mr-3 text-purple-600" /> How to Request a Refund
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            To request a refund, please contact our support team at <a href="mailto:support@meetingroi.com" className="text-indigo-600 hover:underline">support@meetingroi.com</a> within the eligible timeframe. Please include:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Your name and account email.</li>
            <li>Date of purchase and transaction ID.</li>
            <li>A detailed explanation of the reason for your refund request.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            All refund requests will be reviewed on a case-by-case basis. We reserve the right to deny a refund request if it does not meet the criteria outlined in this policy.
          </p>
        </div>
      </div>

      <p className="text-md text-center text-gray-600 mt-12">
        Last updated: July 14, 2025
      </p>
    </section>
  );
};

export default RefundPolicy;