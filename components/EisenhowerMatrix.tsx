import React from 'react';
import { Task } from '../types';
import { Trash2, AlertCircle, Clock, CheckCircle2, CircleDashed } from 'lucide-react';

interface EisenhowerMatrixProps {
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
}

const Quadrant: React.FC<{
  title: string;
  subtitle: string;
  tasks: Task[];
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  bgColor: string;
  borderColor: string;
  textColor: string;
  icon: React.ReactNode;
}> = ({ title, subtitle, tasks, onDelete, onEdit, bgColor, borderColor, textColor, icon }) => (
  <div className={`flex flex-col h-full rounded-2xl border-2 ${borderColor} ${bgColor} overflow-hidden`}>
    <div className={`px-4 py-3 border-b ${borderColor} flex justify-between items-center bg-white/50 backdrop-blur-sm`}>
      <div>
        <h3 className={`font-bold ${textColor} flex items-center gap-2`}>
          {icon}
          {title}
        </h3>
        <p className={`text-xs ${textColor} opacity-80 font-medium`}>{subtitle}</p>
      </div>
      <span className={`px-2 py-0.5 rounded-full text-xs font-bold bg-white/80 ${textColor}`}>
        {tasks.length}
      </span>
    </div>
    <div className="flex-1 p-3 overflow-y-auto space-y-2 no-scrollbar">
      {tasks.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-8 pointer-events-none select-none">
           <p className={`text-sm ${textColor}`}>無事項</p>
        </div>
      ) : (
        tasks.map((task) => (
          <div 
            key={task.id} 
            onClick={() => onEdit(task)}
            className="bg-white p-3 rounded-xl shadow-sm border border-black/5 hover:shadow-md transition-all group cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            title="點擊編輯"
          >
            <div className="flex justify-between items-start gap-2">
              <h4 className="font-semibold text-gray-800 text-sm leading-snug">{task.title}</h4>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500 font-medium flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-gray-300"></span>
              {new Date(task.deadline).toLocaleString('zh-TW', { 
                month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' 
              })}
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

export const EisenhowerMatrix: React.FC<EisenhowerMatrixProps> = ({ tasks, onDeleteTask, onEditTask }) => {
  // Filter tasks into quadrants
  const urgentImportant = tasks.filter(t => t.isUrgent && t.isImportant);
  const notUrgentImportant = tasks.filter(t => !t.isUrgent && t.isImportant);
  const urgentNotImportant = tasks.filter(t => t.isUrgent && !t.isImportant);
  const notUrgentNotImportant = tasks.filter(t => !t.isUrgent && !t.isImportant);

  return (
    <div className="h-full flex flex-col">
       {/* Axis Labels (Visual Guide) */}
       <div className="hidden md:flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest px-4 mb-2">
          <span>緊急 (Urgent)</span>
          <span>不緊急 (Not Urgent)</span>
       </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
        
        {/* Q1: Urgent & Important */}
        <Quadrant
          title="緊急且重要"
          subtitle="馬上做 (Do First)"
          tasks={urgentImportant}
          onDelete={onDeleteTask}
          onEdit={onEditTask}
          bgColor="bg-red-50"
          borderColor="border-red-200"
          textColor="text-red-800"
          icon={<AlertCircle className="w-4 h-4" />}
        />

        {/* Q2: Not Urgent & Important */}
        <Quadrant
          title="不緊急但重要"
          subtitle="計畫做 (Schedule)"
          tasks={notUrgentImportant}
          onDelete={onDeleteTask}
          onEdit={onEditTask}
          bgColor="bg-blue-50"
          borderColor="border-blue-200"
          textColor="text-blue-800"
          icon={<Clock className="w-4 h-4" />}
        />

        {/* Q3: Urgent & Not Important */}
        <Quadrant
          title="緊急但不重要"
          subtitle="授權做 (Delegate)"
          tasks={urgentNotImportant}
          onDelete={onDeleteTask}
          onEdit={onEditTask}
          bgColor="bg-orange-50"
          borderColor="border-orange-200"
          textColor="text-orange-800"
          icon={<CheckCircle2 className="w-4 h-4" />}
        />

        {/* Q4: Not Urgent & Not Important */}
        <Quadrant
          title="不緊急不重要"
          subtitle="改天做 (Eliminate)"
          tasks={notUrgentNotImportant}
          onDelete={onDeleteTask}
          onEdit={onEditTask}
          bgColor="bg-gray-100"
          borderColor="border-gray-200"
          textColor="text-gray-600"
          icon={<CircleDashed className="w-4 h-4" />}
        />
      </div>
      
      {/* Side Label (Visual Guide for Vertical Axis) - Absolute positioned for visual flair on desktop */}
      <div className="hidden md:block absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 origin-left text-xs font-bold text-gray-300 uppercase tracking-widest pointer-events-none">
        重要 (Important)
      </div>
    </div>
  );
};