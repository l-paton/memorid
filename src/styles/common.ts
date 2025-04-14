import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.text.primary,
  },
  inputContainer: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    backgroundColor: colors.white,
  },
  buttonRow: {
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
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: colors.secondary,
  },
  cancelButton: {
    backgroundColor: colors.danger,
  },
  deleteButton: {
    backgroundColor: colors.danger,
    padding: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  languageSelector: {
    width: 80,
    marginRight: 10,
  },
  picker: {
    height: 40,
    width: '100%',
  },
}); 