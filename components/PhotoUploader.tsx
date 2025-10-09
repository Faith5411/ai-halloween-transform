
import React from 'react';
import type { UploadedFile } from '../types';
import { UploadIcon, TrashIcon } from './Icons';

interface PhotoUploaderProps {
  file: UploadedFile | null;
  onFileChange: (file: File | null) => void;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ file, onFileChange }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileChange(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      onFileChange(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="bg-black/20 p-4 rounded-xl card-glow-border h-full">
      <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
        <UploadIcon className="w-6 h-6 text-purple-400" />
        Upload Your Photo
      </h2>
      <div
        className="relative w-full h-[480px] border-2 border-dashed border-purple-600/50 rounded-lg bg-black/20 hover:border-purple-400 transition-colors flex flex-col items-center justify-center p-4 text-center group cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => !file && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={handleFileSelect}
        />
        {file ? (
          <div className="relative w-full h-full">
            <img src={file.preview} alt="Upload preview" className="w-full h-full object-cover rounded-md" />
            <button
              onClick={() => onFileChange(null)}
              className="absolute top-2 right-2 p-1.5 bg-red-600/80 hover:bg-red-700 rounded-full text-white transition-colors"
              aria-label="Remove photo"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <>
            <UploadIcon className="w-12 h-12 text-purple-400 mb-4" />
            <p className="font-semibold text-white">Click or drag & drop to upload</p>
          </>
        )}
      </div>
      <div className="mt-3 text-center">
         <button
          onClick={() => inputRef.current?.click()}
          className="w-full max-w-[200px] bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
         >
           {file ? 'Choose another' : 'Choose File'}
         </button>
         <p className="text-xs text-purple-400 mt-2">Max 10MB • JPG, PNG</p>
      </div>
    </div>
  );
};

export default PhotoUploader;
