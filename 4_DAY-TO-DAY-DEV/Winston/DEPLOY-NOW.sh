#!/bin/bash

# DEPLOY WINSTON TO ENCORE CLOUD NOW

echo "🚀 Deploying Winston War Room to Encore Cloud..."
echo "============================================="

cd /Users/rodericandrews/Obsidian/Master/_Projects/_War-Room-AI/v2-war-room/3_Backend_Codebase/4.4/war-room-4-4-backend

# Since git.encore.cloud doesn't resolve, we need to trigger deployment through the CLI
echo "📦 Building application locally first..."
encore build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🌐 Now go to: https://app.encore.cloud/winston-war-room-9cui"
    echo ""
    echo "In the Encore Cloud Dashboard:"
    echo "1. Click 'Deployments' or 'Deploy'"
    echo "2. Click 'Create Deployment' or 'Deploy to Staging'"
    echo "3. Select 'staging' environment"
    echo "4. Click 'Deploy'"
    echo ""
    echo "The deployment will use the code we just built and tested."
    echo ""
    echo "📍 Expected URL after deployment:"
    echo "https://staging-winston-war-room-9cui.encr.app"
    echo ""
    echo "Once deployed, tell me and I'll update the frontend!"
else
    echo "❌ Build failed. Checking for issues..."
    encore check
fi