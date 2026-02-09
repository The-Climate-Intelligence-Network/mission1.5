import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, RefreshControl, Image, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { Box } from "@/src/ui/box";
import { Text } from "@/src/ui/text";
import { Heading } from "@/src/ui/heading";
import { VStack } from "@/src/ui/vstack";
import { HStack } from "@/src/ui/hstack";
import { Icon } from "@/src/ui/icon";
import { Button } from "@/src/ui/button";
import { Pressable } from "@/src/ui/pressable";
import { Card } from "@/src/ui/card";
import { Badge } from "@/src/ui/badge";
import { Progress } from "@/src/ui/progress";
import { useLanguage } from "@/src/core/i18n/language-context";
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
} from "@/src/features/missions/logic";

const DEFAULT_MISSION_IMAGE = require("@/assets/images/paddy.jpg");

const QuestItem = ({ mission, statusInfo, onView, onStart, onResume, onBookmark, actionLoading }: any) => {
    const [imageError, setImageError] = useState(false);
    const router = useRouter();

    return (
        <Card
            key={mission.id}
            className="overflow-hidden border-2 border-ink  bg-surface"
        >
            <VStack space="md">
                <Box variant="plain" className="h-48 w-full bg-data/10">
                    <Image
                        source={(mission.thumbnailUrl && !imageError) ? { uri: mission.thumbnailUrl } : DEFAULT_MISSION_IMAGE}
                        style={{ width: '100%', height: '100%', resizeMode: "cover" }}
                        onError={() => setImageError(true)}
                    />
                </Box>

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
                        <HStack space="md" className="mt-2">
                            <Button
                                size="sm"
                                onPress={() => onView(mission.id)}
                                action="primary"
                                className="flex-1"
                            >
                                <HStack space="sm" className="items-center">
                                    <Icon as={Eye} size="xs" />
                                    <Text className="font-bold tracking-wide uppercase">View</Text>
                                </HStack>
                            </Button>

                            {mission.submission_status ? (
                                <Button
                                    variant="solid"
                                    size="sm"
                                    onPress={() => {
                                        if (mission.submission_status === "reviewed") {
                                            onView(mission.id);
                                        } else {
                                            router.push(`/mission/${mission.id}/submit`);
                                        }
                                    }}
                                    className="flex-1 bg-sky border-2 border-ink shadow-retro-hard-sm"
                                    disabled={mission.submission_status === "reviewed"}
                                >
                                    <HStack space="xs" className="items-center">
                                        <Icon as={mission.submission_status === "reviewed" ? CheckCircle : Play} size="xs" />
                                        <Text className="font-bold tracking-wide uppercase">
                                            {mission.submission_status === "reviewed" ? "Done" : "Resume"}
                                        </Text>
                                    </HStack>
                                </Button>
                            ) : (
                                <Button
                                    variant="solid"
                                    size="sm"
                                    onPress={() => onStart(mission.id)}
                                    disabled={actionLoading === `start-${mission.id}`}
                                    className="flex-1 bg-sky border-2 border-ink shadow-retro-hard-sm"
                                >
                                    <HStack space="xs" className="items-center">
                                        <Icon as={Target} size="xs" />
                                        <Text className="font-bold tracking-wide uppercase">Start</Text>
                                    </HStack>
                                </Button>
                            )}

                            <Button
                                size="sm"
                                onPress={() => onBookmark(mission.id)}
                                disabled={actionLoading === `bookmark-${mission.id}`}
                                action="secondary"
                                variant="outline"
                                className="px-4"
                            >
                                <Icon
                                    as={mission.is_bookmarked ? BookmarkCheck : Bookmark}
                                    size="sm"
                                    className="text-ink"
                                />
                            </Button>
                        </HStack>
                    </VStack>
                </Box>
            </VStack>
        </Card>
    );
};

const QuestsScreen = () => {
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
            const { data, error } = await toggleMissionBookmark(
                missionId
            );

            if (!error && data) {
                setMissions((prev) =>
                    prev.map((mission) =>
                        mission.id === missionId ? { ...mission, is_bookmarked: data.bookmarked } : mission
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
            const { error } = await startMission(missionId);

            if (!error) {
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
                                    System Loading
                                </Text>
                                <Text className="font-semibold tracking-wide">
                                    Retrieving mission data...
                                </Text>
                            </VStack>
                        </HStack>
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
                    <HStack space="md" className="items-start">
                        <Image
                            source={require("@/assets/icon.png")}
                            style={{ width: 44, height: 44 }}
                            resizeMode="contain"
                        />
                        <VStack space="xs">
                            <Box className="px-2 py-0.5 border-2 border-ink bg-surface shadow-retro-hard-sm self-start">
                                <Text size="xs" className="text-data font-bold tracking-[2px] uppercase">
                                    Operations Node 1.5
                                </Text>
                            </Box>
                            <Heading size="xl" className="text-ink font-extrabold tracking-wide uppercase">Mission Intelligence</Heading>
                        </VStack>
                    </HStack>
                    <Text size="sm" className="text-ink/70 font-medium italic">
                        Synchronizing global climate directives. Select a protocol to engage.
                    </Text>
                </VStack>

                {/* User Progress Card */}
                <Box className="px-6 mb-8">
                    <Card className="p-6 shadow-retro-hard-sm">
                        <VStack space="xl">
                            <HStack className="justify-between items-center">
                                <VStack space="xs">
                                    <Heading size="lg" retro>Agent Statistics</Heading>
                                    <Text size="xs" className="uppercase tracking-[2px] font-bold text-data">
                                        Operational Status: ACTIVE
                                    </Text>
                                </VStack>
                                <Box className="bg-sky border-2 border-ink shadow-retro-hard-sm p-3">
                                    <Icon as={Award} size="lg" className="text-ink" />
                                </Box>
                            </HStack>
                            <HStack space="md" className="items-center">
                                <VStack space="xs" className="flex-1">
                                    <Text size="xs" className="uppercase tracking-[2px] font-bold text-ink/40">
                                        Completed
                                    </Text>
                                    <Text className="font-bold text-ink text-3xl" retro>
                                        {userStats.completed}
                                    </Text>
                                </VStack>
                                <Box className="w-[1px] h-8 bg-ink/10" />
                                <VStack space="xs" className="flex-1">
                                    <Text size="xs" className="uppercase tracking-[2px] font-bold text-ink/40">
                                        Active
                                    </Text>
                                    <Text className="font-bold text-ink text-3xl" retro>
                                        {userStats.active}
                                    </Text>
                                </VStack>
                                <Box className="w-[1px] h-8 bg-ink/10" />
                                <VStack space="xs" className="flex-1">
                                    <Text size="xs" className="uppercase tracking-[2px] font-bold text-ink/40">
                                        Points
                                    </Text>
                                    <Text className="font-bold text-ink text-3xl" retro>
                                        {userStats.totalPoints}
                                    </Text>
                                </VStack>
                            </HStack>
                        </VStack>
                    </Card>
                </Box>

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
                        <Card className="p-8">
                            <VStack space="md" className="items-start">
                                <HStack space="md" className="items-center">
                                    <Box className="p-3 bg-energy border-2 border-ink shadow-retro-hard-sm">
                                        <Icon as={Search} size="lg" className="text-ink" />
                                    </Box>
                                    <VStack space="xs">
                                        <Heading size="md" retro>No Results</Heading>
                                        <Text className="text-ink font-semibold tracking-wide">
                                            {searchQuery
                                                ? "Refine your search parameters."
                                                : "Zero missions in current feed."}
                                        </Text>
                                    </VStack>
                                </HStack>
                                <Button
                                    variant="outline"
                                    action="secondary"
                                    className="mt-2"
                                    onPress={() => setSearchQuery("")}
                                >
                                    <Text className="font-bold uppercase tracking-widest">Clear Search</Text>
                                </Button>
                            </VStack>
                        </Card>
                    ) : (
                        filteredMissions.map((mission) => (
                            <QuestItem
                                key={mission.id}
                                mission={mission}
                                statusInfo={getStatusInfo(mission)}
                                onView={handleViewMission}
                                onStart={handleStartMission}
                                onBookmark={handleBookmarkToggle}
                                actionLoading={actionLoading}
                            />
                        ))
                    )}
                </VStack>
            </ScrollView>
        </SafeAreaView >
    );
};

export default QuestsScreen;
