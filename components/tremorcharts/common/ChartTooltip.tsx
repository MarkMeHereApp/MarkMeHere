import { BaseColors, border, spacing } from '../lib';
import { Color, ValueFormatter } from '../lib';

import React from 'react';
import { tremorTwMerge } from '../lib';

export const ChartTooltipFrame = ({
  children
}: {
  children: React.ReactNode;
}) => (
  <div
    className={
      'border-2 border-border text-primary rounded-tremor-default bg-background shadow-muted'
    }
  >
    {children}
  </div>
);

export interface ChartTooltipRowProps {
  value: string;
  name: string;
  color: Color;
}

export const ChartTooltipRow = ({
  value,
  name,
  color
}: ChartTooltipRowProps) => (
  <div className="flex items-center justify-between space-x-8">
    <div className="flex items-center space-x-2">
      <span
        className={
          'h-sizing-sm w-sizing-sm border-border-md flex-shrink-0 border-background shadow-card'
        }
      />
      <p className={'text-muted-foreground'}>{name}</p>
    </div>
    <p className={'text-muted-foreground'}>{value}</p>
  </div>
);

export interface ChartTooltipProps {
  active: boolean | undefined;
  payload: any;
  label: string;
  categoryColors: Map<string, Color>;
  valueFormatter: ValueFormatter;
}

const ChartTooltip = ({
  active,
  payload,
  label,
  categoryColors,
  valueFormatter
}: ChartTooltipProps) => {
  if (active && payload) {
    return (
      <ChartTooltipFrame>
        <div
          className={tremorTwMerge(
            // light
            'border-tremor-border',
            // dark
            'dark:border-dark-tremor-border',
            spacing.twoXl.paddingX,
            spacing.sm.paddingY,
            border.sm.bottom
          )}
        >
          <p
            className={tremorTwMerge(
              // common
              'font-medium',
              // light
              'text-tremor-content-emphasis',
              // dark
              'dark:text-dark-tremor-content-emphasis'
            )}
          >
            {label}
          </p>
        </div>

        <div
          className={tremorTwMerge(
            spacing.twoXl.paddingX,
            spacing.sm.paddingY,
            'space-y-1'
          )}
        >
          {payload.map(
            ({ value, name }: { value: number; name: string }, idx: number) => (
              <ChartTooltipRow
                key={`id-${idx}`}
                value={valueFormatter(value)}
                name={name}
                color={categoryColors.get(name) ?? BaseColors.Blue}
              />
            )
          )}
        </div>
      </ChartTooltipFrame>
    );
  }
  return null;
};

export default ChartTooltip;
