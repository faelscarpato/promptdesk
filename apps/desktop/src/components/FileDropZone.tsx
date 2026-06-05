import React, { useState } from 'react';
import { Upload, File, Loader2 } from 'lucide-react';
import { open } from '@tauri-apps/api/dialog';
import { processFile } from '../lib/fileProcessor';
import { useAppStore } from '../store/appStore';

interface FileDropZoneProps {
  projectId: string;
}

export const FileDropZone: React.FC<FileDropZoneProps> = ({ projectId }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { addFileToProject } = useAppStore();

  const handlePickFile = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [{ name: 'Documentos', extensions: ['pdf', 'txt'] }]
      });

      if (selected && typeof selected === 'string') {
        setIsUploading(true);
        const fileContext = await processFile(selected);
        addFileToProject(projectId, fileContext);
      }
    } catch (error) {
      alert(`Erro ao carregar arquivo: ${error}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div 
      onClick={handlePickFile}
      className={`
        border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
        ${isUploading ? 'bg-slate-50 border-blue-200' : 'hover:bg-blue-50/50 hover:border-blue-300 border-slate-200'}
      `}
    >
      {isUploading ? (
        <div className="flex flex-col items-center">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
          <p className="font-medium text-slate-700">Extraindo texto do arquivo...</p>
          <p className="text-sm text-slate-400 mt-1">Isso pode levar alguns segundos.</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="bg-blue-50 p-4 rounded-full text-blue-600 mb-4">
            <Upload size={32} />
          </div>
          <p className="font-bold text-slate-700">Clique para selecionar ou arraste um arquivo</p>
          <p className="text-sm text-slate-400 mt-2">Suporta PDF e TXT (Máx 10MB)</p>
          
          <div className="mt-6 flex gap-3">
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">
              <File size={12} /> PDF
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">
              <File size={12} /> TXT
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
