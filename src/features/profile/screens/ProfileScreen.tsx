import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    ScrollView,
    RefreshControl,
    Alert,
    View,
    Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Box } from "@/src/ui/box";
import { Text } from "@/src/ui/text";
import { Heading } from "@/src/ui/heading";
import { VStack } from "@/src/ui/vstack";
import { HStack } from "@/src/ui/hstack";
import { Icon } from "@/src/ui/icon";
import { Button } from "@/src/ui/button";
import { Card } from "@/src/ui/card";
import { Avatar, AvatarImage } from "@/src/ui/avatar";
import { Badge } from "@/src/ui/badge";
import { BackgroundGradient } from "@/src/ui/background-gradient";
import { Scanlines } from "@/src/ui/scanlines";
import { Header } from "@/src/ui/header";
import { HardShadowFrame } from "@/src/ui/primitives/HardShadowFrame";
import { Divider, FilterChip, StatusCard } from "@/src/ui";
import { Pressable } from "react-native";
import { useSession } from "@/src/core/auth/AuthProvider";
import {
    User,
    Award,
    Target,
    BarChart3,
    Calendar,
    CheckCircle,
    Turtle,
    Sun,
    ShoppingBag,
    Leaf,
    Droplet,
    Plus,
    Bookmark,
    Play,
    Calendar1,
    Ticket,
} from "lucide-react-native";
import { Progress } from "@/src/ui/progress";
import { colors } from "@/src/ui/tokens/colors";
import {
    getCurrentUserProfileWithAvatar,
    getAgentStats,
    getAgentLevel,
    getRecentActivity,
    Agent,
    AgentStats,
    AgentLevel,
    Activity,
} from "@/src/features/profile/logic/profile.service";
import { ProfileSettingsMenu } from "../components/ProfileSettingsMenu";
import { BASE_URL } from "@/src/core/config/constants";
import { SegmentedProgressBar } from "@/src/ui/segmented-progress";
import { getPublishedMissions } from "../../missions/logic/missions.service";
import { MissionWithStats } from "../../missions/logic/types";
import { EventRepo } from "@/src/data/repositories/EventRepo";
import { EventQuest } from "@/src/domain/events/models";
import { MissionCard } from "../../missions/components/MissionCard";
import { EventCard } from "../../quests/components/EventCard";

export const ProfileScreen = () => {
    const { user, signOut } = useSession();
    // router is imported directly from expo-router

    // State
    const [profile, setProfile] = useState<Agent | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string>("");
    const [stats, setStats] = useState<AgentStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [events, setEvents] = useState<EventQuest[]>([]);
    const [selectedEventFilter, setSelectedEventFilter] = useState<"Going" | "Bookmarked" | "Done">("Going");

    // Mission Log State
    const [missions, setMissions] = useState<MissionWithStats[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<"In Progress" | "Bookmarked" | "Completed">("In Progress");

    const fetchData = async () => {
        if (!user) return;

        try {
            // Parallel fetch for profile, stats and missions
            const [profileRes, statsRes, activityRes, eventsData, missionsRes] = await Promise.all([
                getCurrentUserProfileWithAvatar(),
                getAgentStats(user.id),
                getRecentActivity(user.id),
                EventRepo.getAll(),
                getPublishedMissions()
            ]);

            if (profileRes.success && profileRes.data) {
                setProfile(profileRes.data);
                setAvatarUrl(profileRes.data.avatarSignedUrl || "");
            }

            if (statsRes.success && statsRes.data) {
                setStats(statsRes.data);
            }

            if (activityRes.success && activityRes.data) {
                // Assuming setActivities state exists or needs to be added
                // setActivities(activityRes.data);
            }

            if (eventsData) {
                setEvents(eventsData);
            }

            if (missionsRes.data) {
                setMissions(missionsRes.data);
            }
        } catch (error) {
            console.error("Error loading profile data:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    const filteredMissions = useMemo(() => {
        if (!Array.isArray(missions)) return [];
        return missions.filter(m => {
            if (selectedFilter === "In Progress") return m.submission_status === 'started' || m.submission_status === 'in_progress';
            if (selectedFilter === "Bookmarked") return m.is_bookmarked;
            if (selectedFilter === "Completed") return m.submission_status === 'reviewed';
            return false;
        });
    }, [missions, selectedFilter]);

    const filteredEvents = useMemo(() => {
        if (!Array.isArray(events)) return [];
        return events.filter(event => {
            if (selectedEventFilter === "Going") return true;
            if (selectedEventFilter === "Bookmarked") return false;
            if (selectedEventFilter === "Done") return new Date(event.endDate) < new Date();
            return true;
        });
    }, [events, selectedEventFilter]);

    const deleteAccount = async () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete your account? This action cannot be undone and you will lose all your progress.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            if (!user?.id) return;

                            // Call the delete user API route
                            const response = await fetch(`${BASE_URL}/api/auth/delete-user`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ userId: user.id }),
                            });

                            const result = await response.json();

                            if (!response.ok) {
                                Alert.alert(
                                    "Error",
                                    result.error || "Failed to delete account. Please try again."
                                );
                                return;
                            }

                            // Sign out the user after successful deletion
                            await signOut();

                            Alert.alert(
                                "Account Deleted",
                                "Your account has been successfully deleted."
                            );
                        } catch (error) {
                            console.error("Error deleting account:", error);
                            Alert.alert(
                                "Error",
                                "Failed to delete account. Please try again."
                            );
                        }
                    },
                },
            ]
        );
    };

    // Display stats for the UI
    const displayStats = [
        {
            label: "Missions Completed",
            value: stats?.completedMissions.toString() || "0",
            color: "text-green-600",
        },
        {
            label: "Missions In Progress",
            value: stats?.ongoingMissions.toString() || "0",
            color: "text-blue-600",
        },
        {
            label: "Saved Missions",
            value: stats?.savedMissions.toString() || "0",
            color: "text-purple-600",
        },
        {
            label: "Points Earned",
            value: stats?.totalPoints.toString() || "0",
            color: "text-orange-600",
        },
        {
            label: "Energy Collected",
            value: stats?.totalEnergy.toString() || "0",
            color: "text-yellow-600",
        },
        {
            label: "Data Points",
            value: stats?.dataPointsContributed.toString() || "0",
            color: "text-blue-500",
        },
    ];

    // Achievements based on stats (Logic could also be moved to service in future)
    const achievements = [
        {
            id: 1,
            title: "First Steps",
            description: "Complete your first mission",
            icon: Target,
            earned: (stats?.completedMissions || 0) >= 1,
        },
        {
            id: 2,
            title: "Climate Activist",
            description: "Complete 5 missions",
            icon: Award,
            earned: (stats?.completedMissions || 0) >= 5,
        },
        {
            id: 3,
            title: "Data Pioneer",
            description: "Contribute 100 data points",
            icon: BarChart3,
            earned: (stats?.dataPointsContributed || 0) >= 100,
        },
        {
            id: 4,
            title: "Mission Master",
            description: "Complete 10 missions",
            icon: CheckCircle,
            earned: (stats?.completedMissions || 0) >= 10,
        },
        {
            id: 5,
            title: "Point Collector",
            description: "Earn 1000 points",
            icon: Award,
            earned: (stats?.totalPoints || 0) >= 1000,
        },
        {
            id: 6,
            title: "Energy Saver",
            description: "Collect 500 energy",
            icon: Award,
            earned: (stats?.totalEnergy || 0) >= 500,
        },
    ];

    // Get display data from profile or auth user
    const displayName =
        profile?.full_name ||
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.email?.split("@")[0] ||
        "Climate Advocate";

    const displayEmail = profile?.email || user?.email || "No email";
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
                    <VStack space="lg" className="w-full">
                        <Header
                            title="Profile"
                            variant="profile"
                            rightContent={
                                <ProfileSettingsMenu
                                    onSignOut={async () => {
                                        await signOut();
                                    }}
                                    onDeleteAccount={deleteAccount}
                                />
                            }
                        />

                        {/* Content */}
                        <VStack space="3xl" className="w-full">
                            {/* Profile Info Card */}
                            <HStack space="lg" className="flex-row items-start w-full">
                                <HardShadowFrame
                                    bg={colors.surface}
                                    radius={16}
                                    shadowSize={4}
                                    className="p-1 border-2 border-ink"
                                >
                                    {avatarUrl ||
                                        user?.user_metadata?.avatar_url ||
                                        user?.user_metadata?.picture ? (
                                        <Avatar className="border-0 h-24 w-24">
                                            <AvatarImage
                                                source={{
                                                    uri:
                                                        avatarUrl ||
                                                        user?.user_metadata?.avatar_url ||
                                                        user?.user_metadata?.picture,
                                                }}
                                                className="rounded-xl"
                                            />
                                        </Avatar>
                                    ) : (
                                        <Box className="w-24 h-24 bg-sky border-0 items-center justify-center rounded-xl">
                                            <Icon as={User} size="xl" className="text-ink" />
                                        </Box>
                                    )}
                                    <Box className="absolute -bottom-2 -right-2 w-10 h-10 bg-surface border-2 border-ink items-center justify-center z-10">
                                        <Image
                                            source={require("@/assets/sea-turtle.png")}
                                            style={{ width: 28, height: 28, resizeMode: "contain" }}
                                        />
                                    </Box>
                                </HardShadowFrame>

                                <VStack space="2xs" className="flex-1 items-start">
                                    <Heading
                                        size="xl"
                                        className="text-ink tracking-wide uppercase"
                                    >
                                        {displayName}
                                    </Heading>
                                    <HStack space="xs" className="items-center mb-4">
                                        <Text weight="bold" className="text-ink/60 uppercase tracking-widest">LEAGUE:</Text>
                                        <Text weight="bold" className="text-ink uppercase tracking-widest">Green Turtle</Text>
                                    </HStack>

                                    <VStack space="xs" className="w-full">
                                        <HStack className="justify-between items-center w-full">
                                            <Text size="md" weight="bold" className="text-ink/60 tracking-widest">Progress</Text>
                                            <Text size="md" weight="bold" className="text-ink/60 tracking-widest">{stats?.totalEnergy || 300}/1000</Text>
                                        </HStack>
                                        <SegmentedProgressBar
                                            current={stats?.totalEnergy || 300}
                                            total={1000}
                                            maxSegments={16}
                                            size="sm"
                                        />
                                    </VStack>
                                </VStack>
                            </HStack>

                            {/* CIQ and Points Boxes */}
                            <HStack space="md" className="w-full">
                                {/* Left Box - CIQ (Energy) */}
                                <HardShadowFrame
                                    bg={colors.data}
                                    radius={16}
                                    shadowSize={4}
                                    wrapperClassName="flex-1"
                                    className="p-4 pt-2 border-2 border-ink relative overflow-hidden h-24 justify-center"
                                >
                                    <Box className="absolute -right-4 -bottom-4 z-0 bg-transparent border-0">
                                        <Icon as={Sun} size={72} className="text-ink opacity-60" />
                                    </Box>
                                    <VStack space="xs">
                                        <Text size="sm" weight="bold" className="text-digital uppercase tracking-widest">CIQ</Text>
                                        <Text weight="bold" size="2xl" className="text-white tracking-widest">
                                            {stats?.totalEnergy || 2500}
                                        </Text>
                                    </VStack>
                                </HardShadowFrame>

                                {/* Right Box - Redeemable Pts (Points) */}
                                <HardShadowFrame
                                    bg={colors.energy}
                                    radius={16}
                                    shadowSize={4}
                                    wrapperClassName="flex-1"
                                    className="p-4 pt-2 border-2 border-ink relative overflow-hidden h-24 justify-center"
                                >
                                    <Box
                                        className="absolute -right-4 -bottom-4 z-0 bg-transparent border-0"
                                        style={{ transform: [{ rotate: '-12deg' }] }}
                                    >
                                        <Icon as={ShoppingBag} size={70} className="text-ink opacity-50" />
                                    </Box>
                                    <VStack space="xs">
                                        <Text size="sm" weight="bold" className="text-ink/80 uppercase tracking-widest">Redeemable Pts</Text>
                                        <Text weight="bold" size="2xl" className="text-ink tracking-widest">
                                            {stats?.totalPoints || 1500}
                                        </Text>
                                    </VStack>
                                </HardShadowFrame>
                            </HStack>

                            {/* Reward Showcase */}
                            <HardShadowFrame
                                bg={colors.surface}
                                radius={16}
                                shadowSize={4}
                                className="p-6 w-full border-2 border-ink"
                            >
                                <VStack space="lg">
                                    <Heading size="lg" className="text-ink/30 tracking-wide uppercase">
                                        Achievements
                                    </Heading>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        <HStack space="md" className="pb-2">
                                            {[Sun, Leaf, Droplet, Turtle, Target, Plus].map((IconComponent, index) => (
                                                <Box key={index} className="w-16 h-16 bg-ink/5 rounded-xl items-center justify-center border-2 border-ink/5">
                                                    <Icon as={IconComponent} size="xl" className="text-ink/20" />
                                                </Box>
                                            ))}
                                        </HStack>
                                    </ScrollView>
                                </VStack>
                            </HardShadowFrame>

                            <VStack space="md">
                                {/* Missions */}
                                <VStack space="sm" className="mt-4 w-full">
                                    <HStack space="sm" className="items-center">
                                        <Icon as={Leaf} size="lg" className="text-ink" />
                                        <Heading size="lg" className="text-ink uppercase">Mission Log</Heading>
                                    </HStack>

                                    {/* Filter chips */}
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="w-full">
                                        <HStack space="sm" className="pb-1">
                                            {["In Progress", "Bookmarked", "Completed"].map((filterOption) => {
                                                const filterIcons: Record<string, any> = {
                                                    "In Progress": Play,
                                                    "Bookmarked": Bookmark,
                                                    "Completed": CheckCircle
                                                };
                                                return (
                                                    <FilterChip
                                                        key={filterOption}
                                                        label={filterOption}
                                                        isSelected={selectedFilter === filterOption}
                                                        icon={filterIcons[filterOption]}
                                                        onPress={() => setSelectedFilter(filterOption as any)}
                                                    />
                                                );
                                            })}
                                        </HStack>
                                    </ScrollView>

                                    {filteredMissions.length > 0 ? (
                                        <ScrollView
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            style={{ marginHorizontal: -24 }}
                                            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 16, gap: 16 }}
                                            className="mt-2"
                                        >
                                            {filteredMissions.map((mission) => (
                                                <MissionCard
                                                    key={mission.id}
                                                    mission={mission}
                                                    variant="compact"
                                                    onPress={() => router.push(`/mission/${mission.id}` as any)}
                                                />
                                            ))}
                                        </ScrollView>
                                    ) : (
                                        <StatusCard
                                            title={`No missions found in "${selectedFilter}"`}
                                            className="mt-2"
                                        />
                                    )}
                                </VStack>

                                {/* Events */}
                                <VStack space="sm" className="w-full">
                                    <HStack space="sm" className="items-center">
                                        <Icon as={Ticket} size="lg" className="text-ink" style={{ transform: [{ rotate: '-45deg' }] }} />
                                        <Heading size="lg" className="text-ink uppercase">Event Dashboard</Heading>
                                    </HStack>

                                    {/* Filter chips */}
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="w-full">
                                        <HStack space="sm" className="pb-1">
                                            {["Going", "Bookmarked", "Done"].map((filterOption) => {
                                                const filterIcons: Record<string, any> = {
                                                    "Going": Calendar,
                                                    "Bookmarked": Bookmark,
                                                    "Done": CheckCircle
                                                };
                                                return (
                                                    <FilterChip
                                                        key={filterOption}
                                                        label={filterOption}
                                                        isSelected={selectedEventFilter === filterOption}
                                                        icon={filterIcons[filterOption]}
                                                        onPress={() => setSelectedEventFilter(filterOption as any)}
                                                    />
                                                );
                                            })}
                                        </HStack>
                                    </ScrollView>

                                    {filteredEvents.length > 0 ? (
                                        <ScrollView
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            style={{ marginHorizontal: -24 }}
                                            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 16, gap: 16 }}
                                            className="mt-2"
                                        >
                                            {filteredEvents.map((event) => {
                                                return (
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
                                                        variant="compact"
                                                        onPress={() => {
                                                            // TODO: Navigate to event details
                                                            Alert.alert("Event Details", `Navigate to event: ${event.title}`);
                                                        }}
                                                    />
                                                );
                                            })}
                                        </ScrollView>
                                    ) : (
                                        <StatusCard
                                            title={`No events found in "${selectedEventFilter}"`}
                                            className="mt-2"
                                        />
                                    )}
                                </VStack>
                            </VStack>

                            {/* Contribution Data */}
                            <VStack space="lg" className="w-full">
                                <HardShadowFrame
                                    bg={colors.surface}
                                    radius={16}
                                    shadowSize={4}
                                    className="p-6 w-full border-2 border-ink"
                                >
                                    <VStack space="md">
                                        <Heading size="lg" className="text-ink tracking-wide uppercase">
                                            Contribution Data
                                        </Heading>
                                        <Divider className="bg-ink/20" />

                                        {/* Row 1: Missions, Events, Time, Locations */}
                                        <HStack className="w-full items-center justify-between">
                                            {[
                                                { label: "Missions", value: stats?.completedMissions || 12 },
                                                { label: "Events", value: 5 },
                                                { label: "Time", value: "12h" },
                                                { label: "Locations", value: 8 }
                                            ].map((stat, index, arr) => (
                                                <React.Fragment key={stat.label}>
                                                    <VStack className="flex-1 items-center">
                                                        <Text size="xs" className="text-ink uppercase tracking-widest mb-1">{stat.label}</Text>
                                                        <Heading size="xl" className="text-ink">{stat.value}</Heading>
                                                    </VStack>
                                                    {index < arr.length - 1 && (
                                                        <Divider orientation="vertical" className="h-8 bg-ink/20" />
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </HStack>

                                        <Divider className="bg-ink/20" />

                                        {/* Row 2: Photos, Videos, Audio, Text */}
                                        <HStack className="w-full items-center justify-between">
                                            {[
                                                { label: "Photos", value: stats?.dataPointsContributed || 48 },
                                                { label: "Videos", value: 0 },
                                                { label: "Audio", value: 0 },
                                                { label: "Text", value: 12 }
                                            ].map((stat, index, arr) => (
                                                <React.Fragment key={stat.label}>
                                                    <VStack className="flex-1 items-center">
                                                        <Text size="xs" className="text-ink uppercase tracking-widest mb-1">{stat.label}</Text>
                                                        <Heading size="xl" className="text-ink">{stat.value}</Heading>
                                                    </VStack>
                                                    {index < arr.length - 1 && (
                                                        <Divider orientation="vertical" className="h-8 bg-ink/20" />
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </HStack>
                                    </VStack>
                                </HardShadowFrame>
                            </VStack>
                        </VStack>
                    </VStack>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default ProfileScreen;
