#!/bin/bash
TOKEN="GCPbSqXjktG1IR4a2forcN0C"
DOMAIN="ai-halloween-transfermation.com"

echo "🌐 Adding domain to ai-halloween project..."

# Use the Vercel API to add domain
curl -X POST "https://api.vercel.com/v10/projects/ai-halloween/domains" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"$DOMAIN\"}" 

echo ""
echo "✅ Domain configuration initiated!"
