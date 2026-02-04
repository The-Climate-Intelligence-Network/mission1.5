import React from 'react';

import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import { Text as RNText } from 'react-native';
import { textStyle } from './styles';

type ITextProps = React.ComponentProps<typeof RNText> &
  VariantProps<typeof textStyle>;

const EcoText = React.forwardRef<React.ComponentRef<typeof RNText>, ITextProps>(
  function EcoText(
    {
      className,
      isTruncated,
      bold,
      underline,
      strikeThrough,
      size = 'md',
      sub,
      italic,
      highlight,
      retro,
      ...props
    },
    ref
  ) {
    return (
      <RNText
        className={textStyle({
          isTruncated,
          bold,
          underline,
          strikeThrough,
          size,
          sub,
          italic,
          highlight,
          retro,
          class: className,
        })}
        {...props}
        ref={ref}
      />
    );
  }
);

EcoText.displayName = 'EcoText';

const Text = EcoText;
Text.displayName = 'Text';

export { Text, EcoText };
