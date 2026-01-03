import React from 'react';
import { Course } from '../types';
import { DAYS, DAY_LABELS, START_HOUR, END_HOUR } from '../constants';
import { Trash2 } from 'lucide-react';

interface TimetableGridProps {
  courses: Course[];
  onDeleteCourse: (id: string) => void;
  onEditCourse: (course: Course) => void;
}

export const TimetableGrid: React.FC<TimetableGridProps> = ({ courses, onDeleteCourse, onEditCourse }) => {
  const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);

  // Helper to calculate position and height
  const getPositionStyle = (startTime: string, endTime: string) => {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    const startTotalMinutes = (startH - START_HOUR) * 60 + startM;
    const endTotalMinutes = (endH - START_HOUR) * 60 + endM;
    const durationMinutes = endTotalMinutes - startTotalMinutes;

    // Assuming 60px height per hour
    const PIXELS_PER_MINUTE = 1; 
    
    return {
      top: `${startTotalMinutes * PIXELS_PER_MINUTE}px`,
      height: `${durationMinutes * PIXELS_PER_MINUTE}px`,
    };
  };

  return (
    <div className="h-full overflow-auto bg-white rounded-2xl shadow-sm border border-gray-300 relative">
      <div className="min-w-[800px] relative">
        
        {/* Sticky Header Row */}
        <div className="sticky top-0 z-40 flex border-b border-gray-300 bg-gray-100 shadow-sm">
          {/* Top-Left Corner (Sticky both ways) */}
          <div className="w-16 flex-shrink-0 border-r border-gray-300 bg-gray-100 sticky left-0 z-50"></div>
          
          {/* Day Headers */}
          {DAYS.map((day) => (
            <div key={day} className="flex-1 py-3 text-center text-sm font-bold text-gray-800 uppercase tracking-wider min-w-[100px] bg-gray-100">
              {DAY_LABELS[day]}
            </div>
          ))}
        </div>

        {/* Main Grid Content - Added mt-6 to prevent first label clipping */}
        <div className="flex relative mt-6" style={{ height: `${(END_HOUR - START_HOUR + 1) * 60}px` }}>
          
          {/* Sticky Time Labels Column */}
          <div className="w-16 flex-shrink-0 border-r border-gray-300 bg-gray-50 z-30 sticky left-0 select-none">
            {hours.map((hour) => (
              <div key={hour} className="h-[60px] relative border-b border-gray-300">
                <span className="absolute -top-3 w-full text-center block text-xs font-semibold text-gray-500 bg-gray-50 py-1">
                  {hour.toString().padStart(2, '0')}:00
                </span>
              </div>
            ))}
          </div>

          {/* Days Columns */}
          {DAYS.map((day, index) => (
            <div key={day} className={`flex-1 relative border-r border-gray-300 min-w-[100px] ${index === DAYS.length - 1 ? 'border-r-0' : ''}`}>
              
              {/* Horizontal Grid Lines */}
              {hours.map((h) => (
                <div key={h} className="h-[60px] border-b border-gray-300 w-full" />
              ))}

              {/* Course Blocks */}
              {courses
                .filter((c) => c.day === day)
                .map((course) => {
                  const style = getPositionStyle(course.startTime, course.endTime);
                  return (
                    <div
                      key={course.id}
                      style={style}
                      onClick={() => onEditCourse(course)}
                      className={`absolute inset-x-1 rounded-lg border p-2 flex flex-col justify-between overflow-hidden group hover:z-20 transition-all hover:shadow-lg ${course.color} bg-opacity-90 backdrop-blur-sm cursor-pointer border-black/10`}
                      title="點擊編輯課程"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-xs leading-tight line-clamp-2 text-black/80">{course.name}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); onDeleteCourse(course.id); }}
                          className="opacity-0 group-hover:opacity-100 text-current hover:bg-black/10 rounded p-0.5 transition-all"
                          title="刪除課程"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-[10px] opacity-90 truncate font-medium text-black/70">
                        {course.location && <span className="block">{course.location}</span>}
                        <span>{course.startTime} - {course.endTime}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};