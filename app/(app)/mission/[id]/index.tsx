import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/i18n/language-context";
import {
  ArrowLeft,
  Target,
  MapPin,
  Clock,
  Users,
  Bookmark,
  BookmarkCheck,
  Play,
  CheckCircle,
  Award,
  Zap,
  Building,
} from "lucide-react-native";
import {
  getMissionDetails,
  getMissionInstructions,
  getMissionGuidanceSteps,
  MissionInstruction,
  GuidanceStep,
} from "@/services/missions/details";
import {
  toggleMissionBookmark,
  startMission,
  getMissionThumbnailUrl,
  MissionWithStats,
} from "@/services/missions";

const MissionDetailsPage = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [mission, setMission] = useState<MissionWithStats | null>(null);
  const [instructions, setInstructions] = useState<MissionInstruction[]>([]);
  const [guidanceSteps, setGuidanceSteps] = useState<GuidanceStep[]>([]);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && typeof id === "string") {
      loadMissionDetails(id);
    }
  }, [id]);

  const loadMissionDetails = async (missionId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data: missionData, error: missionError } =
        await getMissionDetails(missionId);

      if (missionError) {
        setError(missionError);
        return;
      }

      if (missionData) {
        setMission(missionData);
        setInstructions(getMissionInstructions(missionData));
        setGuidanceSteps(getMissionGuidanceSteps(missionData));

        // Load thumbnail if available
        if (missionData.thumbnail_path) {
          const thumbnailUrl = await getMissionThumbnailUrl(
            missionData.thumbnail_path
          );
          setThumbnailUrl(thumbnailUrl);
        }
      }
    } catch (error) {
      console.error("Error loading mission details:", error);
      setError("Failed to load mission details");
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkToggle = async () => {
    if (!mission) return;

    setActionLoading("bookmark");
    try {
      const { success, error, is_bookmarked } = await toggleMissionBookmark(
        mission.id
      );

      if (success) {
        setMission({ ...mission, is_bookmarked });
      } else {
        console.error("Bookmark error:", error);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleStartMission = async () => {
    if (!mission) return;

    setActionLoading("start");
    try {
      const { success, error } = await startMission(mission.id);

      if (success) {
        // Redirect to submit page to start providing evidence
        router.push(`/mission/${mission.id}/submit`);
      } else {
        console.error("Start mission error:", error);
      }
    } catch (error) {
      console.error("Error starting mission:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    // This would need to be determined from mission data or instructions complexity
    return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300";
  };

  const getStatusInfo = () => {
    if (!mission)
      return { text: "Unknown", color: "text-gray-500", icon: Target };

    if (mission.submission_status === "reviewed") {
      return { text: "Completed", color: "text-green-600", icon: CheckCircle };
    } else if (
      mission.submission_status === "in_progress" ||
      mission.submission_status === "started"
    ) {
      return {
        text: `${mission.submission_progress}% Complete`,
        color: "text-sky",
        icon: Play,
      };
    } else if (mission.is_bookmarked) {
      return { text: "Saved", color: "text-action", icon: BookmarkCheck };
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
                Loading mission details...
              </Text>
            </VStack>
          </Card>
        </Box>
      </SafeAreaView>
    );
  }

  if (error || !mission) {
    return (
      <SafeAreaView
        style={{ flex: 1 }}
        className="bg-surface"
      >
        <Box variant="plain" className="flex-1 justify-center items-center p-6">
          <VStack space="md" className="items-center">
            <Text retro>
              {error || "Mission not found"}
            </Text>
            <Button 
              onPress={() => router.back()}
              action="primary"
            >
              <Text className="font-bold tracking-wide">Go Back</Text>
            </Button>
          </VStack>
        </Box>
      </SafeAreaView>
    );
  }

  const statusInfo = getStatusInfo();

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      className="bg-surface"
    >
      <ScrollView className="flex-1">
        {/* Header */}
        <VStack space="lg" className="items-center p-6">
          <Image
            source={require("@/assets/icon.png")}
            style={{ width: 48, height: 48 }}
            resizeMode="contain"
          />
          <Heading size="xl" className="text-center">
            Mission Details
          </Heading>
          
          {/* Back Button */}
          <Button
            variant="solid"
            size="sm"
            onPress={() => router.back()}
            className="bg-surface border-2 border-ink "
          >
            <HStack space="sm" className="items-center">
              <Icon as={ArrowLeft} size="sm" className="text-ink" />
              <Text className="text-ink font-bold tracking-wide">Go Back</Text>
            </HStack>
          </Button>
        </VStack>

        <Box variant="plain" className="p-6">
          {/* Mission Header */}
          <Card className="p-6 mb-6">
            <VStack space="lg">
              {/* Thumbnail */}
              {thumbnailUrl && (
                <Box variant="plain" className="w-full h-48 rounded-lg overflow-hidden border-2 border-ink">
                  <Image
                    source={{ uri: thumbnailUrl }}
                    className="w-full h-full"
                    style={{ resizeMode: "cover" }}
                  />
                </Box>
              )}

              {/* Title and Status */}
              <VStack space="md">
                <VStack space="xs">
                  <Heading retro
                    size="xl"
                    className="text-ink font-bold tracking-wide"
                  >
                    {mission.title}
                  </Heading>
                  <HStack space="xs" className="items-center mt-3">
                    <Icon
                      as={statusInfo.icon}
                      size="sm"
                      className="text-ink"
                    />
                    <Text retro size="sm" className="text-ink">
                      {statusInfo.text}
                    </Text>
                  </HStack>
                </VStack>

                <Text retro
                  size="md"
                  className="text-ink"
                >
                  {mission.description}
                </Text>

                {/* Mission Info */}
                <VStack space="xs">
                  <HStack space="xs" className="items-center">
                    <Icon as={Building} size="sm" className="text-ink" />
                    <Text retro
                      size="sm"
                      className="text-ink"
                    >
                      {mission.organization_name}
                    </Text>
                  </HStack>
                  <HStack space="xs" className="items-center">
                    <Icon as={Users} size="sm" className="text-ink" />
                    <Text retro
                      size="sm"
                      className="text-ink"
                    >
                      {mission.participants_count} participants
                    </Text>
                  </HStack>

                  <HStack space="md" className="items-center">
                    <HStack space="xs" className="items-center">
                      <Icon as={Award} size="sm" className="text-ink" />
                      <Text retro
                        size="sm"
                        className="text-ink"
                      >
                        {mission.points_awarded} points
                      </Text>
                    </HStack>
                    <HStack space="xs" className="items-center">
                      <Icon as={Zap} size="sm" className="text-ink" />
                      <Text retro
                        size="sm"
                        className="text-ink"
                      >
                        {mission.energy_awarded} energy
                      </Text>
                    </HStack>
                  </HStack>
                </VStack>
              </VStack>

              {/* Action Buttons */}
              <HStack space="md">
                <Button
                  size="sm"
                  onPress={handleBookmarkToggle}
                  disabled={actionLoading === "bookmark"}
                  action="secondary"
                  variant="outline"
                  className="flex-1"
                >
                  <HStack space="sm" className="items-center">
                    <Icon
                      as={mission.is_bookmarked ? BookmarkCheck : Bookmark}
                      size="sm"
                      className="text-ink"
                    />
                    <Text className="font-bold tracking-wide">
                      {mission.is_bookmarked ? "Saved" : "Save"}
                    </Text>
                  </HStack>
                </Button>

                {mission.submission_status === "reviewed" ? (
                  <Button
                    variant="solid"
                    size="sm"
                    action="positive"
                    className="flex-1"
                    disabled
                  >
                    <VStack className="items-center justify-center">
                      <HStack space="xs" className="items-center">
                        <Icon as={CheckCircle} size="sm" className="text-ink" />
                        <Text retro className="font-bold">Completed</Text>
                      </HStack>
                    </VStack>
                  </Button>
                ) : mission.submission_status && ["started", "in_progress", "completed"].includes(mission.submission_status) ? (
                  <Button
                    variant="solid"
                    size="sm"
                    onPress={() => router.push(`/mission/${mission.id}/submit`)}
                    action="primary"
                    className="flex-1"
                  >
                    <HStack space="sm" className="items-center">
                      <Icon as={Play} size="sm" className="text-ink" />
                      <Text className="font-bold tracking-wide">
                        {mission.submission_status === "completed" ? "Review" : "Continue"}
                      </Text>
                    </HStack>
                  </Button>
                ) : (
                  <Button
                    variant="solid"
                    size="sm"
                    onPress={handleStartMission}
                    disabled={actionLoading === "start"}
                    action="positive"
                    className="flex-1"
                  >
                    <VStack className="items-center justify-center">
                      <HStack space="xs" className="items-center">
                        <Icon as={Target} size="sm" className="text-ink" />
                        <Text retro className="font-bold">Start Mission</Text>
                      </HStack>
                    </VStack>
                  </Button>
                )}
              </HStack>
            </VStack>
          </Card>

          {/* Instructions */}
          {instructions.length > 0 && (
            <Card className="p-6 mb-6">
              <VStack space="lg">
                <Heading size="lg">Instructions</Heading>

                <VStack space="md">
                  {instructions.map((instruction, index) => (
                    <Card
                      key={instruction.id}
                      className="p-4"
                    >
                      <HStack space="md" className="items-start">
                        <Box className="w-8 h-8 bg-digital border-2 border-ink rounded-full items-center justify-center">
                          <Text retro
                            size="sm"
                            className="font-bold text-ink"
                          >
                            {index + 1}
                          </Text>
                        </Box>
                        <VStack space="xs" className="flex-1">
                          <Text retro className="font-bold text-ink">
                            {instruction.title}
                          </Text>
                          <Text retro
                            size="sm"
                            className="text-ink"
                          >
                            {instruction.description}
                          </Text>
                        </VStack>
                      </HStack>
                    </Card>
                  ))}
                </VStack>
              </VStack>
            </Card>
          )}

          {/* Guidance Steps */}
          {guidanceSteps.length > 0 && (
            <Card className="p-6 mb-6">
              <VStack space="lg">
                <Heading retro
                  size="lg"
                  className="text-ink font-bold tracking-wide"
                >
                  🎯 Evidence Requirements
                </Heading>

                <VStack space="md">
                  {guidanceSteps.map((step, index) => (
                    <Card
                      key={step.id}
                      className="p-4 bg-energy border-2 border-ink "
                    >
                      <VStack space="md">
                        <HStack space="md" className="items-start">
                          <Box className="w-8 h-8 bg-action border-2 border-ink rounded-full items-center justify-center">
                            <Text retro
                              size="sm"
                              className="font-bold text-ink"
                            >
                              {index + 1}
                            </Text>
                          </Box>
                          <VStack space="xs" className="flex-1">
                            <Text retro className="font-bold text-ink">
                              {step.title}
                            </Text>
                            <Text retro
                              size="sm"
                              className="text-ink"
                            >
                              {step.description}
                            </Text>
                          </VStack>
                        </HStack>

                        {step.requiredEvidence.length > 0 && (
                          <VStack space="xs">
                            <Text retro
                              size="sm"
                              className="font-bold text-ink"
                            >
                              Required Evidence:
                            </Text>
                            <HStack space="xs" className="flex-wrap">
                              {step.requiredEvidence.map((evidence, idx) => (
                                <Badge
                                  key={idx}
                                  className="bg-digital border border-ink "
                                >
                                  <Text retro
                                    size="xs"
                                    className="text-ink font-bold"
                                  >
                                    {evidence}
                                  </Text>
                                </Badge>
                              ))}
                            </HStack>
                          </VStack>
                        )}
                      </VStack>
                    </Card>
                  ))}
                </VStack>
              </VStack>
            </Card>
          )}

          {/* Additional Info */}
          <Card className="p-6 bg-digital border-2 border-ink ">
            <VStack space="md" className="items-center">
              <Text retro className="font-bold text-ink text-center text-lg">
                � Ready to make an impact?
              </Text>
              <Text retro
                size="sm"
                className="text-ink text-center"
              >
                Follow the instructions above and submit your evidence to complete this mission and earn awesome rewards! 
              </Text>
              <Text retro
                size="xs"
                className="text-ink text-center opacity-80"
              >
                Every action counts in our fight against climate change! 🌍
              </Text>
            </VStack>
          </Card>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MissionDetailsPage;


