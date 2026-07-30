import Svg, { Path, Rect } from "react-native-svg";

const CalendarIcon = ({ width = 24, height = 24, color = "#D2C5AC" }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <Rect x="3" y="4" width="18" height="17" rx="3" stroke={color} strokeWidth="1.8" />
            <Path d="M3 9H21" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
            <Path d="M8 2V5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
            <Path d="M16 2V5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
            <Path d="M7 13H9" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
            <Path d="M11 13H13" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
            <Path d="M15 13H17" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
            <Path d="M7 17H9" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
            <Path d="M11 17H13" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </Svg>
    );
};

export default CalendarIcon;
