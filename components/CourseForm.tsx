import React, { useState } from 'react';
import { Plus, X, Clock, MapPin, BookOpen, PenLine } from 'lucide-react';
import { Course, DayOfWeek } from '../types';
import { COLORS, DAYS, DAY_LABELS } from '../constants';

interface CourseFormProps {
  onSave: (course: Course) => void;
  onClose: () => void;
  initialData?: Course | null;
}

export const CourseForm: React.FC<CourseFormProps> = ({ onSave, onClose, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [day, setDay] = useState<DayOfWeek>(initialData?.day || 'Monday');
  const [startTime, setStartTime] = useState(initialData?.startTime || '09:00');
  const [endTime, setEndTime] = useState(initialData?.endTime || '10:00');
  const [color, setColor] = useState(initialData?.color || COLORS[Math.floor(Math.random() * COLORS.length)]);

  const isEditing = !!initialData;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !startTime || !endTime) return;

    const courseData: Course = {
      id: initialData?.id || crypto.randomUUID(), // Keep ID if editing, generate new if adding
      name,
      location,
      day,
      startTime,
      endTime,
      color,
    };

    onSave(courseData);
    onClose();
  };

  return (
    <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            {isEditing ? (
              <PenLine className="w-5 h-5 text-brand-600" />
            ) : (
              <Plus className="w-5 h-5 text-brand-600" />
            )}
            {isEditing ? '編輯課程' : '新增課程'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-gray-400" />
              課程名稱
            </label>
            <input
              type="text"
              required
              placeholder="例如：微積分 (一)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Location Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gray-400" />
              地點 (選填)
            </label>
            <input
              type="text"
              placeholder="例如：博雅 101"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             {/* Day Select */}
            <div className="col-span-2 space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">星期</label>
              <div className="grid grid-cols-5 gap-2">
                {DAYS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDay(d)}
                    className={`py-2 text-sm rounded-lg border transition-all ${
                      day === d 
                        ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-200' 
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {/* Take the last character: 星期一 -> 一 */}
                    {DAY_LABELS[d].slice(-1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Inputs */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gray-400" />
                開始時間
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gray-400" />
                結束時間
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
              />
            </div>
          </div>

          {/* Color Picker */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">標籤顏色</label>
            <div className="flex flex-wrap gap-3 p-2 bg-gray-50 rounded-xl">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full cursor-pointer transition-transform hover:scale-110 ring-2 ring-offset-2 ${c.split(' ')[0]} ${
                    color === c ? 'ring-gray-400 scale-110' : 'ring-transparent'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium shadow-lg shadow-brand-200 transition-all active:scale-[0.98] mt-2"
          >
            {isEditing ? '更新課程資訊' : '加入課表'}
          </button>
        </form>
      </div>
    </div>
  );
};