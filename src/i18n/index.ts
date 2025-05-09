import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import es from './locales/es.json';

const LANG_KEY = 'user-language';

const getStoredLanguage = async () => {
  try {
    const storedLanguage = await AsyncStorage.getItem(LANG_KEY);
    return storedLanguage || 'es';
  } catch (error) {
    console.error('Error al cargar el idioma:', error);
    return 'es';
  }
};

export const initI18n = async () => {
  try {
    const language = await getStoredLanguage();
    
    await i18n
      .use(initReactI18next)
      .init({
        resources: {
          en: { translation: en },
          es: { translation: es }
        },
        lng: language,
        fallbackLng: 'es',
        interpolation: {
          escapeValue: false
        }
      });

    i18n.on('languageChanged', async (lng) => {
      try {
        await AsyncStorage.setItem(LANG_KEY, lng);
      } catch (error) {
        console.error('Error al guardar el idioma:', error);
      }
    });

    return i18n;
  } catch (error) {
    console.error('Error al inicializar i18n:', error);
    throw error;
  }
};

export default i18n; 