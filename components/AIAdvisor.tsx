import React from 'react';
import { Sparkles, X, BrainCircuit, AlertTriangle, Lightbulb } from 'lucide-react';
import { AIAnalysisResult } from '../types';

interface AIAdvisorProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  analysis: AIAnalysisResult | null;
  onAnalyze: () => void;
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ isOpen, onClose, isLoading, analysis, onAnalyze }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" onClick={onClose}></div>
      
      {/* Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-indigo-600 to-purple-700 text-white flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-300" />
              AI 課表顧問
            </h2>
            <p className="text-indigo-100 text-sm mt-1">由 Gemini 提供即時課表健檢</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-6">
          
          {/* Empty State / Call to Action */}
          {!analysis && !isLoading && (
            <div className="text-center py-10 space-y-4">
              <div className="bg-white p-4 rounded-full inline-block shadow-sm">
                <BrainCircuit className="w-12 h-12 text-indigo-500" />
              </div>
              <p className="text-gray-600">
                點擊下方按鈕，讓 AI 分析你的時間安排、<br/>找出空堂並提供學習建議。
              </p>
              <button 
                onClick={onAnalyze}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
              >
                <Sparkles className="w-4 h-4" />
                開始分析
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 space-y-4 text-indigo-600">
               <div className="relative">
                 <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                 <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-indigo-600 animate-pulse" />
               </div>
               <p className="font-medium animate-pulse">正在研讀你的課表...</p>
            </div>
          )}

          {/* Result State */}
          {analysis && !isLoading && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Summary Card */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-indigo-50">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-indigo-500" />
                  整體分析
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {analysis.summary}
                </p>
              </div>

              {/* Heavy Days */}
              {analysis.heavyDays && analysis.heavyDays.length > 0 && (
                <div className="bg-orange-50 p-5 rounded-xl border border-orange-100">
                  <h3 className="text-lg font-bold text-orange-800 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    繁忙預警
                  </h3>
                  <ul className="space-y-2">
                    {analysis.heavyDays.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-orange-700">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggestions */}
              <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100">
                 <h3 className="text-lg font-bold text-emerald-800 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    學習建議
                  </h3>
                  <ul className="space-y-3">
                    {analysis.suggestions.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-emerald-700">
                        <span className="mt-1 w-5 h-5 bg-emerald-200 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                          {i + 1}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
              </div>

               <button 
                onClick={onAnalyze}
                className="w-full py-3 bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                重新分析
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
