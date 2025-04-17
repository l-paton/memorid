import AsyncStorage from '@react-native-async-storage/async-storage';

export const statService = {
    async getStats(): Promise<{ [key: string]: { correct: number; total: number } }> {
        try {
            const storedStats = await AsyncStorage.getItem('card_stats');
            return storedStats ? JSON.parse(storedStats) : {};
        } catch (error) {
            console.error('Error al cargar las estadísticas:', error);
            return {};
        }
    },

    async saveStats(stats: { [key: string]: { correct: number; total: number } }): Promise<void> {
        try {
            await AsyncStorage.setItem('card_stats', JSON.stringify(stats));
        } catch (error) {
            console.error('Error al guardar las estadísticas:', error);
        }
    },

    async updateCardStats(cardId: string, isCorrect: boolean): Promise<void> {
        try {
            const stats = await this.getStats();

            if (!stats[cardId]) {
                stats[cardId] = { correct: 0, total: 0 };
            }

            stats[cardId].total++;
            
            if (isCorrect) {
                stats[cardId].correct++;
            }

            await this.saveStats(stats);
        } catch (error) {
            console.error('Error al actualizar las estadísticas:', error);
        }
    },

    async getSuccessRate(cardId: string): Promise<number> {
        try {
            const stats = await this.getStats();
            if (!stats[cardId] || stats[cardId].total === 0) return 0;
            return Math.round((stats[cardId].correct / stats[cardId].total) * 100);
        } catch (error) {
            console.error('Error al obtener la tasa de éxito:', error);
            return 0;
        }
    }
}
