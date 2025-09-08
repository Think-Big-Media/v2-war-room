#!/bin/bash

# UPDATE FRONTEND WITH NEW BACKEND URL
# Run this after creating new Encore app

echo "Enter the new Encore backend URL (e.g., https://staging-war-room-winston-xxxx.encr.app):"
read NEW_URL

if [ -z "$NEW_URL" ]; then
    echo "Error: No URL provided"
    exit 1
fi

# Update frontend .env files
cd /Users/rodericandrews/Obsidian/Master/_Projects/_War-Room-AI/v2-war-room/2_Frontend_Codebase/3.1-ui-war-room-netlify-clean

echo "Updating .env files with new backend URL..."
cat > .env << EOF
VITE_API_URL=$NEW_URL
VITE_USE_MOCK_DATA=false
VITE_ENVIRONMENT=production
VITE_ENABLE_MOCK_MODE=false
VITE_MENTIONLYTICS_API_TOKEN=dummy-token-to-prevent-mock
EOF

cp .env .env.production

echo "Building frontend..."
npm run build

echo "Deploying to Netlify..."
netlify deploy --prod --dir=dist

echo "✅ Frontend updated with new backend URL: $NEW_URL"
echo "✅ Deployed to: https://war-room-3-1-ui.netlify.app"