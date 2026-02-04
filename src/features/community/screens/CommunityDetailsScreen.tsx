import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Box } from "@/src/ui/box";
import { Text } from "@/src/ui/text";
import { Heading } from "@/src/ui/heading";
import { VStack } from "@/src/ui/vstack";
import { HStack } from "@/src/ui/hstack";
import { Icon } from "@/src/ui/icon";
import { Button } from "@/src/ui/button";
import { Card } from "@/src/ui/card";
import { ArrowLeft, Users, MessageCircle, Calendar } from "lucide-react-native";

export default function CommunityDetailsScreen() {
    const { id, name } = useLocalSearchParams();

    const handleGoBack = () => {
        router.back();
    };

    return (
        <SafeAreaView
            style={{ flex: 1 }}
            className="bg-white dark:bg-background-dark"
        >
            <ScrollView className="flex-1">
                <Box className="p-6">
                    {/* Header with Back Button */}
                    <HStack space="md" className="items-center mb-6">
                        <TouchableOpacity onPress={handleGoBack}>
                            <Icon as={ArrowLeft} size="lg" className="text-typography-900 dark:text-typography-950" />
                        </TouchableOpacity>
                        <VStack space="xs" className="flex-1">
                            <Heading
                                size="xl"
                                className="text-typography-900 dark:text-typography-950"
                            >
                                {name || "Community Details"}
                            </Heading>
                            <Text
                                size="sm"
                                className="text-typography-600 dark:text-typography-750"
                            >
                                Community ID: {id}
                            </Text>
                        </VStack>
                    </HStack>

                    {/* Community Details Content */}
                    <VStack space="lg">
                        <Card className="p-6 border border-gray-200 dark:border-gray-800">
                            <VStack space="md">
                                <Heading size="md" className="text-typography-900 dark:text-typography-950">
                                    About This Community
                                </Heading>
                                <Text className="text-typography-600 dark:text-typography-750">
                                    This is a detailed view of the community. You can add more information here.
                                </Text>
                            </VStack>
                        </Card>

                        {/* Action Buttons */}
                        <VStack space="md">
                            <Button variant="solid">
                                <HStack space="xs" className="items-center">
                                    <Icon as={Users} size="sm" className="text-white" />
                                    <Text className="text-white font-medium">Join Community</Text>
                                </HStack>
                            </Button>

                            <Button variant="outline">
                                <HStack space="xs" className="items-center">
                                    <Icon as={MessageCircle} size="sm" />
                                    <Text>Start Discussion</Text>
                                </HStack>
                            </Button>

                            <Button variant="outline">
                                <HStack space="xs" className="items-center">
                                    <Icon as={Calendar} size="sm" />
                                    <Text>View Events</Text>
                                </HStack>
                            </Button>
                        </VStack>
                    </VStack>
                </Box>
            </ScrollView>
        </SafeAreaView>
    );
}
