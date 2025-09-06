# EcoFinds Deployment Guide

## 🚀 Deploy to Vercel

### Step 1: Prepare for Production Database

For production, you'll need a PostgreSQL database. Here are some options:

#### Option A: Vercel Postgres (Recommended)
- Integrated with Vercel
- Easy setup through Vercel dashboard
- Automatic connection string

#### Option B: Neon (Free PostgreSQL)
1. Go to [neon.tech](https://neon.tech)
2. Create a free account
3. Create a new database
4. Copy the connection string

#### Option C: Railway
1. Go to [railway.app](https://railway.app)
2. Create a PostgreSQL database
3. Copy the connection string

### Step 2: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com) and sign in with GitHub**

2. **Import your repository:**
   - Click "New Project"
   - Import `Mainakgit0/coderz_ecofinds`

3. **Configure Environment Variables:**
   ```
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_super_secret_jwt_key_for_production
   ```

4. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

### Step 3: Set up Database

After deployment, you need to set up your production database:

1. **Run migrations:**
   ```bash
   # In Vercel dashboard, go to Functions tab
   # Or use Vercel CLI locally:
   npx vercel env pull .env.local
   npx prisma db push
   ```

2. **Seed the database (optional):**
   ```bash
   npx tsx prisma/seed.ts
   ```

### Step 4: Test Your Deployment

1. Visit your Vercel URL
2. Test user registration/login
3. Test product creation and search
4. Test cart functionality

## 🔧 Environment Variables Needed

```bash
DATABASE_URL="postgresql://username:password@host:port/database"
JWT_SECRET="your-production-secret-key-min-32-characters"
```

## 📝 Post-Deployment Checklist

- [ ] Database connected and migrations run
- [ ] Sample data seeded (optional)
- [ ] User registration working
- [ ] Product creation working
- [ ] Search functionality working
- [ ] Cart and checkout working
- [ ] Image uploads working
- [ ] All pages responsive on mobile

## 🔒 Security Notes

- Never commit `.env` files to Git
- Use strong JWT secrets (32+ characters)
- Enable HTTPS in production (Vercel does this automatically)
- Consider rate limiting for API endpoints

## 🐛 Troubleshooting

### Common Issues:

1. **Database Connection Error:**
   - Check DATABASE_URL format
   - Ensure database is accessible from Vercel

2. **Prisma Client Error:**
   - Ensure `prisma generate` runs in build
   - Check postinstall script in package.json

3. **JWT Secret Error:**
   - Ensure JWT_SECRET is set in Vercel environment variables
   - Must be at least 32 characters long

4. **Image Upload Issues:**
   - Vercel has file system limitations
   - Consider using cloud storage (Cloudinary, AWS S3) for production
