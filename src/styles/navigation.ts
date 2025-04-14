import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { colors } from './colors';

export const navigationStyles: NativeStackNavigationOptions = {
  headerStyle: {
    backgroundColor: colors.primary,
  },
  headerTintColor: colors.white,
  headerTitleStyle: {
    fontWeight: 'bold',
  },
}; 