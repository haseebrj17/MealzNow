import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    Home: undefined;
}

type HomeScreenNavigationProps = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
    navigation: HomeScreenNavigationProps;
    route: RootStackParamList;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    return (
        <View>
            <Text>HomeScreen</Text>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({})