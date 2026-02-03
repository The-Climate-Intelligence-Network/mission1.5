import { tva } from "@gluestack-ui/nativewind-utils/tva";
import { isWeb } from "@gluestack-ui/nativewind-utils/IsWeb";
const baseStyle = isWeb ? "flex flex-col relative z-0" : "";

export const cardStyle = tva({
  base: `${baseStyle} p-5`,
  variants: {
    size: {
      sm: "p-3",
      md: "p-5",
      lg: "p-6",
    },
    variant: {
      primary: "",
      secondary: "",
      success: "",
      warning: "",
      error: "",
      flat: "",
      elevated: "",
    },
  },
});
