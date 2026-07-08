import Svg, { Path } from "react-native-svg";

type IconProps = {
    width?: number;
    height?: number;
    color?: string;
};

export default function WorkoutIcon({
    width = 24,
    height = 24,
    color = "#141B34",
}: IconProps) {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <Path
                d="M4 20L2 22M20 4L22 2M15.5 8.5L8.5 15.5"
                stroke={color}
                strokeWidth={2}
                strokeLinejoin="round"
            />
            <Path
                d="M16 4L15 3L12.5 5.5L18.5 11.5L21 9L20 8M16 4L18 2L22 6L20 8M16 4L20 8"
                stroke={color}
                strokeWidth={2}
                strokeLinejoin="round"
            />
            <Path
                d="M8 20L9 21L11.5 18.5L5.5 12.5L3 15L4 16M8 20L6 22L2 18L4 16M8 20L4 16"
                stroke={color}
                strokeWidth={2}
                strokeLinejoin="round"
            />
        </Svg>
    );
}