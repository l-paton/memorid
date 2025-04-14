export interface Card {
  id: string;
  word: string;
  description: string;
  themeId: string;
}

export interface Theme {
  id: string;
  name: string;
  cards: Card[];
}

export type RootStackParamList = {
  Home: undefined;
  ThemeDetail: { themeId: string };
  Practice: { themeId?: string };
};
  