import Svg, { Path } from "react-native-svg";

type BenchPressIconProps = {
    width?: number;
    height?: number;
    color?: string;
};

export default function ChestIcon({
    width = 24,
    height = 24,
    color = "#F8C61E",
}: BenchPressIconProps) {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <Path
                d="M18 3V9M6 3V9M20.5 4V6M20.5 6V8M20.5 6H22M3.5 4V6M3.5 6V8M3.5 6H2M18 6H6"
                stroke={color}
                strokeWidth={1.5}
                strokeLinejoin="round"
            />
            <Path
                d="M5 18H18.9995L16.9999 14H6.99995L5 18Z"
                stroke={color}
                strokeWidth={1.5}
                strokeLinejoin="round"
            />
            <Path
                d="M9 8V14M15 8V14"
                stroke={color}
                strokeWidth={1.5}
                strokeLinejoin="round"
            />
            <Path
                d="M16 18V21M8 18V21"
                stroke={color}
                strokeWidth={1.5}
                strokeLinejoin="round"
            />
        </Svg>
    );
}