import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Card } from '../types';

type PracticeScreenRouteProp = RouteProp<RootStackParamList, 'Practice'>;

type PracticeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Practice'>;

const PracticeScreen = () => {
  const route = useRoute<PracticeScreenRouteProp>();
  const navigation = useNavigation<PracticeScreenNavigationProp>();
  const themeId = route.params?.themeId;

  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [remainingCards, setRemainingCards] = useState<Card[]>([]);

  // Datos de ejemplo - en una aplicación real, esto vendría de una base de datos
  const allCards: Card[] = [
    {
      id: '1',
      word: 'Álgebra',
      description: 'Rama de las matemáticas que estudia las estructuras, relaciones y cantidades',
      themeId: '1'
    },
    {
      id: '2',
      word: 'Geometría',
      description: 'Rama de las matemáticas que estudia las propiedades y relaciones de puntos, líneas y figuras en el espacio',
      themeId: '1'
    },
    {
      id: '3',
      word: 'Revolución Francesa',
      description: 'Movimiento social y político que tuvo lugar en Francia entre 1789 y 1799',
      themeId: '2'
    }
  ];

  useEffect(() => {
    const filteredCards = themeId
      ? allCards.filter(card => card.themeId === themeId)
      : allCards;
    
    setRemainingCards([...filteredCards]);
    getNextCard();
  }, [themeId]);

  const getNextCard = () => {
    if (remainingCards.length === 0) {
      Alert.alert(
        '¡Felicidades!',
        'Has completado todas las tarjetas.',
        [
          {
            text: 'Volver',
            onPress: () => navigation.goBack()
          }
        ]
      );
      return;
    }

    const randomIndex = Math.floor(Math.random() * remainingCards.length);
    const nextCard = remainingCards[randomIndex];
    setCurrentCard(nextCard);
    setRemainingCards(remainingCards.filter((_, index) => index !== randomIndex));
    setShowAnswer(false);
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  return (
    <View style={styles.container}>
      {currentCard && (
        <>
          <View style={styles.cardContainer}>
            <Text style={styles.description}>{currentCard.description}</Text>
            {showAnswer ? (
              <Text style={styles.word}>{currentCard.word}</Text>
            ) : (
              <TouchableOpacity
                style={styles.showAnswerButton}
                onPress={handleShowAnswer}
              >
                <Text style={styles.showAnswerButtonText}>Mostrar Respuesta</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={getNextCard}
          >
            <Text style={styles.nextButtonText}>Siguiente</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  cardContainer: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginBottom: 24,
  },
  description: {
    fontSize: 18,
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  word: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
  },
  showAnswerButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  showAnswerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PracticeScreen;
