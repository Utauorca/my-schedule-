import { DayOfWeek } from "./types";

export const DAYS: DayOfWeek[] = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export const DAY_LABELS: Record<DayOfWeek, string> = {
  'Monday': '週一',
  'Tuesday': '週二',
  'Wednesday': '週三',
  'Thursday': '週四',
  'Friday': '週五',
  'Saturday': '週六',
  'Sunday': '週日',
};

export const COLORS = [
  'bg-red-100 border-red-300 text-red-800',
  'bg-orange-100 border-orange-300 text-orange-800',
  'bg-amber-100 border-amber-300 text-amber-800',
  'bg-green-100 border-green-300 text-green-800',
  'bg-emerald-100 border-emerald-300 text-emerald-800',
  'bg-teal-100 border-teal-300 text-teal-800',
  'bg-cyan-100 border-cyan-300 text-cyan-800',
  'bg-blue-100 border-blue-300 text-blue-800',
  'bg-indigo-100 border-indigo-300 text-indigo-800',
  'bg-violet-100 border-violet-300 text-violet-800',
  'bg-purple-100 border-purple-300 text-purple-800',
  'bg-fuchsia-100 border-fuchsia-300 text-fuchsia-800',
  'bg-pink-100 border-pink-300 text-pink-800',
  'bg-rose-100 border-rose-300 text-rose-800',
];

export const START_HOUR = 7; // 7 AM
export const END_HOUR = 22;   // 10 PM