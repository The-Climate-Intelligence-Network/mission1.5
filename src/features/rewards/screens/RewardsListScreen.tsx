import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, RefreshControl, Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { Scanlines } from "@/src/ui/scanlines";
import { BackgroundGradient } from "@/src/ui/background-gradient";
import { Box } from "@/src/ui/box";
import { Text } from "@/src/ui/text";
import { Heading } from "@/src/ui/heading";
import { VStack } from "@/src/ui/vstack";
import { HStack } from "@/src/ui/hstack";
import { Icon } from "@/src/ui/icon";
import { StatusCard } from "@/src/ui/status-card";
import { getActiveRewards, Reward } from "@/src/features/rewards/logic";
import { colors } from "@/src/ui/tokens/colors";
import { HardShadowFrame } from "@/src/ui/primitives";
import { radius } from "@/src/ui/tokens/radius";
import { ChevronRight, ArrowLeft } from "lucide-react-native";

export default function RewardsListScreen() {
  const router = useRouter();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadRewards = async () => {
    try {
      const { data, error } = await getActiveRewards();
      if (error) {
        console.error("Error loading rewards:", error);
      } else if (data) {
        setRewards(data);
      }
    } catch (error) {
      console.error("Error loading rewards:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRewards();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRewards();
  };

  return (
    <View style={{ flex: 1 }}>
      <BackgroundGradient />
      <Scanlines />
      <SafeAreaView style={{ flex: 1 }}>
        <VStack space="sm" className="w-full mb-4 px-1">
          <HStack className="justify-between items-center w-full">
            <Pressable onPress={() => router.back()} hitSlop={12}>
              <Icon as={ArrowLeft} size="xl" className="text-ink" />
            </Pressable>
            <Heading size="2xl" className="text-ink uppercase tracking-[2px]">
              Mart
            </Heading>
            <Box className="w-10" />
          </HStack>
          <Box className="h-[2px] w-full bg-ink rounded-full mt-2" />
        </VStack>
        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ padding: 24, paddingBottom: 32 }}
        >
          <VStack space="lg" className="w-full items-start">
            <Heading size="lg" className="text-ink uppercase">
              Redeem with points
            </Heading>
            {rewards.length > 0 ? (
              <VStack space="md" className="w-full">
                {rewards.map((reward) => (
                  <Pressable
                    key={reward.id}
                    onPress={() => router.push(`/rewards/${reward.id}` as const)}
                  >
                    <HardShadowFrame
                      bg={colors.surface}
                      radius={radius.cardSm}
                      shadowSize={2}
                      className="w-full p-4 border-2 border-ink"
                    >
                      <HStack className="w-full justify-between items-center">
                        <VStack space="xs" className="flex-1">
                          <Text
                            size="md"
                            weight="bold"
                            className="text-ink uppercase"
                            numberOfLines={2}
                          >
                            {reward.title}
                          </Text>
                          <Text size="sm" className="text-ink/80">
                            {reward.points_cost} PTS
                          </Text>
                        </VStack>
                        <Icon as={ChevronRight} size={20} className="text-ink" />
                      </HStack>
                    </HardShadowFrame>
                  </Pressable>
                ))}
              </VStack>
            ) : (
              <StatusCard title="No rewards available" />
            )}
          </VStack>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
