import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { RootStackParamList, Card } from '../types';
import { commonStyles } from '../styles/common';
import { practiceStyles } from '../styles/practice';

type PracticeScreenRouteProp = RouteProp<RootStackParamList, 'Practice'>;
type PracticeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Practice'>;

const PracticeScreen = () => {
  const route = useRoute<PracticeScreenRouteProp>();
  const navigation = useNavigation<PracticeScreenNavigationProp>();
  const { t } = useTranslation();
  const themeId = route.params?.themeId;

  const [cards, setCards] = useState<Card[]>([]);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [stats, setStats] = useState<{ [key: string]: { correct: number; total: number } }>({});

  useEffect(() => {
    loadCards();
    loadStats();
    navigation.setOptions({
      title: t('practice.title'),
    });
  }, [navigation, t]);

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
        t('practice.noCardsAvailable'),
        t('practice.noCardsAvailable'),
        [
          {
            text: t('common.back'),
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
    <View style={commonStyles.container}>
      {currentCard ? (
        <View style={practiceStyles.cardContainer}>
          <Text style={practiceStyles.description}>{currentCard.description}</Text>
          
          {!showAnswer ? (
            <>
              <TextInput
                style={commonStyles.input}
                placeholder={t('practice.writeWord')}
                value={userAnswer}
                onChangeText={setUserAnswer}
              />
              <TouchableOpacity
                style={practiceStyles.checkButton}
                onPress={checkAnswer}
              >
                <Text style={commonStyles.buttonText}>{t('practice.check')}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={practiceStyles.answerText}>
                {t('practice.answer')}: {currentCard.word}
              </Text>
              <Text style={practiceStyles.statsText}>
                {t('cards.successRate', { rate: getSuccessRate(currentCard.id) })}
              </Text>
              <TouchableOpacity
                style={practiceStyles.nextButton}
                onPress={() => getRandomCard(cards)}
              >
                <Text style={commonStyles.buttonText}>{t('practice.next')}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      ) : (
        <View style={practiceStyles.emptyContainer}>
          <Text style={practiceStyles.emptyText}>{t('practice.noCardsAvailable')}</Text>
          <TouchableOpacity
            style={practiceStyles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={commonStyles.buttonText}>{t('common.back')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default PracticeScreen;
