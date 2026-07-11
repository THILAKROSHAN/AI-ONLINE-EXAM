import { useState, useEffect, useCallback, useRef } from 'react';

export const useTimer = (initialTime = 0, options = {}) => {
  const {
    autoStart = false,
    interval = 1000,
    onTick = null,
    onComplete = null,
  } = options;

  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef(null);

  const start = useCallback(() => {
    if (!isRunning && !isComplete) {
      setIsRunning(true);
      setIsPaused(false);
    }
  }, [isRunning, isComplete]);

  const pause = useCallback(() => {
    if (isRunning && !isPaused) {
      setIsPaused(true);
      setIsRunning(false);
    }
  }, [isRunning, isPaused]);

  const resume = useCallback(() => {
    if (!isRunning && isPaused) {
      setIsRunning(true);
      setIsPaused(false);
    }
  }, [isRunning, isPaused]);

  const stop = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    stop();
    setTime(initialTime);
    setIsComplete(false);
  }, [initialTime, stop]);

  const restart = useCallback(() => {
    reset();
    start();
  }, [reset, start]);

  const setTimeManually = useCallback((newTime) => {
    if (!isRunning) {
      setTime(newTime);
      setIsComplete(false);
    }
  }, [isRunning]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime - 1;
          
          if (newTime <= 0) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setIsRunning(false);
            setIsComplete(true);
            if (onComplete) onComplete();
            return 0;
          }

          if (onTick) onTick(newTime);
          return newTime;
        });
      }, interval);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, isPaused, interval, onTick, onComplete]);

  const formatTime = (seconds) => {
    const mins = Math.floor(Math.max(0, seconds) / 60);
    const secs = Math.floor(Math.max(0, seconds) % 60);
    return {
      minutes: String(mins).padStart(2, '0'),
      seconds: String(secs).padStart(2, '0'),
      formatted: `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`,
      totalSeconds: seconds,
    };
  };

  return {
    time,
    isRunning,
    isPaused,
    isComplete,
    formatted: formatTime(time),
    start,
    pause,
    resume,
    stop,
    reset,
    restart,
    setTime: setTimeManually,
  };
};

export default useTimer;