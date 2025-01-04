'use client';

import React, { useState, useEffect, useMemo } from 'react';

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

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onComplete]);

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
      mutate('/api/todos');
    } else {
      console.error('Failed to consume pomodoro');
    }
  } catch (error) {
    console.error('Error Failed to consume pomodoro:', error);
  }
};

export default function CountdownTimer() {
  const { data: user, isLoading } = useFetch<User>('/api/user');
  const workDuration = useMemo(
    () => (user ? user.workDuration * 60 : 0),
    [user]
  );
  const breakDuration = useMemo(
    () => (user ? user.breakDuration * 60 : 0),
    [user]
  );

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
      setTimeLeft(breakDuration);
    } else {
      setStatus(State.Work);
      setTimeLeft(workDuration);
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
    setTimeLeft(workDuration);
    setStatus(State.Work);
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
