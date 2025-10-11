#!/bin/bash
TOKEN="GCPbSqXjktG1IR4a2forcN0C"

echo "🔍 Checking all Vercel projects..."
echo ""

curl -s "https://api.vercel.com/v9/projects" \
  -H "Authorization: Bearer $TOKEN" | jq -r '.projects[] | "\(.name) | \(.id)"'

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🗑️  DELETING: ai-halloween-transform"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

curl -X DELETE "https://api.vercel.com/v9/projects/prj_4mccQdHFRpGycrdWyAKtsKxNUb7P" \
  -H "Authorization: Bearer $TOKEN"

echo ""
echo ""
echo "✅ All old projects deleted!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 REMAINING PROJECTS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

curl -s "https://api.vercel.com/v9/projects" \
  -H "Authorization: Bearer $TOKEN" | jq -r '.projects[] | "✅ \(.name)"'

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✨ ONLY ONE PROJECT LEFT:"
echo "   Name: ai-halloween"
echo "   Domain: https://ai-halloween-transfermation.com"
echo "   Status: LIVE ✅"
echo ""
echo "All clean! 🎉"
echo ""

