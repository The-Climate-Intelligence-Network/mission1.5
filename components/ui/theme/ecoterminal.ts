import { vars } from "nativewind";
import { colors } from "../tokens/colors";

const clamp = (value: number) => Math.max(0, Math.min(255, value));

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

const rgbToHex = (r: number, g: number, b: number) =>
  `#${[r, g, b]
    .map((channel) => clamp(Math.round(channel)).toString(16).padStart(2, "0"))
    .join("")}`;

const mix = (hexA: string, hexB: string, ratioA: number) => {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  return rgbToHex(
    a.r * ratioA + b.r * (1 - ratioA),
    a.g * ratioA + b.g * (1 - ratioA),
    a.b * ratioA + b.b * (1 - ratioA)
  );
};

const toVar = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  return `${r} ${g} ${b}`;
};

const makeScale = (base: string, light: string, dark: string) => ({
  "--0": toVar(mix(light, base, 0.92)),
  "--50": toVar(mix(light, base, 0.85)),
  "--100": toVar(mix(light, base, 0.75)),
  "--200": toVar(mix(light, base, 0.65)),
  "--300": toVar(mix(light, base, 0.5)),
  "--400": toVar(mix(light, base, 0.35)),
  "--500": toVar(base),
  "--600": toVar(mix(base, dark, 0.8)),
  "--700": toVar(mix(base, dark, 0.65)),
  "--800": toVar(mix(base, dark, 0.5)),
  "--900": toVar(mix(base, dark, 0.35)),
  "--950": toVar(mix(base, dark, 0.2)),
});

const makeScaleInverted = (base: string, dark: string, light: string) => ({
  "--0": toVar(mix(dark, base, 0.92)),
  "--50": toVar(mix(dark, base, 0.85)),
  "--100": toVar(mix(dark, base, 0.75)),
  "--200": toVar(mix(dark, base, 0.65)),
  "--300": toVar(mix(dark, base, 0.5)),
  "--400": toVar(mix(dark, base, 0.35)),
  "--500": toVar(base),
  "--600": toVar(mix(base, light, 0.8)),
  "--700": toVar(mix(base, light, 0.65)),
  "--800": toVar(mix(base, light, 0.5)),
  "--900": toVar(mix(base, light, 0.35)),
  "--950": toVar(mix(base, light, 0.2)),
});

const darkSurface = mix(colors.ink, "#000000", 0.35);
const darkSurfaceMuted = mix(colors.ink, "#000000", 0.45);
const darkInk = mix(colors.ink, colors.surface, 0.4);

const primaryScale = makeScale(colors.action, colors.surface, colors.actionDark);
const tertiaryScale = makeScale(
  colors.digital,
  colors.surface,
  colors.digitalDark
);
const successScale = makeScale(
  colors.digital,
  colors.surface,
  colors.digitalDark
);
const warningScale = makeScale(colors.energy, colors.surface, colors.ink);
const infoScale = makeScale(colors.sky, colors.surface, colors.ink);
const errorScale = makeScale("#D9534F", colors.surface, colors.ink);

const secondaryScaleLight = makeScale(colors.surface, "#FFFFFF", colors.ink);
const secondaryScaleDark = makeScaleInverted(
  darkSurface,
  "#000000",
  colors.surface
);

const typographyScaleLight = makeScale(colors.ink, colors.surface, "#0B1A12");
const typographyScaleDark = makeScaleInverted(
  darkInk,
  "#000000",
  colors.surface
);

const outlineBaseLight = mix(colors.ink, colors.surface, 0.5);
const outlineBaseDark = mix(darkInk, darkSurface, 0.5);
const outlineScaleLight = makeScale(outlineBaseLight, colors.surface, colors.ink);
const outlineScaleDark = makeScaleInverted(
  outlineBaseDark,
  "#000000",
  colors.surface
);

const backgroundScaleLight = makeScale(colors.surface, "#FFFFFF", "#E0EFE5");
const backgroundScaleDark = makeScaleInverted(
  darkSurfaceMuted,
  "#000000",
  colors.surface
);

const backgroundSpecialLight = {
  error: toVar(mix("#D9534F", colors.surface, 0.2)),
  warning: toVar(mix(colors.energy, colors.surface, 0.2)),
  success: toVar(mix(colors.digital, colors.surface, 0.2)),
  info: toVar(mix(colors.sky, colors.surface, 0.2)),
  muted: toVar(mix(colors.surface, "#FFFFFF", 0.7)),
};

const backgroundSpecialDark = {
  error: toVar(mix("#D9534F", darkSurface, 0.35)),
  warning: toVar(mix(colors.energy, darkSurface, 0.35)),
  success: toVar(mix(colors.digital, darkSurface, 0.35)),
  info: toVar(mix(colors.sky, darkSurface, 0.35)),
  muted: toVar(mix(darkSurface, "#000000", 0.6)),
};

const applyScale = (
  prefix: string,
  scale: Record<string, string>
) =>
  Object.keys(scale).reduce((acc, key) => {
    acc[`--color-${prefix}-${key.replace("--", "")}`] = scale[key];
    return acc;
  }, {} as Record<string, string>);

const lightVars = {
  "--color-ink": toVar(colors.ink),
  "--color-surface": toVar(colors.surface),
  "--color-action": toVar(colors.action),
  "--color-action-dark": toVar(colors.actionDark),
  "--color-digital": toVar(colors.digital),
  "--color-digital-dark": toVar(colors.digitalDark),
  "--color-energy": toVar(colors.energy),
  "--color-data": toVar(colors.data),
  "--color-sky": toVar(colors.sky),
  "--color-atmosphere-0": toVar(colors.backgroundGradient[0]),
  "--color-atmosphere-1": toVar(colors.backgroundGradient[1]),
  "--color-atmosphere-2": toVar(colors.backgroundGradient[2]),
  ...applyScale("primary", primaryScale),
  ...applyScale("secondary", secondaryScaleLight),
  ...applyScale("tertiary", tertiaryScale),
  ...applyScale("error", errorScale),
  ...applyScale("success", successScale),
  ...applyScale("warning", warningScale),
  ...applyScale("info", infoScale),
  ...applyScale("typography", typographyScaleLight),
  ...applyScale("outline", outlineScaleLight),
  ...applyScale("background", backgroundScaleLight),
  "--color-background-error": backgroundSpecialLight.error,
  "--color-background-warning": backgroundSpecialLight.warning,
  "--color-background-success": backgroundSpecialLight.success,
  "--color-background-info": backgroundSpecialLight.info,
  "--color-background-muted": backgroundSpecialLight.muted,
  "--color-indicator-primary": toVar(colors.digitalDark),
  "--color-indicator-info": toVar(colors.sky),
  "--color-indicator-error": toVar("#D9534F"),
};

const darkVars = {
  "--color-ink": toVar(darkInk),
  "--color-surface": toVar(darkSurface),
  "--color-action": toVar(colors.action),
  "--color-action-dark": toVar(colors.actionDark),
  "--color-digital": toVar(colors.digital),
  "--color-digital-dark": toVar(colors.digitalDark),
  "--color-energy": toVar(colors.energy),
  "--color-data": toVar(colors.data),
  "--color-sky": toVar(colors.sky),
  "--color-atmosphere-0": toVar(darkSurfaceMuted),
  "--color-atmosphere-1": toVar(darkSurface),
  "--color-atmosphere-2": toVar(mix(darkSurface, "#000000", 0.7)),
  ...applyScale("primary", primaryScale),
  ...applyScale("secondary", secondaryScaleDark),
  ...applyScale("tertiary", tertiaryScale),
  ...applyScale("error", errorScale),
  ...applyScale("success", successScale),
  ...applyScale("warning", warningScale),
  ...applyScale("info", infoScale),
  ...applyScale("typography", typographyScaleDark),
  ...applyScale("outline", outlineScaleDark),
  ...applyScale("background", backgroundScaleDark),
  "--color-background-error": backgroundSpecialDark.error,
  "--color-background-warning": backgroundSpecialDark.warning,
  "--color-background-success": backgroundSpecialDark.success,
  "--color-background-info": backgroundSpecialDark.info,
  "--color-background-muted": backgroundSpecialDark.muted,
  "--color-indicator-primary": toVar(colors.digital),
  "--color-indicator-info": toVar(colors.sky),
  "--color-indicator-error": toVar("#F28B82"),
};

export const ecoTerminalConfig = {
  light: vars(lightVars),
  dark: vars(darkVars),
};
