import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StatusBar} from 'react-native';
import SplashScreen from './src/screens/SplashScreen';
import MainScreen from './src/screens/MainScreen';
import LiveTVScreen from './src/screens/LiveTVScreen';
import MoviesScreen from './src/screens/MoviesScreen';
import SeriesScreen from './src/screens/SeriesScreen';
import CatchupScreen from './src/screens/CatchupScreen';
import SearchScreen from './src/screens/SearchScreen';
import TVGuideScreen from './src/screens/TVGuideScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import PlayerScreen from './src/screens/PlayerScreen';
import {IPTVProvider} from './src/context/IPTVContext';

const Stack = createStackNavigator();

const App = () => {
  return (
    <IPTVProvider>
      <NavigationContainer>
        <StatusBar hidden={true} />
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            gestureEnabled: false,
            animationEnabled: false,
          }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="LiveTV" component={LiveTVScreen} />
          <Stack.Screen name="Movies" component={MoviesScreen} />
          <Stack.Screen name="Series" component={SeriesScreen} />
          <Stack.Screen name="Catchup" component={CatchupScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="TVGuide" component={TVGuideScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Player" component={PlayerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </IPTVProvider>
  );
};

export default App;