import React from "react";
import { AccessibilityInfo, Platform } from "react-native";

export type UIMode = "full" | "reduced" | "minimal";

type UIModeState = {
  mode: UIMode;
  setMode: (mode: UIMode) => void;
  reducedMotion: boolean;
};

const UIModeContext = React.createContext<UIModeState>({
  mode: "full",
  setMode: () => undefined,
  reducedMotion: false,
});

const isLowEndAndroid = () => {
  if (Platform.OS !== "android") return false;
  const version =
    typeof Platform.Version === "number"
      ? Platform.Version
      : parseInt(String(Platform.Version), 10);
  return Number.isFinite(version) ? version <= 28 : false;
};

const getInitialMode = (): UIMode => {
  return isLowEndAndroid() ? "reduced" : "full";
};

export function UIModeProvider({
  children,
  initialMode,
}: {
  children: React.ReactNode;
  initialMode?: UIMode;
}) {
  const [mode, setMode] = React.useState<UIMode>(
    initialMode ?? getInitialMode()
  );
  const [reducedMotion, setReducedMotion] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (!isMounted) return;
      setReducedMotion(enabled);
      if (enabled) setMode("reduced");
    });

    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      (enabled) => {
        setReducedMotion(enabled);
        if (enabled) setMode("reduced");
      }
    );

    return () => {
      isMounted = false;
      subscription?.remove?.();
    };
  }, []);

  const value = React.useMemo(
    () => ({ mode, setMode, reducedMotion }),
    [mode, reducedMotion]
  );

  return (
    <UIModeContext.Provider value={value}>
      {children}
    </UIModeContext.Provider>
  );
}

export function useUIMode() {
  return React.useContext(UIModeContext);
}
