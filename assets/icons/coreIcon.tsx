import Svg, { Path } from "react-native-svg";

type RopeIconProps = {
    width?: number;
    height?: number;
    color?: string;
};

export default function CoreIcon({
    width = 24,
    height = 24,
    color = "#F8C61E",
}: RopeIconProps) {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <Path
                d="M4 4V5.23077C4 6.8557 4.26603 8.45508 4.56009 10.0301C5.0994 12.9187 5.36933 17.0222 4 20M20 4V5.23077C20 6.8557 19.734 8.45508 19.4399 10.0301C18.9006 12.9187 18.6307 17.0222 20 20"
                stroke={color}
                strokeWidth={1.5}
                strokeLinejoin="round"
            />
            <Path
                d="M16 16.3076C14.515 17.9753 13.3211 17.8447 12 16.3076C10.6049 17.7524 9.39943 18.1339 8 16.3076"
                stroke={color}
                strokeWidth={1.5}
            />
            <Path
                d="M16 10.1541C14.515 11.8218 13.3211 11.6912 12 10.1541C10.6049 11.5988 9.39943 11.9803 8 10.1541"
                stroke={color}
                strokeWidth={1.5}
            />
            <Path
                d="M12 10.1539V7.69238"
                stroke={color}
                strokeWidth={1.5}
                strokeLinejoin="round"
            />
        </Svg>
    );
}