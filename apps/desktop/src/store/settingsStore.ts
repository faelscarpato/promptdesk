import { create } from 'zustand';
import { LLMProvider } from '@core/types';

interface SettingsState {
  provider: LLMProvider;
  setProvider: (p: LLMProvider) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  provider: {
    baseUrl: 'https://api.openai.com/v1',
    apiKey: '',
    model: 'gpt-4o-mini',
  },
  setProvider: (p) => set({ provider: p }),
}));
