
import { Link } from "react-router-dom";
import { BarChart3, Mail, Twitter, Linkedin, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <BarChart3 className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">MeetingROI</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Predict meeting productivity with AI-powered insights and save time for what matters most.
            </p>
            <div className="flex space-x-4">
              <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
              <Github className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/pricing" className="text-gray-400 hover:text-white" onClick={() => window.scrollTo(0,0)}>Pricing</Link></li>
              <li><Link to="/docs" className="text-gray-400 hover:text-white" onClick={() => window.scrollTo(0,0)}>Documentation</Link></li>
              <li><Link to="/api" className="text-gray-400 hover:text-white" onClick={() => window.scrollTo(0,0)}>API Access</Link></li>
              <li><Link to="/bulk" className="text-gray-400 hover:text-white" onClick={() => window.scrollTo(0,0)}>Bulk Predictions</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              <li><Link to="/careers" className="text-gray-400 hover:text-white">Careers</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="text-gray-400 hover:text-white">Cookie Policy</Link></li>
              <li><Link to="/security" className="text-gray-400 hover:text-white">Security</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">
            © 2025 MeetingROI. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Mail className="h-4 w-4 text-gray-400" />
            <span className="text-gray-400">support@meetingroi.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
