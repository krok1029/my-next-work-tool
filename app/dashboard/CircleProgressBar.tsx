'use client';

import React from 'react';
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { State } from './CountdownTimer';

const secondTimeFormatter = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
};
const chartDatas = ({
  timeLeft,
  workDuration,
  breakDuration,
  status,
}: {
  timeLeft: number;
  workDuration: number;
  breakDuration: number;
  status: State;
}) => {
  const formattedTime = secondTimeFormatter(timeLeft);

  const percentage =
    timeLeft > 0
      ? (timeLeft / (status === State.Work ? workDuration : breakDuration)) *
        100
      : 0;

  const dynamicEndAngle = 90 - (percentage * 360) / 100;

  const chartData = [
    {
      name: status,
      visitors: percentage,
      fill:
        status === State.Work ? 'var(--color-default)' : 'hsl(var(--chart-3))',
    },
  ];

  return { formattedTime, dynamicEndAngle, chartData };
};

const CircleProgressBar = (props: {
  timeLeft: number;
  workDuration: number;
  breakDuration: number;
  status: State;
}) => {
  const chartConfig = {
    default: {
      color: 'hsl(var(--chart-2))',
    },
  };

  const { formattedTime, dynamicEndAngle, chartData } = chartDatas(props);

  return (
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
  );
};

export default CircleProgressBar;
