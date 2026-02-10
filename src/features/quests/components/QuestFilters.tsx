import React, { useState } from "react";
import { ScrollView, Pressable } from "react-native";
import { Box } from "@/src/ui/box";
import { Text } from "@/src/ui/text";
import { VStack } from "@/src/ui/vstack";
import { HStack } from "@/src/ui/hstack";
import { Icon } from "@/src/ui/icon";
import { MapPin } from "lucide-react-native";

interface QuestFiltersProps {
    activeType: "missions" | "events";
    onTypeChange: (type: "missions" | "events") => void;
    selectedCategories: string[];
    onCategoryToggle: (category: string) => void;
    selectedSubmissionTypes: string[];
    onSubmissionTypeToggle: (type: string) => void;
    nearbyEnabled: boolean;
    onNearbyToggle: () => void;
}

const CATEGORIES = [
    "ALL",
    "AIR QUALITY",
    "BIODIVERSITY",
    "WASTE REDUCTION",
    "WATER SOURCE",
    "CLIMATE ACTION",
];

const SUBMISSION_TYPES = ["ALL", "PHOTO", "VIDEO", "AUDIO", "TEXT"];

export const QuestFilters = ({
    activeType,
    onTypeChange,
    selectedCategories,
    onCategoryToggle,
    selectedSubmissionTypes,
    onSubmissionTypeToggle,
    nearbyEnabled,
    onNearbyToggle,
}: QuestFiltersProps) => {
    return (
        <VStack space="lg" className="w-full">
            {/* Row 1: Mission/Event Toggle */}
            <HStack className="w-full">
                <Pressable
                    onPress={() => onTypeChange("missions")}
                    className="flex-1"
                >
                    <Box
                        className={`py-2 items-center justify-center border-2 border-ink rounded-tr-none rounded-br-none ${activeType === "missions"
                            ? "bg-digital"
                            : "bg-ink"
                            }`}
                    >
                        <Text
                            size="md"
                            weight="bold"
                            className={`uppercase tracking-wider ${activeType === "missions" ? "text-ink" : "text-white"
                                }`}
                        >
                            MISSIONS
                        </Text>
                    </Box>
                </Pressable>
                <Pressable
                    onPress={() => onTypeChange("events")}
                    className="flex-1"
                >
                    <Box
                        className={`py-2 items-center justify-center border-2 border-r-2 border-t-2 border-b-2 border-ink rounded-tl-none rounded-bl-none ${activeType === "events"
                            ? "bg-digital"
                            : "bg-ink"
                            }`}
                    >
                        <Text
                            size="md"
                            weight="bold"
                            className={`uppercase tracking-wider ${activeType === "events" ? "text-ink" : "text-white"
                                }`}
                        >
                            EVENTS
                        </Text>
                    </Box>
                </Pressable>
            </HStack>

            {/* Row 2: Category Pills - Horizontally Scrollable */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
            >
                {CATEGORIES.map((category) => {
                    const isSelected = selectedCategories.includes(category);
                    return (
                        <Pressable
                            key={category}
                            onPress={() => onCategoryToggle(category)}
                        >
                            <Box
                                className={`px-4 py-2 border-2 border-ink rounded-md ${isSelected ? "bg-ink" : "bg-transparent"
                                    }`}
                            >
                                <Text
                                    size="xs"
                                    className={`uppercase tracking-wider ${isSelected ? "text-white" : "text-ink"
                                        }`}
                                >
                                    {category}
                                </Text>
                            </Box>
                        </Pressable>
                    );
                })}
            </ScrollView>

            {/* Row 3: Nearby + Submission Type Filters */}
            <HStack space="xl" className="w-full items-center">
                {/* Nearby Filter */}
                <Pressable onPress={onNearbyToggle}>
                    <Box
                        className={`px-4 py-2 border-2 border-ink rounded-md flex-row items-center ${nearbyEnabled ? "bg-ink" : "bg-transparent"
                            }`}
                    >
                        <Icon
                            as={MapPin}
                            size="xs"
                            className={nearbyEnabled ? "text-energy mr-2" : "text-ink mr-2"}
                        />
                        <Text
                            size="xs"
                            className={`uppercase tracking-wider ${nearbyEnabled ? "text-energy" : "text-ink"
                                }`}
                        >
                            NEARBY
                        </Text>
                    </Box>
                </Pressable>

                {/* Submission Type Pills - Scrollable */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 8 }}
                    className="flex-1"
                >
                    {SUBMISSION_TYPES.map((type) => {
                        const isSelected = selectedSubmissionTypes.includes(type);
                        return (
                            <Pressable
                                key={type}
                                onPress={() => onSubmissionTypeToggle(type)}
                            >
                                <Box
                                    className={`px-4 py-2 border-2 border-ink rounded-md ${isSelected ? "bg-ink" : "bg-transparent"
                                        }`}
                                >
                                    <Text
                                        size="xs"
                                        className={`uppercase tracking-wider ${isSelected ? "text-white" : "text-ink/60"
                                            }`}
                                    >
                                        {type}
                                    </Text>
                                </Box>
                            </Pressable>
                        );
                    })}
                </ScrollView>
            </HStack>
        </VStack>
    );
};
