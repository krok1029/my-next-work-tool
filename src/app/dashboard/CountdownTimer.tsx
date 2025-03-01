'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { CardFooter } from '../../components/ui/card';
import useFetch from '@/hooks/use-fetch';
import { User } from '@/domain/user/User';
import { useTodoStore } from '@/lib/zustandStore';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { mutate } from 'swr';
import CircleProgressBar from '@/app/dashboard/CircleProgressBar';

export enum State {
  Work = 'Work',
  Break = 'Break',
}

const useTimer = (
  initialTime: number,
  isActive: boolean,
  onComplete: () => Promise<void>
) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const stableOnComplete = useCallback(onComplete, []);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const timeout = setTimeout(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stableOnComplete().catch(console.error);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [isActive, timeLeft, stableOnComplete]);

  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

  return { timeLeft, setTimeLeft };
};

const handleConsumePomodoro = async (id: number) => {
  try {
    const response = await fetch(`/api/todos/${id}/consume_pomodoro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      mutate('/api/todos', undefined, { revalidate: true });
    } else {
      console.error('Failed to consume pomodoro');
    }
  } catch (error) {
    console.error('Error Failed to consume pomodoro:', error);
  }
};

export default function CountdownTimer() {
  const { data: user, isLoading } = useFetch<User>('/api/user');
  const workDuration = (user?.workDuration ?? 0) * 60;
  const breakDuration = (user?.breakDuration ?? 0) * 60;

  const [status, setStatus] = useState<State>(State.Work);
  const {
    selectedTodo,
    setSelectedTodo,
    startProgress,
    stopProgress,
    isInProgress,
  } = useTodoStore();

  const handleNextPhase = async () => {
    if (!selectedTodo) {
      return;
    }
    if (status === State.Work) {
      await handleConsumePomodoro(selectedTodo.id);
      setSelectedTodo({
        ...selectedTodo,
        completedPomodoros: selectedTodo.completedPomodoros + 1,
      });

      if (selectedTodo.completedPomodoros + 1 >= selectedTodo.totalPomodoros) {
        resetTimer();
        return;
      }
      setStatus(State.Break);
    } else {
      setStatus(State.Work);
    }
    startProgress();
  };

  const { timeLeft, setTimeLeft } = useTimer(
    status === State.Work ? workDuration : breakDuration,
    isInProgress,
    handleNextPhase
  );

  useEffect(() => {
    if (selectedTodo) {
      setStatus(State.Work);
      setTimeLeft(workDuration);
    }
  }, [selectedTodo?.id]);

  const resetTimer = () => {
    setStatus(State.Work);
    setTimeLeft(workDuration);
    stopProgress();
  };

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <CircleProgressBar
        timeLeft={timeLeft}
        workDuration={workDuration}
        breakDuration={breakDuration}
        status={status}
      />
      {!!selectedTodo && (
        <CardFooter className="justify-center">
          <div>
            <div className="px-3 text-center text-lg">{selectedTodo.title}</div>
            <div className="px-3 pb-1 text-center text-sm text-gray-500">
              {isInProgress && status === State.Work && 'Task progressing'}
              {isInProgress && status === State.Break && 'Take a break ☕️'}
            </div>
            <div className="flex gap-2">
              {isInProgress ? (
                <Button
                  variant="outline"
                  onClick={stopProgress}
                  disabled={!selectedTodo}
                >
                  <Pause />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={startProgress}
                  disabled={!selectedTodo || selectedTodo.completed}
                >
                  <Play />
                </Button>
              )}
              <Button
                variant="outline"
                onClick={resetTimer}
                disabled={!selectedTodo}
              >
                <RotateCcw />
              </Button>
            </div>
          </div>
        </CardFooter>
      )}
    </>
  );
}
