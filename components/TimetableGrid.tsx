import React from 'react';
import { Course, DayOfWeek } from '../types';
import { DAYS, DAY_LABELS, START_HOUR, END_HOUR } from '../constants';
import { Trash2 } from 'lucide-react';

interface TimetableGridProps {
  courses: Course[];
  onDeleteCourse: (id: string) => void;
}

export const TimetableGrid: React.FC<TimetableGridProps> = ({ courses, onDeleteCourse }) => {
  const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);

  // Helper to calculate position and height
  const getPositionStyle = (startTime: string, endTime: string) => {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    const startTotalMinutes = (startH - START_HOUR) * 60 + startM;
    const endTotalMinutes = (endH - START_HOUR) * 60 + endM;
    const durationMinutes = endTotalMinutes - startTotalMinutes;

    // Assuming 60px height per hour (matches the grid row height)
    const PIXELS_PER_MINUTE = 1; // 1px = 1min implies 60px per hour
    
    return {
      top: `${startTotalMinutes * PIXELS_PER_MINUTE}px`,
      height: `${durationMinutes * PIXELS_PER_MINUTE}px`,
    };
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* Header Row */}
      <div className="overflow-x-auto no-scrollbar bg-gray-50/80 backdrop-blur z-20 border-b border-gray-200">
        <div className="flex min-w-[800px]">
          <div className="w-16 flex-shrink-0 border-r border-gray-200 bg-white/50 sticky left-0 z-30"></div> {/* Time Label Column Header */}
          {DAYS.map((day) => (
            <div key={day} className="flex-1 py-3 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider min-w-[100px]">
              {DAY_LABELS[day]}
            </div>
          ))}
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-auto relative bg-white" style={{ minHeight: '600px' }}>
        <div className="flex relative min-w-[800px]" style={{ height: `${(END_HOUR - START_HOUR + 1) * 60}px` }}>
          
          {/* Time Labels Sidebar */}
          <div className="w-16 flex-shrink-0 border-r border-gray-100 bg-white z-10 sticky left-0 text-xs text-gray-400 font-medium select-none shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
            {hours.map((hour) => (
              <div key={hour} className="h-[60px] relative border-b border-gray-50">
                <span className="absolute -top-2.5 w-full text-center block">
                  {hour.toString().padStart(2, '0')}:00
                </span>
              </div>
            ))}
          </div>

          {/* Days Columns */}
          {DAYS.map((day, index) => (
            <div key={day} className={`flex-1 relative border-r border-gray-50 min-w-[100px] ${index === DAYS.length - 1 ? 'border-r-0' : ''}`}>
              {/* Grid Lines */}
              {hours.map((h) => (
                <div key={h} className="h-[60px] border-b border-gray-50/70 w-full" />
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
                      className={`absolute inset-x-1 rounded-lg border p-2 flex flex-col justify-between overflow-hidden group hover:z-20 transition-all hover:shadow-lg ${course.color} bg-opacity-90 backdrop-blur-sm cursor-pointer`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-xs leading-tight line-clamp-2">{course.name}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); onDeleteCourse(course.id); }}
                          className="opacity-0 group-hover:opacity-100 text-current hover:bg-black/10 rounded p-0.5 transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-[10px] opacity-90 truncate font-medium">
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
