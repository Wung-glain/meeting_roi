import { useState, useEffect } from 'react';

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) setVisible(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white px-4 py-3 flex flex-col md:flex-row justify-between items-center z-50">
      <p className="text-sm">
        We use cookies to personalize your experience and analyze our traffic. Read our{' '}
        <a href="/cookie-policy" className="underline">Cookie Policy</a>.
      </p>
      <button
        onClick={acceptCookies}
        className="mt-2 md:mt-0 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Accept Cookies
      </button>
    </div>
  );
};

export default CookieBanner;
