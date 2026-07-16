import Svg, { Path } from "react-native-svg";

type FeatherIconProps = {
    width?: number;
    height?: number;
    color?: string;
};

export default function LegIcon({
    width = 24,
    height = 24,
    color = "#F8C61E",
}: FeatherIconProps) {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <Path
                d="M5.00195 2C7.69328 2.31359 17 4 20 12L15.0989 22"
                stroke={color}
                strokeWidth={1.5}
                strokeLinejoin="round"
            />
            <Path
                d="M4.00195 12C5.00195 13.7264 8.16635 14.5959 12.002 13.7264C10.5436 14.3176 7.62695 16.8 7.62695 22"
                stroke={color}
                strokeWidth={1.5}
                strokeLinejoin="round"
            />
            <Path
                d="M5.00195 7L12 9.5"
                stroke={color}
                strokeWidth={1.5}
                strokeLinejoin="round"
            />
        </Svg>
    );
}