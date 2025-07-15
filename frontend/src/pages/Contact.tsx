import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactPage: React.FC = () => {
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
    alert('Thank you for your message! We will get back to you soon.'); // Using alert as per instructions
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
              <span>+1 (555) 123-4567</span>
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
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;