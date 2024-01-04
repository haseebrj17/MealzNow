import React from 'react';
import { View } from "react-native";
import { Display } from "../../utils";
import Skeleton from "./Skeleton";
import { theme } from "../../theme/theme";

const MealTypeShimmer = () => {
    return (
        <Skeleton
            width={Display.setWidth(90)}
            height={Display.setHeight(15)}
            style={{ marginBottom: Display.setHeight(3), borderRadius: Display.setHeight(1.3) }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                {/* Image placeholder */}
                <View style={{
                    width: Display.setHeight(12),
                    height: Display.setHeight(12),
                    borderRadius: Display.setHeight(6),
                    backgroundColor: 'transparent',
                }} />

                {/* Text placeholder */}
                <View style={{
                    width: (Display.setWidth(90) - Display.setHeight(12)),
                    height: '70%',
                    justifyContent: 'space-evenly',
                    paddingHorizontal: theme.padding.small,
                }}>
                    <View style={{
                        height: Display.setHeight(3.5),
                        backgroundColor: 'transparent',
                        borderRadius: Display.setHeight(1.75),
                    }} />
                    <View style={{
                        height: Display.setHeight(1.5),
                        backgroundColor: 'transparent',
                        borderRadius: Display.setHeight(0.75),
                    }} />
                </View>
            </View>
        </Skeleton>
    );
};

export default MealTypeShimmer;