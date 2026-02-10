// import { useFonts } from "expo-font";
import { useEffect } from "react";
import { GluestackUIProvider } from "@/src/ui/gluestack-ui-provider";
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import {
  SpaceGrotesk_300Light,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from "@expo-google-fonts/space-grotesk";
import {
  SpaceMono_400Regular,
  SpaceMono_700Bold,
  useFonts
} from "@expo-google-fonts/space-mono";
import { LanguageProvider } from "@/src/core/i18n/language-context";

import "../global.css";
import { SessionProvider, useSession } from "@/src/core/auth/AuthProvider";
import { ThemeProvider } from "@/src/core/theme/ThemeProvider";
import { SplashScreenController } from "@/src/core/bootstrap/SplashController";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'SpaceMono': SpaceMono_400Regular,
    'SpaceMono-Bold': SpaceMono_700Bold,
    'SpaceGrotesk-Light': SpaceGrotesk_300Light,
    'SpaceGrotesk-Regular': SpaceGrotesk_400Regular,
    'SpaceGrotesk-Medium': SpaceGrotesk_500Medium,
    'SpaceGrotesk-SemiBold': SpaceGrotesk_600SemiBold,
    'SpaceGrotesk-Bold': SpaceGrotesk_700Bold,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded) {
    return null;
  }

  return (
    <SessionProvider>
      <LanguageProvider>
        <ThemeProvider>
          <GluestackUIProvider>
            <SplashScreenController />
            <RootLayoutNav />
          </GluestackUIProvider>
        </ThemeProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}

function RootLayoutNav() {
  const { session } = useSession();

  return (
    <Stack>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!session}>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
        <Stack.Screen name="verify-email" options={{ headerShown: false }} />
      </Stack.Protected>

      {/* Reset password should be accessible regardless of session state */}
      <Stack.Screen name="reset-password" options={{ headerShown: false }} />
    </Stack>
  );
}
