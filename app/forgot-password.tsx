import { router } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, Image } from "react-native";
import { Box } from "@/src/ui/box";
import { Text } from "@/src/ui/text";
import { Heading } from "@/src/ui/heading";
import { VStack } from "@/src/ui/vstack";
import { HStack } from "@/src/ui/hstack";
import { Icon } from "@/src/ui/icon";
import { Button, ButtonText } from "@/src/ui/button";
import { Card } from "@/src/ui/card";
import { Input, InputField, InputIcon } from "@/src/ui/input";
import { ScrollView } from "@/src/ui/scroll-view";
import { KeyRound, Mail, ArrowLeft, CheckCircle } from "lucide-react-native";
import { useSession } from "@/src/core/auth/AuthProvider";
import { useAppToast } from "@/src/core/utils/toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useSession();
  const { showError, showSuccess } = useAppToast();

  async function handleResetPassword() {
    if (!email) {
      showError("Email Required", "Please enter your email address");
      return;
    }

    setLoading(true);
    const { error } = await resetPassword(email);

    if (error) {
      showError("Reset Password Error", error.message);
    } else {
      setEmailSent(true);
      showSuccess(
        "Email Sent",
        "Check your email for password reset instructions"
      );
    }
    setLoading(false);
  }

  if (emailSent) {
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
                {/* Success Header */}
                <VStack space="lg" className="items-start mb-8">
                  <Box className="p-4 bg-digital border-2 border-ink shadow-retro-hard-sm">
                    <Icon
                      as={CheckCircle}
                      size="xl"
                      className="text-ink"
                    />
                  </Box>
                  <VStack space="xs" className="items-start">
                    <Heading
                      size="2xl"
                      className="text-ink font-extrabold tracking-[2px] uppercase"
                      retro
                    >
                      Protocol Dispatched
                    </Heading>
                    <Text
                      size="md"
                      className="text-ink/80 font-medium"
                    >
                      A recovery link has been synchronized with your mailbox.
                    </Text>
                  </VStack>
                </VStack>

                {/* Success Card */}
                <Card className="w-full max-w-sm p-7">
                  <VStack space="lg">
                    <VStack space="xs">
                      <Text size="xs" className="text-ink/70 uppercase tracking-[2px]">
                        Target Address
                      </Text>
                      <Text
                        size="lg"
                        className="text-ink font-bold tracking-wide"
                      >
                        {email}
                      </Text>
                    </VStack>

                    <Text
                      size="sm"
                      className="text-ink/80 font-medium italic"
                    >
                      If the node address is valid, you will receive instructions to reset your access key. Check spam filters if not received within 120s.
                    </Text>

                    {/* Actions */}
                    <VStack space="md" className="w-full">
                      <Button
                        variant="solid"
                        action="primary"
                        size="lg"
                        className="w-full"
                        onPress={() => router.push("/sign-in")}
                      >
                        <Text className="font-bold uppercase tracking-widest text-ink">Return to Terminal</Text>
                      </Button>

                      <Button
                        variant="outline"
                        action="secondary"
                        size="md"
                        className="w-full"
                        onPress={() => {
                          setEmailSent(false);
                          setEmail("");
                        }}
                      >
                        <Text className="font-bold uppercase tracking-widest text-ink">Recalibrate Target</Text>
                      </Button>
                    </VStack>
                  </VStack>
                </Card>
              </VStack>
            </Box>
          </Box>
        </ScrollView>
      </SafeAreaView>
    );
  }

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
              <HStack space="xs" className="items-center">
                <Icon as={ArrowLeft} size="sm" className="text-[#333333]" />
                <Text
                  size="md"
                  className="text-[#333333] font-bold tracking-wide"
                >
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
                      Access Recovery Protocol
                    </Text>
                  </Box>
                  <Heading
                    size="2xl"
                    className="text-ink font-extrabold tracking-[2px] uppercase"
                    retro
                  >
                    Lost Credentials
                  </Heading>
                  <Text
                    size="md"
                    className="text-ink/80 font-medium"
                  >
                    Initialize the reset sequence to regain access to your terminal node.
                  </Text>
                </VStack>
              </VStack>
              {/* Reset Password Card */}
              <Card className="w-full max-w-sm p-7">
                <VStack space="lg">
                  <VStack space="xs">
                    <Text size="xs" className="text-ink/70 uppercase tracking-[2px]">
                      Protocol 1.5
                    </Text>
                    <Heading
                      size="lg"
                      className="text-ink font-extrabold tracking-[2px]"
                      retro
                    >
                      Security Console
                    </Heading>
                    <Text
                      size="sm"
                      className="text-ink/80 font-medium"
                    >
                      Provide your node address to receive the reset sequence.
                    </Text>
                  </VStack>

                  {/* Email Input */}
                  <VStack space="xs" className="w-full">
                    <Text
                      size="sm"
                      className="text-[#333333] font-bold tracking-wide"
                    >
                      Email Address
                    </Text>
                    <Input className="w-full">
                      <InputIcon as={Mail} className="ml-3" />
                      <InputField
                        placeholder="email@address.com"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                      />
                    </Input>
                  </VStack>

                  {/* Reset Button */}
                  <Button
                    variant="solid"
                    action="primary"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                    onPress={handleResetPassword}
                  >
                    <HStack space="md" className="items-center justify-center">
                      <Icon
                        as={KeyRound}
                        size="md"
                        className="text-[#333333]"
                      />
                      <Text size="lg" className="text-[#333333] font-semibold">
                        {loading ? "Sending Reset Link..." : "Send Reset Link"}
                      </Text>
                    </HStack>
                  </Button>

                  {/* Sign In Link */}
                  <VStack space="md" className="items-start pt-2">
                    <VStack space="xs">
                      <Text size="sm" className="text-ink/60 font-bold uppercase tracking-widest">
                        Found your credentials?
                      </Text>
                      <Button
                        variant="outline"
                        action="secondary"
                        className="w-full"
                        onPress={() => router.push("/sign-in")}
                      >
                        <ButtonText size="md" className="font-bold uppercase tracking-widest">
                          Return to Terminal
                        </ButtonText>
                      </Button>
                    </VStack>

                    <Text size="xs" className="text-ink/60 font-medium italic">
                      If you're still locked out, contact our technical support division.
                    </Text>
                  </VStack>
                </VStack>
              </Card>
            </VStack>
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
