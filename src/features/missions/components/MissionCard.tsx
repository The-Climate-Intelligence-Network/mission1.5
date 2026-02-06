import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { Box } from "@/src/ui/box";
import { Text } from "@/src/ui/text";
import { Heading } from "@/src/ui/heading";
import { VStack } from "@/src/ui/vstack";
import { HStack } from "@/src/ui/hstack";
import { Icon } from "@/src/ui/icon";
import { Card } from "@/src/ui/card";
import { Bookmark } from "lucide-react-native";
import { MissionWithStats } from "../logic/types";
import { SegmentedProgressBar } from "@/src/ui/segmented-progress";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import { colors } from "@/src/ui/tokens/colors";

const DEFAULT_MISSION_IMAGE = require("@/assets/images/paddy.jpg");

interface MissionCardProps {
    mission: MissionWithStats;
    onPress?: () => void;
    className?: string;
}

export const MissionCard = ({ mission, onPress, className }: MissionCardProps) => {
    const [pressed, setPressed] = React.useState(false);
    const [isBookmarked, setIsBookmarked] = React.useState(mission.is_bookmarked || false);

    return (
        <Pressable
            onPress={onPress}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
        >
            <Card
                className={`w-80 p-0 overflow-hidden ${className}`}
                variant="secondary"
                pressed={pressed}
            >
                {/* Header Media Section - Top 50% height equivalent */}
                <Box className="relative h-44 overflow-hidden w-full"
                    variant="plain"
                >
                    <Image
                        // source={DEFAULT_MISSION_IMAGE}
                        source={mission.thumbnailUrl ? { uri: mission.thumbnailUrl } : DEFAULT_MISSION_IMAGE}
                        className="w-full h-full"
                        style={{ resizeMode: "cover" }}
                    />

                    {/* Gradient Overlay - Bottom-up Dark Green fade */}
                    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
                        <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <Defs>
                                <LinearGradient id="overlay-grad" x1="0" y1="1" x2="0" y2="0">
                                    <Stop offset="0" stopColor="#1A4D2E" stopOpacity="0.6" />
                                    <Stop offset="0.5" stopColor="#1A4D2E" stopOpacity="0" />
                                </LinearGradient>
                            </Defs>
                            <Rect width="100" height="100" fill="url(#overlay-grad)" />
                        </Svg>
                    </View>

                    {/* Mission Type Badge - Top Left, Straight Corners */}
                    {/* Machine Voice: Retro style (uppercase, mono, bold) */}
                    <Box className="absolute top-3 left-3 px-2 py-1 bg-white border-0 rounded-none">
                        <Text size="2xs">
                            {mission.category || "BIODIVERSITY"}
                        </Text>
                    </Box>

                    {/* Bookmark Icon - Top Right */}
                    <Pressable
                        className="absolute top-2 right-3 p-1"
                        onPress={(e) => {
                            e.stopPropagation();
                            setIsBookmarked(!isBookmarked);
                        }}
                    >
                        <Icon
                            as={Bookmark}
                            size="xl"
                            className={isBookmarked ? "text-white fill-white" : "text-white"}
                        />
                    </Pressable>
                </Box>

                {/* Content Section */}
                <VStack space="xs" className="p-4 items-start">
                    {/* Row 1 - Metadata (Points, CIQ, Time) */}
                    <HStack space="md" className="items-center w-full pb-2">
                        <Box className="px-3 py-1 bg-energy border border-ink rounded-md">
                            <Text size="sm" bold>
                                {mission.points_awarded || 150}
                            </Text>
                        </Box>

                        <Text size="sm" className="text-digitalDark font-bold uppercase tracking-wider">
                            {mission.ciq_reward || 300} CIQ
                        </Text>

                        <Text size="sm" className="text-ink/50 font-bold uppercase tracking-wider">
                            {mission.time_estimate || "15 mins"}
                        </Text>
                    </HStack>

                    {/* Row 2 - Mission Title (Human Voice: Space Grotesk) */}
                    <Heading size="lg" className="text-ink leading-tight">
                        {mission.title}
                    </Heading>

                    {/* Row 3 - Description (Machine Voice: Space Mono) */}
                    <Text
                        size="sm"
                        numberOfLines={2}
                        className="text-ink/80 leading-snug"
                    >
                        {mission.description || "Contribute to the global sustainability efforts by documenting biodiversity in your local area."}
                    </Text>

                    {/* Row 4 - Segmented Progress Bar (Only if in progress) */}
                    {(mission.submission_status === "in_progress" || (mission.submission_progress ?? 0) > 0) && (
                        <HStack className="w-full mt-4">
                            <SegmentedProgressBar
                                current={mission.submission_progress || 25}
                                total={100}
                                maxSegments={10}
                                size="sm"
                                activeColor={colors.data}
                            />
                        </HStack>
                    )}
                </VStack>
            </Card>
        </Pressable>
    );
};
