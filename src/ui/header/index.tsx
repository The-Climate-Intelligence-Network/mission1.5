import React from "react";
import { Pressable, View } from "react-native";
import { HStack } from "../hstack";
import { VStack } from "../vstack";
import { Heading } from "../heading";
import { Icon } from "../icon";
import { Box } from "../box";
import { Bell, Settings } from "lucide-react-native";
import { colors } from "../tokens/colors";
import { Divider } from "../divider";

interface HeaderProps {
    title: string;
    onNotificationPress?: () => void;
    variant?: "default" | "profile";
    rightContent?: React.ReactNode;
}

export const Header = ({ title, onNotificationPress, variant = "default", rightContent }: HeaderProps) => {
    return (
        <VStack space="sm" className="w-full mb-4">
            <HStack className="justify-between items-center w-full px-1">
                <Heading size="2xl" className="text-ink uppercase tracking-[2px]">
                    {title}
                </Heading>
                {rightContent ? (
                    rightContent
                ) : (
                    <Pressable
                        onPress={onNotificationPress}
                        hitSlop={12}
                        style={({ pressed }) => ({
                            opacity: pressed ? 0.7 : 1,
                        })}
                    >
                        <Icon
                            as={variant === "profile" ? Settings : Bell}
                            size="xl"
                            className="text-ink"
                        />
                    </Pressable>
                )}
            </HStack>
            <Divider className="bg-ink h-[2px] rounded-full mt-2"/>
        </VStack>
    );
};
