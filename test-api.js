import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyCQXupCZJcDaUCntfrVIoVlwCb0Q51e6q0';
console.log('API Key loaded:', apiKey ? 'YES' : 'NO');
console.log('API Key (first 20 chars):', apiKey.substring(0, 20) + '...');

const ai = new GoogleGenAI({ apiKey });
console.log('GoogleGenAI initialized successfully');

