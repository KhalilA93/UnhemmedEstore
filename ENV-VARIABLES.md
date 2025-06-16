# Environment Variables for Vercel

Copy these to your Vercel dashboard under Settings > Environment Variables:

## Required Variables:

**MONGODB_URI**
```
mongodb+srv://username:password@cluster.mongodb.net/unhemmed?retryWrites=true&w=majority
```
*Get this from MongoDB Atlas (your database provider)*

**SESSION_SECRET**
```
unhemmed-super-secret-key-2025
```
*This can be any random string - used for security*

**EMAIL_USER**
```
khalilatkins420@gmail.com
```

**EMAIL_PASS**
```
your-gmail-app-password-here
```
*Get this from Google Account settings > App passwords*

**NODE_ENV**
```
production
```

## How to Get MongoDB URI:
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Sign up for free account
3. Create a cluster (choose free tier)
4. Click "Connect" > "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
