import { GoogleGenAI, Modality } from '@google/genai';
import fs from 'fs';

const apiKey = 'AIzaSyCQXupCZJcDaUCntfrVIoVlwCb0Q51e6q0';

console.log('🎨 Testing Gemini Image Generation...');

try {
  const ai = new GoogleGenAI({ apiKey });
  
  console.log('\n📤 Testing image generation from text prompt...');
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: [{
      parts: [{ text: 'Generate a simple red circle on white background' }]
    }],
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });
  
  console.log('✅ Response received');
  console.log('📦 Response candidates:', response.candidates?.length || 0);
  
  if (response.candidates && response.candidates[0]) {
    const parts = response.candidates[0].content.parts;
    console.log('📦 Parts in response:', parts?.length || 0);
    
    for (const part of parts) {
      if (part.inlineData) {
        console.log('✅ Image generated successfully!');
        console.log('📏 Image size:', part.inlineData.data.length, 'characters');
        console.log('🖼️ MIME type:', part.inlineData.mimeType);
        console.log('\n🎉 IMAGE GENERATION WORKS!');
        process.exit(0);
      }
    }
    
    console.log('⚠️ No image data in response');
    console.log('📄 Response text:', response.text || 'none');
  }
  
} catch (error) {
  console.error('\n❌ ERROR:', error.message);
  console.error('\n❌ Full error:', error);
  
  if (error.message.includes('model')) {
    console.error('\n⚠️ MODEL ISSUE: gemini-2.5-flash-image may not be available');
    console.error('💡 Try using gemini-2.0-flash-thinking-exp instead');
  }
}
