import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme } from '../types';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';

export const themeService = {
  async getThemes(): Promise<Theme[]>{
    try {
      const storedThemes = await AsyncStorage.getItem('themes');
      return storedThemes ? JSON.parse(storedThemes) : [];
    } catch (error) {
      console.error('Error al cargar los temas:', error);
      return [];
    }
  },

  async saveThemes(themes: Theme[]): Promise<void> {
    try {
      await AsyncStorage.setItem('themes', JSON.stringify(themes));
    } catch (error) {
      console.error('Error al guardar los temas:', error);
    }
  },

  async addTheme(name: string): Promise<Theme | null> {
    try {
      const themes = await this.getThemes();
      const newTheme: Theme = {
        id: uuidv4(),
        name: name.trim(),
        cards: []
      };
      
      const updatedThemes = [...themes, newTheme];
      await this.saveThemes(updatedThemes);
      return newTheme;
    } catch (error) {
      console.error('Error al añadir el tema:', error);
      return null;
    }
  },

  async deleteTheme(themeId: string): Promise<boolean> {
    try {
      const themes = await this.getThemes();
      const updatedThemes = themes.filter(theme => theme.id !== themeId);
      await this.saveThemes(updatedThemes);
      await AsyncStorage.removeItem(`cards_${themeId}`);
      return true;
    } catch (error) {
      console.error('Error al eliminar el tema:', error);
      return false;
    }
  },

  async updateTheme(themeId: string, newName: string): Promise<boolean> {
    try {
      const themes = await this.getThemes();
      const updatedThemes = themes.map(theme => 
        theme.id === themeId ? { ...theme, name: newName.trim() } : theme
      );
      await this.saveThemes(updatedThemes);
      return true;
    } catch (error) {
      console.error('Error al actualizar el tema:', error);
      return false;
    }
  }
}; 