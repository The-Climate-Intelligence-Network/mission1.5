import React from "react";
import { Alert, Pressable } from "react-native";
import { Box } from "@/src/ui/box";
import { Text } from "@/src/ui/text";
import { VStack } from "@/src/ui/vstack";
import { Icon } from "@/src/ui/icon";
import {
    Popover,
    PopoverBackdrop,
    PopoverContent,
} from "@/src/ui/popover";
import {
    Settings,
    Edit,
    LogOut,
    Trash2,
} from "lucide-react-native";
import { Divider } from "@/src/ui";

interface ProfileSettingsMenuProps {
    onSignOut: () => void;
    onDeleteAccount: () => void;
}

export const ProfileSettingsMenu = ({ onSignOut, onDeleteAccount }: ProfileSettingsMenuProps) => {
    return (
        <Popover
            placement="bottom right"
            trigger={(triggerProps) => {
                return (
                    <Pressable {...triggerProps} className="p-2 active:opacity-70">
                        <Icon as={Settings} size="xl" className="text-ink" />
                    </Pressable>
                );
            }}
        >
            <PopoverBackdrop />
            <PopoverContent className="bg-surface border-2 border-ink shadow-retro-hard-sm p-4 w-56 rounded-xl">
                <VStack space="md">
                    <Pressable
                        onPress={() => Alert.alert("Edit Profile", "Feature coming soon")}
                        className="flex-row items-center gap-3 active:opacity-60"
                    >
                        <Icon as={Edit} size="sm" className="text-ink" />
                        <Text className="text-ink tracking-wide" weight="bold">
                            Edit Profile
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={onSignOut}
                        className="flex-row items-center gap-3 active:opacity-60"
                    >
                        <Icon as={LogOut} size="sm" className="text-ink" />
                        <Text className="text-ink tracking-wide" weight="bold">
                            Sign Out
                        </Text>
                    </Pressable>
                    <Divider className="bg-ink/20" />
                    <Pressable
                        onPress={onDeleteAccount}
                        className="flex-row items-center gap-3 active:opacity-60"
                    >
                        <Icon as={Trash2} size="sm" className="text-action" />
                        <Text className="text-action tracking-wide" weight="bold">
                            Delete Account
                        </Text>
                    </Pressable>
                </VStack>
            </PopoverContent>
        </Popover>
    );
};
