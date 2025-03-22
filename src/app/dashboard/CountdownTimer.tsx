'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import useFetch from '@/hooks/use-fetch';
import useTimer from '@/hooks/use-timer';
import { useTodoStore } from '@/lib/zustandStore';
import { consumePomodoro } from '@/lib/api/todos';
import { Pause, Play, RotateCcw } from 'lucide-react';
import CircleProgressBar from '@/app/dashboard/CircleProgressBar';
import { User } from '@/domain/user/User';

export enum State {
  Work = 'Work',
  Break = 'Break',
}

export default function CountdownTimer() {
  const { data: user, isLoading } = useFetch<User>('/api/user');

  const workDuration = (user?.workDuration ?? 25) * 60;
  const breakDuration = (user?.breakDuration ?? 5) * 60;

  const [status, setStatus] = useState<State>(State.Work);

  const {
    selectedTodo,
    setSelectedTodo,
    startProgress,
    stopProgress,
    isInProgress,
  } = useTodoStore();

  const onTimerComplete = async () => {
    if (!selectedTodo) return;

    if (status === State.Work) {
      await consumePomodoro(selectedTodo.id);
      const updated = {
        ...selectedTodo,
        completedPomodoros: selectedTodo.completedPomodoros + 1,
      };
      setSelectedTodo(updated);

      if (updated.completedPomodoros >= updated.totalPomodoros) {
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
    onTimerComplete
  );

  const resetTimer = useCallback(() => {
    setStatus(State.Work);
    setTimeLeft(workDuration);
    stopProgress();
  }, [setTimeLeft, stopProgress, workDuration]);

  useEffect(() => {
    if (selectedTodo) {
      setStatus(State.Work);
      setTimeLeft(workDuration);
    }
  }, [selectedTodo?.id, setTimeLeft, workDuration]);

  useEffect(() => {
    setTimeLeft(status === State.Work ? workDuration : breakDuration);
  }, [status]);

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
                <Button variant="outline" onClick={stopProgress}>
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
              <Button variant="outline" onClick={resetTimer}>
                <RotateCcw />
              </Button>
            </div>
          </div>
        </CardFooter>
      )}
    </>
  );
}
