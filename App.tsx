import React, { useState, useEffect, useCallback } from 'react';
import { Plus, LayoutGrid, Calendar as CalendarIcon, Sparkles, ListTodo, CalendarDays } from 'lucide-react';
import { Course, AIAnalysisResult, Task } from './types';
import { CourseForm } from './components/CourseForm';
import { TaskForm } from './components/TaskForm';
import { TimetableGrid } from './components/TimetableGrid';
import { EisenhowerMatrix } from './components/EisenhowerMatrix';
import { CalendarView } from './components/CalendarView';
import { AIAdvisor } from './components/AIAdvisor';
import { analyzeSchedule } from './services/geminiService';

type ViewMode = 'timetable' | 'tasks' | 'calendar';

const App: React.FC = () => {
  // --- State with Lazy Initialization (Read from LS immediately) ---
  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem('smart_schedule_courses');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse courses from local storage");
      return [];
    }
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('smart_schedule_tasks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse tasks from local storage");
      return [];
    }
  });

  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(() => {
    try {
      const saved = localStorage.getItem('smart_schedule_analysis');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  
  const [viewMode, setViewMode] = useState<ViewMode>('timetable');
  
  const [isCourseFormOpen, setIsCourseFormOpen] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // --- Persistence Effects (Write to LS on change) ---
  useEffect(() => {
    localStorage.setItem('smart_schedule_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('smart_schedule_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (analysisResult) {
      localStorage.setItem('smart_schedule_analysis', JSON.stringify(analysisResult));
    } else {
      localStorage.removeItem('smart_schedule_analysis');
    }
  }, [analysisResult]);

  // --- Handlers ---
  const handleAddCourse = (course: Course) => {
    setCourses(prev => [...prev, course]);
    setAnalysisResult(null); // Invalidate analysis when schedule changes
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    setAnalysisResult(null); // Invalidate analysis when schedule changes
  };

  const handleAddTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleAnalyze = useCallback(async () => {
    if (courses.length === 0) {
      alert("請先新增課程才能進行分析！");
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    try {
      const result = await analyzeSchedule(courses);
      if (result) {
        setAnalysisResult({
          summary: result.summary,
          heavyDays: result.heavyDays || [],
          suggestions: result.advice || []
        });
      }
    } catch (error: any) {
      alert(error.message || "分析失敗，請檢查 API Key");
    } finally {
      setIsAnalyzing(false);
    }
  }, [courses]);

  // --- Helper to open correct form based on view ---
  const handleOpenForm = () => {
    if (viewMode === 'timetable') {
      setIsCourseFormOpen(true);
    } else {
      setIsTaskFormOpen(true);
    }
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'timetable':
        return courses.length === 0 ? (
          <EmptyState 
             icon={<CalendarIcon className="w-20 h-20 text-gray-300" />}
             title="你的課表目前是空的"
             description="點擊右上角的「新增課程」按鈕開始規劃你的學期。"
             action={() => setIsCourseFormOpen(true)}
             actionText="新增課程"
          />
        ) : (
          <TimetableGrid courses={courses} onDeleteCourse={handleDeleteCourse} />
        );
      case 'tasks':
        return <EisenhowerMatrix tasks={tasks} onDeleteTask={handleDeleteTask} />;
      case 'calendar':
        return <CalendarView tasks={tasks} onDeleteTask={handleDeleteTask} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden font-sans">
      {/* Navbar */}
      <nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 z-20 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-brand-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-brand-200/50">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 hidden sm:block">
              SmartSchedule
            </h1>
          </div>
          
          {/* View Switcher */}
          <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[200px] sm:max-w-none">
            <button 
              onClick={() => setViewMode('timetable')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                viewMode === 'timetable' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              課表
            </button>
            <button 
              onClick={() => setViewMode('tasks')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                viewMode === 'tasks' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
            >
              <ListTodo className="w-4 h-4" />
              任務矩陣
            </button>
             <button 
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                viewMode === 'calendar' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              行事曆
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* AI Advisor Button (Only for Timetable currently) */}
          {viewMode === 'timetable' && (
            <button
              onClick={() => setIsAdvisorOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-full font-medium transition-all text-sm group border border-indigo-100"
            >
              <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">AI 顧問</span>
            </button>
          )}

          {/* Add Button (Context Aware) */}
          <button
            onClick={handleOpenForm}
            className={`flex items-center gap-2 px-4 py-2 text-white rounded-full font-medium shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none ${
              viewMode === 'timetable' 
                ? 'bg-brand-600 hover:bg-brand-700 shadow-brand-200' 
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
            }`}
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">
              {viewMode === 'timetable' ? '新增課程' : '新增事項'}
            </span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 overflow-hidden max-w-7xl mx-auto w-full relative">
        {renderContent()}
      </main>

      {/* Modals */}
      {isCourseFormOpen && (
        <CourseForm 
          onAddCourse={handleAddCourse} 
          onClose={() => setIsCourseFormOpen(false)} 
        />
      )}

      {isTaskFormOpen && (
        <TaskForm
          onAddTask={handleAddTask}
          onClose={() => setIsTaskFormOpen(false)}
        />
      )}

      <AIAdvisor 
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
        isLoading={isAnalyzing}
        analysis={analysisResult}
        onAnalyze={handleAnalyze}
      />
    </div>
  );
};

// Helper Component for Empty States
const EmptyState: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  action: () => void;
  actionText: string;
}> = ({ icon, title, description, action, actionText }) => (
  <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-500">
    <div className="w-48 h-48 bg-gray-100 rounded-full flex items-center justify-center mb-4">
       {icon}
    </div>
    <div className="space-y-2 max-w-md">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      <p className="text-gray-500">{description}</p>
    </div>
    <button
       onClick={action}
       className="px-6 py-3 bg-white border border-gray-200 hover:border-brand-500 hover:text-brand-600 text-gray-600 rounded-xl font-medium transition-all shadow-sm"
     >
       {actionText}
     </button>
 </div>
);

export default App;
