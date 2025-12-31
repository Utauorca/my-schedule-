export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface Course {
  id: string;
  name: string;
  location: string;
  day: DayOfWeek;
  startTime: string; // Format "HH:mm"
  endTime: string;   // Format "HH:mm"
  color: string;
}

export interface Task {
  id: string;
  title: string;
  deadline: string; // ISO Date string or "YYYY-MM-DDTHH:mm"
  isUrgent: boolean;
  isImportant: boolean;
}

export interface AIAnalysisResult {
  summary: string;
  heavyDays: string[];
  suggestions: string[];
}
