'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts';

import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { CardFooter } from '../ui/card';
import useFetch from '@/hooks/use-fetch';
import { User } from '@/domain/user/User';
import { useTodoStore } from '@/lib/zustandStore';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { mutate } from 'swr';

const chartConfig = {
  default: {
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export default function CountdownTimer() {
  const { data: user, isLoading } = useFetch<User>('/api/user');
  const workDurationInSeconds = useMemo(
    () => (user ? user.workDuration * 60 : 0),
    [user]
  );
  const breakDurationInSeconds = useMemo(
    () => (user ? user.breakDuration * 60 : 0),
    [user]
  );
  const [timeLeft, setTimeLeft] = useState<number>(workDurationInSeconds);
  const [status, setStatus] = useState<'WORK' | 'BREAK'>('WORK');
  const {
    selectedTodo,
    setSelectedTodo,
    startProgress,
    stopProgress,
    isInProgress,
  } = useTodoStore();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isInProgress) {
      interval = setInterval(() => {
        setTimeLeft((prev) => Math.max(prev - 1, 0));
      }, 1000);
    }

    if (timeLeft === 0 && interval) {
      clearInterval(interval);
      stopProgress();
      handleNextPhase();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isInProgress, timeLeft]);

  useEffect(() => {
    if (selectedTodo) {
      setStatus('WORK');
      setTimeLeft(workDurationInSeconds);
    }
  }, [selectedTodo?.id]);

  const handleNextPhase = async () => {
    if (!selectedTodo) {
      return;
    }
    if (status === 'WORK') {
      await handleConsumePomodoro();
      setSelectedTodo({
        ...selectedTodo,
        completedPomodoros: selectedTodo.completedPomodoros + 1,
      });

      if (selectedTodo.completedPomodoros + 1 >= selectedTodo.totalPomodoros) {
        return;
      }
      setStatus('BREAK');
      setTimeLeft(breakDurationInSeconds);
    } else {
      setStatus('WORK');
      setTimeLeft(workDurationInSeconds);
    }
    startProgress();
  };

  const resetTimer = () => {
    setTimeLeft(workDurationInSeconds);
    setStatus('WORK');
    stopProgress();
  };

  const handleConsumePomodoro = async () => {
    try {
      const response = await fetch(
        `/api/todos/${selectedTodo?.id}/consume_pomodoro`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        mutate('/api/todos');
      } else {
        console.error('Failed to consume pomodoro');
      }
    } catch (error) {
      console.error('Error Failed to consume pomodoro:', error);
    }
  };

  const formattedTime = secondTimeFormatter(timeLeft);
  const percentage =
    timeLeft > 0
      ? (timeLeft /
          (status === 'WORK'
            ? workDurationInSeconds
            : breakDurationInSeconds)) *
        100
      : 0;
  const dynamicEndAngle = 90 - (percentage * 360) / 100;

  const chartData = [
    {
      name: status === 'WORK' ? 'Work' : 'Break',
      visitors: percentage,
      fill: status === 'WORK' ? 'var(--color-default)' : 'hsl(var(--chart-3))',
    },
  ];

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <RadialBarChart
          data={chartData}
          startAngle={90}
          endAngle={dynamicEndAngle}
          innerRadius={80}
          outerRadius={110}
        >
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="none"
            className="first:fill-muted last:fill-background"
            polarRadius={[86, 74]}
          />
          <RadialBar dataKey="visitors" background cornerRadius={10} />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-4xl font-bold"
                      >
                        {formattedTime}
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </ChartContainer>
      {!!selectedTodo && (
        <CardFooter className="justify-center">
          <div>
            <div className="px-3 text-center text-lg">{selectedTodo.title}</div>
            <div className="px-3 pb-1 text-center text-sm text-gray-500">
              {status === 'WORK' ? 'Task progressing' : 'That take a break ☕️'}
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

const secondTimeFormatter = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
};
