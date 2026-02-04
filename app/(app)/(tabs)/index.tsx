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
import { colors } from "@/src/ui/tokens/colors";

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
          contentContainerStyle={{ padding: 24 }}
        >
          <VStack space="lg" className="w-full items-start">
            {/* Top Narrative Card */}
            <Card className="w-full p-6 mb-4" variant="secondary">
              <Text size="sm" className="text-ink leading-relaxed font-body">
                pitstops," proving that even the densest city can become a lush, interconnected sanctuary where humanity and nature thrive in beautiful harmony.
              </Text>
            </Card>

            {/* Current Status Section */}
            <VStack space="md" className="mb-8 w-full items-start">
              <HStack className="justify-between items-end w-full">
                <VStack space="xs" className="items-start">
                  <Text size="2xs" className="text-ink/60 font-bold uppercase tracking-widest">
                    CURRENT STATUS
                  </Text>
                  <Heading size="lg" className="text-ink font-extrabold uppercase tracking-wide">
                    SAPLING GUARDIAN
                  </Heading>
                </VStack>
                <VStack space="xs" className="items-end">
                  <Text size="2xs" className="text-ink/60 font-bold uppercase tracking-widest">
                    ENERGY LEVEL 5
                  </Text>
                  <Text size="md" className="text-action font-bold" retro>
                    {userStats.currentPoints}/1000
                  </Text>
                </VStack>
              </HStack>

              <Box className="w-full h-px bg-ink/10 border-t border-dashed border-ink/20 my-2" />

              <SegmentedProgressBar
                current={userStats.currentPoints}
                total={1000}
                maxSegments={12}
                size="md"
              />
            </VStack>

            {/* Active Missions Section */}
            <VStack space="lg" className="mb-8 w-full items-start">
              <HStack className="justify-between items-center w-full">
                <HStack space="xs" className="items-center">
                  <Box className="w-2 h-2 rounded-full bg-action" />
                  <Heading size="md" className="text-ink font-bold uppercase">Active Missions</Heading>
                </HStack>
                <Pressable
                  onPress={() => router.push("/quests")}
                >
                  <HStack space="xs" className="items-center">
                    <Text size="xs" className="text-ink font-bold uppercase tracking-wider">
                      View All
                    </Text>
                    <Text className="text-ink">{"[->]"}</Text>
                  </HStack>
                </Pressable>
              </HStack>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 16 }}
              >
                {ongoingMissions.length > 0 ? (
                  ongoingMissions.map((mission) => (
                    <Card key={mission.id} className="w-80 overflow-hidden" variant="secondary">
                      <Box className="relative">
                        {(mission as any).thumbnailUrl ? (
                          <Image
                            source={{ uri: (mission as any).thumbnailUrl }}
                            className="w-full h-40"
                            style={{ resizeMode: "cover" }}
                          />
                        ) : (
                          <Box className="w-full h-40 bg-ink/5 items-center justify-center">
                            <Icon as={Globe} size="xl" className="text-ink/20" />
                          </Box>
                        )}
                        <Box className="absolute top-3 left-3 px-3 py-1 bg-surface border-2 border-ink">
                          <Text size="2xs" className="text-ink font-bold uppercase tracking-widest">
                            BIODIVERSITY
                          </Text>
                        </Box>
                      </Box>

                      <VStack space="md" className="p-4 items-start">
                        <HStack className="justify-between items-start w-full">
                          <HStack space="xs" className="items-center">
                            <Icon as={Building} size="xs" className="text-ink" />
                            <Text size="2xs" className="text-data font-bold uppercase tracking-wider">
                              {mission.organization_name}
                            </Text>
                          </HStack>
                          <Box className="px-2 py-1 bg-energy border-2 border-ink">
                            <Text size="xs" className="text-ink font-bold" retro>
                              {mission.points_awarded}
                            </Text>
                          </Box>
                        </HStack>

                        <Heading size="sm" className="text-ink font-bold mb-1">
                          {mission.title}
                        </Heading>

                        <HStack space="md" className="items-center">
                          <Text size="2xs" className="text-ink/60 font-bold uppercase">
                            {mission.submissions_count || 0} SUBMISSIONS
                          </Text>
                          <Text size="2xs" className="text-ink/60">•</Text>
                          <Text size="2xs" className="text-ink/60 font-bold uppercase">
                            {mission.submission_progress || 0}% COMPLETE
                          </Text>
                        </HStack>

                        {mission.submission_status === "in_progress" && (
                          <SegmentedProgressBar
                            current={mission.submission_progress || 0}
                            total={100}
                            maxSegments={8}
                            size="sm"
                          />
                        )}
                      </VStack>
                    </Card>
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
