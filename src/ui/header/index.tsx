import React from "react";
import { Pressable, View } from "react-native";
import { HStack } from "../hstack";
import { VStack } from "../vstack";
import { Heading } from "../heading";
import { Icon } from "../icon";
import { Box } from "../box";
import { Bell } from "lucide-react-native";
import { colors } from "../tokens/colors";

interface HeaderProps {
    title: string;
    onNotificationPress?: () => void;
}

export const Header = ({ title, onNotificationPress }: HeaderProps) => {
    return (
        <VStack space="sm" className="w-full mb-6">
            <HStack className="justify-between items-center w-full px-1">
                <Heading size="2xl" className="text-ink uppercase tracking-[2px]">
                    {title}
                </Heading>
                <Pressable
                    onPress={onNotificationPress}
                    hitSlop={12}
                    style={({ pressed }) => ({
                        opacity: pressed ? 0.7 : 1,
                    })}
                >
                    <Icon as={Bell} size="xl" className="text-ink" />
                </Pressable>
            </HStack>
            <Box
                style={{
                    height: 0.5,
                    backgroundColor: colors.ink,
                    width: "100%",
                    marginTop: 4,
                }}
            />
        </VStack>
    );
};
