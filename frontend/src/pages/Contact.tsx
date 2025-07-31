import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";

const ContactPage: React.FC = () => {
  const [loading , setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real application, you would send this data to a backend API
    console.log('Form submitted:', formData);
     // Using alert as per instructions
    setFormData({ // Clear form
      name: '',
      email: '',
      subject: '',
      message: ''
    });

   
  };

  return (
    <section className="bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-6">Get in Touch</h2>
      <p className="text-lg text-center text-gray-600 mb-12 max-w-3xl mx-auto">
        Have questions, feedback, or want to learn more about how MeetingROI can help your organization? Reach out to us using the form below or through our contact details.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="bg-gray-50 p-8 rounded-xl shadow-md border border-gray-200 flex flex-col justify-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Contact Information</h3>
          <div className="space-y-6">
            <div className="flex items-center text-gray-700">
              <Mail size={24} className="text-indigo-600 mr-4" />
              <span>info@meetingroi.com</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Phone size={24} className="text-indigo-600 mr-4" />
              <span>+237 (673) 981-991</span>
            </div>
            <div className="flex items-start text-gray-700">
              <MapPin size={24} className="text-indigo-600 mr-4 mt-1" />
              <span>123 Productivity Lane, Suite 400, Efficiency City, ROI 90210</span>
            </div>
          </div>
          <div className="mt-8">
            <h4 className="text-xl font-semibold text-gray-800 mb-3">Business Hours:</h4>
            <p className="text-gray-700">Monday - Friday: 9:00 AM - 5:00 PM (WAT)</p>
            <p className="text-gray-700">Saturday - Sunday: Closed</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-gray-50 p-8 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Send Us a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-gray-700 text-sm font-medium mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700 text-sm font-medium mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              ></textarea>
            </div>
            <Button
                type="submit"
                className="w-full h-10 text-base font-semibold rounded-md
                           bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
                           text-white shadow-lg transition-all duration-300 transform hover:scale-105
                           relative overflow-hidden" // Added relative and overflow-hidden for loading animation
                disabled={loading} // Disable when loading
              >
                {loading ? (
                  <>
                    <span className="absolute inset-0 flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                    <span className="opacity-5">Sending Message...</span> {/* Hidden text for button width */}
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;