import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, RefreshControl, Image, View, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Box } from "@/src/ui/box";
import { Text } from "@/src/ui/text";
import { Heading } from "@/src/ui/heading";
import { VStack } from "@/src/ui/vstack";
import { HStack } from "@/src/ui/hstack";
import { Icon } from "@/src/ui/icon";
import { Button } from "@/src/ui/button";
import { Card } from "@/src/ui/card";
import { Divider } from "@/src/ui/divider";
import { Globe, Building } from "lucide-react-native";
import {
  getPublishedMissions,
  getMissionThumbnailUrl,
  MissionWithStats,
} from "@/src/features/missions/logic";
import {
  getActiveRewards,
  getUserAvailablePoints,
  Reward,
} from "@/src/features/rewards/logic";
import { getCurrentUserProfile } from "@/src/features/profile/logic/profile.service";
import { Scanlines } from "@/src/ui/scanlines";
import { SegmentedProgressBar } from "@/src/ui/segmented-progress";
import { BackgroundGradient } from "@/src/ui/background-gradient";
import { Header } from "@/src/ui/header";
import { colors } from "@/src/ui/tokens/colors";

import { MissionCard } from "@/src/features/missions/components/MissionCard";

const HomePage = () => {
  const router = useRouter();
  const [missions, setMissions] = useState<MissionWithStats[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [availablePoints, setAvailablePoints] = useState<number>(0);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [userEnergy, setUserEnergy] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      loadMissions(),
      loadRewards(),
      loadUserPoints(),
      loadUserBalance(),
    ]);
  };

  const loadUserBalance = async () => {
    try {
      const { data: profile, error } = await getCurrentUserProfile();
      if (error) {
        console.error("Error loading user balance:", error);
      } else if (profile) {
        setUserPoints(profile.points || 0);
        setUserEnergy(profile.energy || 0);
      }
    } catch (error) {
      console.error("Error loading user balance:", error);
    }
  };

  const loadMissions = async () => {
    try {
      setLoading(true);
      const { data, error } = await getPublishedMissions();

      if (error) {
        console.error("Error loading missions:", error);
      } else if (data) {
        const missionsWithThumbnails = await Promise.all(
          data.map(async (mission) => {
            if (mission.thumbnail_path) {
              const thumbnailUrl = await getMissionThumbnailUrl(
                mission.thumbnail_path
              );
              return { ...mission, thumbnailUrl };
            }
            return mission;
          })
        );
        setMissions(missionsWithThumbnails);
      }
    } catch (error) {
      console.error("Error loading missions:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRewards = async () => {
    try {
      const { data, error } = await getActiveRewards();
      if (error) {
        console.error("Error loading rewards:", error);
      } else if (data) {
        setRewards(data.slice(0, 5));
      }
    } catch (error) {
      console.error("Error loading rewards:", error);
    }
  };

  const loadUserPoints = async () => {
    try {
      const { data, error } = await getUserAvailablePoints();
      if (error) {
        console.error("Error loading user points:", error);
      } else if (data !== null) {
        setAvailablePoints(data);
      }
    } catch (error) {
      console.error("Error loading user points:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const ongoingMissions = missions.filter(
    (m) =>
      m.submission_status === "in_progress" || m.submission_status === "started"
  );

  const userStats = {
    currentPoints: userPoints,
    totalEnergy: userEnergy,
    completedMissions: missions.filter(
      (m) => m.submission_status === "reviewed"
    ).length,
    activeMissions: ongoingMissions.length,
  };

  return (
    <View style={{ flex: 1 }}>
      <BackgroundGradient />
      <Scanlines />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ padding: 24, paddingTop: 16 }}
        >
          <VStack space="lg" className="w-full items-start">
            {/* Title Section */}
            <Header title="Mission 1.5" />

            {/* Current Status Section */}
            <VStack space="md" className="mb-8 w-full items-start">
              <HStack className="justify-between items-center w-full">
                <HStack space="md" className="items-center">
                  <Box className="w-14 h-14 bg-surface border-2 border-ink items-center justify-center">
                    <Image
                      source={require("@/assets/sea-turtle.png")}
                      style={{ width: 40, height: 40, resizeMode: "contain" }}
                    />
                  </Box>
                  <VStack space="xs" className="items-start">
                    <Text size="sm" className="text-ink/60 font-light uppercase">
                      Current League
                    </Text>
                    <Heading size="lg" className="text-ink font-extrabold uppercase tracking-wide">
                      Green Turtle
                    </Heading>
                  </VStack>
                </HStack>
                <VStack space="xs" className="items-end">
                  <Text size="sm" className="text-ink/60 font-light uppercase">
                    CIQ
                  </Text>
                  <Text size="xl" className="text-action font-extrabold" retro>
                    {userStats.currentPoints}/1000
                  </Text>
                </VStack>
              </HStack>

              <SegmentedProgressBar
                current={userStats.currentPoints || 300}
                total={1000}
                maxSegments={16}
                size="md"
              />
            </VStack>

            {/* Active Missions Section */}
            <VStack space="lg" className="mb-8 w-full items-start">
              <HStack className="justify-between items-center w-full">
                <HStack space="sm" className="items-center">
                  <Box className="w-4 h-4 rounded-full bg-action border-0" />
                  <Heading size="md" className="text-ink font-bold uppercase">Active Missions</Heading>
                </HStack>
                <Pressable
                  onPress={() => router.push("/quests")}
                >
                  <HStack space="xs" className="items-center">
                    <Text size="sm" className="text-ink font-bold uppercase tracking-wider">
                      View All
                    </Text>
                    <Text size="sm" className="text-ink">{"[->]"}</Text>
                  </HStack>
                </Pressable>
              </HStack>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 16, paddingBottom: 12, paddingHorizontal: 4 }}
              >
                {ongoingMissions.length > 0 ? (
                  ongoingMissions.map((mission) => (
                    <MissionCard
                      key={mission.id}
                      mission={mission}
                      onPress={() => router.push(`/mission/${mission.id}`)}
                    />
                  ))
                ) : (
                  <Card className="w-80 p-6 items-center justify-center border-dashed" variant="flat">
                    <Text className="text-ink/40 font-bold uppercase">No active operations</Text>
                  </Card>
                )}
              </ScrollView>
            </VStack>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default HomePage;
