import React from 'react';
import { Pressable } from 'react-native';
import { Box } from '../box';
import { Text } from '../text';
import { Icon } from '../icon';

interface FilterChipProps {
    label: string;
    isSelected: boolean;
    onPress: () => void;
    variant?: 'primary' | 'muted' | 'accent';
    icon?: any;
    className?: string;
}

export const FilterChip = ({
    label,
    isSelected,
    onPress,
    variant = 'primary',
    icon,
    className = ""
}: FilterChipProps) => {
    const getTextColor = () => {
        if (isSelected) {
            if (variant === 'accent') return 'text-energy';
            return 'text-white';
        }
        if (variant === 'muted') return 'text-ink/60';
        return 'text-ink';
    };
    const getBackgroundColor = () => {
        if (isSelected) {
            if (variant === 'muted') return 'bg-data';
            return 'bg-ink';
        }
        return 'bg-transparent';
    };

    return (
        <Pressable onPress={onPress}>
            <Box
                variant="plain"
                className={`px-4 py-2 border-2 border-ink rounded-md flex-row items-center ${getBackgroundColor()} ${className}`}
            >
                {icon && (
                    <Icon
                        as={icon}
                        size="xs"
                        className={`${getTextColor()} mr-2`}
                    />
                )}
                <Text
                    size="xs"
                    weight="bold"
                    className={`uppercase tracking-wider ${getTextColor()}`}
                >
                    {label}
                </Text>
            </Box>
        </Pressable>
    );
};
