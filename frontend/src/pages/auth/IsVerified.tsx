// src/pages/auth/VerifyEmail.tsx

import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import API_BASE_URL from '@/utils/api';

// Button Component with correct prop types
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
  let baseClasses =
    'px-4 py-2 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  switch (variant) {
    case 'default':
      baseClasses += ' bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500';
      break;
    case 'outline':
      baseClasses += ' border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-400';
      break;
    case 'destructive':
      baseClasses += ' bg-red-600 hover:bg-red-700 text-white focus:ring-red-500';
      break;
    case 'ghost':
      baseClasses += ' text-gray-700 hover:bg-gray-100';
      break;
  }

  return (
    <Button type={type} onClick={onClick} className={`${baseClasses} ${className}`}>
      {children}
    </Button>
  );
};

const IsVerified: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setVerificationStatus('error');
      setMessage('Verification link is invalid or missing a token.');
      setErrorDetails('Please ensure you clicked the complete link from your email.');
      setTimeout(() => navigate('/verify-email'), 3000);
      return;
    }

    const verifyToken = async () => {
      setVerificationStatus('loading');
      setMessage('Verifying your email address...');
      setErrorDetails(null);

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/verify`, { token });

        if (response.status === 200) {
          setVerificationStatus('success');
          setMessage('Your email has been successfully verified!');
          setTimeout(() => navigate('/dashboard'), 3000);
        } else {
          setVerificationStatus('error');
          setMessage(response.data.message || 'Email verification failed.');
          setErrorDetails(response.data.detail || 'An unexpected error occurred.');
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (err: any) {
        setVerificationStatus('error');
        if (axios.isAxiosError(err) && err.response) {
          setMessage(err.response.data.message || 'Email verification failed.');
          setErrorDetails(err.response.data.detail || 'Please try again or contact support.');
        } else {
          setMessage('Failed to connect to the verification server.');
          setErrorDetails('Please check your internet connection or try again later.');
        }
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 dark:bg-gray-900 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full text-center space-y-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        {verificationStatus === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader2 className="h-16 w-16 text-blue-500 animate-spin mb-6" />
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">{message}</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-3">
              Please wait while we confirm your email. You will be redirected shortly.
            </p>
          </div>
        )}

        {verificationStatus === 'success' && (
          <div className="flex flex-col items-center">
            <CheckCircle className="h-24 w-24 text-green-500 mb-6" />
            <h2 className="text-4xl font-extrabold text-green-700 dark:text-green-400 mb-3">Success!</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">
              {message} You will be redirected to your dashboard shortly.
            </p>
          </div>
        )}

        {verificationStatus === 'error' && (
          <div className="flex flex-col items-center">
            <XCircle className="h-24 w-24 text-red-500 mb-6" />
            <h2 className="text-3xl font-bold text-red-700 dark:text-red-400 mb-3">Verification Failed</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">{message}</p>
            {errorDetails && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Details: {errorDetails}</p>
            )}
            <p className="text-gray-600 dark:text-gray-400 mt-4">You will be redirected to the login page shortly.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IsVerified;
