import {
  GoogleGenAI,
  Modality,
} from '@google/genai';

// Lazy initialization to avoid crash on module load
let ai: GoogleGenAI | null = null;

function getEnvList(name: string, fallback: string[]): string[] {
  const raw = (import.meta as any).env?.[name] as string | undefined;
  if (!raw) {
    return fallback;
  }

  return raw
    .split(',')
    .map(model => model.trim())
    .filter(Boolean);
}

function getAI(): GoogleGenAI {
  if (!ai) {
    const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
    console.log('🔑 API Key check:', apiKey ? '✅ Loaded' : '❌ Missing');
    console.log(
      '🔑 API Key preview:',
      apiKey ? apiKey.substring(0, 20) + '...' : 'NONE'
    );
    if (!apiKey) {
      throw new Error(
        'VITE_GEMINI_API_KEY environment variable is not set. Please check your .env file.'
      );
    }
    console.log('🚀 Initializing GoogleGenAI...');
    ai = new GoogleGenAI({ apiKey });
    console.log('✅ GoogleGenAI initialized successfully');
  }
  return ai;
}

export async function transformImage(
  images: { data: string; mimeType: string }[],
  prompt: string
): Promise<string> {
  console.log('🎨 Starting Halloween image transformation with Imagen 4...');
  console.log('📝 Costume prompt:', prompt.substring(0, 50) + '...');
  console.log('📸 Images count:', images.length);
  console.log('📸 First image MIME:', images[0]?.mimeType);
  console.log('📸 First image data length:', images[0]?.data?.length);

  // Use Imagen 4 for better image generation
  const imageModels = getEnvList('VITE_GEMINI_IMAGE_MODELS', [
    'imagen-4.0-generate-001',  // Primary: Imagen 4.0 for high quality Halloween costumes
    'imagen-4.0-fast-001',      // Fallback: Faster version if needed
    'gemini-2.5-pro',           // Fallback: If Imagen is not available
  ]);
  console.log('🧠 Image model candidates (using Imagen 4):', imageModels);

  const imageParts = images.map(image => ({
    inlineData: {
      data: image.data,
      mimeType: image.mimeType,
    },
  }));

  // Enhanced Halloween-specific pre-prompt for Imagen 4
  const textPart = {
    text: `HALLOWEEN COSTUME TRANSFORMATION INSTRUCTIONS:

CRITICAL: This is a Halloween costume photo app. The goal is to create a realistic photo of the SAME PERSON wearing a Halloween costume.

IDENTITY PRESERVATION (MOST IMPORTANT):
- Keep the person's face, facial features, and body structure EXACTLY the same
- The person must be instantly recognizable as themselves
- Maintain their exact skin tone, eye color, hair texture, and facial characteristics
- Preserve their age, gender, and physical build
- This should look like the same person dressed up for Halloween, NOT a different person

HALLOWEEN COSTUME APPLICATION:
Apply the following Halloween costume: ${prompt}

COSTUME DETAILS:
- Add realistic Halloween costume clothing over their body
- Apply appropriate Halloween makeup if the costume requires it (face paint, fake blood, etc.)
- Add costume accessories (hats, masks around neck, props, wings, etc.)
- Include Halloween-themed background elements if appropriate
- Make the costume look like it was purchased or rented from a costume shop

PHOTO REALISM:
- Output must look like a real photograph taken at a Halloween party
- Use natural lighting as if taken with a phone camera
- Maintain photo-realistic textures and details
- No cartoon, illustration, or artistic effects
- Should look like an actual Halloween costume photo you'd post on social media

QUALITY: Generate a high-resolution, detailed image that looks like a real Halloween costume photo where the person is clearly recognizable as themselves in costume.`,
  };

  console.log('📡 Sending request to Gemini API...');
  console.log('🔑 API Key loaded:', getAI() ? 'YES' : 'NO');

  let lastError: unknown = null;

  for (const model of imageModels) {
    console.log(`🧪 Attempting image model: ${model}`);

    try {
      const response = await getAI().models.generateContent({
        model,
        contents: [
          {
            parts: [...imageParts, textPart],
          },
        ],
        config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
      });

      console.log('✅ Received response from Gemini API');
      console.log(
        '📦 Response structure:',
        JSON.stringify(response, null, 2).substring(0, 500)
      );

      if (!response) {
        throw new Error('No response received from API');
      }

      if (!response.candidates || response.candidates.length === 0) {
        throw new Error('No candidates in API response');
      }

      if (!response.candidates[0]?.content?.parts) {
        throw new Error('No parts in API response content');
      }

      console.log(
        '📦 Found',
        response.candidates[0].content.parts.length,
        'parts'
      );

      for (const part of response.candidates[0].content.parts) {
        console.log('🔍 Checking part:', Object.keys(part));
        if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          const mimeType = part.inlineData.mimeType;
          console.log('🖼️ Image generated successfully!');
          return `data:${mimeType};base64,${base64ImageBytes}`;
        }
      }

      const textResponse = response.text;
      if (textResponse) {
        throw new Error(`Model could not generate image: ${textResponse}`);
      }

      throw new Error('No image was generated by the model.');
    } catch (error) {
      lastError = error;
      console.error(`❌ Model ${model} failed:`, error);
    }
  }

  console.error('❌ All image models failed');
  throw lastError instanceof Error
    ? lastError
    : new Error('All image models failed.');
}

export async function generateVideoFromImage(
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<string> {
  console.log('🎬 Starting Halloween video generation...');
  console.log('📝 Video prompt:', prompt.substring(0, 50) + '...');

  const videoModels = getEnvList('VITE_GEMINI_VIDEO_MODELS', [
    'veo-2.0-generate-001',
    'veo-1.5-lite-001',
  ]);
  console.log('🎥 Video model candidates:', videoModels);

  let lastError: unknown = null;

  for (const model of videoModels) {
    console.log(`🧪 Attempting video model: ${model}`);

    try {
      let operation = await getAI().models.generateVideos({
        model,
        prompt: `HALLOWEEN VIDEO: ${prompt}.

        Make this Halloween costume photo come alive for 3 seconds with spooky animations:
        - Keep the person's face and identity EXACTLY the same - they should be recognizable
        - Add Halloween-themed animations like:
          * Subtle spooky movements (cape fluttering, costume accessories moving)
          * Halloween gestures (monster poses, witch cackling, zombie movements)
          * Atmospheric effects (fog, lightning flashes, glowing eyes)
          * Character-appropriate actions based on the costume
        - Maintain the realistic photo quality throughout
        - The person should look like themselves in costume doing Halloween actions`,
        image: {
          imageBytes: base64ImageData,
          mimeType: mimeType,
        },
        config: {
          numberOfVideos: 1,
        },
      });

      console.log('Video operation started:', operation);

      while (!operation.done) {
        console.log('Polling for video result...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await getAI().operations.getVideosOperation({
          operation: operation,
        });
        console.log('Polling response:', operation);
      }

      if (operation.error) {
        const errorMessage =
          typeof operation.error.message === 'string'
            ? operation.error.message
            : 'Video generation failed';
        throw new Error(errorMessage);
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

      if (!downloadLink) {
        throw new Error('Video generation completed, but no download link was provided.');
      }

      console.log('Video generated, download link:', downloadLink);

      const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
      const response = await fetch(`${downloadLink}&key=${apiKey}`);
      if (!response.ok) {
        throw new Error(`Failed to download video file: ${response.statusText}`);
      }

      const videoBlob = await response.blob();
      const videoUrl = URL.createObjectURL(videoBlob);

      console.log('Video downloaded and blob URL created:', videoUrl);
      return videoUrl;
    } catch (error) {
      lastError = error;
      console.error(`❌ Video model ${model} failed:`, error);
    }
  }

  console.error('❌ All video models failed');
  throw lastError instanceof Error
    ? lastError
    : new Error('All video models failed.');
}
