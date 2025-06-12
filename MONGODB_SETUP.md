# MongoDB Setup Guide for EliteStore

This guide will help you set up MongoDB to enable full database functionality for the EliteStore e-commerce platform.

## Quick Start (Without MongoDB)

The application is currently running in **DEMO MODE** with sample data. All frontend features work, but no data is persisted. To enable full functionality with database persistence, follow the MongoDB setup below.

## MongoDB Installation Options

### Option 1: MongoDB Community Server (Local Installation)

#### Windows Installation:
1. **Download MongoDB Community Server**
   - Visit: https://www.mongodb.com/try/download/community
   - Select Windows, Current version
   - Download the MSI installer

2. **Install MongoDB**
   - Run the downloaded MSI file
   - Choose "Complete" installation
   - Install as a Windows Service (recommended)
   - Install MongoDB Compass (GUI tool) - optional but helpful

3. **Verify Installation**
   ```bash
   # Check if MongoDB service is running
   sc query MongoDB
   
   # Or check if mongod is accessible
   mongod --version
   ```

4. **Start MongoDB Service (if not running)**
   ```bash
   # Start service
   net start MongoDB
   
   # Or manually start mongod
   mongod --dbpath C:\data\db
   ```

#### macOS Installation:
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux Installation:
```bash
# Ubuntu/Debian
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### Option 2: MongoDB Atlas (Cloud Database)

1. **Create Account**
   - Visit: https://www.mongodb.com/atlas
   - Sign up for free account

2. **Create Cluster**
   - Choose M0 (Free tier)
   - Select your preferred region
   - Create cluster

3. **Configure Access**
   - Add your IP address to whitelist
   - Create database user with username/password

4. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

5. **Update .env file**
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/elitestore?retryWrites=true&w=majority
   ```

## Enabling Database Functionality

Once MongoDB is installed and running:

1. **Update .env file** (if using local MongoDB, no changes needed)
   ```env
   MONGODB_URI=mongodb://localhost:27017/elitestore
   ```

2. **Uncomment API routes in server.js**
   - Edit `server.js`
   - Uncomment the route imports and API route definitions

3. **Restart the server**
   ```bash
   npm start
   ```

4. **Seed the database**
   ```bash
   npm run seed
   ```

## Verification

After setup, you should see:
```
✅ MongoDB Connected: localhost:27017
🌱 Database seeded successfully!
🎉 Created 12 products across 4 categories
Server running on http://localhost:3000
```

## Database Collections

The application creates these collections:
- **products** - Product catalog
- **categories** - Product categories  
- **users** - User accounts
- **orders** - Order history

## Troubleshooting

### Common Issues:

1. **Connection Refused**
   ```
   Error: connect ECONNREFUSED 127.0.0.1:27017
   ```
   - Solution: Start MongoDB service
   - Windows: `net start MongoDB`
   - macOS/Linux: `brew services start mongodb-community` or `sudo systemctl start mongod`

2. **Data Directory Missing**
   ```
   Error: Data directory not found
   ```
   - Solution: Create data directory
   - Windows: `mkdir C:\data\db`
   - macOS/Linux: `sudo mkdir -p /data/db && sudo chown -R $USER /data/db`

3. **Port Already in Use**
   ```
   Error: Port 27017 already in use
   ```
   - Solution: Stop existing MongoDB process or use different port

4. **Authentication Failed**
   - Check username/password in connection string
   - Verify user has proper permissions

## MongoDB GUI Tools

### MongoDB Compass (Recommended)
- Free official GUI
- Download: https://www.mongodb.com/products/compass
- Connect to: `mongodb://localhost:27017`

### Alternative Tools
- **MongoDB Atlas** - Web-based interface
- **Studio 3T** - Professional MongoDB IDE
- **Robo 3T** - Lightweight GUI

## Database Schema

### Products Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  comparePrice: Number,
  category: String,
  image: String,
  gallery: [String],
  inStock: Boolean,
  featured: Boolean,
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Users Collection
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  role: String (default: 'customer'),
  cart: [{
    product: ObjectId,
    quantity: Number,
    price: Number
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## Next Steps

After MongoDB setup:
1. Enable API routes in `server.js`
2. Run database seeding: `npm run seed`
3. Test product search and filtering
4. Enable user registration/login
5. Implement cart persistence
6. Add admin functionality

## Support

If you need help with MongoDB setup:
- Official Documentation: https://docs.mongodb.com/
- Community Forum: https://community.mongodb.com/
- Stack Overflow: Tag questions with 'mongodb'
