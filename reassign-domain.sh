#!/bin/bash
TOKEN="GCPbSqXjktG1IR4a2forcN0C"
OLD_PROJECT="ai-halloween-transform-app"
NEW_PROJECT="ai-halloween"
DOMAIN="ai-halloween-transfermation.com"

echo "🔄 Removing domain from old project..."
curl -X DELETE "https://api.vercel.com/v9/projects/$OLD_PROJECT/domains/$DOMAIN" \
  -H "Authorization: Bearer $TOKEN"

echo ""
echo "⏳ Waiting 2 seconds..."
sleep 2

echo "➕ Adding domain to new project..."
curl -X POST "https://api.vercel.com/v10/projects/$NEW_PROJECT/domains" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"$DOMAIN\"}"

echo ""
echo "✅ Domain reassigned to ai-halloween project!"
echo "🌐 Your app is now at: https://$DOMAIN"
