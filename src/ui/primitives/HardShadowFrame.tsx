import React from "react";
import {
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
  type StyleProp,
} from "react-native";
import { hardShadows } from "../tokens/shadows";
import { colors } from "../tokens/colors";
import { Scanlines } from "../scanlines";

type ShadowSize = 0 | 2 | 4;

type HardShadowFrameProps = Omit<ViewProps, "style"> & {
  radius?: number;
  borderColor?: string;
  borderWidth?: number;
  shadowSize?: ShadowSize;
  shadowColor?: string;
  bg?: string;
  pressed?: boolean;
  className?: string;
  contentClassName?: string;
  wrapperClassName?: string;
  shadowClassName?: string;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  shadowStyle?: StyleProp<ViewStyle>;
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  shadow: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  content: {
    zIndex: 1,
  },
});

const HardShadowFrame = React.forwardRef<View, HardShadowFrameProps>(
  function HardShadowFrame(
    {
      radius = 12,
      borderColor,
      borderWidth,
      shadowSize = hardShadows.md.offset,
      shadowColor = colors.ink,
      bg,
      pressed = false,
      className,
      contentClassName,
      wrapperClassName,
      shadowClassName,
      style,
      contentStyle,
      shadowStyle,
      children,
      ...props
    },
    ref
  ) {
    const pressOffset = pressed ? hardShadows.pressOffset : 0;
    const effectiveShadow = Math.max(0, (shadowSize ?? 0) - pressOffset);

    const frontClassName = contentClassName ?? className;

    const resolvedBorderWidth =
      borderWidth === undefined ? undefined : borderWidth;
    const resolvedBorderColor =
      borderColor ?? colors.ink;
    const borderStyle =
      resolvedBorderWidth === undefined
        ? {}
        : { borderWidth: resolvedBorderWidth, borderColor: resolvedBorderColor };
    const backgroundStyle =
      bg === undefined ? {} : { backgroundColor: bg };

    return (
      <View
        className={wrapperClassName}
        style={[styles.container, style]}
      >
        <View
          pointerEvents="none"
          className={shadowClassName}
          style={[
            styles.shadow,
            {
              borderRadius: radius,
              backgroundColor: shadowColor,
              transform: [
                { translateX: effectiveShadow },
                { translateY: effectiveShadow },
              ],
            },
            shadowStyle,
          ]}
        />
        <View
          ref={ref}
          className={frontClassName}
          style={[
            styles.content,
            {
              borderRadius: radius,
              transform: [
                { translateX: pressOffset },
                { translateY: pressOffset },
              ],
              ...borderStyle,
              ...backgroundStyle,
            },
            contentStyle,
          ]}
          {...props}
        >
          <Scanlines />
          {children}
        </View>
      </View>
    );
  }
);

HardShadowFrame.displayName = "HardShadowFrame";

export { HardShadowFrame };
