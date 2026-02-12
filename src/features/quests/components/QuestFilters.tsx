import React from "react";
import { ScrollView } from "react-native";
import { Box, Text, VStack, HStack, FilterChip } from "@/src/ui";
import { MapPin } from "lucide-react-native";
import { Pressable } from "react-native";

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
    "BIODIVERSITY",
    "WASTE REDUCTION",
    "WATER SOURCE",
    "AIR QUALITY",
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
                {CATEGORIES.map((category) => (
                    <FilterChip
                        key={category}
                        label={category}
                        isSelected={selectedCategories.includes(category)}
                        onPress={() => onCategoryToggle(category)}
                        variant="primary"
                    />
                ))}
            </ScrollView>

            {/* Row 3: Nearby + Submission Type Filters */}
            <HStack space="xl" className="w-full items-center">
                {/* Nearby Filter */}
                <FilterChip
                    label="NEARBY"
                    isSelected={nearbyEnabled}
                    onPress={onNearbyToggle}
                    variant="accent"
                    icon={MapPin}
                />

                {/* Submission Type Pills - Scrollable */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 8 }}
                    className="flex-1"
                >
                    {SUBMISSION_TYPES.map((type) => (
                        <FilterChip
                            key={type}
                            label={type}
                            isSelected={selectedSubmissionTypes.includes(type)}
                            onPress={() => onSubmissionTypeToggle(type)}
                            variant="muted"
                        />
                    ))}
                </ScrollView>
            </HStack>
        </VStack>
    );
};
