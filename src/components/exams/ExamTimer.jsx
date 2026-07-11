import React, { useState, useEffect } from 'react';

const ExamTimer = ({ duration, onTimeUp, onTimeUpdate }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // in seconds
  const [isWarning, setIsWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeUp]);

  useEffect(() => {
    // Update parent with time spent
    const timeSpent = duration * 60 - timeLeft;
    onTimeUpdate?.(timeSpent);

    // Warning states
    const totalSeconds = duration * 60;
    if (timeLeft <= 60) {
      setIsCritical(true);
      setIsWarning(true);
    } else if (timeLeft <= totalSeconds * 0.1) {
      setIsWarning(true);
    } else {
      setIsWarning(false);
      setIsCritical(false);
    }
  }, [timeLeft, duration, onTimeUpdate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalSeconds = duration * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  const getTimerColor = () => {
    if (isCritical) return 'text-red-600 dark:text-red-400';
    if (isWarning) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getProgressColor = () => {
    if (isCritical) return 'bg-red-600';
    if (isWarning) return 'bg-yellow-600';
    return 'bg-green-600';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Time Remaining</p>
          <p className={`text-2xl font-bold ${getTimerColor()}`}>
            {formatTime(timeLeft)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Duration</p>
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            {duration} minutes
          </p>
        </div>
      </div>
      
      <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ${getProgressColor()}`}
          style={{ width: `${getProgress()}%` }}
        ></div>
      </div>

      {isWarning && (
        <p className={`mt-2 text-sm font-medium ${getTimerColor()}`}>
          {isCritical ? '⚠️ Less than 1 minute remaining!' : '⏰ Less than 10% time remaining!'}
        </p>
      )}
    </div>
  );
};

export default ExamTimer;