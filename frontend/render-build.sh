#!/bin/bash

# Install dependencies
npm ci

# Build the React app
npm run build

# Ensure routing files are in build directory
cp public/_redirects build/ 2>/dev/null || echo "_redirects file not found, skipping..."
cp public/_headers build/ 2>/dev/null || echo "_headers file not found, skipping..."

# Verify the files were copied
echo "Build directory contents:"
ls -la build/

# Install serve globally for production
npm install -g serve