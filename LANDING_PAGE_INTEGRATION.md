# 🎃 Landing Page Integration Guide

## What Was Changed

The LandingPage component has been completely redesigned to:

1. **Look like the main app** with Before/After display areas
2. **Automatic slideshow** of contest entries (fades every 5 seconds)
3. **Two tabs**:
   - "Live Transformations" - Public slideshow (no login required)
   - "Full Gallery" - Requires sign-in to view all entries
4. **Voting** - Everyone can vote on the slideshow (no login required)

## How to Integrate

### Option 1: As Default Homepage (Recommended)

Add to the top of your `App.tsx`:

```tsx
import LandingPage from './components/LandingPage';

function App() {
  const { user, loading, openLoginModal } = useAuth();
  const [showLanding, setShowLanding] = useState(!user); // Show landing if not logged in
  
  // Update when user logs in
  useEffect(() => {
    if (user) {
      setShowLanding(false);
    }
  }, [user]);
  
  // If showing landing page
  if (showLanding) {
    return (
      <LandingPage 
        onGetStarted={() => {
          setShowLanding(false);
          openLoginModal();
        }}
        onSignIn={() => openLoginModal()}
      />
    );
  }
  
  // Rest of your app...
}
```

### Option 2: As a Route

If you're using React Router:

```tsx
<Routes>
  <Route path="/" element={<LandingPage onGetStarted={handleGetStarted} onSignIn={handleSignIn} />} />
  <Route path="/app" element={<YourMainApp />} />
</Routes>
```

### Option 3: Toggle Button

Add a button to switch between landing and app:

```tsx
<button onClick={() => setShowLanding(!showLanding)}>
  {showLanding ? 'Go to App' : 'View Landing Page'}
</button>
```

## Key Features

### Live Transformations Tab
- Displays before/after in app-style layout
- Auto-rotates through transformations every 5 seconds
- Smooth fade transition
- Vote button (❤️) updates in real-time
- Shows costume name and winner badge
- Progress indicator (e.g., "Transformation 3 of 47")

### Full Gallery Tab  
- **Requires sign-in** to view
- Shows sign-in prompt with two buttons:
  - "Sign In Now" - Opens login modal
  - "Create Account" - Opens registration
- Once signed in, shows full grid of all transformations
- Can vote on any transformation

## Voting System

- **Everyone can vote** on the slideshow (no login required)
- Anonymous voting uses IP address to prevent duplicates
- Authenticated users: tracked by user_id
- One vote per item per user/IP (anti-cheat)
- Vote count updates in real-time

## Database Integration

The landing page automatically:
- Fetches transformations from Supabase
- Updates vote counts in real-time
- Tracks which items user has voted on
- Shows winner badges for contest winners
- Displays real-time statistics

## Testing

```bash
npm run dev
```

Then:
1. Visit the landing page
2. Watch slideshow auto-rotate
3. Try voting (click heart button)
4. Try voting again (should be disabled)
5. Click "Full Gallery" tab
6. See sign-in prompt
7. Sign in and view full gallery

## Customization

### Change Slideshow Speed

In `LandingPage.tsx` line 83:
```tsx
}, 5000); // Change to 3000 for 3 seconds, 10000 for 10 seconds
```

### Change Fade Duration

In `LandingPage.tsx` line 80:
```tsx
}, 500); // Fade duration in milliseconds
```

### Disable Auto-play

Comment out the useEffect that handles auto-advance (lines 82-95)

## Props

```tsx
interface LandingPageProps {
  onGetStarted?: () => void;  // Called when "Start Creating" is clicked
  onSignIn?: () => void;       // Called when "Sign In" is clicked
}
```

## What's Ready

✅ Automatic slideshow with fade transitions
✅ App-style before/after layout
✅ Real-time voting
✅ Sign-in gate for full gallery
✅ Winner badges
✅ Statistics display
✅ Mobile responsive
✅ All connected to Supabase

## Next Steps

1. Add LandingPage to your App.tsx
2. Wire up `onGetStarted` and `onSignIn` callbacks
3. Test the slideshow
4. Run SQL schema if not done yet (see MANUAL_SQL_SETUP.md)
5. Share with users!

