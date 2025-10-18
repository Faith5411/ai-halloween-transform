# Halloween AI Setup - Identity Preservation System

## Overview
This Halloween app uses Google's Imagen 4.0 for image generation and Veo 2.0 for video generation, with special prompting to ensure people remain recognizable in their Halloween costumes.

## Key Features

### 🎃 Identity Preservation
The app is specifically configured to:
- Keep the original person's face and features completely unchanged
- Apply Halloween costumes as if they were wearing real store-bought outfits
- Maintain photorealistic quality - like a real Halloween party photo
- Ensure the person is instantly recognizable as themselves

### 🖼️ Image Generation (Imagen 4.0)
**Model**: `imagen-4.0-generate-001`
- **Cost**: $0.04 per image
- **Purpose**: Generates realistic photos of people in Halloween costumes
- **Key Feature**: Excellent at preserving facial identity while adding costumes

The pre-prompt ensures:
- Face, body structure, and features remain EXACTLY the same
- Costume elements are added (clothing, makeup, accessories)
- Photo looks like it was taken at a real Halloween party
- No cartoonish or morphing effects

### 🎬 Video Generation (Veo 2.0)
**Model**: `veo-2.0-generate-001`
- **Cost**: ~$5.25 per 15-second video (via Gemini API)
- **Purpose**: Animates the Halloween costume photos with spooky movements
- **Duration**: 5-15 seconds of animation

The video prompt ensures:
- Person's identity remains constant throughout the video
- Halloween-themed animations (costume movements, spooky gestures)
- Atmospheric effects (fog, lightning, glowing effects)
- Maintains photorealistic quality

## Configuration

### Environment Variables
```env
# Use Imagen 4 for better identity preservation in costumes
VITE_GEMINI_IMAGE_MODELS=imagen-4.0-generate-001,imagen-4.0-fast-001,gemini-2.5-pro
VITE_GEMINI_VIDEO_MODELS=veo-2.0-generate-001,veo-1.5-lite-001
```

### Model Selection Logic
1. **Primary**: Imagen 4.0 - Best quality and identity preservation
2. **Fallback 1**: Imagen 4.0 Fast - Faster generation if needed
3. **Fallback 2**: Gemini 2.5 Pro - If Imagen is unavailable

## Cost Optimization

### Recommended Settings
- **Images Only Mode**: $0.04 per transformation (very affordable)
- **Video Optional**: Make video generation optional due to high cost
- **Shorter Videos**: Consider 5-second videos instead of 15 seconds
- **Usage Limits**: Implement daily limits or credit system

### Cost Breakdown
- **Image Generation**: $0.04 per image ✅ Affordable
- **Video Generation**: $5.25 per 15-second video ⚠️ Expensive
- **Complete Transformation**: ~$5.29 total

## How It Works

### 1. User Upload
User uploads a photo of themselves or someone they want to transform

### 2. Costume Selection
User selects or describes the Halloween costume they want

### 3. Image Generation
```javascript
// Imagen 4 generates the costume photo with this approach:
- Analyzes the original person's features
- Applies costume elements while preserving identity
- Outputs a realistic Halloween party photo
```

### 4. Optional Video Animation
```javascript
// Veo 2 animates the costume photo:
- Adds costume-appropriate movements
- Includes Halloween effects
- Maintains person's recognizable features
```

## Example Prompts

### Good Costume Prompts
✅ "Vampire with cape and fangs"
✅ "Witch with pointed hat and broomstick"
✅ "Zombie with tattered clothes and makeup"
✅ "Superhero in full costume with cape"
✅ "Classic ghost with white sheet costume"

### What the AI Does
- **Preserves**: Face, body type, skin tone, age, gender
- **Adds**: Costume clothing, accessories, makeup, props
- **Enhances**: Background with Halloween decorations
- **Maintains**: Photo realism and natural lighting

## Important Notes

1. **API Key Required**: You need a Google AI Studio API key with access to Imagen 4 and Veo 2
2. **Identity Focus**: The system is optimized for keeping people recognizable
3. **Cost Awareness**: Video generation is expensive - consider making it premium
4. **Quality**: Imagen 4 produces higher quality results than standard Gemini models

## Troubleshooting

### Person Doesn't Look Like Themselves
- Check that Imagen 4 is being used (not falling back to Gemini)
- Ensure the pre-prompt includes identity preservation instructions
- Verify the original image is clear and well-lit

### Costume Not Appearing
- Make costume descriptions more specific
- Include details about clothing, colors, and accessories
- Avoid abstract or vague descriptions

### Video Too Expensive
- Reduce duration to 5 seconds
- Make video generation a premium feature
- Use Imagen 4 for images only (much more affordable)