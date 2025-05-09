import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const themeDetailStyles = StyleSheet.create({
  listContainer: {
    paddingBottom: 100,
  },
  cardItem: {
    backgroundColor: colors.secondary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 4,
    shadowColor: colors.shadow,
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
    color: colors.text.primary,
  },
  description: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
  },
  bottomButtons: {
    padding:10,
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  newCardButton: {
    backgroundColor: colors.secondary,
    borderColor: colors.border,
    borderWidth: 2
  },
  practiceButton: {
    backgroundColor: colors.primary,
  },
}); 