import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "../tokens/colors";
import { HStack } from "../hstack";

interface SegmentedProgressBarProps {
    current: number;
    total: number;
    maxSegments?: number;
    activeColor?: string;
    size?: "sm" | "md" | "lg";
}

export const SegmentedProgressBar = ({
    current,
    total,
    maxSegments = 16,
    activeColor = colors.digital,
    size = "md",
}: SegmentedProgressBarProps) => {
    const filledSegments = Math.min(
        maxSegments,
        Math.floor((current / total) * maxSegments)
    );

    const segmentHeight = size === "sm" ? 12 : size === "md" ? 16 : 20;

    return (
        <HStack className="w-full" space="xs">
            {Array.from({ length: maxSegments }).map((_, index) => {
                const isFilled = index < filledSegments;
                return (
                    <View
                        key={index}
                        className="flex-1"
                        style={[
                            styles.segment,
                            {
                                height: segmentHeight,
                                backgroundColor: isFilled ? activeColor : "transparent",
                                borderColor: isFilled ? colors.ink : `${colors.ink}20`,
                                borderWidth: isFilled ? 1 : 1.5,
                            },
                        ]}
                    />
                );
            })}
        </HStack>
    );
};

const styles = StyleSheet.create({
    segment: {
        // No specific styles needed here as they are dynamic
    },
});
