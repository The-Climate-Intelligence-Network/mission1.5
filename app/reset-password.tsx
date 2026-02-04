import { router } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, Image } from "react-native";
import { Box } from "@/src/ui/box";
import { Text } from "@/src/ui/text";
import { Heading } from "@/src/ui/heading";
import { VStack } from "@/src/ui/vstack";
import { HStack } from "@/src/ui/hstack";
import { Icon } from "@/src/ui/icon";
import { Button } from "@/src/ui/button";
import { Card } from "@/src/ui/card";
import { Input, InputField, InputIcon } from "@/src/ui/input";
import { ScrollView } from "@/src/ui/scroll-view";
import { KeyRound, Lock, CheckCircle } from "lucide-react-native";
import { authService } from "@/src/features/auth/logic";
import { useAppToast } from "@/src/core/utils/toast";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showError, showSuccess } = useAppToast();

  async function handlePasswordReset() {
    if (password !== confirmPassword) {
      showError("Password Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      showError(
        "Password Error",
        "Password must be at least 6 characters long"
      );
      return;
    }

    setLoading(true);

    try {
      const { error } = await authService.updatePassword({
        password: password,
      });

      if (error) {
        showError("Password Reset Error", error.message);
      } else {
        showSuccess(
          "Password Updated",
          "Your password has been successfully updated!"
        );

        router.replace("/");
      }
    } catch (error) {
      showError("Password Reset Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      className="bg-white dark:bg-background-dark"
    >
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <Box className="flex-1 justify-center p-6">
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
                    Credential Reset Protocol
                  </Text>
                </Box>
                <Heading
                  size="2xl"
                  className="text-ink font-extrabold tracking-[2px] uppercase"
                  retro
                >
                  Reset Control Key
                </Heading>
                <Text
                  size="md"
                  className="text-ink/80 font-medium"
                >
                  Establish a new synchronization key for your terminal node.
                </Text>
              </VStack>
            </VStack>

            {/* Reset Password Card */}
            <Card className="w-full max-w-sm p-7">
              <VStack space="lg">
                <VStack space="xs">
                  <Text size="xs" className="text-ink/70 uppercase tracking-[2px]">
                    Security Override
                  </Text>
                  <Heading
                    size="lg"
                    className="text-ink font-extrabold tracking-[2px]"
                    retro
                  >
                    New Sequence
                  </Heading>
                  <Text
                    size="sm"
                    className="text-ink/80 font-medium"
                  >
                    Define a secure access sequence to restore terminal connectivity.
                  </Text>
                </VStack>

                {/* New Password Input */}
                <VStack space="xs" className="w-full">
                  <Text
                    size="sm"
                    className="text-ink font-bold tracking-wide"
                  >
                    New Sequence
                  </Text>
                  <Input className="w-full">
                    <InputIcon as={Lock} className="ml-3" />
                    <InputField
                      placeholder="Define sequence"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={true}
                      autoCapitalize="none"
                    />
                  </Input>
                </VStack>

                {/* Confirm Password Input */}
                <VStack space="xs" className="w-full">
                  <Text
                    size="sm"
                    className="text-ink font-bold tracking-wide"
                  >
                    Confirm Sequence
                  </Text>
                  <Input className="w-full">
                    <InputIcon as={Lock} className="ml-3" />
                    <InputField
                      placeholder="Re-enter sequence"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={true}
                      autoCapitalize="none"
                    />
                  </Input>
                </VStack>

                {/* Update Password Button */}
                <Button
                  variant="solid"
                  action="primary"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                  onPress={handlePasswordReset}
                >
                  <HStack space="md" className="items-center justify-center">
                    <CheckCircle size={20} color="#333333" />
                    <Text size="lg" className="text-ink font-bold uppercase tracking-widest">
                      {loading ? "Updating..." : "Commit Sequence"}
                    </Text>
                  </HStack>
                </Button>

                <Text size="xs" className="text-ink/60 font-medium italic">
                  Ensure your sequence is complex and stored securely in your physical log.
                </Text>
              </VStack>
            </Card>
          </VStack>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
