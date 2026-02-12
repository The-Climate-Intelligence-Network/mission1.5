"use client";
import React from "react";
import { createButton } from "@gluestack-ui/button";
import { tva } from "@gluestack-ui/nativewind-utils/tva";
import {
  withStyleContext,
  useStyleContext,
} from "@gluestack-ui/nativewind-utils/withStyleContext";
import { cssInterop } from "nativewind";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  type PressableStateCallbackType,
} from "react-native";
import type { VariantProps } from "@gluestack-ui/nativewind-utils";
import { PrimitiveIcon, UIIcon } from "@gluestack-ui/icon";
import { HardShadowFrame } from "../primitives/HardShadowFrame";
import { colors, getAccentForeground } from "../tokens/colors";
import { radius } from "../tokens/radius";
import { hardShadows } from "../tokens/shadows";

const SCOPE = "BUTTON";

type ButtonContext = {
  variant?: "solid" | "outline" | "link";
  action?: "primary" | "secondary" | "positive" | "negative" | "warning" | "default";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
};

const resolveButtonPalette = (
  action: ButtonContext["action"],
  variant: ButtonContext["variant"]
) => {
  const actionMap: Record<string, string> = {
    primary: colors.action,
    secondary: colors.surface,
    positive: colors.digital,
    negative: colors["action-dark"],
    warning: colors.energy,
    default: colors.surface,
  };

  if (variant === "link") {
    return {
      bg: "transparent",
      border: "transparent",
      text: colors.data,
      borderWidth: 0,
    };
  }

  const bg = variant === "outline" ? "transparent" : actionMap[action ?? "primary"];
  return {
    bg,
    border: colors.ink,
    text: variant === "outline" ? colors.ink : getAccentForeground(bg),
    borderWidth: 2,
  };
};

const resolveRadius = (size?: ButtonContext["size"]) => {
  if (size === "xs" || size === "sm") return radius.controlSm;
  if (size === "xl") return radius.controlLg;
  return radius.controlMd;
};

const resolveShadowSize = (size?: ButtonContext["size"], variant?: ButtonContext["variant"]) => {
  if (variant === "link") return 0;
  if (size === "xs" || size === "sm") return hardShadows.sm.offset;
  return hardShadows.md.offset;
};

const triggerHaptic = () => {
  try {
    // Optional dependency; avoid bundling issues if missing.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Haptics = require("expo-haptics");
    if (Haptics?.impactAsync && Haptics?.ImpactFeedbackStyle) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  } catch {
    // No-op if expo-haptics is unavailable.
  }
};

type ButtonRootProps = React.ComponentPropsWithoutRef<typeof Pressable> & {
  className?: string;
  context?: ButtonContext;
};

const ButtonRoot = withStyleContext(
  React.forwardRef<React.ComponentRef<typeof Pressable>, ButtonRootProps>(
    function ButtonRoot(
      { className, children, context, disabled, onPressIn, onPressOut, ...props },
      ref
    ) {
      const [pressed, setPressed] = React.useState(false);
      const action = context?.action ?? "primary";
      const variant = context?.variant ?? "solid";
      const size = context?.size ?? "md";
      const palette = resolveButtonPalette(action, variant);

      const handlePressIn = (event: any) => {
        if (!disabled) setPressed(true);
        onPressIn?.(event);
      };

      const handlePressOut = (event: any) => {
        setPressed(false);
        onPressOut?.(event);
      };

      const dataProps: Record<string, unknown> = {};
      Object.keys(props).forEach((key) => {
        if (key.startsWith("data-")) {
          dataProps[key] = (props as Record<string, unknown>)[key];
        }
      });

      const pressableState: PressableStateCallbackType = {
        pressed,
        hovered: false,
      };
      const resolvedChildren =
        typeof children === "function"
          ? (children as (state: PressableStateCallbackType) => React.ReactNode)(
              pressableState
            )
          : children;

      return (
        <Pressable
          ref={ref}
          disabled={disabled}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          {...props}
        >
          <HardShadowFrame
            {...dataProps}
            data-disabled={disabled ? true : undefined}
            pressed={pressed && !disabled}
            radius={resolveRadius(size)}
            borderColor={palette.border}
            borderWidth={palette.borderWidth}
            shadowColor={palette.border}
            shadowSize={resolveShadowSize(size, variant)}
            bg={palette.bg}
            contentClassName={className}
          >
            {resolvedChildren}
          </HardShadowFrame>
        </Pressable>
      );
    }
  ),
  SCOPE
);

const UIButton = createButton({
  Root: ButtonRoot,
  Text,
  Group: View,
  Spinner: ActivityIndicator,
  Icon: UIIcon,
});

cssInterop(PrimitiveIcon, {
  className: {
    target: "style",
    nativeStyleToProp: {
      height: true,
      width: true,
      fill: true,
      color: "classNameColor",
      stroke: true,
    },
  },
});

const buttonStyle = tva({
  base: "group/button flex-row items-center justify-center gap-2 data-[focus-visible=true]:web:outline-none data-[focus-visible=true]:web:ring-2 data-[focus-visible=true]:web:ring-digital/70 data-[disabled=true]:opacity-60",
  variants: {
    action: {
      primary: "",
      secondary: "",
      positive: "",
      negative: "",
      warning: "",
      default: "",
    },
    variant: {
      link: "px-0 py-0",
      outline: "",
      solid: "",
    },
    size: {
      xs: "px-3 py-2 min-h-[32px]",
      sm: "px-4 py-2 min-h-[36px]",
      md: "px-5 py-2.5 min-h-[40px]",
      lg: "px-5 py-3 min-h-[44px]",
      xl: "px-6 py-3.5 min-h-[48px]",
    },
  },
});

const buttonTextStyle = tva({
  base: "font-body uppercase tracking-widest web:select-none",
  parentVariants: {
    variant: {
      link: "data-[hover=true]:underline data-[active=true]:underline normal-case",
      outline: "",
      solid: "",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-[14px]",
      lg: "text-[14px]",
      xl: "text-[15px]",
    },
  },
});

const buttonIconStyle = tva({
  base: "fill-none",
  parentVariants: {
    size: {
      xs: "h-3.5 w-3.5",
      sm: "h-4 w-4",
      md: "h-[18px] w-[18px]",
      lg: "h-[18px] w-[18px]",
      xl: "h-5 w-5",
    },
  },
});

const buttonGroupStyle = tva({
  base: "",
  variants: {
    space: {
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-3",
      lg: "gap-4",
      xl: "gap-5",
      "2xl": "gap-6",
      "3xl": "gap-7",
      "4xl": "gap-8",
    },
    isAttached: {
      true: "gap-0",
    },
    flexDirection: {
      row: "flex-row",
      column: "flex-col",
      "row-reverse": "flex-row-reverse",
      "column-reverse": "flex-col-reverse",
    },
  },
});

type IButtonProps = Omit<
  React.ComponentPropsWithoutRef<typeof UIButton>,
  "context"
> &
  VariantProps<typeof buttonStyle> & { className?: string };

const Button = React.forwardRef<
  React.ComponentRef<typeof UIButton>,
  IButtonProps
>(function Button(
  {
    className,
    variant = "solid",
    size = "md",
    action = "primary",
    onPress,
    ...props
  },
  ref
) {
  const handlePress = (event: any) => {
    triggerHaptic();
    onPress?.(event);
  };

  return (
    <UIButton
      ref={ref}
      {...props}
      onPress={handlePress}
      className={buttonStyle({ variant, size, class: className })}
      context={{ variant, size, action }}
    />
  );
});

type IButtonTextProps = React.ComponentPropsWithoutRef<typeof UIButton.Text> &
  VariantProps<typeof buttonTextStyle> & { className?: string };

const ButtonText = React.forwardRef<
  React.ComponentRef<typeof UIButton.Text>,
  IButtonTextProps
>(function ButtonText({ className, variant, size, ...props }, ref) {
  const {
    variant: parentVariant,
    size: parentSize,
    action: parentAction,
  } = useStyleContext(SCOPE) as ButtonContext;

  const actionForText = parentAction ?? "primary";
  const palette = resolveButtonPalette(
    actionForText,
    (variant ?? parentVariant) ?? "solid"
  );

  return (
    <UIButton.Text
      ref={ref}
      {...props}
      style={{ color: palette.text }}
      className={buttonTextStyle({
        parentVariants: {
          variant: parentVariant,
          size: parentSize,
        },
        variant,
        size,
        class: className,
      })}
    />
  );
});

const ButtonSpinner = UIButton.Spinner;

type IButtonIcon = React.ComponentPropsWithoutRef<typeof UIButton.Icon> &
  VariantProps<typeof buttonIconStyle> & {
    className?: string | undefined;
    as?: React.ElementType;
    height?: number;
    width?: number;
  };

const ButtonIcon = React.forwardRef<
  React.ComponentRef<typeof UIButton.Icon>,
  IButtonIcon
>(function ButtonIcon({ className, size, ...props }, ref) {
  const {
    variant: parentVariant,
    size: parentSize,
    action: parentAction,
  } = useStyleContext(SCOPE) as ButtonContext;

  const palette = resolveButtonPalette(parentAction ?? "primary", parentVariant ?? "solid");

  if (typeof size === "number") {
    return (
      <UIButton.Icon
        ref={ref}
        {...props}
        className={buttonIconStyle({ class: className })}
        size={size}
        color={palette.text}
      />
    );
  } else if (
    (props.height !== undefined || props.width !== undefined) &&
    size === undefined
  ) {
    return (
      <UIButton.Icon
        ref={ref}
        {...props}
        className={buttonIconStyle({ class: className })}
        color={palette.text}
      />
    );
  }
  return (
    <UIButton.Icon
      {...props}
      className={buttonIconStyle({
        parentVariants: {
          size: parentSize,
        },
        size,
        class: className,
      })}
      color={palette.text}
      ref={ref}
    />
  );
});

type IButtonGroupProps = React.ComponentPropsWithoutRef<typeof UIButton.Group> &
  VariantProps<typeof buttonGroupStyle>;

const ButtonGroup = React.forwardRef<
  React.ComponentRef<typeof UIButton.Group>,
  IButtonGroupProps
>(function ButtonGroup(
  {
    className,
    space = "md",
    isAttached = false,
    flexDirection = "column",
    ...props
  },
  ref
) {
  return (
    <UIButton.Group
      className={buttonGroupStyle({
        class: className,
        space,
        isAttached,
        flexDirection,
      })}
      {...props}
      ref={ref}
    />
  );
});

Button.displayName = "Button";
ButtonText.displayName = "ButtonText";
ButtonSpinner.displayName = "ButtonSpinner";
ButtonIcon.displayName = "ButtonIcon";
ButtonGroup.displayName = "ButtonGroup";

export { Button, ButtonText, ButtonSpinner, ButtonIcon, ButtonGroup };
