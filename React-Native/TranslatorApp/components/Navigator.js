import Main from './Main';
import RekognitionData from './RekognitionData';
import { createAppContainer, createBottomTabNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const RootStack = createStackNavigator({
    Home: {
        screen: Main,
    },
    Image: {
        screen: RekognitionData,
    },
},
);
const Container = createAppContainer(RootStack);

export default Container;
