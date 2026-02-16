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
import { Card } from "@/src/ui/card";
import { Divider } from "@/src/ui/divider";
import { Globe, Building, Sun, ShoppingBag, Mountain } from "lucide-react-native";
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
import { EventRepo } from "@/src/data/repositories/EventRepo";
import { EventQuest } from "@/src/domain/events/models";
import { getCurrentUserProfile } from "@/src/features/profile/logic/profile.service";
import { Scanlines } from "@/src/ui/scanlines";
import { SegmentedProgressBar } from "@/src/ui/segmented-progress";
import { BackgroundGradient } from "@/src/ui/background-gradient";
import { Header } from "@/src/ui/header";
import { colors } from "@/src/ui/tokens/colors";
import { radius } from "@/src/ui/tokens/radius";
import { StatusCard } from "@/src/ui/status-card";

import { MissionCard } from "@/src/features/missions/components/MissionCard";
import { EventCard } from "@/src/features/quests/components/EventCard";
import { HardShadowFrame } from "@/src/ui/primitives";

const HomePage = () => {
  const router = useRouter();
  const [missions, setMissions] = useState<MissionWithStats[]>([]);
  const [events, setEvents] = useState<EventQuest[]>([]);
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
      loadEvents(),
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

  const loadEvents = async () => {
    try {
      const data = await EventRepo.getUpcoming();
      setEvents(data);
    } catch (error) {
      console.error("Error loading events:", error);
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

  const featuredMissions = missions.filter(
    (m) =>
      m.submission_status !== "reviewed"
  );

  const userStats = {
    currentPoints: userPoints,
    totalEnergy: userEnergy,
    completedMissions: missions.filter(
      (m) => m.submission_status === "reviewed"
    ).length,
    activeMissions: missions.filter(
      (m) => m.submission_status === "in_progress" || m.submission_status === "started"
    ).length,
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
          contentContainerStyle={{ padding: 24, paddingTop: 16, paddingBottom: 80 }}
        >
          <VStack space="lg" className="w-full items-start">
            {/* Title Section */}
            <Header title="Mission 1.5" />
            {/* <Heading size="xl" className="-mt-4 text-ink/80">Hi, Yuneth</Heading> */}


            {/* Current Status Section */}
            <HStack space="md" className="justify-between items-center w-full mb-2">
              <HardShadowFrame
                bg={colors.surface}
                radius={8}
                shadowSize={2}
                className="p-0 border-2 border-ink"
              >
                <Box className="w-24 h-24 bg-surface border-0 items-center justify-center">
                  <Scanlines />
                  <Image
                    source={require("@/assets/sea-turtle.png")}
                    style={{ width: 80, height: 80, resizeMode: "contain" }}
                  />
                </Box>
              </HardShadowFrame>

              <VStack space="xs" className="flex-1 justify-start">

                <HStack className="items-center justify-between">
                  <Text size="sm" className="text-ink/80 uppercase">
                    Current League
                  </Text>
                  <Text size="sm" className="text-ink/80 uppercase">
                    CIQ
                  </Text>
                </HStack>

                <HStack className="items-center justify-between mb-2">
                  <Heading size="xl" className="text-ink uppercase tracking-wide">
                    Green Turtle
                  </Heading>
                  <Text size="2xl" weight="bold" className="text-action">
                    {userStats.totalEnergy}/1000
                  </Text>
                </HStack>

                <SegmentedProgressBar
                  current={userStats.totalEnergy || 300}
                  total={1000}
                  maxSegments={12}
                  size="sm"
                />
              </VStack>
            </HStack>

            {/* CIQ and Points Boxes */}
            <HStack space="md" className="w-full mb-8">
              {/* Left Box - Completed quests*/}
              <HardShadowFrame
                bg={colors.action}
                radius={8}
                shadowSize={4}
                wrapperClassName="flex-1"
                className="p-4 pt-2 border-2 border-ink relative overflow-hidden h-24 justify-center"
              >
                <Box
                  className="absolute -right-2 -bottom-4 z-0 bg-transparent border-0"
                // style={{ transform: [{ rotate: '-15deg' }] }}
                >
                  <Icon as={Mountain} size={70} className="text-ink opacity-50" />
                </Box>
                <VStack space="xs">
                  <Text size="sm" weight="bold" className="text-digital uppercase tracking-widest">Completed Quests</Text>
                  <Text weight="bold" size="3xl" className="text-white tracking-widest">
                    {userStats.completedMissions || 12}
                  </Text>
                </VStack>
              </HardShadowFrame>

              {/* Right Box - CIQ (Energy) */}
              <HardShadowFrame
                bg={colors.data}
                radius={8}
                shadowSize={4}
                wrapperClassName="flex-1"
                className="p-4 pt-2 border-2 border-ink relative overflow-hidden h-24 justify-center"
              >
                <Box className="absolute -right-2 -bottom-4 z-0 bg-transparent border-0">
                  <Icon as={Sun} size={72} className="text-ink opacity-60" />
                </Box>
                <VStack space="xs">
                  <Text size="sm" weight="bold" className="text-digital uppercase tracking-widest">Total CIQ</Text>
                  <Text weight="bold" size="3xl" className="text-white tracking-widest">
                    {userStats.totalEnergy || 2500}
                  </Text>
                </VStack>
              </HardShadowFrame>

            </HStack>

            {/* Active Missions Section */}
            <VStack space="lg" className="mb-2 w-full items-start">
              <HStack className="justify-between items-center w-full">
                <HStack space="sm" className="items-center">
                  <Box className="w-4 h-4 rounded-full bg-action border-0 animate-pulse-live" />
                  <Heading size="lg" className="text-ink uppercase">Featured Missions</Heading>
                </HStack>
                <Pressable
                  onPress={() => router.push("/quests")}
                >
                  <HStack space="xs" className="items-center">
                    <Text size="md" className="text-ink/80 uppercase tracking-wider">
                      View All
                    </Text>
                    <Text size="md" className="text-ink/80">{"[>]"}</Text>
                  </HStack>
                </Pressable>
              </HStack>

              {featuredMissions.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginHorizontal: -24 }}
                  contentContainerStyle={{ gap: 16, paddingBottom: 8, paddingHorizontal: 24 }}
                >
                  {featuredMissions.map((mission) => (
                    <MissionCard
                      key={mission.id}
                      mission={mission}
                      onPress={() => router.push(`/mission/${mission.id}`)}
                    />
                  ))}
                </ScrollView>
              ) : (
                <StatusCard title="No available missions" />
              )}
            </VStack>

            {/* Active Events Section */}
            <VStack space="lg" className="w-full items-start mb-8">
              <HStack className="justify-between items-center w-full">
                <HStack space="sm" className="items-center">
                  <Box className="w-4 h-4 rounded-full bg-action border-0 animate-pulse-live" />
                  <Heading size="lg" className="text-ink uppercase">Upcoming Events</Heading>
                </HStack>
                <Pressable
                  onPress={() => router.push("/quests")}
                >
                  <HStack space="xs" className="items-center">
                    <Text size="md" className="text-ink/80 uppercase tracking-wider">
                      View All
                    </Text>
                    <Text size="md" className="text-ink/80">{"[>]"}</Text>
                  </HStack>
                </Pressable>
              </HStack>

              {events.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginHorizontal: -24 }}
                  contentContainerStyle={{ gap: 16, paddingBottom: 8, paddingHorizontal: 24 }}
                >
                  {events.map((event) => (
                    <EventCard
                      key={event.id}
                      event={{
                        id: event.id,
                        title: event.title,
                        description: event.description,
                        category: "EVENT",
                        points_awarded: event.pointsReward,
                        ciq_reward: event.ciqReward,
                        location: event.venue.name,
                        date: event.eventDate,
                        time: event.eventStartTime,
                        attendee_count: event.registeredCount,
                        thumbnailUrl: event.imageUrl,
                        is_bookmarked: false,
                      }}
                      onPress={() => router.push(`/event/${event.id}`)}
                    />
                  ))}
                </ScrollView>
              ) : (
                <StatusCard title="No upcoming events" />
              )}
            </VStack>

            {/* Available Funds / Open Mart Card */}
            <HardShadowFrame
              bg={colors.energy}
              radius={radius.controlSm}
              shadowSize={4}
              className="w-full p-4 border-2 border-ink h-24"
            >
              <HStack className="w-full justify-between items-center">
                <VStack space="xs">
                  <Text size="sm" weight="bold" className="text-ink uppercase tracking-widest">
                    Redeemable Points
                  </Text>
                  <Text size="4xl" weight="bold" className="text-ink tracking-widest">
                    {availablePoints || 500}
                  </Text>
                </VStack>
                <Pressable
                  onPress={() => router.push("/rewards" as import("expo-router").Href)}
                >
                  <HStack
                    space="sm"
                    className="bg-surface border-2 border-ink px-4 py-2 rounded-xl items-center"
                  >
                    <Scanlines />
                    <Icon as={ShoppingBag} size={18} className="text-ink" />
                    <Text size="sm" weight="bold" className="text-ink uppercase tracking-wider">
                      Open Rewards
                    </Text>
                  </HStack>
                </Pressable>
              </HStack>
            </HardShadowFrame>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default HomePage;
