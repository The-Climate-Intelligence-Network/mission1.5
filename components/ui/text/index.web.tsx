import React from 'react';
import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import { textStyle } from './styles';

type ITextProps = React.ComponentProps<'span'> & VariantProps<typeof textStyle>;

const Text = React.forwardRef<React.ComponentRef<'span'>, ITextProps>(
  function Text(
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
    }: { className?: string } & ITextProps,
    ref
  ) {
    return (
      <span
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

const EcoText = Text;
EcoText.displayName = 'EcoText';

Text.displayName = 'Text';

export { Text, EcoText };
