import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { RootStackParamList, Theme } from '../types';
import { commonStyles } from '../styles/common';
import { homeStyles } from '../styles/home';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t, i18n: i18nInstance } = useTranslation();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [showNewThemeForm, setShowNewThemeForm] = useState(false);
  const [newThemeName, setNewThemeName] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadThemes();
    navigation.setOptions({
      title: t('themes.title'),
      headerRight: () => (
        <View style={commonStyles.languageSelector}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ marginRight: 8, color: '#000' }}>
              {i18nInstance.language.toUpperCase()}
            </Text>
            <Picker
              selectedValue={i18nInstance.language as 'es' | 'en'}
              onValueChange={(itemValue: 'es' | 'en') => changeLanguage(itemValue)}
              style={commonStyles.picker}
              dropdownIconColor="#000"
            >
              <Picker.Item label="ES" value="es" />
              <Picker.Item label="EN" value="en" />
            </Picker>
          </View>
        </View>
      ),
    });
  }, [navigation, i18nInstance.language, t]);

  const loadThemes = async () => {
    try {
      const storedThemes = await AsyncStorage.getItem('themes');
      if (storedThemes) {
        const themesData = JSON.parse(storedThemes);
        
        // Cargar las tarjetas para cada tema
        const themesWithCards = await Promise.all(
          themesData.map(async (theme: Theme) => {
            const storedCards = await AsyncStorage.getItem(`cards_${theme.id}`);
            return {
              ...theme,
              cards: storedCards ? JSON.parse(storedCards) : []
            };
          })
        );
        
        setThemes(themesWithCards);
      }
    } catch (error) {
      console.error('Error al cargar las temáticas:', error);
    }
  };

  const saveThemes = async (themesToSave: Theme[]) => {
    try {
      await AsyncStorage.setItem('themes', JSON.stringify(themesToSave));
    } catch (error) {
      console.error('Error al guardar las temáticas:', error);
    }
  };

  const addTheme = async () => {
    if (!newThemeName.trim()) {
      Alert.alert('Error', t('themes.themeNameRequired'));
      return;
    }

    const newTheme: Theme = {
      id: Date.now().toString(),
      name: newThemeName.trim(),
      cards: []
    };

    const updatedThemes = [...themes, newTheme];
    setThemes(updatedThemes);
    await saveThemes(updatedThemes);
    setNewThemeName('');
    setShowNewThemeForm(false);
  };

  const deleteTheme = async (themeId: string) => {
    Alert.alert(
      t('themes.deleteTheme'),
      t('themes.deleteThemeConfirm'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel'
        },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            const updatedThemes = themes.filter(theme => theme.id !== themeId);
            setThemes(updatedThemes);
            await saveThemes(updatedThemes);
            await AsyncStorage.removeItem(`cards_${themeId}`);
          }
        }
      ]
    );
  };

  const renderThemeItem = ({ item }: { item: Theme }) => (
    <View style={homeStyles.themeCard}>
      <TouchableOpacity
        style={homeStyles.themeContent}
        onPress={() => navigation.navigate('ThemeDetail', { themeId: item.id })}
      >
        <Text style={homeStyles.themeName}>{item.name}</Text>
        <Text style={homeStyles.cardCount}>{item.cards.length} {t('cards.title')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={commonStyles.deleteButton}
        onPress={() => deleteTheme(item.id)}
      >
        <Text style={commonStyles.deleteButtonText}>{t('common.delete')}</Text>
      </TouchableOpacity>
    </View>
  );

  const changeLanguage = (lng: 'es' | 'en') => {
    i18nInstance.changeLanguage(lng);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadThemes();
    setRefreshing(false);
  };

  return (
    <View style={commonStyles.container}>
      {showNewThemeForm && (
        <View style={commonStyles.inputContainer}>
          <TextInput
            style={commonStyles.input}
            placeholder={t('themes.themeName')}
            value={newThemeName}
            onChangeText={setNewThemeName}
          />
          <View style={commonStyles.buttonRow}>
            <TouchableOpacity
              style={[commonStyles.button, commonStyles.cancelButton]}
              onPress={() => setShowNewThemeForm(false)}
            >
              <Text style={commonStyles.buttonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[commonStyles.button, commonStyles.addButton]}
              onPress={addTheme}
            >
              <Text style={commonStyles.buttonText}>{t('common.save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={themes}
        renderItem={renderThemeItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={homeStyles.listContainer}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
      
      <View style={homeStyles.bottomButtons}>
        <TouchableOpacity
          style={[commonStyles.button, homeStyles.newThemeButton]}
          onPress={() => setShowNewThemeForm(true)}
        >
          <Text style={commonStyles.buttonText}>{t('themes.newTheme')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[commonStyles.button, homeStyles.practiceButton]}
          onPress={() => navigation.navigate('Practice', { themeId: undefined })}
        >
          <Text style={commonStyles.buttonWhiteText}>{t('common.practiceAll')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;
