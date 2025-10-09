import { GoogleGenAI, Modality } from '@google/genai';

const apiKey = 'AIzaSyCQXupCZJcDaUCntfrVIoVlwCb0Q51e6q0';

console.log('🔄 Testing API NOW...\n');

try {
  const ai = new GoogleGenAI({ apiKey });
  
  console.log('📤 Attempting image generation with gemini-2.5-flash-image...');
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: [{
      parts: [{ text: 'Generate a small red square on white background' }]
    }],
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });
  
  console.log('✅ Response received!');
  
  if (response.candidates && response.candidates[0]) {
    const parts = response.candidates[0].content.parts;
    
    for (const part of parts) {
      if (part.inlineData) {
        console.log('✅✅✅ IMAGE GENERATION WORKS NOW! ✅✅✅');
        console.log('📏 Image size:', part.inlineData.data.length, 'characters');
        console.log('🖼️ MIME type:', part.inlineData.mimeType);
        console.log('\n🎉🎉🎉 SUCCESS! BILLING IS ENABLED! 🎉🎉🎉');
        console.log('\n✨ Your Halloween app should work now!');
        process.exit(0);
      }
    }
  }
  
  console.log('⚠️ Response received but no image data');
  
} catch (error) {
  console.error('❌ Still getting error:', error.status);
  console.error('❌ Message:', error.message.substring(0, 200));
  
  if (error.message.includes('quota')) {
    console.log('\n⚠️ Still showing quota issues.');
    console.log('💡 It may take a few minutes for billing to activate.');
    console.log('⏰ Try waiting 2-3 minutes and test again.');
  }
}
