import { GoogleGenAI } from '@google/genai';

const apiKey = 'AIzaSyCQXupCZJcDaUCntfrVIoVlwCb0Q51e6q0';

console.log('🔍 Checking API Status...\n');

try {
  const ai = new GoogleGenAI({ apiKey });
  
  // Try a very simple, low-quota request
  console.log('📤 Attempting minimal text request...');
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-exp',
    contents: [{ parts: [{ text: 'Hi' }] }],
  });
  
  console.log('✅ TEXT API WORKS!');
  console.log('Response:', response.text);
  
  console.log('\n📤 Now trying IMAGE model (gemini-2.5-flash-image)...');
  
  const imageResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: [{ parts: [{ text: 'Hello' }] }],
    config: { responseModalities: ['IMAGE'] },
  });
  
  console.log('✅ IMAGE API WORKS TOO!');
  
} catch (error) {
  console.error('❌ ERROR:', error.status, error.message);
  
  if (error.message.includes('quota')) {
    console.log('\n⚠️ QUOTA ISSUE CONFIRMED');
    console.log('\nPossible reasons:');
    console.log('1. The IMAGE model has separate, stricter quotas');
    console.log('2. There might be a per-model quota you hit');
    console.log('3. The gemini-2.5-flash-image model might be in limited preview');
    console.log('\n💡 TIP: Try using a different model that supports images');
  }
  
  if (error.message.includes('limit: 0')) {
    console.log('\n⚠️ CRITICAL: Quota limit shows as 0');
    console.log('This means the model may not be available in free tier');
    console.log('or requires billing to be enabled.');
  }
}
