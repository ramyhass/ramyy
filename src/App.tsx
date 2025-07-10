import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StatusBar} from 'react-native';
import SplashScreen from './screens/SplashScreen';
import MainScreen from './screens/MainScreen';
import LiveTVScreen from './screens/LiveTVScreen';
import MoviesScreen from './screens/MoviesScreen';
import SeriesScreen from './screens/SeriesScreen';
import CatchupScreen from './screens/CatchupScreen';
import SearchScreen from './screens/SearchScreen';
import TVGuideScreen from './screens/TVGuideScreen';
import SettingsScreen from './screens/SettingsScreen';
import PlayerScreen from './screens/PlayerScreen';
import {IPTVProvider} from './context/IPTVContext';

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