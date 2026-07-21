import BackIcon from "@/assets/icons/backIcon";
import BicepIcon from "@/assets/icons/bicepicon";
import ChestIcon from "@/assets/icons/chestIcon";
import CoreIcon from "@/assets/icons/coreIcon";
import DumbbellIcon from "@/assets/icons/dumbellicon";
import KettlebellIcon from "@/assets/icons/kettlebellicon";
import LegIcon from "@/assets/icons/legIcon";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";

type muscleObject = {
    id: number;
    name: string;
    user_id: any;
};

type SelectMuscleSectionProps = {
    musclegroups?: Array<muscleObject>;
    setTab: (tab: number) => void;
    selectedId: Array<number>;
    setSelectedId: React.Dispatch<React.SetStateAction<Array<number>>>;
    getExcercisesByMuscles: () => void;
};

interface MuscleBoxProps {
    muscle: muscleObject;
    isSelected: boolean;
    onPress: () => void;
    iconFn?: (color: string) => React.ReactNode;
}

function MuscleBox({ muscle, isSelected, onPress, iconFn }: MuscleBoxProps) {
    const scale = useSharedValue(1);
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withTiming(isSelected ? 1 : 0, { duration: 200 });
    }, [isSelected]);

    const animatedBoxStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            progress.value,
            [0, 1],
            ["#19202B", "#26231E"]
        );
        const borderColor = interpolateColor(
            progress.value,
            [0, 1],
            ["#2B3547", "#F8C61E"]
        );
        return {
            transform: [{ scale: scale.value }],
            backgroundColor,
            borderColor,
        };
    });

    const animatedCircleStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            progress.value,
            [0, 1],
            ["#232A35", "#3C3215"]
        );
        return {
            backgroundColor,
        };
    });

    const handlePressIn = () => {
        scale.value = withSpring(0.95);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    const iconColor = isSelected ? "#F8C61E" : "#6B7C96";
    const textColor = isSelected ? "#F8C61E" : "#95A1B5";

    return (
        <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            className="w-[46%] mb-3"
        >
            <Animated.View
                className="h-[120px] w-full p-3 rounded-xl items-center justify-center gap-y-3 border-[1.5px]"
                style={animatedBoxStyle}
            >
                <Animated.View
                    className="h-[50px] w-[50px] rounded-full items-center justify-center"
                    style={animatedCircleStyle}
                >
                    {iconFn ? iconFn(iconColor) : <DumbbellIcon height={30} width={30} color={iconColor} />}
                </Animated.View>
                <Text
                    className="uppercase w-full text-center font-semibold text-base tracking-wide"
                    style={{ color: textColor }}
                >
                    {muscle.name}
                </Text>
            </Animated.View>
        </Pressable>
    );
}

export default function SelectMuscleSection({ musclegroups = [], setTab, selectedId, setSelectedId, getExcercisesByMuscles }: SelectMuscleSectionProps) {

    const toggleSelection = (id: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedId((prev) => {
            if (prev.includes(id)) {
                return prev.filter((item) => item !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const icons = [
        {
            name: "Chest",
            icon: (color: string) => <ChestIcon height={30} width={30} color={color} />,
        },
        {
            name: "Back",
            icon: (color: string) => <BackIcon height={30} width={30} color={color} />,
        },
        {
            name: "Shoulder",
            icon: (color: string) => <KettlebellIcon height={30} width={30} color={color} />,
        },
        {
            name: "Legs",
            icon: (color: string) => <LegIcon height={30} width={30} color={color} />,
        },
        {
            name: "Biceps",
            icon: (color: string) => <BicepIcon height={30} width={30} color={color} />,
        },
        {
            name: "Triceps",
            icon: (color: string) => <DumbbellIcon height={30} width={30} color={color} />,
        },
        {
            name: "Core",
            icon: (color: string) => <CoreIcon height={30} width={30} color={color} />,
        },
    ];

    return (
        <ScrollView
            className="bg-dark w-full h-full"
            contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
        >
            <View>
                <Pressable
                    className="absolute left-2.5 top-[60px] z-10 justify-center items-center"
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setTab(1)
                    }}
                    hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                >
                    <Ionicons name="arrow-back" size={24} color="#F8C61E" />
                </Pressable>
                <Text className="text-brand w-full text-center text-2xl mt-16 font-medium uppercase tracking-wide">Select Muscle</Text>
            </View>
            <View className="flex-row flex-wrap justify-center items-center gap-x-4 gap-y-4 mt-6">
                {musclegroups.map((muscle) => {
                    const iconObj = icons.find((i) => i.name === muscle.name);
                    const isSelected = selectedId.includes(muscle.id);

                    return (
                        <MuscleBox
                            key={muscle.id}
                            muscle={muscle}
                            isSelected={isSelected}
                            onPress={() => toggleSelection(muscle.id)}
                            iconFn={iconObj?.icon}
                        />
                    );
                })}
            </View>
            {selectedId.length > 0 && <View className="absolute right-5 bottom-[60px] z-10 justify-center items-center h-[50px] w-[50px] rounded-full bg-brand">
                <Pressable
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        getExcercisesByMuscles()
                    }}
                    hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                >
                    <Ionicons name="arrow-forward" size={24} color="#252C37" />
                </Pressable>
            </View>}
        </ScrollView>
    );
}