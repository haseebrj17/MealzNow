import React from "react";
import Svg, { Path, Defs, G, LinearGradient, Stop } from "react-native-svg";

const FacebookIcon = ({ size }) => {
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 256 256"
        >
            <Defs>
                <LinearGradient
                    id="color-1"
                    x1="9.993"
                    x2="40.615"
                    y1="9.993"
                    y2="40.615"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset="0" stopColor="#19afff"></Stop>
                    <Stop offset="1" stopColor="#0062e0"></Stop>
                </LinearGradient>
            </Defs>
            <G
                fill="none"
                strokeMiterlimit="10"
                fontFamily="none"
                fontSize="none"
                fontWeight="none"
                textAnchor="none"
                style={{ mixBlendMode: "normal" }}
            >
                <Path
                    fill="url(#color-1)"
                    d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4z"
                    transform="scale(5.33333)"
                ></Path>
                <Path
                    fill="#fff"
                    d="M26.707 29.301h5.176l.813-5.258h-5.989v-2.874c0-2.184.714-4.121 2.757-4.121h3.283V12.46c-.577-.078-1.797-.248-4.102-.248-4.814 0-7.636 2.542-7.636 8.334v3.498H16.06v5.258h4.948v14.452c.98.146 1.973.246 2.992.246.921 0 1.82-.084 2.707-.204z"
                    transform="scale(5.33333)"
                ></Path>
            </G>
        </Svg>
    );
}

export default FacebookIcon;
