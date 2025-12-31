import React, { useState } from 'react';
import { X, Cloud, Save, Database, AlertCircle, Copy } from 'lucide-react';
import { UserSettings } from '../types';

interface SettingsModalProps {
  currentSettings: UserSettings | null;
  onSave: (settings: UserSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ currentSettings, onSave, onClose }) => {
  const [url, setUrl] = useState(currentSettings?.supabaseUrl || '');
  const [key, setKey] = useState(currentSettings?.supabaseKey || '');
  const [syncId, setSyncId] = useState(currentSettings?.syncId || crypto.randomUUID());
  const [showTutorial, setShowTutorial] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      supabaseUrl: url.trim(),
      supabaseKey: key.trim(),
      syncId: syncId.trim(),
    });
    onClose();
  };

  const copySQL = () => {
    const sql = `create table user_data (
  id text primary key,
  content jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);
alter table user_data enable row level security;
create policy "Public Access" on user_data for all using (true);`;
    navigator.clipboard.writeText(sql);
    alert("SQL 已複製！請至 Supabase SQL Editor 執行。");
  };

  return (
    <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Cloud className="w-5 h-5 text-indigo-600" />
            雲端同步設定 (Supabase)
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="settings-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Tutorial Toggle */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm text-blue-800 font-medium">
                    想要跨平台使用？請連接免費的 Supabase 資料庫。
                  </p>
                  <button 
                    type="button" 
                    onClick={() => setShowTutorial(!showTutorial)}
                    className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-200 transition-colors font-semibold"
                  >
                    {showTutorial ? '隱藏教學' : '教我如何設定'}
                  </button>
                </div>
              </div>

              {showTutorial && (
                <div className="mt-4 pt-4 border-t border-blue-200 text-sm text-blue-900 space-y-3">
                  <ol className="list-decimal list-inside space-y-1 ml-1">
                    <li>前往 <a href="https://supabase.com" target="_blank" className="underline font-bold">supabase.com</a> 註冊並建立一個新專案 (Project)。</li>
                    <li>進入專案後，點選左側選單的 <strong>SQL Editor</strong>。</li>
                    <li>
                      複製下方 SQL 語法，貼上並點擊 <strong>Run</strong> 以建立資料表：
                      <div className="relative mt-2">
                        <pre className="bg-slate-800 text-slate-200 p-3 rounded-lg text-xs overflow-x-auto font-mono">
{`create table user_data (
  id text primary key,
  content jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);
alter table user_data enable row level security;
create policy "Public Access" on user_data for all using (true);`}
                        </pre>
                        <button type="button" onClick={copySQL} className="absolute top-2 right-2 p-1.5 bg-white/10 hover:bg-white/20 rounded text-white" title="複製 SQL">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                    <li>完成後，點選左側選單的 <strong>Project Settings (齒輪)</strong> &rarr; <strong>API</strong>。</li>
                    <li>將 <strong>Project URL</strong> 和 <strong>anon / public Key</strong> 複製到下方欄位。</li>
                  </ol>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Project URL (Supabase URL)</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://your-project.supabase.co"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-mono text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Project API Key (anon / public)</label>
                <input
                  type="password"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-mono text-sm"
                />
              </div>

              <div className="space-y-1.5 pt-4 border-t border-gray-100">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                   同步 ID (Sync ID)
                   <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">重要</span>
                </label>
                <p className="text-xs text-gray-500 mb-2">在所有裝置上輸入相同的 ID 即可同步資料。</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={syncId}
                    onChange={(e) => setSyncId(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-mono text-sm bg-gray-50"
                  />
                  <button 
                    type="button" 
                    onClick={() => setSyncId(crypto.randomUUID())}
                    className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-xl transition-colors font-medium text-gray-700"
                  >
                    產生新 ID
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-200 transition-colors"
          >
            取消
          </button>
          <button 
            type="submit" 
            form="settings-form"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            儲存設定
          </button>
        </div>
      </div>
    </div>
  );
};
