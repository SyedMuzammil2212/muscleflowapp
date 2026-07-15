import Svg, { Path } from "react-native-svg";

type ChartIconProps = {
    width?: number;
    height?: number;
    color?: string;
};

export default function ChartIcon({
    width = 12,
    height = 12,
    color = "#F8C61E",
}: ChartIconProps) {
    return (
        <Svg width={width} height={height} viewBox="0 0 12 12" fill="none">
            <Path
                d="M2.66667 9.33333H4V6H2.66667V9.33333ZM8 9.33333H9.33333V2.66667H8V9.33333ZM5.33333 9.33333H6.66667V7.33333H5.33333V9.33333ZM5.33333 6H6.66667V4.66667H5.33333V6ZM1.33333 12C0.966667 12 0.652778 11.8694 0.391667 11.6083C0.130556 11.3472 0 11.0333 0 10.6667V1.33333C0 0.966667 0.130556 0.652778 0.391667 0.391667C0.652778 0.130556 0.966667 0 1.33333 0H10.6667C11.0333 0 11.3472 0.130556 11.6083 0.391667C11.8694 0.652778 12 0.966667 12 1.33333V10.6667C12 11.0333 11.8694 11.3472 11.6083 11.6083C11.3472 11.8694 11.0333 12 10.6667 12H1.33333ZM1.33333 10.6667H10.6667V1.33333H1.33333V10.6667Z"
                fill={color}
            />
        </Svg>
    );
}