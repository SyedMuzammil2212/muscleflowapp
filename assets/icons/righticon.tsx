import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export default function RightIcon(props: SvgProps) {
    return (
        <Svg
            width={8}
            height={12}
            viewBox="0 0 8 12"
            fill="none"
            {...props}
        >
            <Path
                d="M4.6 6L0 1.4L1.4 0L7.4 6L1.4 12L0 10.6L4.6 6Z"
                fill={props.color || "#9A9079"}
            />
        </Svg>
    );
}
