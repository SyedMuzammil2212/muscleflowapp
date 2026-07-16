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
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
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
            style={styles.pressableWrapper}
        >
            <Animated.View style={[styles.box, animatedBoxStyle]}>
                <Animated.View style={[styles.outerCircle, animatedCircleStyle]}>
                    {iconFn ? iconFn(iconColor) : <DumbbellIcon height={30} width={30} color={iconColor} />}
                </Animated.View>
                <Text style={[styles.muscleText, { color: textColor }]}>
                    {muscle.name}
                </Text>
            </Animated.View>
        </Pressable>
    );
}

export default function SelectMuscleSection({ musclegroups = [], setTab, selectedId, setSelectedId }: SelectMuscleSectionProps) {


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
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View>
                <Pressable
                    style={styles.backButton}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        console.log("Backpressed")
                        setTab(1)
                    }}
                    hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                >
                    <Ionicons name="arrow-back" size={24} color="#F8C61E" />
                </Pressable>
                <Text style={styles.headerTitle}>Select Muscle</Text>
            </View>
            <View style={styles.boxesParent}>
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
            {selectedId.length > 0 && <View style={styles.frontButton}>
                <Pressable
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        console.log("Backpressed")
                        setTab(1)
                    }}
                    hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                >
                    <Ionicons name="arrow-forward" size={24} color="#252C37" />
                </Pressable>
            </View>}


        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#252C37",
        width: "100%",
        height: "100%",
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 80,
    },
    headerTitle: {
        color: "#F8C61E",
        width: "100%",
        textAlign: "center",
        fontSize: 22,
        marginTop: 60,
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    boxesParent: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        rowGap: 16,
        columnGap: 16,
        marginTop: 24,
    },
    pressableWrapper: {
        width: "46%",
        marginBottom: 12,
    },
    box: {
        height: 120,
        width: "100%",
        padding: 12,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        rowGap: 12,
        borderWidth: 1.5,
    },
    muscleText: {
        textTransform: "uppercase",
        width: "100%",
        textAlign: "center",
        fontWeight: "600",
        fontSize: 16,
        letterSpacing: 0.5,
    },
    outerCircle: {
        height: 50,
        width: 50,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
    },
    backButton: {
        position: "absolute",
        left: 10,
        top: 60,
        zIndex: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    frontButton: {
        position: "absolute",
        right: 20,
        bottom: 60,
        zIndex: 10,
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        width: 50,
        borderRadius: 100,
        backgroundColor: "#F8C61E"
    },
});