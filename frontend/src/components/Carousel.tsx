// src/components/HeroCarousel.tsx
import React, { useState, useEffect } from 'react';
import { Zap, TimerOff, Brain, DollarSign, CheckCircle } from 'lucide-react'; // Changed ClockOff to TimerOff

const slides = [
  {
    icon: <Zap size={80} className="text-indigo-500 dark:text-indigo-400" />,
    heading: "Predict the ROI of your meetings",
    subheading: "in seconds."
  },
  {
    icon: <TimerOff size={80} className="text-red-500 dark:text-red-400" />, // Changed ClockOff to TimerOff
    heading: "Stop wasting time on unproductive meetings.",
    subheading: "Transform your schedule into productive powerhouses."
  },
  {
    icon: <Brain size={80} className="text-blue-500 dark:text-blue-400" />,
    heading: "AI-powered Productivity Prediction",
    subheading: "Our platform analyzes your meeting data and predicts productivity."
  },
  {
    icon: <DollarSign size={80} className="text-green-500 dark:text-green-400" />,
    heading: "Accurately Calculate Meeting Costs",
    subheading: "Understand the true financial investment of holding your meetings."
  },
  {
    icon: <CheckCircle size={80} className="text-teal-500 dark:text-teal-400" />,
    heading: "Actionable Improvement Suggestions",
    subheading: "Get precise recommendations to boost productivity with 95% accuracy."
  }
];

const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(true); // State to control fade animation

  useEffect(() => {
    // Set up interval for automatic slide change
    const interval = setInterval(() => {
      setFade(false); // Start fade-out
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setFade(true); // Start fade-in for new slide
      }, 500); // Half of the transition duration
    }, 5000); // Change slide every 5 seconds

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index: number) => {
    setFade(false);
    setTimeout(() => {
      setCurrentSlide(index);
      setFade(true);
    }, 500);
  };

  const { icon, heading, subheading } = slides[currentSlide];

  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-r from-indigo-50 dark:from-gray-900 to-blue-50 dark:to-gray-800 transition-colors duration-500">
      <div
        className={`text-center transition-opacity duration-1000 ease-in-out ${
          fade ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="mb-6">{icon}</div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4 px-4">
          {heading}
        </h2>
        <p className="text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto px-4">
          {subheading}
        </p>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-3 w-3 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'bg-indigo-600 w-8' : 'bg-gray-300 dark:bg-gray-600'
            }`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;