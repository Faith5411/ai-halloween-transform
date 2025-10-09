
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

export type Tier = 'basic' | 'pro' | 'magic';
