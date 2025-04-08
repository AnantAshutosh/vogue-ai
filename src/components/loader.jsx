import React, { useEffect, useState } from 'react';
import { ShoppingBag, Package, Zap } from 'lucide-react';

const Loader = ({ 
  color = "#3B82F6", 
  secondaryColor = "#10B981",
  size = "md",
  text = "Loading your experience"
}) => {
  const [progress, setProgress] = useState(0);
  const [currentIcon, setCurrentIcon] = useState(0);
  
  // Size mapping
  const sizeMap = {
    sm: {
      container: "w-48 h-48",
      ring: "w-24 h-24",
      icon: 24,
      text: "text-xs",
      dots: "w-1 h-1",
    },
    md: {
      container: "w-64 h-64",
      ring: "w-32 h-32",
      icon: 32,
      text: "text-sm",
      dots: "w-1.5 h-1.5",
    },
    lg: {
      container: "w-80 h-80",
      ring: "w-40 h-40",
      icon: 40,
      text: "text-base",
      dots: "w-2 h-2",
    }
  };
  
  const currentSize = sizeMap[size] || sizeMap.md;
  
  const icons = [
    <ShoppingBag key="bag" size={currentSize.icon} />,
    <Package key="package" size={currentSize.icon} />,
    <Zap key="zap" size={currentSize.icon} />
  ];
  
  // Animation logic
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 1;
      });
    }, 40);
    
    const iconInterval = setInterval(() => {
      setCurrentIcon(prev => (prev + 1) % icons.length);
    }, 1500);
    
    return () => {
      clearInterval(progressInterval);
      clearInterval(iconInterval);
    };
  }, []);
  
  // Generate orbital dots
  const generateDots = (count) => {
    const dots = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 360;
      dots.push(
        <div 
          key={i}
          className={`absolute ${currentSize.dots} rounded-full bg-white`}
          style={{
            transform: `rotate(${angle}deg) translateY(-160%) ${i % 3 === 0 ? 'scale(1.5)' : ''}`,
            opacity: (Math.sin((progress / 100 * 360 + angle) * (Math.PI / 180)) + 1) / 2,
            filter: `blur(${i % 4 === 0 ? '1px' : '0px'})`,
            backgroundColor: i % 3 === 0 ? secondaryColor : color
          }}
        />
      );
    }
    return dots;
  };
  
  return (
    <div className={`${currentSize.container} flex flex-col items-center justify-center relative mx-auto`}>
      {/* Background pulse */}
      <div className="absolute inset-0 rounded-full opacity-10" 
        style={{ 
        //   backgroundColor: color,
          animation: "pulse 3s infinite"
        }}
      />
      
      {/* Orbital ring */}
      <div className={`${currentSize.ring} relative flex items-center justify-center`}>
        {/* Orbital dots */}
        {generateDots(24)}
        
        {/* Center container */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Icon */}
            <div className="absolute inset-0 flex items-center justify-center text-white transition-opacity duration-500"
              style={{ 
                opacity: (Math.sin(progress / 100 * Math.PI * 2) + 1) / 2,
                color: progress > 50 ? secondaryColor : color 
              }}
            >
              {icons[currentIcon]}
            </div>
            
            {/* Progress ring */}
            <svg className={`${currentSize.ring}`} viewBox="0 0 100 100">
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                fill="none" 
                strokeWidth="2" 
                stroke="rgba(255, 255, 255, 0.1)" 
              />
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                fill="none" 
                strokeWidth="3" 
                stroke={progress > 50 ? secondaryColor : color}
                strokeLinecap="round" 
                strokeDasharray={2 * Math.PI * 40} 
                strokeDashoffset={2 * Math.PI * 40 * (1 - progress / 100)} 
                transform="rotate(-90 50 50)" 
                style={{ 
                  filter: `drop-shadow(0 0 3px ${progress > 50 ? secondaryColor : color})` 
                }}
              />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Loading text */}
      <div className={`mt-8 ${currentSize.text} font-medium text-white flex items-center`}
        style={{ color }}
      >
        {text}
        <span className="ml-2 flex space-x-1">
          {[0, 1, 2].map((i) => (
            <span 
              key={i} 
              className="inline-block w-1 h-1 rounded-full"
              style={{ 
                backgroundColor: color,
                animation: `fadeInOut 1.5s infinite ${i * 0.2}s` 
              }}
            />
          ))}
        </span>
      </div>
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(0.95); opacity: 0.1; }
          50% { transform: scale(1.05); opacity: 0.2; }
        }
        
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-2px); }
        }
      `}</style>
    </div>
  );
};

export default Loader;