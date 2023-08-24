'use client';

import { Color, ValueFormatter } from '../lib/inputTypes';
import {
  Pie,
  PieChart as ReChartsDonutChart,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { defaultValueFormatter, themeColorRange } from '../lib';
import { parseData, parseLabelInput } from './inputParser';

import type BaseAnimationTimingProps from '../common/BaseAnimationTimingProps';
import { DonutChartTooltip } from './DonutChartTooltip';
import NoData from '../common/NoData';
import React from 'react';
import { tremorTwMerge } from '../lib';

type DonutChartVariant = 'donut' | 'pie';

export interface DonutChartProps
  extends BaseAnimationTimingProps,
    React.HTMLAttributes<HTMLDivElement> {
  data: any[];
  category?: string;
  index?: string;
  colors?: Color[];
  variant?: DonutChartVariant;
  valueFormatter?: ValueFormatter;
  label?: string;
  showLabel?: boolean;
  showAnimation?: boolean;
  showTooltip?: boolean;
  noDataText?: string;
}

const DonutChart = React.forwardRef<HTMLDivElement, DonutChartProps>(
  (props, ref) => {
    const {
      data = [],
      category = 'value',
      index = 'name',
      colors = themeColorRange,
      variant = 'donut',
      valueFormatter = defaultValueFormatter,
      label,
      showLabel = true,
      animationDuration = 900,
      showAnimation = true,
      showTooltip = true,
      noDataText,
      className,
      ...other
    } = props;
    const isDonut = variant == 'donut';

    const parsedLabelInput = parseLabelInput(
      label,
      valueFormatter,
      data,
      category
    );

    return (
      <div
        ref={ref}
        className={tremorTwMerge('w-full h-44', className)}
        {...other}
      >
        <ResponsiveContainer className="h-full w-full">
          {data?.length ? (
            <ReChartsDonutChart>
              {showLabel && isDonut ? (
                <text
                  className={'--primary'}
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {parsedLabelInput}
                </text>
              ) : null}
              <Pie
                className="--background"
                data={parseData(data, colors)}
                cx="50%"
                cy="50%"
                startAngle={90}
                endAngle={-270}
                innerRadius={isDonut ? '75%' : '0%'}
                outerRadius="100%"
                stroke=""
                strokeLinejoin="round"
                dataKey={category}
                nameKey={index}
                isAnimationActive={showAnimation}
                animationDuration={animationDuration}
              />
              {showTooltip ? (
                <Tooltip
                  wrapperStyle={{ outline: 'none' }}
                  content={({ active, payload }) => (
                    <DonutChartTooltip
                      active={active}
                      payload={payload}
                      valueFormatter={valueFormatter}
                    />
                  )}
                />
              ) : null}
            </ReChartsDonutChart>
          ) : (
            <NoData noDataText={noDataText} />
          )}
        </ResponsiveContainer>
      </div>
    );
  }
);

DonutChart.displayName = 'DonutChart';

export default DonutChart;
