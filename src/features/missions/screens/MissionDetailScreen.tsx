import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Box } from "@/src/ui/box";
import { Text } from "@/src/ui/text";
import { Heading } from "@/src/ui/heading";
import { VStack } from "@/src/ui/vstack";
import { HStack } from "@/src/ui/hstack";
import { Icon } from "@/src/ui/icon";
import { Button } from "@/src/ui/button";
import { Card } from "@/src/ui/card";
import { Badge } from "@/src/ui/badge";
import { useLanguage } from "@/src/core/i18n/language-context";
import {
    ArrowLeft,
    Target,
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
} from "@/src/features/missions/logic/details";
import { GuidanceStep } from "@/src/features/missions/logic/types";
import {
    toggleMissionBookmark,
    startMission,
    getMissionThumbnailUrl,
    MissionWithStats,
} from "@/src/features/missions/logic";

const MissionDetailScreen = () => {
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
            const { data, error } = await toggleMissionBookmark(mission.id);

            if (data) {
                setMission({ ...mission, is_bookmarked: data.bookmarked });
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
            const { data, error } = await startMission(mission.id);

            if (data) {
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
                <Box variant="plain" className="flex-1 p-6">
                    <Card className="p-8">
                        <HStack space="md" className="items-center">
                            <Image
                                source={require("@/assets/icon.png")}
                                style={{ width: 48, height: 48 }}
                                resizeMode="contain"
                            />
                            <VStack space="xs">
                                <Text className="font-bold tracking-widest uppercase text-data text-xs">
                                    Decoding Mission
                                </Text>
                                <Text className="font-semibold tracking-wide">
                                    Loading instructions...
                                </Text>
                            </VStack>
                        </HStack>
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
                <VStack space="lg" className="p-6 pb-2">
                    <HStack className="justify-between items-center">
                        <Button
                            variant="outline"
                            size="sm"
                            onPress={() => router.back()}
                            action="secondary"
                            className="px-4"
                        >
                            <HStack space="xs" className="items-center">
                                <Icon as={ArrowLeft} size="sm" className="text-ink" />
                                <Text className="text-ink font-bold tracking-wide uppercase">Back</Text>
                            </HStack>
                        </Button>
                        <Image
                            source={require("@/assets/icon.png")}
                            style={{ width: 32, height: 32 }}
                            resizeMode="contain"
                        />
                    </HStack>
                    <Heading size="xl" retro>Mission Protocol</Heading>
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
                                        alt="Mission Thumbnail"
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
                    <Card variant="success" className="p-6 mb-8">
                        <VStack space="md">
                            <HStack space="md" className="items-center">
                                <Box className="p-3 bg-ink rounded-full">
                                    <Icon as={Play} size="md" className="text-digital" />
                                </Box>
                                <Heading size="md" retro>Ready to proceed?</Heading>
                            </HStack>
                            <Text retro className="font-semibold text-ink">
                                Follow the instructions above and submit your evidence to complete this mission and earn rewards.
                            </Text>
                            <Text size="xs" className="text-ink font-bold tracking-widest uppercase opacity-60">
                                🌍 Node 01 • Data Sovereignty • Clean Future
                            </Text>
                        </VStack>
                    </Card>
                </Box>
            </ScrollView>
        </SafeAreaView>
    );
};

export default MissionDetailScreen;
