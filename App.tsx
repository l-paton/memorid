import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import ThemeDetailScreen from './src/screens/ThemeDetailScreen';
import PracticeScreen from './src/screens/PracticeScreen';
import { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4CAF50',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Temáticas' }}
        />
        <Stack.Screen
          name="ThemeDetail"
          component={ThemeDetailScreen}
          options={{ title: 'Detalle de Temática' }}
        />
        <Stack.Screen
          name="Practice"
          component={PracticeScreen}
          options={{ title: 'Práctica' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}