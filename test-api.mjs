import { GoogleGenAI } from '@google/genai';

const apiKey = 'AIzaSyCQXupCZJcDaUCntfrVIoVlwCb0Q51e6q0';

console.log('🔑 Testing API Key...');
console.log('📝 API Key:', apiKey.substring(0, 20) + '...');

try {
  console.log('\n🚀 Initializing GoogleGenAI...');
  const ai = new GoogleGenAI({ apiKey });
  console.log('✅ GoogleGenAI initialized successfully');
  
  console.log('\n📤 Testing simple text generation...');
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-exp',
    contents: [{ parts: [{ text: 'Say hello in 3 words' }] }],
  });
  
  const text = response.text;
  console.log('✅ API Response:', text);
  console.log('\n🎉 SUCCESS! API key is working!');
  
} catch (error) {
  console.error('\n❌ ERROR:', error.message);
  console.error('❌ Full error:', error);
  
  if (error.message.includes('API key')) {
    console.error('\n⚠️ API KEY ISSUE: The key may be invalid or expired');
  } else if (error.message.includes('quota')) {
    console.error('\n⚠️ QUOTA ISSUE: You may have exceeded your API quota');
  } else if (error.message.includes('permission')) {
    console.error('\n⚠️ PERMISSION ISSUE: The API may not be enabled for this key');
  }
}
