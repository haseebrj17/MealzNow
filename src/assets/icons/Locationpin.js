import React from 'react';
import Svg, { Path, Mask, G, Defs, ClipPath, Circle } from 'react-native-svg'

const Locationpin = () => {
    return (
        <Svg xmlns="http://www.w3.org/2000/svg" fill="white" {...props}>
            <G filter="url(#a)">
                <Circle cx={20.5} cy={16.82} r={16.5} fill="#fff" />
            </G>
            <G clipPath="url(#b)">
                <Mask
                    id="c"
                    width={17}
                    height={24}
                    x={12}
                    y={5}
                    maskUnits="userSpaceOnUse"
                    style={{
                        maskType: "luminance",
                    }}
                >
                    <Path fill="#fff" d="M12.81 5.32h15.364v23H12.81v-23Z" />
                </Mask>
                <G mask="url(#c)">
                    <Path
                        fill="#FFAF51"
                        d="M20.49 5.32c-4.229 0-7.657 3.433-7.657 7.667 0 1.438.394 2.781 1.082 3.931l6.575 11.403 6.581-11.41a7.638 7.638 0 0 0 1.078-3.924c0-4.234-3.429-7.667-7.658-7.667Zm0 10.233a2.564 2.564 0 0 1-2.562-2.566 2.564 2.564 0 0 1 2.563-2.566 2.564 2.564 0 0 1 2.563 2.566 2.564 2.564 0 0 1-2.563 2.566Z"
                    />
                </G>
            </G>
            <Defs>
                <ClipPath id="b">
                    <Path fill="#fff" d="M9 5.32h23v23H9z" />
                </ClipPath>
            </Defs>
        </Svg>
    )
}

export default Locationpin; 