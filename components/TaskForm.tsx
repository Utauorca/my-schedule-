import React, { useState } from 'react';
import { Plus, X, CalendarClock, AlertCircle, Clock, CheckCircle2, CircleDashed } from 'lucide-react';
import { Task } from '../types';

interface TaskFormProps {
  onAddTask: (task: Task) => void;
  onClose: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onAddTask, onClose }) => {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isUrgent, setIsUrgent] = useState(true);
  const [isImportant, setIsImportant] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !deadline) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      deadline,
      isUrgent,
      isImportant,
    };

    onAddTask(newTask);
    onClose();
  };

  const setType = (urgent: boolean, important: boolean) => {
    setIsUrgent(urgent);
    setIsImportant(important);
  };

  return (
    <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-600" />
            新增代辦事項
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">事項名稱</label>
            <input
              type="text"
              required
              placeholder="例如：完成期末報告"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Deadline Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              <CalendarClock className="w-4 h-4 text-gray-400" />
              截止時間
            </label>
            <input
              type="datetime-local"
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            />
          </div>

          {/* Matrix Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">優先級分類</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType(true, true)}
                className={`p-3 rounded-xl border-2 text-left transition-all relative overflow-hidden group ${
                  isUrgent && isImportant 
                    ? 'border-red-500 bg-red-50 text-red-800' 
                    : 'border-gray-100 hover:border-red-200 text-gray-600'
                }`}
              >
                <div className="font-bold flex items-center gap-2 mb-1">
                  <AlertCircle className={`w-4 h-4 ${isUrgent && isImportant ? 'text-red-600' : 'text-gray-400'}`} />
                  緊急且重要
                </div>
                <div className="text-xs opacity-80">馬上處理 (Do First)</div>
                {isUrgent && isImportant && <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></div>}
              </button>

              <button
                type="button"
                onClick={() => setType(false, true)}
                className={`p-3 rounded-xl border-2 text-left transition-all relative overflow-hidden group ${
                  !isUrgent && isImportant 
                    ? 'border-blue-500 bg-blue-50 text-blue-800' 
                    : 'border-gray-100 hover:border-blue-200 text-gray-600'
                }`}
              >
                <div className="font-bold flex items-center gap-2 mb-1">
                  <Clock className={`w-4 h-4 ${!isUrgent && isImportant ? 'text-blue-600' : 'text-gray-400'}`} />
                  不緊急但重要
                </div>
                <div className="text-xs opacity-80">排程計畫 (Schedule)</div>
                {!isUrgent && isImportant && <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full"></div>}
              </button>

              <button
                type="button"
                onClick={() => setType(true, false)}
                className={`p-3 rounded-xl border-2 text-left transition-all relative overflow-hidden group ${
                  isUrgent && !isImportant 
                    ? 'border-orange-500 bg-orange-50 text-orange-800' 
                    : 'border-gray-100 hover:border-orange-200 text-gray-600'
                }`}
              >
                <div className="font-bold flex items-center gap-2 mb-1">
                  <CheckCircle2 className={`w-4 h-4 ${isUrgent && !isImportant ? 'text-orange-600' : 'text-gray-400'}`} />
                  緊急但不重要
                </div>
                <div className="text-xs opacity-80">授權/委派 (Delegate)</div>
                {isUrgent && !isImportant && <div className="absolute top-2 right-2 w-3 h-3 bg-orange-500 rounded-full"></div>}
              </button>

              <button
                type="button"
                onClick={() => setType(false, false)}
                className={`p-3 rounded-xl border-2 text-left transition-all relative overflow-hidden group ${
                  !isUrgent && !isImportant 
                    ? 'border-gray-400 bg-gray-100 text-gray-800' 
                    : 'border-gray-100 hover:border-gray-300 text-gray-600'
                }`}
              >
                <div className="font-bold flex items-center gap-2 mb-1">
                  <CircleDashed className={`w-4 h-4 ${!isUrgent && !isImportant ? 'text-gray-600' : 'text-gray-400'}`} />
                  不緊急不重要
                </div>
                <div className="text-xs opacity-80">改天再做 (Eliminate)</div>
                {!isUrgent && !isImportant && <div className="absolute top-2 right-2 w-3 h-3 bg-gray-400 rounded-full"></div>}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
          >
            加入代辦事項
          </button>
        </form>
      </div>
    </div>
  );
};
