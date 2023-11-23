import * as React from "react"
import Svg, { Path } from "react-native-svg"
const Vegetarian = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={75}
        height={75}
        fill="none"
        {...props}
    >
        <Path
            stroke={props.color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M1 1a96.853 96.853 0 0 1 36.411 72.822c3.277-24.832 5.462-34.59 14.564-50.975m0 0c14.565 0 21.847-7.283 21.847-21.847-14.564 0-21.847 7.282-21.847 21.847Z"
        />
        <Path
            stroke={props.color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M57.11 6.826a36.411 36.411 0 1 0 10.923 10.923"
        />
        <Path
            fill={props.color}
            d="M69.824 40.258c-6.24 3.661-5.793 11.182-10.166 14.576-3.29 2.554-7.933 1.26-10.618.162 0 0-1.82 2.296-3.124 5.358-.437 1.027-2.355-.105-2.019-.975 4.267-11.009 18.781-16.501 18.781-16.501s-10.241-.434-17.086 8.51c-.183-2.044-.487-7.57 4.814-10.96 7.185-4.6 20.875-1.024 19.418-.17Z"
        />
    </Svg>
)
export default Vegetarian
