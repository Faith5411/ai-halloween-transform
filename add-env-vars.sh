#!/bin/bash
TOKEN="GCPbSqXjktG1IR4a2forcN0C"

echo "🔑 Adding environment variables to Vercel..."

npx vercel env add VITE_GEMINI_API_KEY production --token $TOKEN <<< "AIzaSyCQXupCZJcDaUCntfrVIoVlwCb0Q51e6q0"
npx vercel env add VITE_SUPABASE_URL production --token $TOKEN <<< "https://twsnioiuggbyzfxajlwk.supabase.co"
npx vercel env add VITE_SUPABASE_ANON_KEY production --token $TOKEN <<< "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3c25pb2l1Z2dieXpmeGFqbHdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5OTc2NzQsImV4cCI6MjA3NTU3MzY3NH0.YucpUB6CwU6FZ0uRC0mr1oPtQUWQcFWB2unePNSCJCY"
npx vercel env add VITE_STRIPE_PUBLISHABLE_KEY production --token $TOKEN <<< "pk_live_51SGDRWE50jh3rJnIxnXseHyO4DUISe6s3yZ64aQ5Hexaiskpzw6uiA4kukIVWjAFuzXscvKWwVNoPi0IjUIuhInA00j67MataS"

echo "✅ Environment variables added!"
echo "🚀 Redeploying with environment variables..."

npx vercel --prod --token $TOKEN

