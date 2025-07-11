import React, { useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // Show splash for 3 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      {/* Logo */}
      <div className="mb-8 animate-pulse">
        <img 
          src="/golden-lion-with-crown-logo-vector-45981373.png" 
          alt="LEOIPTV Logo" 
          className="w-48 h-48 object-contain"
        />
      </div>

      {/* Powered by text */}
      <div className="text-center">
        <p className="text-2xl text-yellow-500 font-bold tracking-wider mb-4">
          Powered by LEOIPTV
        </p>
        
        {/* Loading animation */}
        <div className="flex space-x-2 justify-center">
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>

      {/* Version info */}
      <div className="absolute bottom-8 text-center">
        <p className="text-gray-400 text-sm">Version 1.0.0</p>
        <p className="text-gray-500 text-xs">Professional IPTV Solution</p>
      </div>
    </div>
  );
};