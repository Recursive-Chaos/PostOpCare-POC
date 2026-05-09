import { Platform } from 'react-native';
import { HistoryEntry } from '../types';

// pe android merge pe 10.0.2.2:3001 care de fapt e localhost-ul din pc
export const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001';
export const dailyQuestionnaire = {
  status: 'Necompletat' as 'Necompletat' | 'Completat',
};

export const mockHistory: HistoryEntry[] = [
  { id: '1', day: '3', month: 'MAI', weekday: 'Duminica', pain: 4, painSeverity: 'low', temperatureC: 36.8 },
  { id: '2', day: '2', month: 'MAI', weekday: 'Sambata', pain: 5, painSeverity: 'moderate', temperatureC: 37.0 },
  { id: '3', day: '1', month: 'MAI', weekday: 'Vineri', pain: 9, painSeverity: 'high', temperatureC: 36.9 },
];
