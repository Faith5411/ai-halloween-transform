import fs from 'fs/promises';
import path from 'path';

async function extractAudio() {
  const audioServicePath = path.resolve(process.cwd(), 'services/audioService.ts');
  const publicAudioDir = path.resolve(process.cwd(), 'public/audio');

  try {
    await fs.mkdir(publicAudioDir, { recursive: true });

    const content = await fs.readFile(audioServicePath, 'utf-8');

    // Regex to find variable assignments with base64 data
    const soundRegex = /const\s+(\w+)\s*=\s*'data:audio\/wav;base64,([A-Za-z0-9+/=]+)'/g;
    const imageSoundsRegex = /const imageSuccessSounds: Record<string, string> = {([^}]+)};/s;

    let match;

    // Handle simple sound variables (loginSound, videoSuccessSound)
    while ((match = soundRegex.exec(content)) !== null) {
      const varName = match[1];
      const base64Data = match[2];
      // Special case for videoSuccessSound which is a placeholder
      if (varName === 'videoSuccessSound' && base64Data.length < 100) {
          console.log('Skipping placeholder videoSuccessSound');
          continue;
      }
      const fileName = `${varName.replace('Sound', '')}.wav`;
      const filePath = path.join(publicAudioDir, fileName);
      await fs.writeFile(filePath, Buffer.from(base64Data, 'base64'));
      console.log(`Created ${filePath}`);
    }

    // Handle the imageSuccessSounds object
    const imageSoundsMatch = content.match(imageSoundsRegex);
    if (imageSoundsMatch) {
      const objectContent = imageSoundsMatch[1];
      const soundEntryRegex = /'([^']+)':\s*'data:audio\/wav;base64,([A-Za-z0-9+/=]+)'/g;

      while ((match = soundEntryRegex.exec(objectContent)) !== null) {
        const soundName = match[1].toLowerCase().replace(/\s+/g, '-');
        const base64Data = match[2];
        const fileName = `${soundName}.wav`;
        const filePath = path.join(publicAudioDir, fileName);
        await fs.writeFile(filePath, Buffer.from(base64Data, 'base64'));
        console.log(`Created ${filePath}`);
      }
    }

    console.log('Audio extraction complete.');

  } catch (error) {
    console.error('Error extracting audio:', error);
    process.exit(1);
  }
}

extractAudio();
