
export type Patient = {
  firstName: string;
  recoveryDay: number;
  surgeryType: string;
};

export type HistoryEntry = {
  id: string;
  day: string;
  month: string;
  weekday: string;
  pain: number;
  painSeverity: 'low' | 'moderate' | 'high';
  temperatureC: number;
};
