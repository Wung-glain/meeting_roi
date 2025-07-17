// BillingAndPlans.tsx
import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  DollarSign,
  Calendar,
  History,
  PlusCircle,
  ArrowLeft,
  Info,
  ExternalLink
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

// Reusable typed Button
type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'destructive' | 'ghost';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'default',
  className = '',
  type = 'button',
}) => {
  let baseClasses = "px-4 py-2 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  if (variant === 'default') {
    baseClasses += " bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500";
  } else if (variant === 'outline') {
    baseClasses += " border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-400 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700";
  } else if (variant === 'destructive') {
    baseClasses += " bg-red-600 hover:bg-red-700 text-white focus:ring-red-500";
  } else if (variant === 'ghost') {
    baseClasses += " text-gray-700 hover:bg-gray-100 dark:text-gray-200";
  }
  return <button type={type} onClick={onClick} className={`${baseClasses} ${className}`}>{children}</button>;
};

// Mock payment history
const mockPaymentHistory = [
  { id: 'TXN001', date: '2024-06-10', amount: '$49.99', status: 'Completed', description: 'Pro Plan Monthly' },
  { id: 'TXN002', date: '2024-05-10', amount: '$49.99', status: 'Completed', description: 'Pro Plan Monthly' },
  { id: 'TXN003', date: '2024-04-10', amount: '$49.99', status: 'Completed', description: 'Pro Plan Monthly' },
];

const BillingAndPlans: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [billingData, setBillingData] = useState({
    subscription_plan: user?.subscription_plan || "Free Tier",
    plan_expires: user?.plan_expires || "N/A",
    last_payment: user?.last_payment || "N/A",
    payment_method: user?.payment_method || "N/A",
  });

  useEffect(() => {
    if(loading) return;
    if (user) {
      setBillingData({
        subscription_plan: user.subscription_plan || "Free Tier",
        plan_expires: user.plan_expires || "N/A",
        last_payment: user.last_payment || "N/A",
        payment_method: user.payment_method || "N/A",
      });
    } else {
      navigate('/login');
    }
  }, [user,loading, navigate]);

  const handleManageSubscription = () => {
    toast.info("Redirecting to subscription management...");
  };

  const handleUpdatePaymentMethod = () => {
    toast.info("Redirecting to update payment method...");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-lg text-gray-700 dark:text-gray-200">Loading billing information...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-inter text-gray-800 dark:text-gray-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Billing & Plans</h1>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg space-y-10 border dark:border-gray-700">

          {/* Current Plan */}
          <section className="space-y-6">
            <h3 className="text-2xl font-semibold flex items-center">
              <DollarSign size={28} className="mr-3 text-indigo-600" /> Your Current Plan
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border dark:border-gray-700">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Plan:</p>
                  <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{billingData.subscription_plan}</p>
                </div>
                <div>
                  <p className="font-medium">Renewal/Expires:</p>
                  <p className="flex items-center">
                    <Calendar size={18} className="mr-2 text-gray-500" /> {billingData.plan_expires}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Last Payment:</p>
                  <p>{billingData.last_payment}</p>
                </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <Button onClick={handleManageSubscription} className="flex-1">
                  Manage Subscription
                </Button>
                <Link to="/pricing" className="flex-1">
                  <Button variant="outline" className="w-full">Change Plan</Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Payment Method */}
          <section className="space-y-6">
            <h3 className="text-2xl font-semibold flex items-center">
              <CreditCard size={28} className="mr-3 text-teal-600" /> Payment Method
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border dark:border-gray-700">
              <p className="mb-4">
                Your payment method: <strong>{billingData.payment_method}</strong>
              </p>
              <Button variant="outline" onClick={handleUpdatePaymentMethod} className="w-full flex items-center justify-center">
                <PlusCircle size={18} className="mr-2" /> Update Payment Method
              </Button>
            </div>
          </section>

          {/* Payment History */}
          <section className="space-y-6">
            <h3 className="text-2xl font-semibold flex items-center">
              <History size={28} className="mr-3 text-orange-600" /> Payment History
            </h3>
            <div className="overflow-x-auto bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border dark:border-gray-700">
              {mockPaymentHistory.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {mockPaymentHistory.map(payment => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 text-sm">{payment.date}</td>
                        <td className="px-6 py-4 text-sm">{payment.description}</td>
                        <td className="px-6 py-4 text-sm">{payment.amount}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <a href="#" className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 flex items-center justify-end">
                            View Invoice <ExternalLink size={14} className="ml-1" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-700 dark:text-gray-300 text-center py-4">No payment history available.</p>
              )}
            </div>
          </section>

          {/* Billing Support */}
          <section className="space-y-6">
            <h3 className="text-2xl font-semibold flex items-center">
              <Info size={28} className="mr-3 text-gray-600" /> Billing Support
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border dark:border-gray-700">
              <p className="mb-4">
                If you have any questions, please contact support.
              </p>
              <Link to="/contact">
                <Button variant="outline" className="w-full flex items-center justify-center">
                  Contact Billing Support <ExternalLink size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default BillingAndPlans;
