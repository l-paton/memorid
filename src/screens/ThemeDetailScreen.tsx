import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList, Card } from '../types';

type ThemeDetailScreenRouteProp = RouteProp<RootStackParamList, 'ThemeDetail'>;

type ThemeDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ThemeDetail'>;

const ThemeDetailScreen = () => {
  const route = useRoute<ThemeDetailScreenRouteProp>();
  const navigation = useNavigation<ThemeDetailScreenNavigationProp>();
  const themeId = route.params.themeId;

  const [cards, setCards] = useState<Card[]>([]);
  const [showNewCardModal, setShowNewCardModal] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const storedCards = await AsyncStorage.getItem(`cards_${themeId}`);
      if (storedCards) {
        setCards(JSON.parse(storedCards));
      }
    } catch (error) {
      console.error('Error al cargar las tarjetas:', error);
    }
  };

  const saveCards = async (cardsToSave: Card[]) => {
    try {
      await AsyncStorage.setItem(`cards_${themeId}`, JSON.stringify(cardsToSave));
    } catch (error) {
      console.error('Error al guardar las tarjetas:', error);
    }
  };

  const addCard = async () => {
    if (!newWord.trim() || !newDescription.trim()) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }

    const newCard: Card = {
      id: Date.now().toString(),
      word: newWord.trim(),
      description: newDescription.trim(),
      themeId: themeId
    };

    const updatedCards = [...cards, newCard];
    setCards(updatedCards);
    await saveCards(updatedCards);
    setNewWord('');
    setNewDescription('');
    setShowNewCardModal(false);
  };

  const deleteCard = async (cardId: string) => {
    Alert.alert(
      'Eliminar Tarjeta',
      '¿Estás seguro de que quieres eliminar esta tarjeta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const updatedCards = cards.filter(card => card.id !== cardId);
            setCards(updatedCards);
            await saveCards(updatedCards);
          }
        }
      ]
    );
  };

  const renderCardItem = ({ item }: { item: Card }) => (
    <View style={styles.cardContainer}>
      <View style={styles.cardContent}>
        <Text style={styles.word}>{item.word}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteCard(item.id)}
      >
        <Text style={styles.deleteButtonText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tarjetas de la Temática</Text>
      
      <FlatList
        data={cards}
        renderItem={renderCardItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={[styles.button, styles.newCardButton]}
          onPress={() => setShowNewCardModal(true)}
        >
          <Text style={styles.buttonText}>Nueva Tarjeta</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.practiceButton]}
          onPress={() => navigation.navigate('Practice', { themeId })}
        >
          <Text style={styles.buttonText}>Practicar</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showNewCardModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nueva Tarjeta</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Palabra"
              value={newWord}
              onChangeText={setNewWord}
            />
            
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Descripción"
              value={newDescription}
              onChangeText={setNewDescription}
              multiline
            />
            
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setShowNewCardModal(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.addButton]}
                onPress={addCard}
              >
                <Text style={styles.buttonText}>Añadir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  listContainer: {
    paddingBottom: 100,
  },
  cardContainer: {
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
  cardContent: {
    flex: 1,
  },
  word: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
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
  newCardButton: {
    backgroundColor: '#2196F3',
  },
  practiceButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '90%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  addButton: {
    backgroundColor: '#2196F3',
  },
  cancelButton: {
    backgroundColor: '#f44336',
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
});

export default ThemeDetailScreen; 