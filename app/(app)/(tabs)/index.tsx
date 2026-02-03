import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, RefreshControl, Image } from "react-native";
import { useRouter } from "expo-router";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/components/i18n/language-context";
import {
  Globe,
  Play,
  CheckCircle,
  Bookmark,
  Target,
  Zap,
  Award,
  Users,
  Building,
  Eye,
  Gift,
  Star,
} from "lucide-react-native";
import {
  getPublishedMissions,
  getMissionThumbnailUrl,
  MissionWithStats,
} from "@/services/missions";
import {
  getActiveRewards,
  getUserAvailablePoints,
  Reward,
} from "@/services/rewards";
import { getCurrentUserProfile } from "@/services/profile/profile.service";

const HomePage = () => {
  const { t } = useLanguage();
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
        // Load thumbnail URLs for missions that have them
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
        setRewards(data.slice(0, 5)); // Show top 5 rewards
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

  // Filter missions for different sections
  const ongoingMissions = missions.filter(
    (m) =>
      m.submission_status === "in_progress" || m.submission_status === "started"
  );

  const savedMissions = missions.filter((m) => m.is_bookmarked);

  const availableMissions = missions
    .filter((m) => !m.submission_status && !m.is_bookmarked)
    .slice(0, 3); // Show top 3 available missions

  // User stats (from real agent balance and mission data)
  const userStats = {
    currentPoints: userPoints, // Use actual balance from agents table
    totalEnergy: userEnergy, // Use actual balance from agents table
    completedMissions: missions.filter(
      (m) => m.submission_status === "reviewed"
    ).length,
    activeMissions: ongoingMissions.length,
  };

  const getStatusInfo = (mission: MissionWithStats) => {
    if (mission.submission_status === "reviewed") {
      return { text: "Completed", color: "text-digitalDark", icon: CheckCircle };
    } else if (
      mission.submission_status === "in_progress" ||
      mission.submission_status === "started"
    ) {
      return {
        text: `${mission.submission_progress || 0}% Complete`,
        color: "text-sky",
        icon: Play,
      };
    } else if (mission.is_bookmarked) {
      return {
        text: "Saved",
        color: "text-action",
        icon: Bookmark,
      };
    } else {
      return { text: "Available", color: "text-data", icon: Target };
    }
  };

  const handleViewMission = (missionId: string) => {
    router.push(`/mission/${missionId}/`);
  };

  const handleStartMission = (missionId: string) => {
    router.push(`/mission/${missionId}/submit`);
  };

  const handleContinueMission = (missionId: string) => {
    router.push(`/mission/${missionId}/submit`);
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-surface">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Box variant="plain" className="p-6">
          {/* Header with League Status */}
          <VStack space="lg" className="mb-8">
            <VStack space="md" className="items-center">
              <Image
                source={require("@/assets/icon.png")}
                style={{ width: 64, height: 64 }}
                resizeMode="contain"
              />
              <Heading size="xl">Mission 1.5</Heading>
              <Text size="lg" className="text-center">
                Empowering climate action
              </Text>
            </VStack>

            {/* Total Points & Energy Card */}
            <Card className="p-4">
              <HStack space="lg" className="items-center justify-around">
                {/* Points Section */}
                <VStack space="xs" className="items-center flex-1">
                  <Box className="p-3 bg-energy">
                    <Icon as={Star} size="lg" className="text-ink" />
                  </Box>
                  <Text size="sm" className="uppercase tracking-widest">
                    Total Points
                  </Text>
                  <Text size="3xl" retro>
                    {userStats.currentPoints}
                  </Text>
                </VStack>

                {/* Divider */}
                <Box variant="plain" className="w-0.5 h-20 bg-ink" />

                {/* Energy Section */}
                <VStack space="xs" className="items-center flex-1">
                  <Box className="p-3 bg-action">
                    <Icon as={Zap} size="lg" className="text-ink" />
                  </Box>
                  <Text size="sm" className="uppercase tracking-widest">
                    Total Energy
                  </Text>
                  <Text size="3xl" retro>
                    {userStats.totalEnergy}
                  </Text>
                </VStack>
              </HStack>
            </Card>
          </VStack>

          {/* Quick Stats */}
          <HStack space="md" className="mb-8">
            <Card variant="success" className="flex-1 p-4">
              <VStack space="xs" className="items-center">
                <Text size="2xl" retro>
                  {userStats.completedMissions}
                </Text>
                <Text size="sm" className="uppercase tracking-widest">
                  Completed
                </Text>
              </VStack>
            </Card>
            <Card variant="primary" className="flex-1 p-4">
              <VStack space="xs" className="items-center">
                <Text size="2xl" retro>
                  {userStats.activeMissions}
                </Text>
                <Text size="sm" className="uppercase tracking-widest">
                  Active
                </Text>
              </VStack>
            </Card>
            <Card variant="warning" className="flex-1 p-4">
              <VStack space="xs" className="items-center">
                <Text size="2xl" retro>
                  {savedMissions.length}
                </Text>
                <Text size="sm" className="uppercase tracking-widest">
                  Saved
                </Text>
              </VStack>
            </Card>
          </HStack>

          {/* Available Rewards */}
          {rewards.length > 0 && (
            <VStack space="lg" className="mb-8">
              <HStack className="justify-between items-center">
                <Heading size="lg">Redeem Rewards</Heading>
                <Badge className="bg-sky">
                  <HStack space="xs" className="items-center">
                    <Icon as={Star} size="xs" className="text-ink" />
                    <Text size="sm" className="font-bold">
                      {availablePoints} pts
                    </Text>
                  </HStack>
                </Badge>
              </HStack>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <HStack space="lg">
                  {rewards.map((reward) => {
                    const canAfford = availablePoints >= reward.points_cost;
                    const isLimitedAndOutOfStock =
                      reward.availability === "limited" &&
                      reward.quantity_available !== null &&
                      reward.quantity_available <= 0;

                    return (
                      <Card
                        key={reward.id}
                        className="w-72 overflow-hidden"
                      >
                        <VStack space="md" className="p-4">
                          <HStack space="md" className="items-start">
                            <Box className="p-3 bg-sky">
                              <Icon as={Gift} size="md" className="text-ink" />
                            </Box>
                            <VStack space="xs" className="flex-1">
                              <Text
                                className="font-bold tracking-wide"
                                numberOfLines={2}
                                retro
                              >
                                {reward.title}
                              </Text>
                              <Badge className="bg-energy self-start">
                                <Text size="xs" className="font-bold tracking-wide">
                                  {reward.type.replace("-", " ").toUpperCase()}
                                </Text>
                              </Badge>
                            </VStack>
                          </HStack>

                          <Text
                            size="sm"
                            className="font-semibold tracking-wide"
                            numberOfLines={3}
                          >
                            {reward.description}
                          </Text>

                          <HStack className="justify-between items-center">
                            <VStack space="xs">
                              <Text size="xs" className="font-semibold tracking-wide">
                                Points Cost
                              </Text>
                              <HStack space="xs" className="items-center">
                                <Icon as={Star} size="sm" className="text-ink" />
                                <Text className="font-bold text-lg tracking-wider" retro>
                                  {reward.points_cost}
                                </Text>
                              </HStack>
                            </VStack>
                            <VStack space="xs" className="items-end">
                              <Text size="xs" className="font-semibold tracking-wide">
                                Value
                              </Text>
                              <Text size="sm" className="font-bold tracking-wide">
                                {reward.value}
                              </Text>
                            </VStack>
                          </HStack>

                          {reward.availability === "limited" &&
                            reward.quantity_available !== null && (
                              <HStack space="xs" className="items-center">
                                <Icon as={Users} size="sm" className="text-ink" />
                                <Text size="sm" className="font-semibold tracking-wide">
                                  {reward.quantity_available} left
                                </Text>
                              </HStack>
                            )}

                          <Button
                            size="sm"
                            action={
                              !canAfford || isLimitedAndOutOfStock
                                ? "secondary"
                                : "primary"
                            }
                            className="mt-2"
                            onPress={() =>
                              router.push(`/rewards/${reward.id}/`)
                            }
                            disabled={!canAfford || isLimitedAndOutOfStock}
                          >
                            <HStack space="xs" className="items-center">
                              <Icon as={Gift} size="sm" className="text-ink" />
                              <Text className="font-bold tracking-wide">
                                {isLimitedAndOutOfStock
                                  ? "Out of Stock"
                                  : !canAfford
                                  ? "Not Enough Points"
                                  : "Redeem"}
                              </Text>
                            </HStack>
                          </Button>
                        </VStack>
                      </Card>
                    );
                  })}
                </HStack>
              </ScrollView>
            </VStack>
          )}

          {/* Ongoing Quests */}
          {ongoingMissions.length > 0 && (
            <VStack space="lg" className="mb-8">
              <HStack className="justify-between items-center">
                <Heading size="lg">Continue Your Quests</Heading>
                <Button
                  variant="link"
                  size="sm"
                  onPress={() => router.push("/quests")}
                >
                  <Text size="sm" className="uppercase tracking-widest">
                    View All
                  </Text>
                </Button>
              </HStack>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <HStack space="lg">
                  {ongoingMissions.slice(0, 5).map((mission) => {
                    const statusInfo = getStatusInfo(mission);
                    return (
                      <Card key={mission.id} className="w-72 overflow-hidden">
                        <VStack space="md">
                          {(mission as any).thumbnailUrl && (
                            <Box variant="plain" className="relative">
                              <Image
                                source={{ uri: (mission as any).thumbnailUrl }}
                                className="w-full h-32"
                                style={{ resizeMode: "cover" }}
                              />
                              <Badge
                                variant="solid"
                                className="absolute top-2 right-2 bg-digital"
                              >
                                <Text size="xs" className="font-bold tracking-wide">
                                  {mission.submission_progress || 0}% Complete
                                </Text>
                              </Badge>
                            </Box>
                          )}
                          <VStack space="md" className="p-4">
                            <HStack space="xs" className="items-center">
                              <Badge className="bg-digital border-2 border-ink ">
                                <HStack space="xs" className="items-center">
                                  <Icon
                                    as={Award}
                                    size="xs"
                                    className="text-ink"
                                  />
                                  <Text
                                    size="xs"
                                    className="text-ink font-bold tracking-wide"
                                  >
                                    +{mission.points_awarded} pts
                                  </Text>
                                </HStack>
                              </Badge>
                              <Badge className="bg-energy border-2 border-ink ">
                                <HStack space="xs" className="items-center">
                                  <Icon
                                    as={Zap}
                                    size="xs"
                                    className="text-ink"
                                  />
                                  <Text
                                    size="xs"
                                    className="text-ink font-bold tracking-wide"
                                  >
                                    +{mission.energy_awarded} energy
                                  </Text>
                                </HStack>
                              </Badge>
                            </HStack>
                            <VStack space="xs">
                              <Text
                                className="font-bold text-ink tracking-wide"
                                numberOfLines={2}
                                retro
                              >
                                {mission.title}
                              </Text>
                              <Text
                                size="sm"
                                className="text-ink font-semibold tracking-wide"
                                numberOfLines={3}
                              >
                                {mission.description}
                              </Text>
                            </VStack>
                            <HStack space="xs" className="items-center">
                              <Icon
                                as={Building}
                                size="sm"
                                className="text-ink"
                              />
                              <Text
                                size="sm"
                                className="text-ink font-semibold tracking-wide"
                              >
                                {mission.organization_name}
                              </Text>
                            </HStack>
                            <VStack space="md">
                              <Button
                                size="sm"
                                className="bg-sky border-2 border-ink "
                                onPress={() => handleContinueMission(mission.id)}
                              >
                                <HStack space="xs" className="items-center">
                                  <Icon
                                    as={Play}
                                    size="sm"
                                    className="text-ink"
                                  />
                                  <Text className="text-ink font-bold tracking-wide">
                                    Continue
                                  </Text>
                                </HStack>
                              </Button>
                              <Button
                                variant="solid"
                                size="sm"
                                className="border-2 border-ink  bg-surface"
                                onPress={() => handleViewMission(mission.id)}
                              >
                                <HStack space="xs" className="items-center">
                                  <Icon
                                    as={Eye}
                                    size="sm"
                                    className="text-ink"
                                  />
                                  <Text
                                    size="sm"
                                    className="text-ink font-bold tracking-wide"
                                  >
                                    View
                                  </Text>
                                </HStack>
                              </Button>
                            </VStack>
                          </VStack>
                        </VStack>
                      </Card>
                    );
                  })}
                </HStack>
              </ScrollView>
            </VStack>
          )}

          {/* Saved Quests */}
          {savedMissions.length > 0 && (
            <VStack space="lg" className="mb-8">
              <HStack className="justify-between items-center">
                <Heading
                  size="lg"
                  className="text-ink font-extrabold tracking-wider"
                  retro
                >
                  Saved Quests
                </Heading>
                <Button
                  variant="link"
                  size="sm"
                  onPress={() => router.push("/quests")}
                >
                  <Text
                    size="sm"
                    className="text-ink font-bold tracking-wide"
                  >
                    View All
                  </Text>
                </Button>
              </HStack>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <HStack space="lg">
                  {savedMissions.slice(0, 5).map((mission) => (
                    <Card
                      key={mission.id}
                      className="w-72 overflow-hidden border-2 border-ink  bg-surface"
                    >
                      <VStack space="md">
                        {(mission as any).thumbnailUrl && (
                          <Box variant="plain" className="relative">
                            <Image
                              source={{ uri: (mission as any).thumbnailUrl }}
                              className="w-full h-32"
                              style={{ resizeMode: "cover" }}
                            />
                            <Badge
                              variant="solid"
                              className="absolute top-2 right-2 bg-action border-2 border-ink "
                            >
                              <HStack space="xs" className="items-center">
                                <Icon
                                  as={Bookmark}
                                  size="xs"
                                  className="text-ink"
                                />
                                <Text
                                  size="xs"
                                  className="text-ink font-bold tracking-wide"
                                >
                                  Saved
                                </Text>
                              </HStack>
                            </Badge>
                          </Box>
                        )}
                        <VStack space="md" className="p-4">
                          <HStack space="xs" className="items-center">
                            <Badge className="bg-digital border-2 border-ink ">
                              <HStack space="xs" className="items-center">
                                <Icon
                                  as={Award}
                                  size="xs"
                                  className="text-ink"
                                />
                                <Text
                                  size="xs"
                                  className="text-ink font-bold tracking-wide"
                                >
                                  +{mission.points_awarded} pts
                                </Text>
                              </HStack>
                            </Badge>
                            <Badge className="bg-energy border-2 border-ink ">
                              <HStack space="xs" className="items-center">
                                <Icon
                                  as={Zap}
                                  size="xs"
                                  className="text-ink"
                                />
                                <Text
                                  size="xs"
                                  className="text-ink font-bold tracking-wide"
                                >
                                  +{mission.energy_awarded} energy
                                </Text>
                              </HStack>
                            </Badge>
                          </HStack>
                          <VStack space="xs">
                            <Text
                              className="font-bold text-ink tracking-wide"
                              numberOfLines={2}
                              retro
                            >
                              {mission.title}
                            </Text>
                            <Text
                              size="sm"
                              className="text-ink font-semibold tracking-wide"
                              numberOfLines={3}
                            >
                              {mission.description}
                            </Text>
                          </VStack>
                          <HStack space="xs" className="items-center">
                            <Icon
                              as={Building}
                              size="sm"
                              className="text-ink"
                            />
                            <Text
                              size="sm"
                              className="text-ink font-semibold tracking-wide"
                            >
                              {mission.organization_name}
                            </Text>
                          </HStack>
                          <VStack space="md">
                            <Button
                              size="sm"
                              className="bg-sky border-2 border-ink "
                              onPress={() => handleStartMission(mission.id)}
                            >
                              <HStack space="xs" className="items-center">
                                <Icon
                                  as={Target}
                                  size="sm"
                                  className="text-ink"
                                />
                                <Text className="text-ink font-bold tracking-wide">
                                  Start
                                </Text>
                              </HStack>
                            </Button>
                            <Button
                              variant="solid"
                              size="sm"
                              className="border-2 border-ink  bg-surface"
                              onPress={() => handleViewMission(mission.id)}
                            >
                              <HStack space="xs" className="items-center">
                                <Icon
                                  as={Eye}
                                  size="sm"
                                  className="text-ink"
                                />
                                <Text
                                  size="sm"
                                  className="text-ink font-bold tracking-wide"
                                >
                                  View
                                </Text>
                              </HStack>
                            </Button>
                          </VStack>
                        </VStack>
                      </VStack>
                    </Card>
                  ))}
                </HStack>
              </ScrollView>
            </VStack>
          )}

          {/* Available Quests */}
          {availableMissions.length > 0 && (
            <VStack space="lg" className="mb-8">
              <HStack className="justify-between items-center">
                <Heading
                  size="lg"
                  className="text-ink font-extrabold tracking-wider"
                  retro
                >
                  Discover New Quests
                </Heading>
                <Button
                  variant="link"
                  size="sm"
                  onPress={() => router.push("/quests")}
                >
                  <Text
                    size="sm"
                    className="text-ink font-bold tracking-wide"
                  >
                    View All
                  </Text>
                </Button>
              </HStack>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <HStack space="lg">
                  {availableMissions.map((mission) => (
                    <Card
                      key={mission.id}
                      className="w-72 overflow-hidden border-2 border-ink  bg-surface"
                    >
                      <VStack space="md">
                        {(mission as any).thumbnailUrl && (
                          <Box variant="plain" className="relative">
                            <Image
                              source={{ uri: (mission as any).thumbnailUrl }}
                              className="w-full h-32"
                              style={{ resizeMode: "cover" }}
                            />
                            <Badge
                              variant="solid"
                              className="absolute top-2 right-2 bg-energy border-2 border-ink "
                            >
                              <Text
                                size="xs"
                                className="text-ink font-bold tracking-wide"
                              >
                                +{mission.points_awarded} pts
                              </Text>
                            </Badge>
                          </Box>
                        )}
                        <VStack space="md" className="p-4">
                          <HStack space="xs" className="items-center">
                            <Badge className="bg-digital border-2 border-ink ">
                              <HStack space="xs" className="items-center">
                                <Icon
                                  as={Award}
                                  size="xs"
                                  className="text-ink"
                                />
                                <Text
                                  size="xs"
                                  className="text-ink font-bold tracking-wide"
                                >
                                  +{mission.points_awarded} pts
                                </Text>
                              </HStack>
                            </Badge>
                            <Badge className="bg-energy border-2 border-ink ">
                              <HStack space="xs" className="items-center">
                                <Icon
                                  as={Zap}
                                  size="xs"
                                  className="text-ink"
                                />
                                <Text
                                  size="xs"
                                  className="text-ink font-bold tracking-wide"
                                >
                                  +{mission.energy_awarded} energy
                                </Text>
                              </HStack>
                            </Badge>
                          </HStack>
                          <VStack space="xs">
                            <Text
                              className="font-bold text-ink tracking-wide"
                              numberOfLines={2}
                              retro
                            >
                              {mission.title}
                            </Text>
                            <Text
                              size="sm"
                              className="text-ink font-semibold tracking-wide"
                              numberOfLines={3}
                            >
                              {mission.description}
                            </Text>
                          </VStack>
                          <HStack space="xs" className="items-center">
                            <Icon
                              as={Building}
                              size="sm"
                              className="text-ink"
                            />
                            <Text
                              size="sm"
                              className="text-ink font-semibold tracking-wide"
                            >
                              {mission.organization_name}
                            </Text>
                          </HStack>
                          <VStack space="md">
                            <Button
                              size="sm"
                              className="bg-digital border-2 border-ink "
                              onPress={() => handleStartMission(mission.id)}
                            >
                              <HStack space="xs" className="items-center">
                                <Icon
                                  as={Target}
                                  size="sm"
                                  className="text-ink"
                                />
                                <Text className="text-ink font-bold tracking-wide">
                                  Start Quest
                                </Text>
                              </HStack>
                            </Button>
                            <Button
                              variant="solid"
                              size="sm"
                              className="border-2 border-ink  bg-surface"
                              onPress={() => handleViewMission(mission.id)}
                            >
                              <HStack space="xs" className="items-center">
                                <Icon
                                  as={Eye}
                                  size="sm"
                                  className="text-ink"
                                />
                                <Text
                                  size="sm"
                                  className="text-ink font-bold tracking-wide"
                                >
                                  View
                                </Text>
                              </HStack>
                            </Button>
                          </VStack>
                        </VStack>
                      </VStack>
                    </Card>
                  ))}
                </HStack>
              </ScrollView>
            </VStack>
          )}

          {/* Loading State */}
          {loading && (
            <Card className="p-8 items-center border-2 border-ink  bg-surface">
              <VStack space="md" className="items-center">
                <Image
                  source={require("@/assets/icon.png")}
                  style={{ width: 48, height: 48 }}
                  resizeMode="contain"
                />
                <Text className="text-center text-ink font-semibold tracking-wide">
                  Loading your quests...
                </Text>
              </VStack>
            </Card>
          )}

          {/* No quests message */}
          {!loading && missions.length === 0 && (
            <Card className="p-8 items-center border-2 border-ink  bg-surface">
              <VStack space="md" className="items-center">
                <Icon as={Target} size="xl" className="text-ink" />
                <Text className="text-center text-ink font-semibold tracking-wide">
                  No quests available at the moment.
                </Text>
                <Button
                  size="sm"
                  variant="solid"
                  className="border-2 border-ink  bg-surface"
                  onPress={() => router.push("/quests")}
                >
                  <Text className="text-ink font-bold tracking-wide">
                    Explore Quests
                  </Text>
                </Button>
              </VStack>
            </Card>
          )}

          {/* Empty states for each section */}
          {!loading &&
            missions.length > 0 &&
            ongoingMissions.length === 0 &&
            savedMissions.length === 0 && (
              <VStack space="lg" className="mb-8">
                <Heading
                  size="lg"
                  className="text-ink font-extrabold tracking-wider"
                  retro
                >
                  Get Started
                </Heading>
                <Card className="p-6 bg-surface border-2 border-ink ">
                  <VStack space="md" className="items-center">
                    <Icon as={Target} size="xl" className="text-ink" />
                    <Text
                      className="text-center text-ink font-bold tracking-wide"
                      retro
                    >
                      Start your climate action journey!
                    </Text>
                    <Text className="text-center text-ink font-semibold tracking-wide">
                      Browse available quests and start making a positive impact
                      on our planet.
                    </Text>
                    <Button
                      size="sm"
                      className="bg-digital border-2 border-ink "
                      onPress={() => router.push("/quests")}
                    >
                      <Text className="text-ink font-bold tracking-wide">
                        Explore Quests
                      </Text>
                    </Button>
                  </VStack>
                </Card>
              </VStack>
            )}
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomePage;


