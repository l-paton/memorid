import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList, Card } from '../types';

type PracticeScreenRouteProp = RouteProp<RootStackParamList, 'Practice'>;
type PracticeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Practice'>;

const PracticeScreen = () => {
  const route = useRoute<PracticeScreenRouteProp>();
  const navigation = useNavigation<PracticeScreenNavigationProp>();
  const themeId = route.params?.themeId;

  const [cards, setCards] = useState<Card[]>([]);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [stats, setStats] = useState<{ [key: string]: { correct: number; total: number } }>({});

  useEffect(() => {
    loadCards();
    loadStats();
  }, []);

  const loadCards = async () => {
    try {
      if (themeId) {
        const storedCards = await AsyncStorage.getItem(`cards_${themeId}`);
        if (storedCards) {
          setCards(JSON.parse(storedCards));
          getRandomCard(JSON.parse(storedCards));
        }
      } else {
        const allCards: Card[] = [];
        const keys = await AsyncStorage.getAllKeys();
        const cardKeys = keys.filter(key => key.startsWith('cards_'));
        for (const key of cardKeys) {
          const storedCards = await AsyncStorage.getItem(key);
          if (storedCards) {
            allCards.push(...JSON.parse(storedCards));
          }
        }
        setCards(allCards);
        getRandomCard(allCards);
      }
    } catch (error) {
      console.error('Error al cargar las tarjetas:', error);
    }
  };

  const loadStats = async () => {
    try {
      const storedStats = await AsyncStorage.getItem('card_stats');
      if (storedStats) {
        setStats(JSON.parse(storedStats));
      }
    } catch (error) {
      console.error('Error al cargar las estadísticas:', error);
    }
  };

  const saveStats = async (newStats: { [key: string]: { correct: number; total: number } }) => {
    try {
      await AsyncStorage.setItem('card_stats', JSON.stringify(newStats));
    } catch (error) {
      console.error('Error al guardar las estadísticas:', error);
    }
  };

  const getRandomCard = (availableCards: Card[]) => {
    if (availableCards.length === 0) {
      Alert.alert(
        'No hay tarjetas disponibles',
        'No hay tarjetas para practicar en este momento.',
        [
          {
            text: 'Volver',
            onPress: () => navigation.goBack()
          }
        ]
      );
      return;
    }

    // Mezclar el array de tarjetas
    const shuffledCards = [...availableCards].sort(() => Math.random() - 0.5);
    
    // Si la tarjeta actual es la misma que la anterior, tomar la siguiente
    let nextCard = shuffledCards[0];
    if (currentCard && shuffledCards.length > 1) {
      nextCard = shuffledCards.find(card => card.id !== currentCard.id) || shuffledCards[0];
    }
    
    setCurrentCard(nextCard);
    setUserAnswer('');
    setShowAnswer(false);
  };

  const checkAnswer = () => {
    if (!currentCard) return;

    const isCorrect = userAnswer.toLowerCase().trim() === currentCard.word.toLowerCase();
    const newStats = { ...stats };
    
    if (!newStats[currentCard.id]) {
      newStats[currentCard.id] = { correct: 0, total: 0 };
    }
    
    newStats[currentCard.id].total++;
    if (isCorrect) {
      newStats[currentCard.id].correct++;
    }
    
    setStats(newStats);
    saveStats(newStats);
    setShowAnswer(true);
  };

  const getSuccessRate = (cardId: string) => {
    if (!stats[cardId] || stats[cardId].total === 0) return 0;
    return Math.round((stats[cardId].correct / stats[cardId].total) * 100);
  };

  return (
    <View style={styles.container}>
      {currentCard ? (
        <View style={styles.cardContainer}>
          <Text style={styles.description}>{currentCard.description}</Text>
          
          {!showAnswer ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Escribe la palabra"
                value={userAnswer}
                onChangeText={setUserAnswer}
              />
              <TouchableOpacity
                style={styles.checkButton}
                onPress={checkAnswer}
              >
                <Text style={styles.buttonText}>Comprobar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.answerText}>
                Respuesta: {currentCard.word}
              </Text>
              <Text style={styles.statsText}>
                Porcentaje de aciertos: {getSuccessRate(currentCard.id)}%
              </Text>
              <TouchableOpacity
                style={styles.nextButton}
                onPress={() => getRandomCard(cards)}
              >
                <Text style={styles.buttonText}>Siguiente</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay tarjetas disponibles</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  cardContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  description: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  checkButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  answerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 10,
  },
  statsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default PracticeScreen;
