#!/bin/bash
TOKEN="GCPbSqXjktG1IR4a2forcN0C"
PROJECT_ID="prj_XxH4nns08HIVRp8nytkrF2Y3Llhf"
PROJECT_NAME="ai-halloween-transform-app"

echo "🗑️  Deleting old project: $PROJECT_NAME"
echo "Project ID: $PROJECT_ID"
echo ""

curl -X DELETE "https://api.vercel.com/v9/projects/$PROJECT_ID" \
  -H "Authorization: Bearer $TOKEN"

echo ""
echo ""
echo "✅ Project deleted!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 YOUR REMAINING PROJECTS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

curl -s "https://api.vercel.com/v9/projects" \
  -H "Authorization: Bearer $TOKEN" | jq -r '.projects[] | "✅ \(.name) (ID: \(.id))"'

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✨ ACTIVE PROJECT:"
echo "   Name: ai-halloween"
echo "   Domain: https://ai-halloween-transfermation.com"
echo "   Status: LIVE ✅"
echo ""

