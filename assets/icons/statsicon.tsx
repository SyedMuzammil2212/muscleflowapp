import Svg, { Path, Polyline, Circle } from "react-native-svg";

type StatsIconProps = {
    width?: number;
    height?: number;
    color?: string;
};

export default function StatsIcon({ width = 26, height = 26, color = "#D2C5AC" }: StatsIconProps) {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <Polyline
                points="22,12 18,12 15,21 9,3 6,12 2,12"
                stroke={color}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
