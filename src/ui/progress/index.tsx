"use client";
import React from "react";
import { LayoutChangeEvent, View } from "react-native";
import type { VariantProps } from "@gluestack-ui/nativewind-utils";
import { tva } from "@gluestack-ui/nativewind-utils/tva";
import { colors } from "../tokens/colors";

const sizeToPx = {
  xs: 6,
  sm: 8,
  md: 10,
  lg: 12,
  xl: 14,
  "2xl": 16,
} as const;

const progressStyle = tva({
  base: "border-2 border-ink bg-surface overflow-hidden",
  variants: {
    orientation: {
      horizontal: "w-full",
      vertical: "h-full",
    },
  },
});

type ProgressSize = keyof typeof sizeToPx;

type SegmentedProgressProps = VariantProps<typeof progressStyle> & {
  value?: number;
  min?: number;
  max?: number;
  segments?: number;
  size?: ProgressSize;
  className?: string;
};

const SegmentedProgress = React.forwardRef<View, SegmentedProgressProps>(
  function SegmentedProgress(
    {
      value = 0,
      min = 0,
      max = 100,
      segments,
      size = "md",
      orientation = "horizontal",
      className,
      ...props
    },
    ref
  ) {
    const [trackLength, setTrackLength] = React.useState(0);
    const maxSegments = Math.max(1, Math.min(12, segments ?? 12));
    const minSegmentSize = 6;
    const gap = 2;

    const handleLayout = (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      setTrackLength(orientation === "horizontal" ? width : height);
    };

    const autoSegments =
      trackLength > 0
        ? Math.max(
            1,
            Math.min(
              maxSegments,
              Math.floor((trackLength + gap) / (minSegmentSize + gap))
            )
          )
        : maxSegments;

    const segmentCount = segments ?? autoSegments;
    const progressRatio =
      max <= min ? 0 : Math.max(0, Math.min(1, (value - min) / (max - min)));
    const filledSegments = Math.round(progressRatio * segmentCount);

    const thickness = sizeToPx[size] ?? sizeToPx.md;
    const trackStyle =
      orientation === "horizontal"
        ? { height: thickness }
        : { width: thickness };

    return (
      <View
        ref={ref}
        {...props}
        onLayout={handleLayout}
        className={progressStyle({ orientation, class: className })}
        style={trackStyle}
      >
        <View
          className={
            orientation === "horizontal" ? "flex-row gap-1" : "flex-col gap-1"
          }
          style={{ flex: 1 }}
        >
          {Array.from({ length: segmentCount }).map((_, index) => {
            const isFilled = index < filledSegments;
            return (
              <View
                // eslint-disable-next-line react/no-array-index-key
                key={`${segmentCount}-${index}`}
                style={{
                  flex: 1,
                  minWidth: orientation === "horizontal" ? minSegmentSize : undefined,
                  minHeight: orientation === "vertical" ? minSegmentSize : undefined,
                  borderRadius: 3,
                  backgroundColor: isFilled ? colors.digital : colors.surface,
                }}
              />
            );
          })}
        </View>
      </View>
    );
  }
);

const Progress = SegmentedProgress;

const ProgressFilledTrack = () => null;

Progress.displayName = "Progress";
ProgressFilledTrack.displayName = "ProgressFilledTrack";

export { Progress, ProgressFilledTrack };
