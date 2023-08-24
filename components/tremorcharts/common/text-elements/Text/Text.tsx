import { Color } from '../../../lib/inputTypes';
import React from 'react';
import { colorPalette } from '../../../lib/theme';
import { getColorClassNames } from '../../../lib';
import { tremorTwMerge } from '../../../lib';

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  color?: Color;
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>((props, ref) => {
  const { color, className, children } = props;
  return (
    <p
      ref={ref}
      className={tremorTwMerge(
        // common
        'text-tremor-default',
        color
          ? getColorClassNames(color, colorPalette.text).textColor
          : tremorTwMerge(
              // light
              'text-tremor-content',
              // dark
              'dark:text-dark-tremor-content'
            ),
        className
      )}
    >
      {children}
    </p>
  );
});

Text.displayName = 'Text';

export default Text;
