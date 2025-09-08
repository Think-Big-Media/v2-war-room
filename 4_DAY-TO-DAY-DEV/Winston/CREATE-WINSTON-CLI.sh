#!/bin/bash

# CREATE WINSTON APP USING ENCORE CLI

echo "Creating Winston app with Encore CLI..."

# Navigate to the backend directory
cd /Users/rodericandrews/Obsidian/Master/_Projects/_War-Room-AI/v2-war-room/3_Backend_Codebase/4.4/war-room-4-4-backend

# Initialize as new Encore app
echo "Initializing Winston app..."
encore app create winston --example=empty

# Link to existing codebase
echo "Linking to existing backend code..."
encore app link winston

# Deploy to staging
echo "Deploying to staging..."
git push encore main

echo "✅ Winston app created and deploying!"
echo "Check deployment at: https://app.encore.cloud/winston"