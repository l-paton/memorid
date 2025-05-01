import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import ThemeDetailScreen from './src/screens/ThemeDetailScreen';
import PracticeScreen from './src/screens/PracticeScreen';
import { navigationStyles } from './src/styles/navigation';
import { initI18n } from './src/i18n';
import { View, ActivityIndicator } from 'react-native';
import { commonStyles } from './src/styles/common';

const Stack = createNativeStackNavigator();

const App = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initI18n();
        setIsReady(true);
      } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        setIsReady(true);
    };

    initializeApp();
  }, []);

  if (!isReady) {
    return (
      <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={navigationStyles}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Temáticas' }}/>
        <Stack.Screen name="ThemeDetail" component={ThemeDetailScreen} options={{ title: 'Tarjetas' }}/>
        <Stack.Screen name="Practice" component={PracticeScreen} options={{ title: 'Practicar' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;