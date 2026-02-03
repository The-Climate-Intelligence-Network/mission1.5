import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, RefreshControl, Image, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Pressable } from "@/components/ui/pressable";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/components/i18n/language-context";
import {
  Zap,
  Target,
  Calendar,
  Clock,
  Users,
  Award,
  Search,
  Filter,
  SortAsc,
  Thermometer,
  FileText,
  TrendingUp,
  CheckCircle,
  Play,
  MapPin,
  TreePine,
  Waves,
  Recycle,
  Lightbulb,
  Heart,
  Plus,
  Bookmark,
  BookmarkCheck,
  Eye,
  Building,
} from "lucide-react-native";
import {
  getPublishedMissions,
  toggleMissionBookmark,
  startMission,
  getMissionThumbnailUrl,
  MissionWithStats,
} from "@/services/missions";

const QuestsPage = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all"); // all, missions, events
  const [searchQuery, setSearchQuery] = useState("");
  const [missions, setMissions] = useState<MissionWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadMissions();
  }, []);

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

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMissions();
    setRefreshing(false);
  };

  const handleBookmarkToggle = async (missionId: string) => {
    setActionLoading(`bookmark-${missionId}`);
    try {
      const { success, error, is_bookmarked } = await toggleMissionBookmark(
        missionId
      );

      if (success) {
        setMissions((prev) =>
          prev.map((mission) =>
            mission.id === missionId ? { ...mission, is_bookmarked } : mission
          )
        );
      } else {
        console.error("Bookmark error:", error);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleStartMission = async (missionId: string) => {
    setActionLoading(`start-${missionId}`);
    try {
      const { success, error } = await startMission(missionId);

      if (success) {
        // Redirect to submit page to start providing evidence
        router.push(`/mission/${missionId}/submit`);
      } else {
        console.error("Start mission error:", error);
      }
    } catch (error) {
      console.error("Error starting mission:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewMission = (missionId: string) => {
    router.push(`/mission/${missionId}/`);
  };

  // User stats (calculated from real data)
  const userStats = {
    completed: missions.filter((m) => m.submission_status === "reviewed")
      .length,
    active: missions.filter(
      (m) =>
        m.submission_status === "in_progress" ||
        m.submission_status === "started"
    ).length,
    totalPoints: missions
      .filter((m) => m.submission_status === "reviewed")
      .reduce((sum, m) => sum + (m.points_awarded || 0), 0),
    totalEnergy: missions
      .filter((m) => m.submission_status === "reviewed")
      .reduce((sum, m) => sum + (m.energy_awarded || 0), 0),
    rank: 45, // This would come from user profile/leaderboard
  };

  // Filter missions based on current tab and search
  const filteredMissions = missions.filter((mission) => {
    // Text search
    const matchesSearch =
      searchQuery === "" ||
      mission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mission.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Tab filter
    const matchesTab =
      activeTab === "all" ||
      activeTab === "missions" ||
      (activeTab === "events" &&
        (mission.is_bookmarked || mission.submission_status));

    return matchesSearch && matchesTab;
  });

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
        icon: BookmarkCheck,
      };
    } else {
      return { text: "Available", color: "text-data", icon: Target };
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1 }}
        className="bg-surface"
      >
        <Box variant="plain" className="flex-1 justify-center items-center p-6">
          <Card className="p-8">
            <VStack space="md" className="items-center">
              <Image
                source={require("@/assets/icon.png")}
                style={{ width: 48, height: 48 }}
                resizeMode="contain"
              />
              <Text className="font-semibold tracking-wide">
                Loading missions...
              </Text>
            </VStack>
          </Card>
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      className="bg-surface"
    >
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <VStack space="lg" className="p-6 pb-4">
          <VStack space="md" className="items-center">
            <Image
              source={require("@/assets/icon.png")}
              style={{ width: 64, height: 64 }}
              resizeMode="contain"
            />
            <Heading size="xl">Climate Quests</Heading>
            <Text size="lg" className="text-center">
              Complete missions to earn rewards and make an impact
            </Text>
          </VStack>

          {/* User Stats */}
          <Card className="p-6 bg-surface border-2 border-ink ">
            <VStack space="md">
              <HStack className="justify-between items-center">
                <Text
                  size="xl"
                  className="text-ink font-bold tracking-wide"
                  retro
                >
                  Your Progress
                </Text>
                <Box className="bg-sky border-2 border-ink rounded-lg p-3">
                  <Icon as={Award} size="lg" className="text-ink" />
                </Box>
              </HStack>
              <HStack className="justify-between items-center w-full">
                <VStack space="xs" className="items-center flex-1">
                  <Text
                    className="font-bold text-ink text-2xl tracking-wider"
                    retro
                  >
                    {userStats.completed}
                  </Text>
                  <Text
                    size="sm"
                    className="text-ink font-bold tracking-wide"
                  >
                    Completed
                  </Text>
                </VStack>
                <VStack space="xs" className="items-center flex-1">
                  <Text
                    className="font-bold text-ink text-2xl tracking-wider"
                    retro
                  >
                    {userStats.active}
                  </Text>
                  <Text
                    size="sm"
                    className="text-ink font-bold tracking-wide"
                  >
                    Active
                  </Text>
                </VStack>
                <VStack space="xs" className="items-center flex-1">
                  <Text
                    className="font-bold text-ink text-2xl tracking-wider"
                    retro
                  >
                    {userStats.totalPoints}
                  </Text>
                  <Text
                    size="sm"
                    className="text-ink font-bold tracking-wide"
                  >
                    Points
                  </Text>
                </VStack>
                <VStack space="xs" className="items-center flex-1">
                  <Text
                    className="font-bold text-ink text-2xl tracking-wider"
                    retro
                  >
                    {userStats.totalEnergy}
                  </Text>
                  <Text
                    size="sm"
                    className="text-ink font-bold tracking-wide"
                  >
                    Energy
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </Card>
        </VStack>

        {/* Search Bar */}
        <Box variant="plain" className="px-6 mb-4">
          <HStack
            space="md"
            className="items-center bg-surface border-2 border-ink rounded-lg px-4 py-3"
          >
            <Icon as={Search} size="md" className="text-ink" />
            <TextInput
              className="flex-1 text-ink font-body tracking-normal"
              placeholder="Search quests..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#4F9D69"
            />
          </HStack>
        </Box>

        {/* Tab Navigation */}
        <HStack space="md" className="px-6 mb-6">
          <Button
            variant="solid"
            size="sm"
            onPress={() => setActiveTab("all")}
            action={activeTab === "all" ? "primary" : "secondary"}
            className="flex-1"
          >
            <Text className="font-bold tracking-wide uppercase">
              All ({missions.length})
            </Text>
          </Button>
          <Button
            variant="solid"
            size="sm"
            onPress={() => setActiveTab("missions")}
            action={activeTab === "missions" ? "primary" : "secondary"}
            className="flex-1"
          >
            <HStack space="xs" className="items-center">
              <Icon as={Target} size="sm" className="text-ink" />
              <Text className="font-bold tracking-wide uppercase">
                Missions
              </Text>
            </HStack>
          </Button>
          <Button
            variant="solid"
            size="sm"
            onPress={() => setActiveTab("events")}
            action={activeTab === "events" ? "primary" : "secondary"}
            className="flex-1"
          >
            <HStack space="xs" className="items-center">
              <Icon as={Calendar} size="sm" className="text-ink" />
              <Text className="font-bold tracking-wide uppercase">
                Events
              </Text>
            </HStack>
          </Button>
        </HStack>

        {/* Missions List */}
        <VStack space="md" className="px-6 pb-6">
          {filteredMissions.length === 0 ? (
            <Card className="p-8 items-center">
              <VStack space="md" className="items-center">
                <Image
                  source={require("@/assets/icon.png")}
                  style={{ width: 48, height: 48 }}
                  resizeMode="contain"
                />
                <Text className="text-center text-ink font-semibold tracking-wide">
                  {searchQuery
                    ? "No missions found matching your search."
                    : "No missions available at the moment."}
                </Text>
              </VStack>
            </Card>
          ) : (
            filteredMissions.map((mission) => {
              const statusInfo = getStatusInfo(mission);

              return (
                <Card
                  key={mission.id}
                  className="overflow-hidden border-2 border-ink  bg-surface"
                >
                  <VStack space="md">
                    {/* Mission Image */}
                    {(mission as any).thumbnailUrl && (
                    <Box variant="plain" className="h-48 w-full">
                        <Image
                          source={{ uri: (mission as any).thumbnailUrl }}
                          className="w-full h-full"
                          style={{ resizeMode: "cover" }}
                        />
                      </Box>
                    )}

                    <Box variant="plain" className="p-4">
                      {/* Mission Header */}
                      <VStack space="md">
                        <HStack className="justify-between items-start">
                          <VStack space="xs" className="flex-1">
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

                            <Heading
                              size="md"
                              className="text-ink font-extrabold tracking-wider"
                              retro
                            >
                              {mission.title}
                            </Heading>

                            <Text
                              size="sm"
                              className="text-ink font-semibold tracking-wide"
                              numberOfLines={2}
                            >
                              {mission.description}
                            </Text>
                          </VStack>

                          <HStack space="xs" className="items-center">
                            <Icon
                              as={statusInfo.icon}
                              size="sm"
                              className={statusInfo.color}
                            />
                            <Text size="xs" className={statusInfo.color}>
                              {statusInfo.text}
                            </Text>
                          </HStack>
                        </HStack>

                        {/* Mission Info */}
                        <HStack space="md" className="items-center">
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
                          <HStack space="xs" className="items-center">
                            <Icon
                              as={Users}
                              size="sm"
                              className="text-ink"
                            />
                            <Text
                              size="sm"
                              className="text-ink font-semibold tracking-wide"
                            >
                              {mission.participants_count}
                            </Text>
                          </HStack>
                        </HStack>

                        {/* Progress Bar for Active Missions */}
                        {mission.submission_status &&
                          mission.submission_status !== "reviewed" && (
                            <VStack space="xs">
                              <HStack className="justify-between">
                                <Text
                                  size="sm"
                                  className="text-ink font-bold tracking-wide"
                                >
                                  Progress
                                </Text>
                                <Text
                                  size="sm"
                                  className="text-ink font-bold tracking-wide"
                                >
                                  {mission.submission_progress || 0}%
                                </Text>
                              </HStack>
                              <Progress
                                value={mission.submission_progress || 0}
                                size="sm"
                                className="w-full"
                              />
                            </VStack>
                          )}

                        {/* Action Buttons */}
                        <HStack space="md">
                          <Button
                            size="sm"
                            onPress={() => handleBookmarkToggle(mission.id)}
                            disabled={
                              actionLoading === `bookmark-${mission.id}`
                            }
                            action="secondary"
                            variant="outline"
                            className="flex-1"
                          >
                            <HStack space="xs" className="items-center">
                              <Icon
                                as={
                                  mission.is_bookmarked
                                    ? BookmarkCheck
                                    : Bookmark
                                }
                                size="sm"
                                className="text-ink"
                              />
                              <Text
                                size="sm"
                                className="text-ink font-bold tracking-wide"
                              >
                                {mission.is_bookmarked ? "Saved" : "Save"}
                              </Text>
                            </HStack>
                          </Button>

                          <Button
                            variant="solid"
                            size="sm"
                            onPress={() => handleViewMission(mission.id)}
                            action="primary"
                            className="flex-1"
                          >
                            <HStack space="sm" className="items-center">
                              <Icon
                                as={Eye}
                                size="sm"
                                className="text-ink"
                              />
                              <Text className="text-ink font-bold tracking-wide">
                                View
                              </Text>
                            </HStack>
                          </Button>

                          {mission.submission_status ? (
                            <Button
                              variant="solid"
                              size="sm"
                              onPress={() => {
                                if (mission.submission_status === "reviewed") {
                                  handleViewMission(mission.id);
                                } else {
                                  router.push(`/mission/${mission.id}/submit`);
                                }
                              }}
                              className="flex-1 bg-sky border-2 border-ink "
                              disabled={
                                mission.submission_status === "reviewed"
                              }
                            >
                              <HStack space="xs" className="items-center">
                                <Icon
                                  as={
                                    mission.submission_status === "reviewed"
                                      ? CheckCircle
                                      : Play
                                  }
                                  size="sm"
                                  className="text-ink"
                                />
                                <Text
                                  size="sm"
                                  className="text-ink font-bold tracking-wide"
                                >
                                  {mission.submission_status === "reviewed"
                                    ? "Completed"
                                    : "Continue"}
                                </Text>
                              </HStack>
                            </Button>
                          ) : (
                            <Button
                              variant="solid"
                              size="sm"
                              onPress={() => handleStartMission(mission.id)}
                              disabled={actionLoading === `start-${mission.id}`}
                              className="flex-1 bg-sky border-2 border-ink "
                            >
                              <HStack space="xs" className="items-center">
                                <Icon
                                  as={Target}
                                  size="sm"
                                  className="text-ink"
                                />
                                <Text
                                  size="sm"
                                  className="text-ink font-bold tracking-wide"
                                >
                                  Start
                                </Text>
                              </HStack>
                            </Button>
                          )}
                        </HStack>
                      </VStack>
                    </Box>
                  </VStack>
                </Card>
              );
            })
          )}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QuestsPage;

