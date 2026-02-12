export const colors = {
  ink: "#1A4D2E",
  surface: "#F9FDF5",
  action: "#FF7F51",
  "action-dark": "#E6603A",
  digital: "#AFFC41",
  "digital-dark": "#7FBF2F",
  energy: "#FFD23F",
  data: "#4F9D69",
  sky: "#B8E1FF",
  backgroundGradient: ["#D4F1F4", "#F9FDF5", "#E8F5E9"],
} as const;

const hexToRgb = (hex: string) => {
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized;
  const int = parseInt(value, 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
};

const luminance = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  const toLinear = (channel: number) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const rl = toLinear(r);
  const gl = toLinear(g);
  const bl = toLinear(b);
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
};

const contrastRatio = (hexA: string, hexB: string) => {
  const l1 = luminance(hexA);
  const l2 = luminance(hexB);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
};

export const getReadableTextColor = (backgroundHex: string) => {
  const inkContrast = contrastRatio(backgroundHex, colors.ink);
  const surfaceContrast = contrastRatio(backgroundHex, colors.surface);
  return inkContrast >= surfaceContrast ? colors.ink : colors.surface;
};

export const getAccentForeground = (
  accent: keyof typeof colors | string
) => {
  const value =
    typeof accent === "string" && accent.startsWith("#")
      ? accent
      : (colors as Record<string, string | readonly string[]>)[accent as string];

  if (!value) {
    return colors.ink;
  }

  if (Array.isArray(value) || typeof value !== "string") {
    return colors.ink;
  }

  return getReadableTextColor(value);
};
