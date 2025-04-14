import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const homeStyles = StyleSheet.create({
  listContainer: {
    paddingBottom: 100,
  },
  themeCard: {
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
  themeContent: {
    flex: 1,
  },
  themeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  cardCount: {
    fontSize: 12,
    color: colors.text.light,
    marginTop: 4,
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  newThemeButton: {
    backgroundColor: colors.secondary,
  },
  practiceButton: {
    backgroundColor: colors.primary,
  },
}); 