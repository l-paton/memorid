import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/types';
import HomeScreen from './src/screens/HomeScreen';
import ThemeDetailScreen from './src/screens/ThemeDetailScreen';
import PracticeScreen from './src/screens/PracticeScreen';
import { navigationStyles } from './src/styles/navigation';
import './src/i18n';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={navigationStyles}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Temáticas' }}
        />
        <Stack.Screen
          name="ThemeDetail"
          component={ThemeDetailScreen}
          options={{ title: 'Tarjetas' }}
        />
        <Stack.Screen
          name="Practice"
          component={PracticeScreen}
          options={{ title: 'Practicar' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;