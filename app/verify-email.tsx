import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  TextInput,
  Keyboard,
  InteractionManager,
  Image,
} from "react-native";
import { Box } from "@/src/ui/box";
import { Text } from "@/src/ui/text";
import { Heading } from "@/src/ui/heading";
import { VStack } from "@/src/ui/vstack";
import { HStack } from "@/src/ui/hstack";
import { Icon } from "@/src/ui/icon";
import { Button, ButtonText } from "@/src/ui/button";
import { Card } from "@/src/ui/card";
import { ScrollView } from "@/src/ui/scroll-view";
import { Mail, ArrowLeft } from "lucide-react-native";
import { useSession } from "@/src/core/auth/AuthProvider";
import { useAppToast } from "@/src/core/utils/toast";

export default function VerifyEmail() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const { verifyOtp, resendVerification } = useSession();
  const { showError, showSuccess } = useAppToast();

  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Wait for the screen to fully load before showing interactive elements
  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        setIsReady(true);
      });
      return () => task.cancel();
    }, [])
  );

  // Clean up keyboard and input refs on unmount
  useEffect(() => {
    return () => {
      // Dismiss keyboard when component unmounts
      Keyboard.dismiss();
      // Clear input refs
      inputRefs.current = [];
    };
  }, []);

  const handleCodeChange = (value: string, index: number) => {
    if (!isReady) return; // Don't handle input until screen is ready
    if (value.length > 1) return; // Prevent multiple characters

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      // Use setTimeout to avoid focus issues during state updates
      setTimeout(() => {
        if (inputRefs.current[index + 1]) {
          inputRefs.current[index + 1]?.focus();
        }
      }, 50);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (!isReady) return; // Don't handle input until screen is ready
    // Handle backspace to focus previous input
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      // Use setTimeout to avoid focus issues during state updates
      setTimeout(() => {
        if (inputRefs.current[index - 1]) {
          inputRefs.current[index - 1]?.focus();
        }
      }, 50);
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join("");

    if (verificationCode.length !== 6) {
      showError("Invalid Code", "Please enter all 6 digits");
      return;
    }

    if (!email) {
      showError("Error", "Email not found. Please go back and try again.");
      return;
    }

    setLoading(true);
    try {
      const { error, session } = await verifyOtp(
        email,
        verificationCode,
        "signup"
      );

      if (error) {
        showError(
          "Verification Failed",
          "The verification code is invalid or has expired. Please check your code or request a new one."
        );
      } else {
        showSuccess(
          "Email Verified!",
          "Your email has been successfully verified."
        );
        // Navigate after a short delay to let user see the success message
        setTimeout(() => {
          router.push("/sign-in");
        }, 1500);
      }
    } catch (error) {
      showError(
        "Verification Error",
        "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      showError("Error", "Email not found. Please go back and try again.");
      return;
    }

    setResendLoading(true);
    try {
      const { error } = await resendVerification(email);

      if (error) {
        showError(
          "Resend Error",
          error.message || "Failed to resend verification code"
        );
      } else {
        showSuccess(
          "Code Sent",
          "A new verification code has been sent to your email."
        );
        // Clear the current code
        setCode(["", "", "", "", "", ""]);
      }
    } catch (error) {
      showError(
        "Resend Error",
        "An unexpected error occurred. Please try again."
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      className="bg-white dark:bg-background-dark"
    >
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <Box className="flex-1 p-6">
          {/* Back Button */}
          <HStack className="items-center mb-6">
            <Button
              variant="solid"
              size="sm"
              onPress={() => router.back()}
              className="border-2 border-[#333333] shadow-[2px_2px_0_#333333] bg-[#FCFCFC] px-4 py-2"
            >
              <HStack space="sm" className="items-center">
                <Icon as={ArrowLeft} size="sm" className="text-[#333333]" />
                <Text className="text-[#333333] font-bold tracking-wide">
                  Go Back
                </Text>
              </HStack>
            </Button>
          </HStack>

          <Box className="flex-1 justify-center">
            <VStack space="xl" className="items-start">
              {/* Header */}
              <VStack space="md" className="items-start mb-4">
                <Image
                  source={require("@/assets/icon.png")}
                  style={{ width: 64, height: 64 }}
                  resizeMode="contain"
                />
                <VStack space="xs" className="items-start">
                  <Box className="px-3 py-1 border-2 border-ink bg-surface shadow-retro-hard-sm">
                    <Text size="xs" className="text-data font-bold tracking-[2px] uppercase">
                      Identity Validation Protocol
                    </Text>
                  </Box>
                  <Heading
                    size="2xl"
                    className="text-ink font-extrabold tracking-[2px] uppercase"
                    retro
                  >
                    Verify Control Node
                  </Heading>
                  <VStack space="xs" className="items-start">
                    <Text
                      size="md"
                      className="text-ink/80 font-medium"
                    >
                      A 6-digit synchronization code has been dispatched to:
                    </Text>
                    <Text
                      size="lg"
                      className="text-energy font-bold tracking-wide"
                    >
                      {email}
                    </Text>
                  </VStack>
                </VStack>
              </VStack>

              {/* Verification Card */}
              <Card className="w-full max-w-sm p-7">
                <VStack space="lg">
                  <VStack space="xs">
                    <Text size="xs" className="text-ink/70 uppercase tracking-[2px]">
                      Session Security
                    </Text>
                    <Heading
                      size="lg"
                      className="text-ink font-extrabold tracking-[2px]"
                      retro
                    >
                      Enter Sequence
                    </Heading>
                    <Text
                      size="sm"
                      className="text-ink/80 font-medium"
                    >
                      Enter the synchronization code or utilize the direct activation link in your terminal mailbox.
                    </Text>
                  </VStack>

                  {/* Code Input */}
                  <HStack space="sm" className="justify-center">
                    {code.map((digit, index) => (
                      <Box
                        key={index}
                        className="w-12 h-12 border-2 border-[#333333] shadow-[2px_2px_0_#333333] rounded-lg bg-[#FCFCFC]"
                      >
                        <TextInput
                          ref={(ref) => {
                            if (isReady) {
                              inputRefs.current[index] = ref;
                            }
                          }}
                          value={digit}
                          onChangeText={(value) =>
                            handleCodeChange(value, index)
                          }
                          onKeyPress={(e) => handleKeyPress(e, index)}
                          keyboardType="numeric"
                          maxLength={1}
                          textAlign="center"
                          autoCorrect={false}
                          autoComplete="off"
                          textContentType="none"
                          editable={isReady}
                          style={{
                            flex: 1,
                            fontSize: 18,
                            fontWeight: "600",
                            color: "#333333", // Retro color for the digit text
                          }}
                          className="text-typography-900 dark:text-typography-50"
                        />
                      </Box>
                    ))}
                  </HStack>

                  {/* Verify Button */}
                  <Button
                    variant="solid"
                    action="primary"
                    size="lg"
                    className="w-full"
                    disabled={
                      !isReady ||
                      loading ||
                      resendLoading ||
                      code.some((digit) => !digit)
                    }
                    onPress={handleVerify}
                  >
                    <Text size="lg" className="text-[#333333] font-semibold">
                      {loading ? "Verifying..." : "Verify Email"}
                    </Text>
                  </Button>

                  {/* Resend Code */}
                  <VStack space="md" className="items-start pt-2">
                    <VStack space="xs">
                      <Text size="sm" className="text-ink/60 font-bold uppercase tracking-widest">
                        No Transmission?
                      </Text>
                      <Button
                        variant="outline"
                        action="secondary"
                        size="md"
                        disabled={loading || resendLoading}
                        onPress={handleResendCode}
                      >
                        <ButtonText size="md" className="font-bold uppercase tracking-widest">
                          {resendLoading ? "Resending..." : "New Transmission"}
                        </ButtonText>
                      </Button>
                    </VStack>

                    <VStack space="xs">
                      <Text size="sm" className="text-ink/60 font-bold uppercase tracking-widest">
                        Activation Link Used?
                      </Text>
                      <Button
                        variant="link"
                        size="sm"
                        onPress={() => router.push("/sign-in")}
                        className="p-0"
                      >
                        <Text size="md" className="text-ink font-bold tracking-wide">
                          Proceed to Sign In
                        </Text>
                      </Button>
                    </VStack>
                  </VStack>
                </VStack>
              </Card>

              {/* Help Text */}
              <VStack space="xs" className="w-full max-w-sm">
                <Text
                  size="md"
                  className="text-[#666666] text-center font-medium tracking-wide"
                >
                  Check your spam folder if you don't see the email
                </Text>
              </VStack>
            </VStack>
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
