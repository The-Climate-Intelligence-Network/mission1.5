import React from "react";
import type { VariantProps } from "@gluestack-ui/nativewind-utils";
import { ViewProps } from "react-native";
import { HardShadowFrame } from "../primitives/HardShadowFrame";
import { colors } from "../tokens/colors";
import { radius } from "../tokens/radius";
import { hardShadows } from "../tokens/shadows";
import { cardStyle } from "./styles";

type ICardProps = ViewProps &
  VariantProps<typeof cardStyle> & { className?: string; pressed?: boolean; radius?: number };

const resolveCardBackground = (variant: ICardProps["variant"]) => {
  switch (variant) {
    case "primary":
      return colors.sky;
    case "success":
      return colors.digital;
    case "warning":
      return colors.energy;
    case "error":
      return colors.actionDark;
    case "secondary":
    case "flat":
    case "elevated":
    default:
      return colors.surface;
  }
};

const resolveCardRadius = (size: ICardProps["size"]) => {
  if (size === "sm") return radius.cardSm;
  if (size === "lg") return radius.cardLg;
  return radius.cardMd;
};

const Card = React.forwardRef<React.ComponentRef<typeof HardShadowFrame>, ICardProps>(
  function Card(
    { className, size = "md", variant = "secondary", radius: customRadius, ...props },
    ref
  ) {
    const shadowSize =
      variant === "flat" ? 0 : hardShadows.md.offset;

    return (
      <HardShadowFrame
        ref={ref}
        contentClassName={cardStyle({ size, variant, class: className })}
        bg={resolveCardBackground(variant)}
        borderColor={colors.ink}
        borderWidth={2}
        shadowColor={colors.ink}
        shadowSize={shadowSize}
        radius={customRadius ?? resolveCardRadius(size)}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

export { Card };
