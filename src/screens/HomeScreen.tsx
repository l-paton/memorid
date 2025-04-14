import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList, Theme } from '../types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [showNewThemeForm, setShowNewThemeForm] = useState(false);
  const [newThemeName, setNewThemeName] = useState('');

  useEffect(() => {
    loadThemes();
  }, []);

  const loadThemes = async () => {
    try {
      const storedThemes = await AsyncStorage.getItem('themes');
      if (storedThemes) {
        setThemes(JSON.parse(storedThemes));
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
      Alert.alert('Error', 'Por favor, introduce un nombre para la temática');
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
      'Eliminar Temática',
      '¿Estás seguro de que quieres eliminar esta temática? Se eliminarán todas sus tarjetas.',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const updatedThemes = themes.filter(theme => theme.id !== themeId);
            setThemes(updatedThemes);
            await saveThemes(updatedThemes);
            // También eliminamos las tarjetas asociadas
            await AsyncStorage.removeItem(`cards_${themeId}`);
          }
        }
      ]
    );
  };

  const renderThemeItem = ({ item }: { item: Theme }) => (
    <View style={styles.themeCard}>
      <TouchableOpacity
        style={styles.themeContent}
        onPress={() => navigation.navigate('ThemeDetail', { themeId: item.id })}
      >
        <Text style={styles.themeName}>{item.name}</Text>
        <Text style={styles.cardCount}>{item.cards.length} tarjetas</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteTheme(item.id)}
      >
        <Text style={styles.deleteButtonText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Temáticas</Text>
      
      {showNewThemeForm && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre de la temática"
            value={newThemeName}
            onChangeText={setNewThemeName}
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setShowNewThemeForm(false)}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.addButton]}
              onPress={addTheme}
            >
              <Text style={styles.buttonText}>Añadir</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={themes}
        renderItem={renderThemeItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={[styles.button, styles.newThemeButton]}
          onPress={() => setShowNewThemeForm(true)}
        >
          <Text style={styles.buttonText}>Nueva Temática</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.practiceButton]}
          onPress={() => navigation.navigate('Practice', { themeId: undefined })}
        >
          <Text style={styles.buttonText}>Practicar Todas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  inputContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  addButton: {
    backgroundColor: '#2196F3',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  newThemeButton: {
    backgroundColor: '#2196F3',
  },
  practiceButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 100,
  },
  themeCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeContent: {
    flex: 1,
  },
  themeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardCount: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default HomeScreen;
