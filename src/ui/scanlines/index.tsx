import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Svg, { Defs, Pattern, Rect, Line } from "react-native-svg";
import { colors } from "../tokens/colors";

const { width, height } = Dimensions.get("window");

export const Scanlines = () => {
    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Svg width="100%" height="100%">
                <Defs>
                    <Pattern
                        id="scanlines"
                        width="100%"
                        height="4"
                        patternUnits="userSpaceOnUse"
                    >
                        <Line
                            x1="0"
                            y1="2"
                            x2="100%"
                            y2="2"
                            stroke={colors.ink}
                            strokeWidth="1"
                            opacity="0.05"
                        />
                    </Pattern>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#scanlines)" opacity="0.6" />
            </Svg>
        </View>
    );
};
