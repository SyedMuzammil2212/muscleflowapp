import Svg, { Circle, Path } from "react-native-svg";

type IconProps = {
    width?: number;
    height?: number;
    color?: string;
};

export default function ClockIcon({
    width = 24,
    height = 24,
    color = "#141B34",
}: IconProps) {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <Circle
                cx={12}
                cy={12}
                r={10}
                stroke={color}
                strokeWidth={1.5}
            />

            <Path
                d="M12 8V12L14 14"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}