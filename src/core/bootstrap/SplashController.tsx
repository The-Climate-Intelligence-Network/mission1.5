import { SplashScreen } from "expo-router";
import { useSession } from "@/src/core/auth/AuthProvider";

export function SplashScreenController() {
    const { isLoading } = useSession();

    if (!isLoading) {
        SplashScreen.hideAsync();
    }

    return null;
}
