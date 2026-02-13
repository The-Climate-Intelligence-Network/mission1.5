import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { Box } from "@/src/ui/box";
import { Text } from "@/src/ui/text";
import { Heading } from "@/src/ui/heading";
import { VStack } from "@/src/ui/vstack";
import { HStack } from "@/src/ui/hstack";
import { Icon } from "@/src/ui/icon";
import { Card } from "@/src/ui/card";
import { MapPin, Calendar, Users, Bookmark } from "lucide-react-native";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";

const DEFAULT_EVENT_IMAGE = require("@/assets/images/paddy.jpg");

export interface Event {
    id: string;
    title: string;
    description?: string;
    category?: string;
    points_awarded?: number;
    ciq_reward?: number;
    location?: string;
    date?: string;
    time?: string;
    attendee_count?: number;
    thumbnailUrl?: string;
    is_bookmarked?: boolean;
}

interface EventCardProps {
    event: Event;
    onPress?: () => void;
    className?: string;
    variant?: 'vertical' | 'landscape' | 'compact';
}

export const EventCard = ({ event, onPress, className, variant = 'vertical' }: EventCardProps) => {
    const [pressed, setPressed] = React.useState(false);
    const [isBookmarked, setIsBookmarked] = React.useState(event.is_bookmarked || false);
    const [imageError, setImageError] = React.useState(false);

    const imageSource = (event.thumbnailUrl && !imageError)
        ? { uri: event.thumbnailUrl }
        : DEFAULT_EVENT_IMAGE;

    const handleImageError = () => {
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
                                        <LinearGradient id="overlay-grad-event-landscape" x1="0" y1="1" x2="0" y2="0">
                                            <Stop offset="0" stopColor="#1A4D2E" stopOpacity="0.6" />
                                            <Stop offset="0.5" stopColor="#1A4D2E" stopOpacity="0" />
                                        </LinearGradient>
                                    </Defs>
                                    <Rect width="100" height="100" fill="url(#overlay-grad-event-landscape)" />
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
                                            {event.category || "EVENT"}
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

                                {/* Title and Info */}
                                <VStack space="xs">
                                    {/* Title */}
                                    <Heading size="lg" className="text-ink leading-tight" numberOfLines={1}>
                                        {event.title}
                                    </Heading>

                                    {/* Location & Date */}
                                    <VStack space="2xs" className="w-full">
                                        {event.location && (
                                            <HStack space="xs" className="items-center">
                                                <Icon as={MapPin} size="xs" className="text-digital-dark" />
                                                <Text size="2xs" className="text-ink/80" numberOfLines={1}>
                                                    {event.location}
                                                </Text>
                                            </HStack>
                                        )}
                                        {event.date && (
                                            <HStack space="xs" className="items-center">
                                                <Icon as={Calendar} size="xs" className="text-digital-dark" />
                                                <Text size="2xs" className="text-ink/80">
                                                    {event.date} {event.time && `• ${event.time}`}
                                                </Text>
                                            </HStack>
                                        )}
                                    </VStack>
                                </VStack>
                            </VStack>

                            {/*Row: Points, CIQ, Attendees*/}
                            <HStack space="lg" className="items-center">
                                {/* Points Badge */}
                                <Box className="px-2 py-1 bg-energy border border-ink rounded-md">
                                    <Text size="sm" weight="bold">
                                        {event.points_awarded || 300}
                                    </Text>
                                </Box>

                                {/* CIQ Reward */}
                                <Text size="sm" weight="bold" className="text-digital-dark tracking-wider">
                                    {event.ciq_reward || 500}{"\u2009"}CIQ
                                </Text>

                                {/* Attendees */}
                                <HStack space="xs" className="items-center">
                                    <Icon as={Users} size="xs" className="text-ink/60" />
                                    <Text size="xs" className="text-ink/80">
                                        {event.attendee_count || 0}
                                    </Text>
                                </HStack>
                            </HStack>
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
                        {/* Image Section - 32% */}
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
                                        <LinearGradient id="overlay-grad-event-compact" x1="0" y1="1" x2="0" y2="0">
                                            <Stop offset="0" stopColor="#1A4D2E" stopOpacity="0.6" />
                                            <Stop offset="0.5" stopColor="#1A4D2E" stopOpacity="0" />
                                        </LinearGradient>
                                    </Defs>
                                    <Rect width="100" height="100" fill="url(#overlay-grad-event-compact)" />
                                </Svg>
                            </View>
                        </Box>

                        {/* Content Section - 68% */}
                        <VStack space="xs" className="flex-1 p-3 items-start justify-between">
                            <VStack space="xs" className="w-full">
                                {/* Category and Bookmark */}
                                <HStack space="xs" className="items-center w-full justify-between">
                                    <Box className="px-2 py-1 bg-surface border border-ink/20 rounded-sm self-start">
                                        <Text size="2xs" className="uppercase text-ink/60">
                                            {event.category || "EVENT"}
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
                                    {event.title}
                                </Heading>
                                {/* Mini Location/Date */}
                                <HStack space="md" className="items-center">
                                    {event.location && (
                                        <HStack space="xs" className="items-center">
                                            <Icon as={MapPin} size="2xs" className="text-digital-dark" />
                                            <Text size="2xs" className="text-ink/60" numberOfLines={1}>
                                                {event.location.split(',')[0]}
                                            </Text>
                                        </HStack>
                                    )}
                                    {event.date && (
                                        <HStack space="xs" className="items-center">
                                            <Icon as={Calendar} size="2xs" className="text-digital-dark" />
                                            <Text size="2xs" className="text-ink/60">
                                                {event.date}
                                            </Text>
                                        </HStack>
                                    )}
                                </HStack>
                            </VStack>

                            {/*Row: Points, CIQ*/}
                            <HStack space="md" className="items-center">
                                {/* Points Badge */}
                                <Box className="px-2 py-0.5 bg-energy border border-ink rounded-md">
                                    <Text size="xs" weight="bold">
                                        {event.points_awarded || 300}
                                    </Text>
                                </Box>

                                {/* CIQ Reward */}
                                <Text size="xs" weight="bold" className="text-digital-dark tracking-wider">
                                    {event.ciq_reward || 500}{"\u2009"}CIQ
                                </Text>

                                {/* Attendees */}
                                <HStack space="xs" className="items-center">
                                    <Icon as={Users} size="2xs" className="text-ink/40" />
                                    <Text size="2xs" className="text-ink/40">
                                        {event.attendee_count || 0}
                                    </Text>
                                </HStack>
                            </HStack>
                        </VStack>
                    </HStack>
                </Card>
            </Pressable>
        );
    }

    // Vertical variant
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
                {/* Header Media Section */}
                <Box
                    className="relative h-44 overflow-hidden w-full bg-ink"
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
                                <LinearGradient id="overlay-grad-event" x1="0" y1="1" x2="0" y2="0">
                                    <Stop offset="0" stopColor="#1A4D2E" stopOpacity="0.6" />
                                    <Stop offset="0.5" stopColor="#1A4D2E" stopOpacity="0" />
                                </LinearGradient>
                            </Defs>
                            <Rect width="100" height="100" fill="url(#overlay-grad-event)" />
                        </Svg>
                    </View>

                    {/* Category Badge */}
                    <Box className="absolute top-3 left-3 px-2 py-1 bg-white border-0 rounded-none">
                        <Text size="2xs">
                            {event.category || "EVENT"}
                        </Text>
                    </Box>

                    {/* Bookmark Icon */}
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
                    {/* Points & CIQ */}
                    <HStack space="lg" className="items-center w-full">
                        <Box className="px-3 py-1 bg-energy border border-ink rounded-md">
                            <Text size="sm" weight="bold">
                                {event.points_awarded || 300}
                            </Text>
                        </Box>

                        <Text size="sm" weight="bold" className="text-digital-dark tracking-wider">
                            {event.ciq_reward || 500}{"\u2009"}CIQ
                        </Text>
                    </HStack>

                    {/* Event Title */}
                    <Heading size="lg" className="text-ink leading-tight" numberOfLines={1}>
                        {event.title}
                    </Heading>

                    {/* Description */}
                    {event.description && (
                        <Text
                            size="sm"
                            numberOfLines={2}
                            className="text-ink/80 leading-snug"
                        >
                            {event.description}
                        </Text>
                    )}

                    {/* Location & Date Info */}
                    <VStack space="xs" className="w-full mt-2">
                        {event.location && (
                            <HStack space="xs" className="items-center">
                                <Icon as={MapPin} size="sm" className="text-digital-dark" />
                                <Text size="sm" className="text-ink/80 flex-1" numberOfLines={1}>
                                    {event.location}
                                </Text>
                            </HStack>
                        )}
                        {event.date && (
                            <HStack space="xs" className="items-center">
                                <Icon as={Calendar} size="sm" className="text-digital-dark" />
                                <Text size="sm" className="text-ink/80">
                                    {event.date} {event.time && `• ${event.time}`}
                                </Text>
                            </HStack>
                        )}
                        <HStack space="xs" className="items-center">
                            <Icon as={Users} size="sm" className="text-ink/60" />
                            <Text size="sm" className="text-ink/80">
                                {event.attendee_count || 0} attending
                            </Text>
                        </HStack>
                    </VStack>
                </VStack>
            </Card>
        </Pressable>
    );
};
