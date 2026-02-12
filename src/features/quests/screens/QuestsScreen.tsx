import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, RefreshControl, Image, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { Scanlines } from "@/src/ui/scanlines";
import { BackgroundGradient } from "@/src/ui/background-gradient";
import { Header } from "@/src/ui/header";
import { Box } from "@/src/ui/box";
import { Text } from "@/src/ui/text";
import { Heading } from "@/src/ui/heading";
import { VStack } from "@/src/ui/vstack";
import { HStack } from "@/src/ui/hstack";
import { Icon } from "@/src/ui/icon";
import { Button } from "@/src/ui/button";
import { Pressable } from "@/src/ui/pressable";
import { StatusCard } from "@/src/ui/status-card";
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
import { MissionCard } from "@/src/features/missions/components/MissionCard";
import { QuestFilters } from "@/src/features/quests/components/QuestFilters";



const QuestsScreen = () => {
    const { t } = useLanguage();
    const router = useRouter();

    // Filter state
    const [activeType, setActiveType] = useState<"missions" | "events">("missions");
    const [selectedCategories, setSelectedCategories] = useState<string[]>(["ALL"]);
    const [selectedSubmissionTypes, setSelectedSubmissionTypes] = useState<string[]>(["ALL"]);
    const [nearbyEnabled, setNearbyEnabled] = useState(false);

    const [activeTab, setActiveTab] = useState("all"); // all, missions, events
    const [searchQuery, setSearchQuery] = useState("");
    const [missions, setMissions] = useState<MissionWithStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Filter helpers
    const handleCategoryToggle = (category: string) => {
        if (category === "ALL") {
            setSelectedCategories(["ALL"]);
        } else {
            const filtered = selectedCategories.filter(c => c !== "ALL");
            if (selectedCategories.includes(category)) {
                const newCategories = filtered.filter(c => c !== category);
                setSelectedCategories(newCategories.length === 0 ? ["ALL"] : newCategories);
            } else {
                setSelectedCategories([...filtered, category]);
            }
        }
    };

    const handleSubmissionTypeToggle = (type: string) => {
        if (type === "ALL") {
            setSelectedSubmissionTypes(["ALL"]);
        } else {
            const filtered = selectedSubmissionTypes.filter(t => t !== "ALL");
            if (selectedSubmissionTypes.includes(type)) {
                const newTypes = filtered.filter(t => t !== type);
                setSelectedSubmissionTypes(newTypes.length === 0 ? ["ALL"] : newTypes);
            } else {
                setSelectedSubmissionTypes([...filtered, type]);
            }
        }
    };

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

    // Filter missions based on categories, types and search
    const filteredMissions = missions.filter((mission) => {
        // Text search
        const matchesSearch =
            searchQuery === "" ||
            mission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mission.description.toLowerCase().includes(searchQuery.toLowerCase());

        // Category filter
        const matchesCategory =
            selectedCategories.includes("ALL") ||
            (mission.category && selectedCategories.includes(mission.category.toUpperCase()));

        // Submission Type filter
        const matchesSubmissionType =
            selectedSubmissionTypes.includes("ALL") ||
            (mission.submission_type && selectedSubmissionTypes.includes(mission.submission_type.toUpperCase()));

        return matchesSearch && matchesCategory && matchesSubmissionType;
    });

    const getStatusInfo = (mission: MissionWithStats) => {
        if (mission.submission_status === "reviewed") {
            return { text: "Completed", color: "text-digital-dark", icon: CheckCircle };
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
            <View style={{ flex: 1 }}>
                <BackgroundGradient />
                <Scanlines />
                <SafeAreaView style={{ flex: 1 }}>
                    <Box variant="plain" className="flex-1 p-6">
                        <StatusCard
                            variant="loading"
                            title="Retrieving mission data..."
                        />
                    </Box>
                </SafeAreaView>
            </View>
        );
    }

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
                    contentContainerStyle={{ padding: 24, paddingTop: 16, paddingBottom: 100 }}
                >
                    <VStack space="lg" className="w-full items-start">
                        {/* Header */}
                        <Header title="Quests" />

                        {/* Quest Filters */}
                        <QuestFilters
                            activeType={activeType}
                            onTypeChange={setActiveType}
                            selectedCategories={selectedCategories}
                            onCategoryToggle={handleCategoryToggle}
                            selectedSubmissionTypes={selectedSubmissionTypes}
                            onSubmissionTypeToggle={handleSubmissionTypeToggle}
                            nearbyEnabled={nearbyEnabled}
                            onNearbyToggle={() => setNearbyEnabled(!nearbyEnabled)}
                        />

                        {/* Missions List */}
                        <VStack space="lg" className="w-full mt-4">
                            {filteredMissions.length === 0 ? (
                                <StatusCard
                                    title="No Missions Found"
                                    description="Try adjusting your filters or check back later."
                                />
                            ) : activeType === "events" ? (
                                <StatusCard
                                    title="Events Coming Soon"
                                    description="Event functionality will be available soon."
                                    icon={Calendar}
                                />
                            ) : (
                                filteredMissions.map((mission) => (
                                    <MissionCard
                                        key={mission.id}
                                        mission={mission}
                                        variant="landscape"
                                        onPress={() => handleViewMission(mission.id)}
                                    />
                                ))
                            )}
                        </VStack>
                    </VStack>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default QuestsScreen;
