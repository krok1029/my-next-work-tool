'use client';

import React, { useState, useEffect } from 'react';
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
import { Pause, Play, RotateCcw } from 'lucide-react';

const chartConfig = {
  default: {
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export default function CountdownTimer() {
  const { data: user, isLoading } = useFetch<User>('/api/user');

  const duration = user ? user.workDuration * 60 : 0 * 60;
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  if (isLoading) {
    return;
  }

  const resetTimer = () => {
    setTimeLeft(duration);
    setIsRunning(false);
  };

  const formattedTime = secondTimeFormatter(timeLeft);

  const percentage = (timeLeft / duration) * 100;
  const dynamicEndAngle = 90 - (percentage * 360) / 100;

  const chartData = [
    { name: 'Time Left', visitors: percentage, fill: 'var(--color-default)' },
  ];

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
      <CardFooter className="justify-center">
        <div className="flex gap-2">
          {isRunning ? (
            <Button variant="outline" onClick={() => setIsRunning(false)}>
              <Pause />
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setIsRunning(true)}>
              <Play />
            </Button>
          )}
          <Button variant="outline" onClick={resetTimer}>
            <RotateCcw />
          </Button>
        </div>
      </CardFooter>
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
