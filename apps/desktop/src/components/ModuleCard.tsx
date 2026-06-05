import React from 'react';
import { GripVertical, Trash2, ChevronDown } from 'lucide-react';
import { PromptModule } from "@core/types";

interface ModuleCardProps {
  module: PromptModule;
  onRemove: () => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ module, onRemove }) => {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden group">
      <div className="flex items-center p-4">
        <div className="cursor-grab text-slate-300 hover:text-slate-500 mr-3">
          <GripVertical size={20} />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {module.category}
            </span>
            <h4 className="font-bold text-slate-800 dark:text-white">{module.label}</h4>
          </div>
          <p className="text-sm text-slate-500 line-clamp-1">{module.instruction}</p>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
            <ChevronDown size={18} />
          </button>
          <button 
            onClick={onRemove}
            className="p-2 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-600"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Variáveis (se houver) */}
      {module.variables.length > 0 && (
        <div className="px-12 pb-4 flex flex-wrap gap-3">
          {module.variables.map(variable => (
            <div key={variable} className="flex-1 min-w-[150px]">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">
                {variable}
              </label>
              <input 
                placeholder={`Valor para ${variable}...`}
                className="w-full text-xs border-slate-200 rounded-md bg-slate-50 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
