import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Task } from '../types';

interface CalendarViewProps {
  tasks: Task[];
  onDeleteTask: (id: string) => void;
}

const getTaskColor = (task: Task) => {
  if (task.isUrgent && task.isImportant) return 'bg-red-100 text-red-800 border-red-200';
  if (!task.isUrgent && task.isImportant) return 'bg-blue-100 text-blue-800 border-blue-200';
  if (task.isUrgent && !task.isImportant) return 'bg-orange-100 text-orange-800 border-orange-200';
  return 'bg-gray-100 text-gray-700 border-gray-200';
};

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onDeleteTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Navigation
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const today = () => setCurrentDate(new Date());

  // Days calculations
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
  
  // Adjust so Monday is 0? Let's stick to standard Sunday = 0 for Calendar view typically
  // But our app considers Monday as start. Let's make Monday first column.
  const startDayOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Mon=0, Sun=6

  const days = [];
  // Empty slots for previous month
  for (let i = 0; i < startDayOffset; i++) {
    days.push(null);
  }
  // Days of current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  const weekDays = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      const d = new Date(task.deadline);
      return (
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear()
      );
    });
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50/50">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-indigo-600" />
          {year}年 {month + 1}月
        </h2>
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
          <button onClick={prevMonth} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button onClick={today} className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
            今天
          </button>
          <button onClick={nextMonth} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Grid Header */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {weekDays.map((day, idx) => (
          <div key={idx} className={`py-2 text-center text-xs font-semibold text-gray-500 uppercase ${idx >= 5 ? 'text-red-400' : ''}`}>
            {day}
          </div>
        ))}
      </div>

      {/* Grid Days */}
      <div className="flex-1 grid grid-cols-7 grid-rows-5 md:grid-rows-6 auto-rows-fr">
        {days.map((date, idx) => {
          if (!date) {
            return <div key={`empty-${idx}`} className="bg-gray-50/30 border-b border-r border-gray-100"></div>;
          }

          const dayTasks = getTasksForDate(date);
          const isToday = new Date().toDateString() === date.toDateString();

          return (
            <div 
              key={date.toISOString()} 
              className={`border-b border-r border-gray-100 p-2 flex flex-col gap-1 transition-colors hover:bg-gray-50 min-h-[80px] ${isToday ? 'bg-indigo-50/30' : ''}`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white' : 'text-gray-700'}`}>
                  {date.getDate()}
                </span>
                {dayTasks.length > 0 && (
                   <span className="text-[10px] font-bold text-gray-400">{dayTasks.length} 事項</span>
                )}
              </div>
              
              <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                {dayTasks.map(task => (
                  <div 
                    key={task.id}
                    className={`text-[10px] px-1.5 py-0.5 rounded border truncate ${getTaskColor(task)}`}
                    title={`${task.title} - ${new Date(task.deadline).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
                  >
                    {task.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {/* Fill remaining cells to complete the grid visually if needed, but flex grid handles it okay */}
      </div>
    </div>
  );
};
