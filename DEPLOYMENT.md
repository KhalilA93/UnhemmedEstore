# Render Deployment Guide

## Prerequisites
- Backend already deployed on Render
- Frontend ready for deployment

## Backend Environment Variables (Already Set)
Make sure your backend has these environment variables:
- `NODE_ENV=production`
- `MONGODB_URI=your_mongodb_connection_string`
- `JWT_SECRET=your_jwt_secret`
- `CLIENT_URL=https://your-frontend-app.onrender.com`

## Frontend Deployment Steps

### 1. Create New Web Service on Render
- Go to [Render Dashboard](https://dashboard.render.com)
- Click "New +" → "Web Service"
- Connect your GitHub repository: `KhalilA93/UnhemmedEstore`

### 2. Configure Frontend Build Settings
```
Name: unhemmed-frontend
Environment: Node
Region: Ohio (same as backend)
Branch: main
Root Directory: frontend
Build Command: npm install && npm run build
Start Command: npx serve -s build
```

### 3. Add Environment Variables
Add these in the Render dashboard:
```
REACT_APP_API_URL = https://your-backend-app.onrender.com
GENERATE_SOURCEMAP = false
```

### 4. Update Backend CORS
Update your backend's `CLIENT_URL` environment variable to:
```
CLIENT_URL = https://your-frontend-app.onrender.com
```

## Manual Deployment Commands (if needed)

### Build Frontend Locally
```bash
cd frontend
npm install
npm run build
```

### Test Production Build Locally
```bash
cd frontend
npm run serve
```

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Ensure backend `CLIENT_URL` matches frontend URL
2. **API Calls Failing**: Check `REACT_APP_API_URL` environment variable
3. **Images Not Loading**: Ensure images are in `frontend/public/images`
4. **Build Failures**: Check for ESLint errors or missing dependencies

### Environment Variables Checklist:
- [ ] Backend: `CLIENT_URL` set to frontend URL
- [ ] Frontend: `REACT_APP_API_URL` set to backend URL
- [ ] Backend: `MONGODB_URI` configured
- [ ] Backend: `JWT_SECRET` configured

## URLs to Update
After deployment, update these URLs in your environment variables:
- Backend URL: `https://your-backend-app.onrender.com`
- Frontend URL: `https://your-frontend-app.onrender.com`