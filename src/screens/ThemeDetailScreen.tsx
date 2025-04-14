import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { RootStackParamList, Card } from '../types';
import { commonStyles } from '../styles/common';
import { themeDetailStyles } from '../styles/themeDetail';

type ThemeDetailScreenRouteProp = RouteProp<RootStackParamList, 'ThemeDetail'>;

type ThemeDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ThemeDetail'>;

const ThemeDetailScreen = () => {
  const route = useRoute<ThemeDetailScreenRouteProp>();
  const navigation = useNavigation<ThemeDetailScreenNavigationProp>();
  const { t } = useTranslation();
  const themeId = route.params.themeId;

  const [cards, setCards] = useState<Card[]>([]);
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [stats, setStats] = useState<{ [key: string]: { correct: number; total: number } }>({});

  useEffect(() => {
    loadCards();
    loadStats();
    navigation.setOptions({
      title: t('cards.title'),
    });
  }, [navigation, t]);

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

  const getSuccessRate = (cardId: string) => {
    if (!stats[cardId] || stats[cardId].total === 0) return 0;
    return Math.round((stats[cardId].correct / stats[cardId].total) * 100);
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
      Alert.alert('Error', t('cards.fillAllFields'));
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
    setShowNewCardForm(false);
  };

  const deleteCard = async (cardId: string) => {
    Alert.alert(
      t('cards.deleteCard'),
      t('cards.deleteCardConfirm'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel'
        },
        {
          text: t('common.delete'),
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
    <View style={themeDetailStyles.cardItem}>
      <View style={themeDetailStyles.cardContent}>
        <Text style={themeDetailStyles.word}>{item.word}</Text>
        <Text style={themeDetailStyles.description}>{item.description}</Text>
      </View>
      <TouchableOpacity
        style={commonStyles.deleteButton}
        onPress={() => deleteCard(item.id)}
      >
        <Text style={commonStyles.deleteButtonText}>{t('common.delete')}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={commonStyles.container}>
      {showNewCardForm && (
        <View style={commonStyles.inputContainer}>
          <TextInput
            style={commonStyles.input}
            placeholder={t('cards.word')}
            value={newWord}
            onChangeText={setNewWord}
          />
          <TextInput
            style={commonStyles.input}
            placeholder={t('cards.description')}
            value={newDescription}
            onChangeText={setNewDescription}
          />
          <View style={commonStyles.buttonRow}>
            <TouchableOpacity
              style={[commonStyles.button, commonStyles.cancelButton]}
              onPress={() => setShowNewCardForm(false)}
            >
              <Text style={commonStyles.buttonWhiteText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[commonStyles.button, commonStyles.addButton]}
              onPress={addCard}
            >
              <Text style={commonStyles.buttonText}>{t('common.save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={cards}
        renderItem={renderCardItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={themeDetailStyles.listContainer}
      />
      
      <View style={themeDetailStyles.bottomButtons}>
        <TouchableOpacity
          style={[commonStyles.button, themeDetailStyles.newCardButton]}
          onPress={() => setShowNewCardForm(true)}
        >
          <Text style={commonStyles.buttonText}>{t('cards.newCard')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[commonStyles.button, themeDetailStyles.practiceButton]}
          onPress={() => navigation.navigate('Practice', { themeId })}
        >
          <Text style={commonStyles.buttonWhiteText}>{t('common.practice')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ThemeDetailScreen; 