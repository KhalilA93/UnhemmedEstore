#!/bin/bash

# Install dependencies
npm ci

# Build the React app
npm run build

# Install serve globally for production
npm install -g serve