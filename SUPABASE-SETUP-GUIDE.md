# 🚀 Complete Supabase Setup Guide
## Travel Inspiration Platform - Database Configuration

---

## 📋 Overview

This guide will walk you through setting up Supabase from scratch for your Travel Inspiration Platform. Follow each step carefully.

**Time Required:** 15-20 minutes  
**Difficulty:** Beginner-friendly  
**Cost:** FREE (Supabase Free Tier)

---

## 🎯 Part 1: Creating Your Supabase Account

### Step 1: Sign Up for Supabase

1. **Open your web browser**
2. Go to: **https://supabase.com**
3. Click the **"Start your project"** button (top right)
4. You'll see sign-in options:
   - ✅ **Sign up with GitHub** (Recommended - fastest)
   - Sign up with Google
   - Sign up with Email

5. **Choose GitHub option:**
   - Click "Continue with GitHub"
   - Log in to your GitHub account
   - Click "Authorize Supabase"

6. **You're now logged in!** 
   - You'll see the Supabase dashboard

---

## 🏗️ Part 2: Creating Your Project

### Step 2: Create a New Project

1. **On the Supabase Dashboard:**
   - Click **"New Project"** button (big green button)
   
2. **You'll see "Create a new project" form:**

   Fill in the following:

   **Organization:**
   - If first time: You'll need to create an organization
   - Click "New organization"
   - Name it: `travel-platform` (or any name you like)
   - Click "Create organization"

   **Project Details:**
   
   📝 **Project name:**
   ```
   travel-inspiration-platform
   ```
   
   🔐 **Database Password:**
   - Click the "Generate a password" button
   - **VERY IMPORTANT:** Copy this password immediately!
   - Paste it in a Notepad file temporarily
   - You'll need this password later
   
   Example:
   ```
   Password: Xk9#mP2$nQ7@vL4w
   ```
   ⚠️ **Save this password! You cannot see it again!**

   🌍 **Region:**
   - Select closest region to you
   - For India: Choose "Southeast Asia (Singapore)" or "Mumbai"
   - For USA: Choose "East US" or "West US"
   - For Europe: Choose "Europe (Frankfurt)" or "London"

   💰 **Pricing Plan:**
   - Select **"Free"** (this is perfect for development)

3. **Click "Create new project"** button

4. **Wait 2-3 minutes** while Supabase sets up your database
   - You'll see a progress screen: "Setting up your project..."
   - Coffee break time! ☕

5. **Project is Ready!**
   - You'll see your project dashboard

---

## 🔑 Part 3: Getting Your API Keys

### Step 3: Find Your Connection Details

1. **On your Project Dashboard:**
   - Look at the left sidebar
   - Click on **⚙️ "Settings"** (bottom of sidebar)

2. **Click "API"** in the Settings menu

3. **You'll see important information:**

   📋 **Copy these values:**

   **Project URL:**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```
   Example: `https://eubmypdgjygtjbckbgpf.supabase.co`

   **API Keys Section:**
   - You'll see two keys: `anon` `public` and `service_role`
   
   **Copy the `service_role` key:**
   - Look for "service_role" (secret)
   - Click "Reveal" button
   - Click the copy icon 📋
   - It looks like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...`

4. **Save these to your .env file:**
   - Open: `Backend-Repository\.env`
   - Replace the values:

   ```env
   PORT=5000
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...your-long-key-here...
   ```

   **Your actual file should look like:**
   ```env
   PORT=5000
   SUPABASE_URL=https://eubmypdgjygtjbckbgpf.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1Ym15cGRnanlndGpiY2tiZ3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3ODI1NjIsImV4cCI6MjA4NTM1ODU2Mn0.Sx3lb81L0TTXx1gqiB0rnO-zYovYWVDPwHuVgv6nqdU
   ```

5. **Save the file** (Ctrl + S)

---

## 🗄️ Part 4: Creating Database Tables

### Step 4: Open SQL Editor

1. **On the left sidebar**, click on **🔧 "SQL Editor"**
   - It's in the middle of the sidebar
   - Icon looks like a database with code

2. **You'll see the SQL Editor interface:**
   ```
   ┌─────────────────────────────────┐
   │  + New query   Snippets   ...   │
   ├─────────────────────────────────┤
   │                                  │
   │  [Large text editor area]        │
   │                                  │
   │                                  │
   └───────────[RUN]──────────────────┘
   ```

3. **Click "+ New query"** button (top left)

### Step 5: Run the Database Schema

1. **Open the schema file on your computer:**
   - Navigate to: `Backend-Repository\database-schema.sql`
   - Open it in VS Code or Notepad
   - **Select ALL text** (Ctrl + A)
   - **Copy** (Ctrl + C)

2. **Back in Supabase SQL Editor:**
   - Click in the text editor area
   - **Paste** the entire schema (Ctrl + V)
   - You should see all the SQL code

3. **Click the "RUN" button** (bottom right, blue button)
   - Or press **Ctrl + Enter**

4. **Wait 5-10 seconds** while it executes

5. **Success! You should see:**
   ```
   ✅ Success. No rows returned
   ```
   Or
   ```
   ✅ Success
   ```

   ⚠️ **If you see errors:**
   - Red text will appear
   - Most common: "relation already exists"
   - Solution: Skip to "Troubleshooting" section below

---

## ✅ Part 5: Verifying Your Tables

### Step 6: Check Tables Were Created

1. **On the left sidebar**, click **📊 "Table Editor"**

2. **You should see 4 tables:**
   ```
   📋 destinations
   👤 users
   ⭐ reviews
   📔 journals
   ```

3. **Click on "destinations" table**
   - You should see 5 sample destinations:
     - Bali, Indonesia
     - Kyoto, Japan
     - Patagonia, Argentina
     - Santorini, Greece
     - Marrakech, Morocco

4. **Click on "users" table**
   - You should see 1 user: Chloe Anderson

5. **Click on "reviews" table**
   - You should see 1 review for Bali

6. **Click on "journals" table**
   - You should see 1 journal entry

✅ **If you see all this data, your database is set up correctly!**

---

## 🔍 Part 6: Understanding Your Database Structure

### Step 7: Explore the Tables

#### **Destinations Table**
Click on **"destinations"** in Table Editor to see:

| Column Name | Type | Purpose |
|------------|------|---------|
| id | uuid | Unique identifier |
| name | text | Destination name (e.g., "Bali") |
| description | text | Full description |
| interests | text[] | Array like ["adventure", "culture"] |
| climate | text | "tropical", "temperate", "cold", "arid" |
| best_seasons | text[] | Array like ["summer", "spring"] |
| avg_daily_cost | numeric | Average daily cost in USD |
| avg_flight_cost | numeric | Average flight cost |
| avg_accommodation_cost | numeric | Per night cost |
| avg_food_cost | numeric | Food per day |
| avg_activities_cost | numeric | Activities per day |
| images | text[] | Array of image URLs |
| off_the_beaten_path | boolean | true/false |
| country | text | Country name |
| continent | text | Continent name |
| created_at | timestamp | Auto-generated |
| updated_at | timestamp | Auto-generated |

#### **Users Table**

| Column Name | Type | Purpose |
|------------|------|---------|
| id | uuid | Unique identifier |
| name | text | User's name |
| email | text | User's email (unique) |
| preferences | jsonb | JSON with interests, budget, etc. |
| created_at | timestamp | Auto-generated |
| updated_at | timestamp | Auto-generated |

#### **Reviews Table**

| Column Name | Type | Purpose |
|------------|------|---------|
| id | uuid | Unique identifier |
| destination_id | uuid | Links to destinations table |
| user_id | uuid | Links to users table |
| rating | integer | 1 to 5 stars |
| title | text | Review title |
| content | text | Full review text |
| tips | text[] | Array of travel tips |
| photos | text[] | Array of photo URLs |
| created_at | timestamp | Auto-generated |
| updated_at | timestamp | Auto-generated |

#### **Journals Table**

| Column Name | Type | Purpose |
|------------|------|---------|
| id | uuid | Unique identifier |
| user_id | uuid | Links to users table |
| destination_id | uuid | Links to destinations table |
| title | text | Journal title |
| content | text | Journal entry content |
| photos | text[] | Array of photo URLs |
| is_public | boolean | Public or private |
| trip_dates | text | Date range as text |
| views | integer | View count |
| created_at | timestamp | Auto-generated |
| updated_at | timestamp | Auto-generated |

---

## 🔒 Part 7: Row Level Security (RLS) - OPTIONAL

### Step 8: Understanding RLS (Already Configured)

The database schema already includes RLS policies, but here's what they do:

**RLS is already enabled for:**
- ✅ Destinations - Everyone can read, authenticated users can write
- ✅ Users - Users can view their own data
- ✅ Reviews - Everyone can read, authenticated users can write
- ✅ Journals - Public journals viewable by all

**You don't need to do anything here!** It's automatic.

**To verify RLS is enabled:**
1. Click **"Authentication"** in sidebar
2. Click **"Policies"** tab
3. You should see policies listed for each table

---

## 🧪 Part 8: Testing the Database Connection

### Step 9: Test from Backend Server

1. **Make sure you saved your .env file** with correct credentials

2. **Open Terminal/PowerShell**

3. **Navigate to backend:**
   ```powershell
   cd "c:\Puneet\Eaton\Personal\Khushboo\Masai\Project\Backend-Repository"
   ```

4. **Install dependencies (if not already):**
   ```powershell
   npm install
   ```

5. **Start the server:**
   ```powershell
   npm start
   ```

6. **You should see:**
   ```
   Server running on port 5000
   ```
   ✅ No errors = Connection successful!

7. **Test with browser:**
   - Open browser
   - Go to: `http://localhost:5000/api/destinations`
   - You should see JSON data with 5 destinations

   **Success!** Your backend is connected to Supabase!

---

## 📊 Part 9: Adding More Data (Optional)

### Step 10: Add Your Own Destination

1. **Go back to Supabase Table Editor**
2. **Click "destinations" table**
3. **Click "Insert row" button** (top right, green button)
4. **Fill in the form:**

   Example:
   ```
   name: Paris, France
   description: City of lights with Eiffel Tower, amazing food, and rich history
   interests: ["culture", "food", "history"]
   climate: temperate
   best_seasons: ["spring", "summer", "fall"]
   avg_daily_cost: 150
   avg_flight_cost: 600
   avg_accommodation_cost: 200
   avg_food_cost: 80
   avg_activities_cost: 100
   images: ["https://images.unsplash.com/photo-1502602898657-3e91760cbb34"]
   off_the_beaten_path: false
   country: France
   continent: Europe
   ```

5. **Click "Save"**
6. **Your new destination is added!**

---

## 🎓 Part 10: Understanding Supabase Dashboard

### Key Features You'll Use:

**📊 Table Editor:**
- View and edit data
- Add/delete rows
- See table structure

**🔧 SQL Editor:**
- Run custom SQL queries
- Create tables
- Modify schema

**🔐 Authentication:**
- Manage users (future feature)
- View policies
- Configure auth providers

**⚙️ Settings → API:**
- Get API keys
- View connection strings
- API documentation

**📈 Database:**
- View database size
- See connections
- Performance metrics

**🔍 Storage (not used yet):**
- For file uploads
- Image storage
- Future feature for photo uploads

---

## 🔧 Troubleshooting Common Issues

### Issue 1: "relation already exists"
**When:** Running schema again  
**Solution:**
1. Go to SQL Editor
2. Run this to delete existing tables:
   ```sql
   DROP TABLE IF EXISTS journals CASCADE;
   DROP TABLE IF EXISTS reviews CASCADE;
   DROP TABLE IF EXISTS users CASCADE;
   DROP TABLE IF EXISTS destinations CASCADE;
   ```
3. Then run the full schema again

### Issue 2: Can't see tables in Table Editor
**Solution:**
1. Refresh the page (F5)
2. Check SQL Editor for errors
3. Make sure schema ran successfully

### Issue 3: Backend can't connect
**Solution:**
1. Check `.env` file has correct values
2. Make sure SUPABASE_URL has `https://`
3. Verify service_role key is complete (very long)
4. Restart backend server

### Issue 4: "Invalid API key"
**Solution:**
1. Go to Settings → API
2. Copy the `service_role` key again (click Reveal)
3. Make sure you copied the ENTIRE key
4. Update `.env` file

### Issue 5: Empty tables (no sample data)
**Solution:**
1. Go to SQL Editor
2. Find the "SAMPLE DATA" section in database-schema.sql
3. Copy just the INSERT statements
4. Paste and run in SQL Editor

---

## 📋 Verification Checklist

Before moving forward, verify:

- [ ] ✅ Supabase account created
- [ ] ✅ Project created successfully
- [ ] ✅ Database password saved
- [ ] ✅ API URL copied to .env
- [ ] ✅ Service role key copied to .env
- [ ] ✅ Database schema executed (no errors)
- [ ] ✅ 4 tables visible in Table Editor
- [ ] ✅ Sample data present (5 destinations, 1 user, etc.)
- [ ] ✅ Backend server starts without errors
- [ ] ✅ Test API call returns destination data

---

## 🎯 Quick Reference Card

**📍 Supabase Dashboard:**
```
https://app.supabase.com/projects
```

**📋 Your Project URL:**
```
https://YOUR-PROJECT-ID.supabase.co
```

**🔑 Important Files:**
- Backend: `Backend-Repository\.env`
- Schema: `Backend-Repository\database-schema.sql`

**🧪 Test Endpoint:**
```
http://localhost:5000/api/destinations
```

**📊 Table Editor Path:**
```
Sidebar → Table Editor → Select table
```

**🔧 SQL Editor Path:**
```
Sidebar → SQL Editor → New query
```

---

## 📚 Next Steps After Supabase Setup

1. ✅ Test backend with Postman (see POSTMAN-TESTING-GUIDE.md)
2. ✅ Start frontend development
3. ✅ Connect frontend to backend APIs
4. ✅ Build UI components
5. ✅ Deploy to production

---

## 🆘 Need Help?

**Supabase Documentation:**
- https://supabase.com/docs

**Official Discord:**
- https://discord.supabase.com

**Video Tutorials:**
- Search "Supabase tutorial" on YouTube

**Project Support:**
- Check POSTMAN-TESTING-GUIDE.md
- Check Backend README.md
- Check REQUIREMENTS-ANALYSIS.md

---

## 🎉 Congratulations!

You've successfully set up Supabase for your Travel Inspiration Platform!

**Your database is now:**
✅ Created and configured  
✅ Populated with sample data  
✅ Connected to your backend  
✅ Ready for development  
✅ Secured with RLS policies  

**You're ready to start building! 🚀**

---

**Last Updated:** February 28, 2026  
**Version:** 1.0
