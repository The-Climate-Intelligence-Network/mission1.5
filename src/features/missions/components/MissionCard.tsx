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
    variant?: 'vertical' | 'landscape' | 'compact';
}

export const MissionCard = ({ mission, onPress, className, variant = 'vertical' }: MissionCardProps) => {
    const [pressed, setPressed] = React.useState(false);
    const [isBookmarked, setIsBookmarked] = React.useState(mission.is_bookmarked || false);
    const [imageError, setImageError] = React.useState(false);

    // Use URL if available and hasn't failed, otherwise fallback
    const imageSource = (mission.thumbnailUrl && !imageError)
        ? { uri: mission.thumbnailUrl }
        : DEFAULT_MISSION_IMAGE;

    const handleImageError = (e: any) => {
        console.log(`[Image Load Fail] Mission: ${mission.title}, URI: ${mission.thumbnailUrl}`);
        if (e.nativeEvent) {
            console.log(`[Image Error Detail] ${JSON.stringify(e.nativeEvent)}`);
        }
        setImageError(true);
    };

    // Landscape variant
    if (variant === 'landscape') {
        return (
            <Pressable
                onPress={onPress}
                onPressIn={() => setPressed(true)}
                onPressOut={() => setPressed(false)}
            >
                <Card
                    className={`w-full h-48 p-0 overflow-hidden ${className}`}
                    variant="secondary"
                    radius={16}
                    pressed={pressed}
                >
                    <HStack className="h-full">
                        {/* Image Section - 40% */}
                        <Box
                            className="relative w-[40%] h-full overflow-hidden bg-ink"
                            variant="plain"
                        >
                            <Image
                                source={imageSource}
                                style={{ width: '100%', height: '100%', resizeMode: "cover" }}
                                onError={handleImageError}
                            />

                            {/* Gradient Overlay */}
                            <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
                                <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <Defs>
                                        <LinearGradient id="overlay-grad-landscape" x1="0" y1="1" x2="0" y2="0">
                                            <Stop offset="0" stopColor="#1A4D2E" stopOpacity="0.6" />
                                            <Stop offset="0.5" stopColor="#1A4D2E" stopOpacity="0" />
                                        </LinearGradient>
                                    </Defs>
                                    <Rect width="100" height="100" fill="url(#overlay-grad-landscape)" />
                                </Svg>
                            </View>
                        </Box>

                        {/* Content Section - 60% */}
                        <VStack space="xs" className="flex-1 p-3 items-start justify-between">

                            {/*Top Section*/}
                            <VStack space="md">
                                {/* Category Badge and bookmark */}
                                <HStack space="xs" className="items-center w-full justify-between">
                                    <Box className="px-2 py-1 bg-surface border border-ink/20 rounded-sm self-start">
                                        <Text size="2xs" className="uppercase text-ink/60">
                                            {mission.category || "BIODIVERSITY"}
                                        </Text>
                                    </Box>
                                    {/* Bookmark Button */}
                                    <Pressable
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            setIsBookmarked(!isBookmarked);
                                        }}
                                        className="p-1"
                                    >
                                        <Icon
                                            as={Bookmark}
                                            size="md"
                                            className={isBookmarked ? "text-ink fill-ink" : "text-ink"}
                                        />
                                    </Pressable>
                                </HStack>

                                {/* Title and Description */}
                                <VStack space="xs">
                                    {/* Title */}
                                    <Heading size="lg" className="text-ink leading-tight" numberOfLines={1}>
                                        {mission.title}
                                    </Heading>

                                    {/* Description */}
                                    <Text
                                        size="sm"
                                        numberOfLines={2}
                                        className="text-ink/80 leading-snug"
                                    >
                                        {mission.description || "Contribute to the global sustainability efforts by documenting biodiversity in your local area."}
                                    </Text>
                                </VStack>
                            </VStack>

                            {/*Row: Points, CIQ, Time*/}
                            <HStack space="lg" className="items-center">
                                {/* Points Badge */}
                                <Box className="px-2 py-1 bg-energy border border-ink rounded-md">
                                    <Text size="sm" weight="bold">
                                        {mission.points_awarded || 150}
                                    </Text>
                                </Box>

                                {/* CIQ Reward */}
                                <Text size="sm" weight="bold" className="text-digital-dark tracking-wider">
                                    {mission.ciq_reward || 300}{"\u2009"}CIQ
                                </Text>

                                {/* Time Estimate */}
                                <Text size="sm" className="text-ink/80 tracking-wider">
                                    {mission.time_estimate || "15m"}
                                </Text>
                            </HStack>

                            {/* Progress Bar */}
                            {(mission.submission_status === "in_progress" || (mission.submission_progress ?? 0) > 0) && (
                                <VStack space="xs">
                                    <HStack className="w-full justify-between">
                                        <Text size="xs" className="text-ink/80">
                                            Progress
                                        </Text>
                                        <Text size="xs" className="text-ink/80">
                                            {mission.submission_progress || 25}%
                                        </Text>
                                    </HStack>
                                    <HStack className="w-full">
                                        <SegmentedProgressBar
                                            current={mission.submission_progress || 25}
                                            total={100}
                                            maxSegments={10}
                                            size="sm"
                                            activeColor={colors.data}
                                        />
                                    </HStack>
                                </VStack>
                            )}
                        </VStack>
                    </HStack>
                </Card>
            </Pressable>
        );
    }

    // Compact variant
    if (variant === 'compact') {
        return (
            <Pressable
                onPress={onPress}
                onPressIn={() => setPressed(true)}
                onPressOut={() => setPressed(false)}
                style={{ alignSelf: 'flex-start' }}
            >
                <Card
                    className={`w-80 h-32 p-0 overflow-hidden ${className}`}
                    variant="secondary"
                    radius={16}
                    pressed={pressed}
                >
                    <HStack className="h-full">
                        {/* Image Section - 40% */}
                        <Box
                            className="relative w-[32%] h-full overflow-hidden bg-ink"
                            variant="plain"
                        >
                            <Image
                                source={imageSource}
                                style={{ width: '100%', height: '100%', resizeMode: "cover" }}
                                onError={handleImageError}
                            />

                            {/* Gradient Overlay */}
                            <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
                                <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <Defs>
                                        <LinearGradient id="overlay-grad-landscape" x1="0" y1="1" x2="0" y2="0">
                                            <Stop offset="0" stopColor="#1A4D2E" stopOpacity="0.6" />
                                            <Stop offset="0.5" stopColor="#1A4D2E" stopOpacity="0" />
                                        </LinearGradient>
                                    </Defs>
                                    <Rect width="100" height="100" fill="url(#overlay-grad-landscape)" />
                                </Svg>
                            </View>
                        </Box>

                        {/* Content Section - 60% */}
                        <VStack space="xs" className="flex-1 p-3 items-start justify-between">
                            {(mission.submission_status === "in_progress" || (mission.submission_progress ?? 0) > 0) ? (
                                <VStack space="xs" className="w-full">
                                    {/* Title */}
                                    <Heading size="lg" className="text-ink leading-tight" numberOfLines={1}>
                                        {mission.title}
                                    </Heading>
                                    {/* Progress Bar */}
                                    <VStack space="xs" className="-mt-1">
                                        <HStack className="w-full justify-between">
                                            <Text size="xs" className="text-ink/80">
                                                Progress {mission.submission_progress || 50}%
                                            </Text>
                                        </HStack>
                                        <HStack className="w-full">
                                            <SegmentedProgressBar
                                                current={mission.submission_progress || 2}
                                                total={4}
                                                maxSegments={10}
                                                size="sm"
                                                activeColor={colors.data}
                                            />
                                        </HStack>
                                    </VStack>
                                </VStack>
                            ) : (
                                <VStack space="sm" className="w-full">
                                    {/* Category Badge and bookmark */}
                                    <HStack space="xs" className="items-center w-full justify-between">
                                        <Box className="px-2 py-1 bg-surface border border-ink/20 rounded-sm self-start">
                                            <Text size="2xs" className="uppercase text-ink/60">
                                                {mission.category || "BIODIVERSITY"}
                                            </Text>
                                        </Box>

                                        <Pressable
                                            onPress={(e) => {
                                                e.stopPropagation();
                                                setIsBookmarked(!isBookmarked);
                                            }}
                                            className="p-1"
                                        >
                                            <Icon
                                                as={Bookmark}
                                                size="md"
                                                className={isBookmarked ? "text-ink fill-ink" : "text-ink"}
                                            />
                                        </Pressable>
                                    </HStack>
                                    {/* Title */}
                                    <Heading size="lg" className="text-ink leading-tight" numberOfLines={1}>
                                        {mission.title}
                                    </Heading>
                                </VStack>
                            )}



                            {/*Row: Points, CIQ, Time*/}
                            <HStack space="lg" className="items-center">
                                {/* Points Badge */}
                                <Box className="px-2 py-1 bg-energy border border-ink rounded-md">
                                    <Text size="sm" weight="bold">
                                        {mission.points_awarded || 150}
                                    </Text>
                                </Box>

                                {/* CIQ Reward */}
                                <Text size="sm" weight="bold" className="text-digital-dark tracking-wider">
                                    {mission.ciq_reward || 300}{"\u2009"}CIQ
                                </Text>

                                {/* Time Estimate */}
                                <Text size="sm" className="text-ink/80 tracking-wider">
                                    {mission.time_estimate || "15m"}
                                </Text>
                            </HStack>
                        </VStack>
                    </HStack>
                </Card>
            </Pressable>
        );
    }

    // Vertical variant (original)
    return (
        <Pressable
            onPress={onPress}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            style={{ alignSelf: 'flex-start' }}
        >
            <Card
                className={`w-64 p-0 overflow-hidden ${className}`}
                variant="secondary"
                radius={16}
                pressed={pressed}
            >
                {/* Header Media Section - Top 50% height equivalent */}
                <Box
                    className="relative h-44 overflow-hidden w-full bg-ink"
                    variant="plain"
                >
                    <Image
                        source={imageSource}
                        style={{ width: '100%', height: '100%', resizeMode: "cover" }}
                        onError={handleImageError}
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
                <VStack space="sm" className="p-4 items-start">
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

                    {/* Row - Metadata (Points, CIQ, Time) */}
                    <HStack space="lg" className="items-center w-full mt-2">
                        <Box className="px-3 py-1 bg-energy border border-ink rounded-md">
                            <Text size="sm" weight="bold">
                                {mission.points_awarded || 150}
                            </Text>
                        </Box>

                        <Text size="sm" weight="bold" className="text-digital-dark tracking-wider">
                            {mission.ciq_reward || 300}{"\u2009"}CIQ
                        </Text>

                        <Text size="sm" className="text-ink/80 tracking-wider">
                            {mission.time_estimate || "15 Mins"}
                        </Text>
                    </HStack>
                </VStack>


                {/* Progress Section */}
                {(mission.submission_status === "in_progress" || (mission.submission_progress ?? 0) > 0) && (
                    <VStack space="sm" className="mt-2 p-4 pt-2 border-t border-ink">
                        <HStack className="w-full justify-between">
                            <Text size="xs" className="text-ink/80">
                                Progress
                            </Text>
                            <Text size="xs" className="text-ink/80">
                                {mission.submission_progress || 25}%
                            </Text>
                        </HStack>
                        <HStack className="w-full">
                            <SegmentedProgressBar
                                current={mission.submission_progress || 25}
                                total={100}
                                maxSegments={10}
                                size="sm"
                                activeColor={colors.data}
                            />
                        </HStack>
                    </VStack>
                )}
            </Card>
        </Pressable>
    );
};
