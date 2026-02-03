import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { SafeAreaView, Platform, Image } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { ScrollView } from "@/components/ui/scroll-view";
import { Spinner } from "@/components/ui/spinner";
import { useAppToast } from "@/lib/toast-utils";
import { LogIn, Mail, Lock, Github } from "lucide-react-native";
import { useSession } from "@/context/auth";
import { GoogleIcon } from "@/assets/ico/google-icon";
import { AppleIcon } from "@/assets/ico/apple-icon";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const {
    signIn,
    signInWithGitHub,
    signInWithGoogle,
    signInWithApple,
    isGoogleProcessing,
    session,
  } = useSession();
  const { showError, showSuccess } = useAppToast();

  // Show success message when Google OAuth completes
  useEffect(() => {
    if (session && isGoogleProcessing === false && googleLoading === false) {
      // This means we just completed Google OAuth
      showSuccess(
        "Welcome Back!",
        "You have successfully signed in with Google."
      );
    }
  }, [session, isGoogleProcessing, googleLoading]);

  async function handleSignIn() {
    // Debounce: Prevent rapid multiple submissions
    const now = Date.now();
    if (now - lastSubmitTime < 2000) {
      // 2 second debounce
      console.log("Ignoring rapid button press");
      return;
    }
    setLastSubmitTime(now);

    // Prevent double submission
    if (loading) {
      console.log("Sign in already in progress, ignoring duplicate request");
      return;
    }

    // Validation
    if (!email.trim()) {
      showError("Email Required", "Please enter your email address");
      return;
    }

    if (!password.trim()) {
      showError("Password Required", "Please enter your password");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError("Invalid Email", "Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      console.log("Starting sign in process for:", email);

      const { error } = await signIn(email, password);

      console.log("Sign in response:", {
        hasError: !!error,
        errorMessage: error?.message,
      });

      if (error) {
        console.error("Sign in error:", error);
        showError("Sign In Error!", error.message);
      } else {
        console.log("Sign in successful");
        showSuccess("Welcome Back!", "You have successfully signed in.");
      }
    } catch (error) {
      console.error("Unexpected sign in error:", error);
      showError(
        "Sign In Error",
        "An unexpected error occurred. Please try again."
      );
    } finally {
      // Add a small delay before re-enabling the button to prevent rapid double-clicks
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }

  async function handleGitHubSignIn() {
    setGithubLoading(true);
    const { error } = await signInWithGitHub();

    if (error) {
      showError("GitHub Sign In Error!", error.message);
    } else {
      showSuccess(
        "GitHub Connected!",
        "You have successfully signed in with GitHub."
      );
    }
    setGithubLoading(false);
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();

      if (error) {
        showError(
          "Google Sign In Error!",
          error.message || "Failed to sign up with Google"
        );
      }
    } catch (error) {
      showError(
        "Google Sign Up Error",
        "An unexpected error occurred with Google sign up"
      );
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleAppleSignIn() {
    if (Platform.OS !== "ios") {
      showError(
        "Apple Sign In Error",
        "Apple Sign In is only available on iOS devices"
      );
      return;
    }

    setAppleLoading(true);
    try {
      const { error } = await signInWithApple();

      if (error) {
        if (error.message === "Apple Sign In was cancelled") {
          // Don't show error for user cancellation
          return;
        }
        showError(
          "Apple Sign In Error",
          error.message || "Failed to sign in with Apple"
        );
      } else {
        showSuccess(
          "Welcome Back!",
          "You have successfully signed in with Apple."
        );
      }
    } catch (error) {
      showError(
        "Apple Sign In Error",
        "An unexpected error occurred with Apple sign in"
      );
    } finally {
      setAppleLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-surface">
      <Box className="absolute inset-0">
        <Box className="h-48 bg-atmosphere-0" />
        <Box className="flex-1 bg-atmosphere-1" />
        <Box className="h-40 bg-atmosphere-2" />
        <Box className="absolute -top-10 -right-12 h-40 w-40 rounded-full bg-digital/20" />
        <Box className="absolute top-36 -left-16 h-32 w-32 rounded-full bg-energy/25" />
      </Box>

      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <Box className="flex-1 justify-center px-6 py-10">
          <VStack space="xl" className="items-center">
            <VStack space="md" className="items-center">
              <Image
                source={require("@/assets/icon.png")}
                style={{ width: 72, height: 72 }}
                resizeMode="contain"
              />
              <VStack space="sm" className="items-center">
                <Box className="px-3 py-1 border-2 border-ink rounded-full bg-surface">
                  <Text size="xs" className="text-ink font-bold tracking-[2px]">
                    ECO-TERMINAL ACCESS
                  </Text>
                </Box>
                <Heading size="2xl" className="text-ink text-center font-extrabold tracking-[3px]">
                  WELCOME BACK
                </Heading>
                <Text size="sm" className="text-ink/80 text-center font-medium">
                  Continue your climate action journey. Secure access, fast sync, no noise.
                </Text>
              </VStack>
            </VStack>

            {/* Sign In Card */}
            <Card className="w-full max-w-sm p-7">
              <VStack space="lg">
                <VStack space="xs" className="items-start">
                  <Text size="xs" className="text-ink/70 uppercase tracking-[2px]">
                    Mission 1.5 Node
                  </Text>
                  <Heading size="lg" className="text-ink font-extrabold tracking-[2px]">
                    Command Console
                  </Heading>
                  <Text size="sm" className="text-ink/80">
                    Sign in to sync missions, evidence, and field notes.
                  </Text>
                </VStack>

                {/* Email Input */}
                <VStack space="xs">
                  <Text size="xs" className="text-ink uppercase tracking-[2px]">
                    Email
                  </Text>
                  <Input className="w-full" size="md">
                    <InputSlot className="pl-3">
                      <InputIcon as={Mail} />
                    </InputSlot>
                    <InputField
                      className="pr-3"
                      placeholder="email@address.com"
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </Input>
                </VStack>

                {/* Password Input */}
                <VStack space="xs">
                  <Text size="xs" className="text-ink uppercase tracking-[2px]">
                    Password
                  </Text>
                  <Input className="w-full" size="md">
                    <InputSlot className="pl-3">
                      <InputIcon as={Lock} />
                    </InputSlot>
                    <InputField
                      className="pr-3"
                      placeholder="Password"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={true}
                      autoCapitalize="none"
                    />
                  </Input>
                </VStack>

                {/* Sign In Button */}
                <Button
                  variant="solid"
                  action="primary"
                  size="lg"
                  className="w-full"
                  disabled={
                    loading ||
                    githubLoading ||
                    googleLoading ||
                    isGoogleProcessing ||
                    !email.trim() ||
                    !password.trim()
                  }
                  onPress={handleSignIn}
                >
                  <HStack space="md" className="w-full items-center justify-center">
                    {loading ? (
                      <Spinner size="small" />
                    ) : (
                      <ButtonIcon as={LogIn} size="md" />
                    )}
                    <ButtonText size="lg" className="normal-case tracking-normal">
                      {loading ? "Signing In..." : "Sign In"}
                    </ButtonText>
                  </HStack>
                </Button>

                {/* Divider */}
                <HStack className="items-center w-full">
                  <Box className="flex-1 h-px bg-ink/20" />
                  <Text size="xs" className="px-3 text-ink/70 uppercase tracking-[2px]">
                    or continue with
                  </Text>
                  <Box className="flex-1 h-px bg-ink/20" />
                </HStack>

                {/* Google OAuth Button */}
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  disabled={
                    loading ||
                    githubLoading ||
                    googleLoading ||
                    appleLoading ||
                    isGoogleProcessing
                  }
                  onPress={handleGoogleSignIn}
                >
                  <HStack space="md" className="w-full items-center justify-center">
                    <GoogleIcon size={20} />
                    <ButtonText size="lg" className="normal-case tracking-normal">
                      {googleLoading || isGoogleProcessing
                        ? isGoogleProcessing
                          ? "Processing..."
                          : "Connecting..."
                        : "Continue with Google"}
                    </ButtonText>
                  </HStack>
                </Button>

                {/* Apple OAuth Button (iOS only) */}
                {Platform.OS === "ios" && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    disabled={
                      loading ||
                      githubLoading ||
                      googleLoading ||
                      appleLoading ||
                      isGoogleProcessing
                    }
                    onPress={handleAppleSignIn}
                  >
                    <HStack space="md" className="w-full items-center justify-center">
                      {appleLoading ? (
                        <Spinner size="small" />
                      ) : (
                        <AppleIcon size={20} color="#6B7280" />
                      )}
                      <ButtonText size="lg" className="normal-case tracking-normal">
                        {appleLoading ? "Connecting..." : "Continue with Apple"}
                      </ButtonText>
                    </HStack>
                  </Button>
                )}

                {/* GitHub OAuth Button */}
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  disabled={
                    loading || githubLoading || googleLoading || appleLoading
                  }
                  onPress={handleGitHubSignIn}
                >
                  <HStack space="md" className="w-full items-center justify-center">
                    <ButtonIcon as={Github} size="md" />
                    <ButtonText size="lg" className="normal-case tracking-normal">
                      {githubLoading ? "Connecting..." : "Continue with GitHub"}
                    </ButtonText>
                  </HStack>
                </Button>

                {/* Forgot Password Link */}
                <Button variant="link" size="sm" onPress={() => router.push("/forgot-password")}>
                  <ButtonText size="md" className="normal-case tracking-normal">
                    Forgot Password?
                  </ButtonText>
                </Button>

                {/* Sign Up Link */}
                <VStack space="xs" className="items-center">
                  <Text size="sm" className="text-ink/80 font-medium">
                    Don't have an account?
                  </Text>
                  <Button variant="link" size="sm" onPress={() => router.push("/sign-up")}>
                    <ButtonText size="md" className="normal-case tracking-normal">
                      Create Account
                    </ButtonText>
                  </Button>
                </VStack>

                <Text size="xs" className="text-ink/60 text-center">
                  By signing in, you agree to our Terms of Service and Privacy Policy.
                </Text>
              </VStack>
            </Card>

            {/* Features */}
            <Card className="w-full max-w-sm p-6">
              <VStack space="sm">
                <Text size="xs" className="text-ink/70 uppercase tracking-[2px]">
                  What you unlock
                </Text>
                <VStack space="xs">
                  <HStack space="md" className="items-center">
                    <Box className="w-2.5 h-2.5 bg-digital rounded-full border-2 border-ink" />
                    <Text size="sm" className="text-ink font-medium">
                      Access verified climate missions and field data kits
                    </Text>
                  </HStack>
                  <HStack space="md" className="items-center">
                    <Box className="w-2.5 h-2.5 bg-sky rounded-full border-2 border-ink" />
                    <Text size="sm" className="text-ink font-medium">
                      Coordinate with a global research community
                    </Text>
                  </HStack>
                  <HStack space="md" className="items-center">
                    <Box className="w-2.5 h-2.5 bg-energy rounded-full border-2 border-ink" />
                    <Text size="sm" className="text-ink font-medium">
                      Track impact, rewards, and verified outcomes
                    </Text>
                  </HStack>
                </VStack>
              </VStack>
            </Card>
          </VStack>
        </Box>
      </ScrollView>

      {/* Google Processing Overlay */}
      {isGoogleProcessing && (
        <Box className="absolute inset-0 bg-ink/60 flex-1 justify-center items-center">
          <Card className="p-8 m-6">
            <VStack space="lg" className="items-center">
              <Spinner size="large" />
              <VStack space="xs" className="items-center">
                <Heading size="md" className="text-ink font-extrabold tracking-[2px]">
                  Completing Sign In
                </Heading>
                <Text size="sm" className="text-ink/80 text-center">
                  Securely connecting your Google account...
                </Text>
              </VStack>
            </VStack>
          </Card>
        </Box>
      )}
    </SafeAreaView>
  );
}
