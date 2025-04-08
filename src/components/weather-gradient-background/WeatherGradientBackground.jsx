
import React, { useEffect, useState } from 'react';

const WeatherGradientBackground = ({ temperature }) => {
  const [animationState, setAnimationState] = useState(0);
  
  // Determine color scheme based on temperature
  const getColorScheme = (temp) => {
    if (temp === undefined || temp === null) return { from: '#4338ca', via: '#3b82f6', to: '#0ea5e9' }; // Default blue
    
    if (temp <= 0) return { from: '#1e40af', via: '#3b82f6', to: '#93c5fd' }; // Freezing (deep blue)
    if (temp <= 10) return { from: '#1d4ed8', via: '#60a5fa', to: '#bfdbfe' }; // Cold (light blue)
    if (temp <= 20) return { from: '#10b981', via: '#34d399', to: '#a7f3d0' }; // Mild (green)
    if (temp <= 30) return { from: '#f59e0b', via: '#fbbf24', to: '#fde68a' }; // Warm (yellow/orange)
    return { from: '#dc2626', via: '#ef4444', to: '#fca5a5' }; // Hot (red)
  };
  
  // Get animation speed based on temperature
  const getAnimationSpeed = (temp) => {
    if (temp === undefined || temp === null) return 10; // Default
    
    // More extreme temperatures = faster animations
    const normalizedTemp = Math.abs(temp - 20);
    return Math.max(5, Math.min(15, normalizedTemp / 2 + 5));
  };
  
  // Get animation pattern based on temperature
  const getAnimationPattern = (temp) => {
    if (temp === undefined || temp === null) return '0deg'; // Default
    
    if (temp <= 0) return '135deg'; // Diagonal for freezing
    if (temp <= 10) return '120deg'; // Angled for cold
    if (temp <= 20) return '90deg'; // Horizontal for mild
    if (temp <= 30) return '60deg'; // Angled for warm
    return '45deg'; // Diagonal for hot
  };
  
  // Calculate the intensity of the floating particles
  const getParticleIntensity = (temp) => {
    if (temp === undefined || temp === null) return 3; // Default
    
    // More extreme temperatures = more particles
    const normalizedTemp = Math.abs(temp - 20);
    return Math.floor(Math.min(5, normalizedTemp / 10 + 1));
  };
  
  // Update animation state to trigger transitions
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationState((prevState) => (prevState + 1) % 100);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  const colors = getColorScheme(temperature);
  const speed = getAnimationSpeed(temperature);
  const direction = getAnimationPattern(temperature);
  const particleCount = getParticleIntensity(temperature);
  
  // Generate hexagonal grid particles
  const generateParticles = (count) => {
    return Array.from({ length: count * 3 }).map((_, i) => {
      const size = Math.random() * 10 + 5;
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const opacity = Math.random() * 0.3 + 0.1;
      const delay = Math.random() * 5;
      
      return (
        <div 
          key={i}
          className="absolute pointer-events-none"
          style={{
            top: `${top}%`,
            left: `${left}%`,
            width: `${size}px`,
            height: `${size}px`,
            opacity: opacity,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '20%',
            animation: `float ${speed + delay}s infinite ease-in-out alternate`,
          }}
        />
      );
    });
  };
  
  const getTemperatureDisplay = (temp) => {
    if (temp === undefined || temp === null) return "Unknown";
    return `${temp}°C`;
  };
  
  const getWeatherDescription = (temp) => {
    if (temp === undefined || temp === null) return "Loading weather data";
    
    if (temp <= 0) return "Freezing conditions";
    if (temp <= 10) return "Cold weather";
    if (temp <= 20) return "Mild temperature";
    if (temp <= 30) return "Warm weather";
    return "Hot conditions";
  };
  
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Dynamic gradient background */}
      <div 
        className="absolute inset-0 transition-all duration-1000 ease-in-out bg-gradient-to-br"
        style={{
          backgroundImage: `linear-gradient(${direction}, ${colors.from}, ${colors.via}, ${colors.to})`,
          transform: `scale(1.1) rotate(${animationState % 2 === 0 ? '3deg' : '-3deg'})`,
        }}
      />
      
      {/* Futuristic overlay with grid pattern */}
      <div className="absolute inset-0 opacity-10" 
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }} 
      />
      
      {/* Dynamic particles */}
      {generateParticles(particleCount)}
      
      {/* Temperature display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <div className="text-6xl font-bold backdrop-blur-sm px-8 py-4 rounded-xl">
          {getTemperatureDisplay(temperature)}
        </div>
        <div className="text-xl mt-4 backdrop-blur-sm px-6 py-2 rounded-lg">
          {getWeatherDescription(temperature)}
        </div>
      </div>
      
      {/* CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          100% {
            transform: translateY(-20px) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default WeatherGradientBackground;