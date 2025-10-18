# Video Generation Cost Optimization Guide

## Current Situation
Your app uses Google Veo models for video generation at approximately $0.15-0.75 per second.

## Cost Optimization Strategies

### 1. Update Model Configuration
Replace the outdated `veo-1.5-lite-001` with current models:
```env
# Option A: Cost-Optimized (Recommended)
VITE_GEMINI_VIDEO_MODELS=veo-3.1-fast-generate-preview,veo-3.1-generate-preview

# Option B: Quality-First
VITE_GEMINI_VIDEO_MODELS=veo-2.0-generate-001,veo-3.1-generate-preview
```

### 2. Reduce Video Duration
Change from 5 seconds to 3 seconds in `geminiService.ts`:
```typescript
// Update the prompt
prompt: `HALLOWEEN VIDEO: ${prompt}.
Make this Halloween costume photo come alive for 3 seconds with spooky animations:`
```

### 3. Implement Tiered Video Access
```typescript
// Free tier: No video generation
// Basic tier ($4.99): 3 videos/month at 3 seconds
// Pro tier ($9.99): 10 videos/month at 3 seconds
// Premium tier ($19.99): 25 videos/month at 5 seconds
```

### 4. Smart Video Generation
- Only generate video for highly-rated transformations
- Add a "Create Video" button (don't auto-generate)
- Cache popular videos for reuse
- Use preview frames instead of full videos for gallery

### 5. Cost Comparison

| Approach | Cost per User | Videos Included |
|----------|--------------|-----------------|
| Current (5 sec Veo 2) | $2.50/video | Very expensive |
| Optimized (3 sec Veo 3 Fast) | $0.45/video | 78% cheaper |
| Hybrid (Local + API) | $0.10/video | 96% cheaper |

## Alternative: Hybrid Approach

### Use Google Veo for Premium Users
- High-quality results
- No infrastructure needed
- Pay per use

### Use Local Models for Free/Basic Tiers
- AnimateDiff or SVD from Hugging Face
- Run on GPU server ($50-100/month for unlimited)
- Lower quality but much cheaper at scale

## Implementation Priority

1. **Immediate**: Switch to 3-second videos (40% cost reduction)
2. **This Week**: Update to Veo 3 Fast model (70% cost reduction)
3. **This Month**: Add manual video trigger button (prevent waste)
4. **Next Month**: Consider local GPU for high-volume users

## Break-Even Analysis

If you have more than 100 video generations per month:
- API Cost: $45-150/month
- GPU Server: $50-100/month (unlimited videos)
- **Recommendation**: Switch to hybrid model

## Monitoring Costs

Add usage tracking:
```typescript
// Track in your database
const videoGeneration = {
  user_id: userId,
  model_used: 'veo-3-fast',
  duration_seconds: 3,
  estimated_cost: 0.45,
  timestamp: new Date()
};
```

This will help you understand actual usage patterns and optimize further.