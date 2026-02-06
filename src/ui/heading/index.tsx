import React, { forwardRef } from 'react';
import { Text } from 'react-native';
import { headingStyle } from './styles';
import type { VariantProps } from '@gluestack-ui/nativewind-utils';

type IHeadingProps = VariantProps<typeof headingStyle> &
  React.ComponentProps<typeof Text> & {
    weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  };

// Map weight variants to font family names
const getFontFamily = (weight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold') => {
  switch (weight) {
    case 'light':
      return 'SpaceGrotesk-Light';
    case 'regular':
      return 'SpaceGrotesk-Regular';
    case 'medium':
      return 'SpaceGrotesk-Medium';
    case 'semibold':
      return 'SpaceGrotesk-SemiBold';
    case 'bold':
    default:
      return 'SpaceGrotesk-Bold';
  }
};

const Heading = forwardRef<React.ComponentRef<typeof Text>, IHeadingProps>(
  function Heading(
    {
      className,
      size = 'lg',
      weight = 'bold',
      isTruncated,
      bold,
      underline,
      strikeThrough,
      sub,
      italic,
      highlight,
      retro,
      ...props
    },
    ref
  ) {
    return (
      <Text
        className={headingStyle({
          size,
          isTruncated,
          bold,
          underline,
          strikeThrough,
          sub,
          italic,
          highlight,
          retro,
          class: className,
        })}
        style={{ fontFamily: getFontFamily(weight) }}
        {...props}
        ref={ref}
      />
    );
  }
);

Heading.displayName = 'Heading';

export { Heading };
