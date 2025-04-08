import React, { useState, useEffect } from 'react';

const FuturisticVogueAI = () => {
  const [isLaunching, setIsLaunching] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing...");

  // Simulate loading progress
  useEffect(() => {
    if (isLaunching) {
      const loadingTexts = [
        "Initializing neural fashion networks...",
        "Scanning style databases...",
        "Syncing trend algorithms...",
        "Calibrating aesthetic parameters...",
        "Launching Vogue AI..."
      ];
      
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          const newProgress = prev + (1 + Math.random() * 2);
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          
          // Update loading text based on progress
          const textIndex = Math.min(
            Math.floor(newProgress / 20),
            loadingTexts.length - 1
          );
          setLoadingText(loadingTexts[textIndex]);
          
          return newProgress;
        });
      }, 120);
      
      return () => clearInterval(interval);
    }
  }, [isLaunching]);
  
  // Handle launch button click
  const handleLaunch = () => {
    setIsLaunching(true);
    setLoadingProgress(0);
  };

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center">
      {/* Background grid animation */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,24,39,0)_0,_rgba(13,13,36,1)_100%)]" />
        
        {/* Horizontal lines */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={`h-line-${i}`} 
            className="absolute h-px w-full bg-cyan-900/30" 
            style={{
              top: `${(i + 1) * 5}%`,
              animation: `pulse 3s infinite ${i * 0.1}s`,
              opacity: 0.1 + (i % 3) * 0.1
            }}
          />
        ))}
        
        {/* Vertical lines */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={`v-line-${i}`} 
            className="absolute w-px h-full bg-cyan-900/30" 
            style={{
              left: `${(i + 1) * 5}%`,
              animation: `pulse 3s infinite ${i * 0.1}s`,
              opacity: 0.1 + (i % 3) * 0.1
            }}
          />
        ))}
        
        {/* Animated circles */}
        {Array.from({ length: 8 }).map((_, i) => {
          const size = 300 + (i * 50);
          return (
            <div 
              key={`circle-${i}`} 
              className="absolute rounded-full border border-cyan-500/20"
              style={{
                width: size,
                height: size,
                left: 'calc(50% - ' + size/2 + 'px)',
                top: 'calc(50% - ' + size/2 + 'px)',
                animation: `ripple 8s infinite ${i * 0.8}s`
              }}
            />
          );
        })}
      </div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center max-w-4xl w-full px-6">
        {!isLaunching ? (
          <>
            {/* Title and intro */}
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4 text-center tracking-wider">
              START VOGUE AI
            </h1>
            <p className="text-cyan-300 text-xl mb-12 text-center max-w-lg">
            Discover the future of fashion! Ready to upgrade your style and experience the next level of convenience?
            </p>
            
            {/* Futuristic launch button */}
            <button
              onClick={handleLaunch}
              className="group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:opacity-70 transition-opacity duration-300" />
              
              {/* Button border effects */}
              <div className="absolute inset-px bg-black rounded-md z-0 group-hover:opacity-90 transition-opacity" />
              
              {/* Top laser light */}
              <div className="absolute h-px w-full bg-cyan-400 top-0 left-0 animate-[slideRight_3s_ease-in-out_infinite]" />
              
              {/* Bottom laser light */}
              <div className="absolute h-px w-full bg-blue-400 bottom-0 right-0 animate-[slideLeft_3s_ease-in-out_infinite]" />
              
              {/* Left laser light */}
              <div className="absolute h-full w-px bg-cyan-400 left-0 bottom-0 animate-[slideUp_3s_ease-in-out_infinite]" />
              
              {/* Right laser light */}
              <div className="absolute h-full w-px bg-blue-400 right-0 top-0 animate-[slideDown_3s_ease-in-out_infinite]" />
              
              {/* Button text */}
              <div className="relative px-12 py-6 text-2xl font-bold text-white tracking-widest z-10">
                INITIALIZE SYSTEM
              </div>
            </button>
            
            {/* Decorative tech elements */}
            <div className="absolute top-1/4 left-16 w-32 h-32 border border-cyan-500/20 rounded-full animate-pulse" />
            <div className="absolute bottom-1/4 right-16 w-48 h-48 border border-blue-500/20 rounded-full animate-pulse" />
            
            {/* Tech Product Holograms */}
            <div className="absolute top-1/3 right-24 w-24 h-32 border border-cyan-500/30 rounded flex items-center justify-center">
              <div className="w-16 h-24 bg-gradient-to-b from-cyan-500/20 to-blue-500/20 rounded animate-pulse" />
            </div>
            
            <div className="absolute bottom-1/3 left-24 w-32 h-24 border border-blue-500/30 rounded-lg flex items-center justify-center">
              <div className="w-24 h-16 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg animate-pulse" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center w-full max-w-md bg-black/80 backdrop-blur-lg border border-cyan-500/30 rounded-lg p-10">
            {/* Loading progress */}
            <div className="w-full h-2 bg-gray-800 rounded-full mb-6 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                style={{ width: `${loadingProgress}%`, transition: 'width 0.3s ease-out' }}
              />
            </div>
            
            {/* Loading text */}
            <p className="text-cyan-400 font-mono text-center">
              {loadingText}
            </p>
            
            {/* Loading percentage */}
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mt-4">
              {Math.round(loadingProgress)}%
            </p>
            
            {/* Decorative icons */}
            <div className="flex gap-4 mt-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={`icon-${i}`} 
                  className="w-3 h-3 bg-cyan-500 rounded-full animate-ping"
                  style={{ animationDelay: `${i * 0.2}s`, animationDuration: '1.5s' }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Global styles */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 0.2; }
          50% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(0.8); opacity: 0.2; }
        }
        
        @keyframes slideRight {
          0% { transform: translateX(-100%); }
          50%, 100% { transform: translateX(100%); }
        }
        
        @keyframes slideLeft {
          0% { transform: translateX(100%); }
          50%, 100% { transform: translateX(-100%); }
        }
        
        @keyframes slideUp {
          0% { transform: translateY(100%); }
          50%, 100% { transform: translateY(-100%); }
        }
        
        @keyframes slideDown {
          0% { transform: translateY(-100%); }
          50%, 100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
};

export default FuturisticVogueAI;