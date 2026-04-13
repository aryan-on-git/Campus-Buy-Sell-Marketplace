# CampusBuy - Deployment Guide

Quick guide to deploy your project online so you can show it during your interview.

---

## 🚀 Option 1: Deploy to Heroku (Easiest)

### Prerequisites
- Heroku account (free at heroku.com)
- Git installed
- MongoDB Atlas account with connection string

### Steps

1. **Install Heroku CLI**
   ```bash
   # Windows
   choco install heroku-cli
   
   # Or download from: https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku app**
   ```bash
   heroku create your-app-name
   # Example: heroku create campus-buy-marketplace
   ```

4. **Set environment variables**
   ```bash
   heroku config:set MONGODB_URI="your_mongodb_atlas_connection_string"
   heroku config:set JWT_SECRET="your_super_secret_key"
   heroku config:set NODE_ENV=production
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **Open your app**
   ```bash
   heroku open
   ```

Your app is now live! Share this URL with interviewers.

---

## 🚀 Option 2: Deploy to Railway (Also Easy)

### Steps

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project → GitHub repo
4. Add MongoDB service (choose plugin)
5. Deploy automatically
6. Copy your production URL

---

## 🚀 Option 3: Deploy to Render

### Steps

1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Set environment variables
5. Deploy

---

## ✅ Post-Deployment Checklist

After deployment, test:

- [ ] Homepage loads
- [ ] Signup/login works
- [ ] Can create a product
- [ ] Can browse products
- [ ] Search works
- [ ] Can view My Products
- [ ] Can edit/delete own products
- [ ] API endpoints respond correctly

---

## 🐛 Troubleshooting

### "App crashes after deploy"
```bash
heroku logs --tail
# Check the error logs
```

### "MongoDB connection fails"
- Verify connection string is correct
- Check IP whitelist in MongoDB Atlas (allow from anywhere)

### "Port issues"
- Make sure `process.env.PORT` is used in server.js (it is)

### "Static files not serving"
- Verify public folder is committed to git
- Check express.static() path in server.js

---

## 📊 Show to Interviewers

**Perfect Interview Setup:**
1. Pull up your GitHub repo
2. Show your commits (gradual development)
3. Open live deployed link
4. Live demo: signup → create product → search
5. Show API_DOCS.md
6. Discuss architecture

---

## 💡 Hosting Comparison

| Provider | Difficulty | Cost | Speed | Best For |
|----------|-----------|------|-------|----------|
| Heroku | Easy | Free tier exists | Medium | Quick setup |
| Railway | Easy | $5-20/mo | Fast | Modern deployment |
| Render | Easy | Free tier | Medium | No credit card |
| AWS | Hard | Varies | Very Fast | Big projects |
| DigitalOcean | Medium | $5+/mo | Fast | Long-term |

**For interview:** Use Heroku or Railway (simplest to set up)

---

## 🔒 Production Security Checklist

Before going live, verify:

- [ ] `.env` file is in `.gitignore` (never commit secrets)
- [ ] MongoDB password is strong
- [ ] JWT_SECRET is complex and random
- [ ] CORS is properly configured
- [ ] No console.log with sensitive data
- [ ] All validation errors don't leak info
- [ ] Database has backups

---

Good luck! Your live demo will impress interviewers! 🎉
