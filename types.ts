
export interface UploadedFile {
  file: File;
  preview: string;
}

export interface NightmareOption {
  id: string;
  name: string;
  description: string;
  emoji: string;
  prompt: string;
}

export type Tier = 'free' | 'basic' | 'pro' | 'magic';
