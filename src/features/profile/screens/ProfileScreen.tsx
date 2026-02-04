import React, { useState, useEffect } from "react";
import {
    SafeAreaView,
    ScrollView,
    RefreshControl,
    Alert,
    Image,
} from "react-native";
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
import { useTheme } from "@/src/core/theme/ThemeProvider";
import { useSession } from "@/src/core/auth/AuthProvider";
import {
    User,
    Award,
    Target,
    BarChart3,
    LogOut,
    Calendar,
    CheckCircle,
    Edit,
    Trash2,
} from "lucide-react-native";
import { getPublishedMissions, MissionWithStats } from "@/src/features/missions/logic";
import {
    getCurrentUserProfileWithAvatar,
    Agent,
} from "@/src/features/profile/logic/profile.service";
import { BASE_URL } from "@/src/core/config/constants";

const ProfileScreen = () => {
    const { signOut, user } = useSession();
    const [missions, setMissions] = useState<MissionWithStats[]>([]);
    const [profile, setProfile] = useState<Agent | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        await Promise.all([loadMissions(), loadProfile()]);
    };

    const loadMissions = async () => {
        try {
            const { data, error } = await getPublishedMissions();

            if (error) {
                console.error("Error loading missions:", error);
            } else if (data) {
                setMissions(data);
            }
        } catch (error) {
            console.error("Error loading missions:", error);
        }
    };

    const loadProfile = async () => {
        try {
            const response = await getCurrentUserProfileWithAvatar();
            if (response.success && response.data) {
                setProfile(response.data);
                setAvatarUrl(response.data.avatarSignedUrl || "");
            }
        } catch (error) {
            console.error("Error loading profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

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

    // Calculate real user statistics from missions
    const userStats = {
        completedMissions: missions.filter(
            (m) => m.submission_status === "reviewed"
        ).length,
        ongoingMissions: missions.filter(
            (m) =>
                m.submission_status === "in_progress" ||
                m.submission_status === "started"
        ).length,
        savedMissions: missions.filter((m) => m.is_bookmarked).length,
        totalPoints: missions
            .filter((m) => m.submission_status === "reviewed")
            .reduce((sum, m) => sum + (m.points_awarded || 0), 0),
        totalEnergy: missions
            .filter((m) => m.submission_status === "reviewed")
            .reduce((sum, m) => sum + (m.energy_awarded || 0), 0),
        dataPointsContributed: missions
            .filter((m) => m.submission_status === "reviewed")
            .reduce((sum, m) => sum + (m.participants_count || 1), 0),
    };

    // Calculate achievements based on real data
    const achievements = [
        {
            id: 1,
            title: "First Steps",
            description: "Complete your first mission",
            icon: Target,
            earned: userStats.completedMissions >= 1,
        },
        {
            id: 2,
            title: "Climate Activist",
            description: "Complete 5 missions",
            icon: Award,
            earned: userStats.completedMissions >= 5,
        },
        {
            id: 3,
            title: "Data Pioneer",
            description: "Contribute 100 data points",
            icon: BarChart3,
            earned: userStats.dataPointsContributed >= 100,
        },
        {
            id: 4,
            title: "Mission Master",
            description: "Complete 10 missions",
            icon: CheckCircle,
            earned: userStats.completedMissions >= 10,
        },
        {
            id: 5,
            title: "Point Collector",
            description: "Earn 1000 points",
            icon: Award,
            earned: userStats.totalPoints >= 1000,
        },
        {
            id: 6,
            title: "Energy Saver",
            description: "Collect 500 energy",
            icon: Award,
            earned: userStats.totalEnergy >= 500,
        },
    ];

    const earnedAchievements = achievements.filter((a) => a.earned);

    // Calculate user level based on points
    const getUserLevel = (points: number) => {
        if (points >= 2000) return { level: 5, name: "Climate Champion" };
        if (points >= 1500) return { level: 4, name: "Earth Guardian" };
        if (points >= 1000) return { level: 3, name: "Green Warrior" };
        if (points >= 500) return { level: 2, name: "Eco Explorer" };
        if (points >= 100) return { level: 1, name: "Climate Rookie" };
        return { level: 0, name: "Newcomer" };
    };

    const currentLevel = getUserLevel(userStats.totalPoints);

    // Recent activity from missions
    const recentActivity = missions
        .filter((m) => m.submission_status === "reviewed")
        .slice(0, 3)
        .map((mission) => ({
            id: mission.id,
            title: `Completed ${mission.title}`,
            date: "Recently",
            icon: CheckCircle,
            color: "bg-green-500",
        }));

    const stats = [
        {
            label: "Missions Completed",
            value: userStats.completedMissions.toString(),
            color: "text-green-600",
        },
        {
            label: "Missions In Progress",
            value: userStats.ongoingMissions.toString(),
            color: "text-blue-600",
        },
        {
            label: "Saved Missions",
            value: userStats.savedMissions.toString(),
            color: "text-purple-600",
        },
        {
            label: "Points Earned",
            value: userStats.totalPoints.toString(),
            color: "text-orange-600",
        },
        {
            label: "Energy Collected",
            value: userStats.totalEnergy.toString(),
            color: "text-yellow-600",
        },
        {
            label: "Data Points",
            value: userStats.dataPointsContributed.toString(),
            color: "text-blue-500",
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
    const displayLocation = profile?.address || user?.user_metadata?.location;

    return (
        <SafeAreaView style={{ flex: 1 }} className="bg-[#FCFCFC]">
            <ScrollView
                className="flex-1"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <Box className="p-6 items-start">
                    {/* Header */}
                    <VStack space="lg" className="mb-8 items-start w-full">
                        <HStack space="md" className="flex-row items-start">
                            <Image
                                source={require("@/assets/icon.png")}
                                style={{ width: 44, height: 44 }}
                                resizeMode="contain"
                            />
                            <VStack space="xs">
                                <Heading size="xl">Agent Profile</Heading>
                                <Text size="sm" className="text-data font-bold tracking-widest uppercase">
                                    Terminal Node 01 User
                                </Text>
                            </VStack>
                        </HStack>
                    </VStack>

                    {/* Profile Info Card */}
                    <Card className="p-6 mb-6 w-full">
                        <VStack space="xl">
                            <HStack space="lg" className="flex-row items-start">
                                {avatarUrl ||
                                    user?.user_metadata?.avatar_url ||
                                    user?.user_metadata?.picture ? (
                                    <Avatar size="xl" className="border-2 border-ink shadow-retro-hard-sm">
                                        <AvatarImage
                                            source={{
                                                uri:
                                                    avatarUrl ||
                                                    user?.user_metadata?.avatar_url ||
                                                    user?.user_metadata?.picture,
                                            }}
                                        />
                                    </Avatar>
                                ) : (
                                    <Box className="w-20 h-20 bg-sky border-2 border-ink shadow-retro-hard-sm items-center justify-center">
                                        <Icon as={User} size="xl" className="text-ink" />
                                    </Box>
                                )}
                                <VStack space="xs" className="flex-1 items-start">
                                    <Heading
                                        retro
                                        size="lg"
                                        className="text-ink font-bold tracking-wide"
                                    >
                                        {displayName}
                                    </Heading>
                                    <Text size="sm" className="text-ink/60 font-mono lower">
                                        {displayEmail}
                                    </Text>
                                    <HStack space="xs" className="flex-row items-center mt-2 flex-wrap">
                                        <Badge className="bg-digital border-2 border-ink">
                                            <Text size="xs" className="font-bold uppercase">Lvl {currentLevel.level}</Text>
                                        </Badge>
                                        <Badge className="bg-energy border-2 border-ink">
                                            <Text size="xs" className="font-bold uppercase">{userStats.totalPoints} pts</Text>
                                        </Badge>
                                    </HStack>
                                </VStack>
                            </HStack>

                            <VStack space="md" className="w-full">
                                <HStack space="md" className="flex-row">
                                    <Button
                                        action="primary"
                                        className="flex-1 shadow-retro-hard-sm"
                                        onPress={() => router.push("/profile/edit")}
                                    >
                                        <HStack space="sm" className="flex-row items-center">
                                            <Icon as={Edit} size="xs" />
                                            <Text className="font-bold tracking-wide uppercase">Edit</Text>
                                        </HStack>
                                    </Button>
                                    <Button
                                        action="secondary"
                                        variant="outline"
                                        className="flex-1"
                                        onPress={signOut}
                                    >
                                        <HStack space="sm" className="flex-row items-center">
                                            <Icon as={LogOut} size="xs" />
                                            <Text className="font-bold tracking-wide uppercase">Sign Out</Text>
                                        </HStack>
                                    </Button>
                                </HStack>
                            </VStack>
                        </VStack>
                    </Card>

                    {/* Delete Account Button */}
                    <Button
                        action="negative"
                        variant="outline"
                        className="mt-4 w-full"
                        onPress={deleteAccount}
                    >
                        <HStack space="sm" className="flex-row items-center justify-center">
                            <Icon as={Trash2} size="xs" />
                            <Text className="font-bold tracking-wide uppercase">Delete Data Access</Text>
                        </HStack>
                    </Button>

                    {/* Stats Card */}
                    <Card className="p-6 mb-6 w-full">
                        <VStack space="lg">
                            <Heading
                                retro
                                size="lg"
                                className="text-ink font-bold tracking-wide"
                            >
                                Contributions
                            </Heading>
                            <VStack space="md">
                                {stats.map((stat, index) => (
                                    <HStack key={index} className="flex-row justify-between items-center">
                                        <Text retro className="text-ink">
                                            {stat.label}
                                        </Text>
                                        <Text retro className="text-ink font-bold">
                                            {stat.value}
                                        </Text>
                                    </HStack>
                                ))}
                            </VStack>
                        </VStack>
                    </Card>

                    {/* Achievements Card */}
                    <Card className="p-6 mb-6 w-full">
                        <VStack space="lg">
                            <Heading
                                retro
                                size="lg"
                                className="text-ink font-bold tracking-wide"
                            >
                                Achievements
                            </Heading>
                            <VStack space="md">
                                {achievements.map((achievement) => (
                                    <HStack
                                        key={achievement.id}
                                        space="md"
                                        className="flex-row items-center"
                                    >
                                        <Box
                                            className={`p-2 border-2 border-ink shadow-retro-hard-sm ${achievement.earned ? "bg-digital" : "bg-ink/5"
                                                }`}
                                        >
                                            <Icon
                                                as={achievement.icon}
                                                size="md"
                                                className="text-ink"
                                            />
                                        </Box>
                                        <VStack space="xs" className="flex-1">
                                            <Text
                                                retro
                                                className={`font-bold tracking-wide text-ink`}
                                            >
                                                {achievement.title}
                                            </Text>
                                            <Text
                                                retro
                                                size="sm"
                                                className={`text-ink/70`}
                                            >
                                                {achievement.description}
                                            </Text>
                                        </VStack>
                                        {achievement.earned && (
                                            <Badge className="bg-energy border-2 border-ink shadow-retro-hard-sm">
                                                <Text
                                                    retro
                                                    size="xs"
                                                    className="text-ink font-bold"
                                                >
                                                    EARNED
                                                </Text>
                                            </Badge>
                                        )}
                                    </HStack>
                                ))}
                            </VStack>
                        </VStack>
                    </Card>
                    {/* Recent Activity Card */}
                    <Card className="p-6 mb-6 w-full">
                        <VStack space="lg">
                            <Heading
                                retro
                                size="lg"
                                className="text-ink font-bold tracking-wide"
                            >
                                Recent Activity
                            </Heading>
                            {loading ? (
                                <Text retro className="text-ink/60">
                                    Loading activity...
                                </Text>
                            ) : recentActivity.length > 0 ? (
                                <VStack space="md">
                                    {recentActivity.map((activity, index) => (
                                        <HStack key={index} space="md" className="flex-row items-center">
                                            <Box className="w-3 h-3 bg-digital border border-ink rounded-full" />
                                            <VStack space="xs" className="flex-1 items-start">
                                                <Text retro className="text-ink font-bold">
                                                    {activity.title}
                                                </Text>
                                                <Text
                                                    retro
                                                    size="sm"
                                                    className="text-ink/60"
                                                >
                                                    {activity.date}
                                                </Text>
                                            </VStack>
                                        </HStack>
                                    ))}
                                </VStack>
                            ) : (
                                <VStack space="md" className="items-start">
                                    <Box className="p-4 bg-ink mb-2">
                                        <Icon as={Calendar} size="lg" className="text-digital" />
                                    </Box>
                                    <Text retro className="text-ink font-semibold">
                                        Complete missions to synchronize your activity stream.
                                    </Text>
                                </VStack>
                            )}
                        </VStack>
                    </Card>
                </Box>
            </ScrollView >
        </SafeAreaView >
    );
};

export default ProfileScreen;
