import Svg, { Circle, Path } from "react-native-svg";

type KettlebellIconProps = {
    width?: number;
    height?: number;
    color?: string;
};

export default function KettlebellIcon({
    width = 24,
    height = 24,
    color = "#F8C61E",
}: KettlebellIconProps) {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <Path
                d="M17.0002 10C18.2117 6.73012 18.8203 5.60157 18.3297 4.3672C18.1795 3.98912 17.9639 3.64539 17.6946 3.35437C16.0233 1.54854 7.97647 1.54854 6.30519 3.35437C6.03585 3.64539 5.82029 3.98912 5.67004 4.3672C5.17947 5.60157 5.7885 6.73012 7 10"
                stroke={color}
                strokeWidth={1.5}
                strokeLinejoin="round"
            />
            <Path
                d="M15 16H17M7 16H9"
                stroke={color}
                strokeWidth={1.5}
                strokeLinejoin="round"
            />
            <Circle
                cx={12}
                cy={16}
                r={3}
                stroke={color}
                strokeWidth={1.5}
                strokeLinejoin="round"
            />
            <Path
                d="M12 8C7.58172 8 4 11.5817 4 16C4 18.3894 5.04751 20.5341 6.70835 22H17.2916C18.9525 20.5341 20 18.3894 20 16C20 11.5817 16.4183 8 12 8Z"
                stroke={color}
                strokeWidth={1.5}
            />
        </Svg>
    );
}