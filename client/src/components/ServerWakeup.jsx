import React, { useState, useEffect } from 'react';

const ServerWakeup = () => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  
  const messages = [
    "Lighting the lamps…",
    "Dusting the shelves…",
    "Unlocking the stockroom…",
    "Setting out this week's picks…",
    "Almost there…"
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
    <div className="flex min-h-screen items-center justify-center bg-bg p-6 text-ink">
      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        <span className="font-heading text-[34px] leading-none font-medium tracking-[-0.02em]">
          Book<em className="text-accent">byte</em>
        </span>

        <div className="flex flex-col gap-3">
          <span className="eyebrow">One moment</span>
          <h1 className="m-0 text-[40px] leading-[1.05] font-normal">
            The shop is just <em className="text-accent">waking up</em>.
          </h1>
          <p className="m-0 min-h-6 text-muted italic">{messages[messageIndex]}</p>
        </div>

        <div className="flex w-full flex-col gap-2">
          <div className="h-px w-full bg-divider">
            <div
              className="h-px bg-accent transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted tabular-nums">
            <span>Opening the doors</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        <p className="m-0 border-t border-divider pt-5 text-sm text-muted">
          Bookbyte runs on a free tier that naps when it's quiet. It usually takes
          {' '}<span className="text-ink">30–50 seconds</span> to spin back up — thanks for your patience.
        </p>
      </div>
    </div>
  );
};

export default ServerWakeup;
