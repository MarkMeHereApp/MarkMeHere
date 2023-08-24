import React, { useRef } from 'react';
import { useEffect, useState } from 'react';

import { Color } from '../lib';
import { Legend } from './legend';

const useOnWindowResize = (
  handler: { (): void },
  initialWindowSize?: number
) => {
  const [windowSize, setWindowSize] = useState<undefined | number>(
    initialWindowSize
  );
  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
      handler();
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [handler, windowSize]);
};

const ChartLegend = (
  { payload }: any,
  categoryColors: Map<string, Color>,
  setLegendHeight: React.Dispatch<React.SetStateAction<number>>
) => {
  const legendRef = useRef<HTMLDivElement>(null);

  useOnWindowResize(() => {
    const calculateHeight = (height: number | undefined) =>
      height
        ? Number(height) + 20 // 20px extra padding
        : 60; // default height
    setLegendHeight(calculateHeight(legendRef.current?.clientHeight));
  });

  return (
    <div ref={legendRef} className="flex items-center justify-end">
      <Legend
        categories={payload.map((entry: any) => entry.value)}
        colors={payload.map((entry: any) => categoryColors.get(entry.value))}
      />
    </div>
  );
};

export default ChartLegend;
