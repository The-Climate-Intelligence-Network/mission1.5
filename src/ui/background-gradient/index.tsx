import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import { colors } from "../tokens/colors";

const { width, height } = Dimensions.get("window");

export const BackgroundGradient = () => {
    const gradientColors = colors.backgroundGradient || ["#D4F1F4", "#F9FDF5", "#E8F5E9"];

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Svg width="100%" height="100%" preserveAspectRatio="none">
                <Defs>
                    <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <Stop offset="0%" stopColor={gradientColors[0]} stopOpacity="1" />
                        <Stop offset="40%" stopColor={gradientColors[1]} stopOpacity="1" />
                        <Stop offset="100%" stopColor={gradientColors[2]} stopOpacity="1" />
                    </LinearGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#grad)" />
            </Svg>
        </View>
    );
};
