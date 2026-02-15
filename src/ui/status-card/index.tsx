import React from "react";
import { LucideIcon, Search, AlertCircle, Loader2 } from "lucide-react-native";
import { Card } from "../card";
import { VStack } from "../vstack";
import { Heading } from "../heading";
import { Text } from "../text";
import { Icon } from "../icon";
import { HStack } from "../hstack";
import { Box } from "../box";
import { colors } from "../tokens/colors";

interface StatusCardProps {
    variant?: "empty" | "loading" | "error";
    title: string;
    description?: string;
    icon?: LucideIcon;
    className?: string;
}

export const StatusCard = ({
    variant = "empty",
    title,
    description,
    icon: CustomIcon,
    className,
}: StatusCardProps) => {
    const getIcon = () => {
        if (CustomIcon) return CustomIcon;
        switch (variant) {
            case "loading":
                return Loader2;
            case "error":
                return AlertCircle;
            case "empty":
            default:
                return Search;
        }
    };

    const IconComponent = getIcon();

    if (variant === "loading") {
        return (
            <Card radius={0} className={`p-8 w-full ${className}`}>
                <HStack space="md" className="items-center">
                    <Box className="w-12 h-12 bg-surface items-center justify-center rounded-xl">
                        <Icon as={IconComponent} size="xl" className="text-data animate-spin" />
                    </Box>
                    <VStack space="xs">
                        <Text weight="bold" className="tracking-widest uppercase text-data text-xs">
                            System Loading
                        </Text>
                        <Heading size="md" className="tracking-wide">
                            {title}
                        </Heading>
                    </VStack>
                </HStack>
            </Card>
        );
    }

    return (
        <Box
            className={`p-8 w-full items-center justify-center border-2 border-dashed border-ink/10 rounded-none ${className}`}
        >
            <VStack space="md" className="items-center">
                <Icon as={IconComponent} size="xl" className="text-ink/20" />
                <VStack space="xs" className="items-center">
                    <Heading size="md" className="text-ink/60 uppercase tracking-wider text-center">
                        {title}
                    </Heading>
                    {description && (
                        <Text size="sm" className="text-ink/40 text-center tracking-wide">
                            {description}
                        </Text>
                    )}
                </VStack>
            </VStack>
        </Box>
    );
};
