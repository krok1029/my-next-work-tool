import { useState, useEffect, useRef } from 'react';

const useTimer = (
  initialTime: number,
  isActive: boolean,
  onComplete: () => Promise<void>
) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const timeout = setTimeout(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onCompleteRef.current().catch(console.error);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [isActive, timeLeft]);

  return { timeLeft, setTimeLeft };
};

export default useTimer;
