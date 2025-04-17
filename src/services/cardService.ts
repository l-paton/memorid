import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from '../types';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';

export const cardService = {
  async getCards(themeId: string): Promise<Card[]> {
    try {
      const storedCards = await AsyncStorage.getItem(`cards_${themeId}`);
      return storedCards ? JSON.parse(storedCards) : [];
    } catch (error) {
      console.error('Error al cargar las tarjetas:', error);
      return [];
    }
  },

  async saveCards(themeId: string, cards: Card[]): Promise<void> {
    try {
      await AsyncStorage.setItem(`cards_${themeId}`, JSON.stringify(cards));
    } catch (error) {
      console.error('Error al guardar las tarjetas:', error);
    }
  },

  async addCard(themeId: string, word: string, description: string): Promise<Card | null> {
    try {
      const cards = await this.getCards(themeId);
      const newCard: Card = {
        id: uuidv4(),
        word: word.trim(),
        description: description.trim(),
        themeId
      };
      
      const updatedCards = [...cards, newCard];
      await this.saveCards(themeId, updatedCards);
      return newCard;
    } catch (error) {
      console.error('Error al añadir la tarjeta:', error);
      return null;
    }
  },

  async deleteCard(themeId: string, cardId: string): Promise<boolean> {
    try {
      const cards = await this.getCards(themeId);
      const updatedCards = cards.filter(card => card.id !== cardId);
      await this.saveCards(themeId, updatedCards);
      return true;
    } catch (error) {
      console.error('Error al eliminar la tarjeta:', error);
      return false;
    }
  }
}; 