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
    maxSegments = 12,
    activeColor = colors.digital,
    size = "md",
}: SegmentedProgressBarProps) => {
    const filledSegments = Math.min(
        maxSegments,
        Math.floor((current / total) * maxSegments)
    );

    const segmentHeight = size === "sm" ? 8 : size === "md" ? 12 : 16;
    const segmentWidth = size === "sm" ? 12 : size === "md" ? 20 : 28;

    return (
        <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center" }}>
            {Array.from({ length: maxSegments }).map((_, index) => {
                const isFilled = index < filledSegments;
                return (
                    <View
                        key={index}
                        style={[
                            styles.segment,
                            {
                                height: segmentHeight,
                                width: segmentWidth,
                                backgroundColor: isFilled ? activeColor : "transparent",
                                borderColor: colors.ink,
                                borderWidth: 2,
                                marginRight: 4,
                                marginBottom: 4,
                            },
                        ]}
                    />
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    segment: {
        // No specific styles needed here as they are dynamic
    },
});
