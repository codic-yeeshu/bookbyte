import React, { useState, useEffect } from 'react';
import { Server, Activity, Coffee, Rocket, CheckCircle } from 'lucide-react';

const ServerWakeup = () => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  
  const messages = [
    "Waking up the servers...",
    "Pouring some virtual coffee...",
    "Stretching database connections...",
    "Loading your BookByte experience...",
    "Almost there..."
  ];

  useEffect(() => {
    // A fake progress bar that gradually fills up over roughly 50 seconds
    const duration = 50000;
    const interval = 100;
    const increment = (100 / (duration / interval));
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 99) return 99; // Hang at 99% until actual response
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Cycle through messages every 10 seconds
    const messageTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 10000);
    return () => clearInterval(messageTimer);
  }, [messages.length]);

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Animated Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-fuchsia-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="z-10 max-w-md w-full bg-neutral-800/50 backdrop-blur-xl border border-neutral-700/50 p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center transform transition-all">
        
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
          <div className="relative bg-neutral-800 p-5 rounded-full border border-neutral-700">
            <Server className="w-12 h-12 text-indigo-400 animate-bounce" style={{ animationDuration: '2s' }} />
          </div>
          
          <div className="absolute -top-2 -right-2 bg-neutral-800 p-2 rounded-full border border-neutral-700">
            <Coffee className="w-4 h-4 text-orange-400 animate-pulse" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-3 text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-fuchsia-400">
          Server Sleeping
        </h1>
        
        <p className="text-neutral-400 mb-8 min-h-[48px] flex items-center justify-center transition-all duration-500">
          {messages[messageIndex]}
        </p>

        <div className="w-full space-y-3">
          <div className="flex justify-between text-sm text-neutral-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Activity className="w-4 h-4" /> 
              Booting Instance
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          
          {/* Progress Bar Container */}
          <div className="w-full h-3 bg-neutral-900/50 rounded-full overflow-hidden border border-neutral-700/50">
            <div 
              className="h-full bg-linear-to-r from-indigo-500 via-purple-500 to-fuchsia-500 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite] shimmer"></div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-700/50 w-full text-sm text-neutral-500 flex items-start gap-3 text-left">
          <Rocket className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
          <p>
            BookByte is hosted on a free tier which goes to sleep after inactivity. 
            It usually takes <span className="text-neutral-300 font-medium">30-50 seconds</span> to spin back up. Thanks for your patience!
          </p>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
};

export default ServerWakeup;
