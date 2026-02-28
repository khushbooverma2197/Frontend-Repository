# 🚀 Complete Postman Testing Guide for Travel Inspiration Platform
## Step-by-Step Tutorial for Beginners

---

## 📥 Part 1: Installing Postman

### Option 1: Desktop Application (Recommended)
1. Go to https://www.postman.com/downloads/
2. Download Postman for Windows
3. Run the installer
4. Create a free account (optional but recommended)
5. Launch Postman

### Option 2: Web Version
1. Go to https://web.postman.co/
2. Sign up for a free account
3. Start using Postman in your browser

---

## 🎯 Part 2: Setting Up Your First Request

### Understanding Postman Interface:
```
┌─────────────────────────────────────┐
│  New Tab  │  Collections  │  ...    │
├─────────────────────────────────────┤
│  [GET ▼]  [URL Bar]      [Send]     │
├─────────────────────────────────────┤
│  Params │ Authorization │ Headers   │
│  Body   │ Pre-request   │ Tests     │
├─────────────────────────────────────┤
│         Response Section             │
│     Status: 200 OK                   │
│     Body | Headers | Cookies         │
└─────────────────────────────────────┘
```

---

## 🛠 Part 3: Before You Start Testing

### Step 1: Start Your Backend Server
1. Open Terminal/PowerShell
2. Navigate to Backend-Repository:
   ```powershell
   cd "c:\Puneet\Eaton\Personal\Khushboo\Masai\Project\Backend-Repository"
   ```
3. Install dependencies (first time only):
   ```powershell
   npm install
   ```
4. Start the server:
   ```powershell
   npm start
   ```
5. You should see: `Server running on port 5000`
6. **Keep this terminal window open!**

### Step 2: Set Up Supabase Database
1. Go to https://supabase.com
2. Sign in to your account
3. Open your project
4. Click on "SQL Editor" in the left sidebar
5. Click "New Query"
6. Copy all content from `database-schema.sql` file
7. Paste it into the SQL Editor
8. Click "Run" button
9. Wait for "Success. No rows returned"

---

## 🧪 Part 4: Testing All API Endpoints

### ✅ TEST 1: Check if Backend is Running

**What:** Verify the server is working  
**Method:** GET  
**URL:** `http://localhost:5000/`

**Steps:**
1. Click "+ New" button (top left)
2. Select "HTTP Request"
3. Make sure "GET" is selected in the dropdown
4. Type URL: `http://localhost:5000/`
5. Click "Send" button (blue button)

**Expected Response:**
```
Status: 200 OK
Body: Travel Inspiration Platform Backend Running
```

---

### 🗺 DESTINATIONS API TESTS

---

### ✅ TEST 2: Get All Destinations

**What:** Retrieve all destinations from database  
**Method:** GET  
**URL:** `http://localhost:5000/api/destinations`

**Steps:**
1. Create new request
2. Method: GET
3. URL: `http://localhost:5000/api/destinations`
4. Click "Send"

**Expected Response:**
```json
Status: 200 OK
[
  {
    "id": "uuid-here",
    "name": "Bali, Indonesia",
    "description": "A tropical paradise...",
    "interests": ["adventure", "relaxation", "culture"],
    "climate": "tropical",
    "best_seasons": ["summer", "spring"],
    "avg_daily_cost": 75.00,
    "images": ["url1", "url2"],
    ...
  },
  // More destinations...
]
```

**✨ What This Tests:** Basic database connection and retrieval

---

### ✅ TEST 3: Search Destinations with Filters

**What:** Find destinations based on interests and budget  
**Method:** GET  
**URL:** `http://localhost:5000/api/destinations/search?interests=adventure&budget=2000`

**Steps:**
1. Create new request
2. Method: GET
3. URL: `http://localhost:5000/api/destinations/search`
4. Click on "Params" tab (below URL bar)
5. Add parameters:
   
   | KEY | VALUE |
   |-----|-------|
   | interests | adventure |
   | budget | 2000 |
   | climate | tropical |

6. Click "Send"

**Alternative: Using URL directly:**
```
http://localhost:5000/api/destinations/search?interests=adventure&budget=2000&climate=tropical
```

**Expected Response:**
```json
Status: 200 OK
[
  {
    "name": "Bali, Indonesia",
    "avg_daily_cost": 75.00,
    "interests": ["adventure", "relaxation"],
    ...
  }
]
```

**✨ What This Tests:** Search and filter functionality

---

### ✅ TEST 4: Get Personalized Recommendations

**What:** Get destination suggestions based on interests  
**Method:** POST  
**URL:** `http://localhost:5000/api/destinations/recommendations`

**Steps:**
1. Create new request
2. Method: **POST** (change from GET!)
3. URL: `http://localhost:5000/api/destinations/recommendations`
4. Click on "Body" tab
5. Select "raw" radio button
6. Select "JSON" from dropdown (right side)
7. Enter this JSON:
   ```json
   {
     "interests": "adventure,culture,photography"
   }
   ```
8. Click "Send"

**Expected Response:**
```json
Status: 200 OK
[
  {
    "name": "Kyoto, Japan",
    "interests": ["culture", "history", "photography"],
    ...
  },
  // More matching destinations...
]
```

**✨ What This Tests:** Personalized recommendation algorithm

---

### ✅ TEST 5: Get Budget Estimate

**What:** Calculate trip cost for specific destination  
**Method:** GET  
**URL:** `http://localhost:5000/api/destinations/{destination-id}/budget`

**Steps:**
1. First, copy a destination ID from TEST 2 response
2. Create new request
3. Method: GET
4. URL: `http://localhost:5000/api/destinations/PASTE-ID-HERE/budget`
5. Add parameters in "Params" tab:
   
   | KEY | VALUE |
   |-----|-------|
   | duration | 7 |
   | travelers | 2 |

6. Click "Send"

**Example URL:**
```
http://localhost:5000/api/destinations/abc123-uuid/budget?duration=7&travelers=2
```

**Expected Response:**
```json
Status: 200 OK
{
  "destination": "Bali, Indonesia",
  "duration": "7 days",
  "travelers": 2,
  "breakdown": {
    "flights": 1000,
    "accommodation": 700,
    "food": 700,
    "activities": 1050
  },
  "total": 3450,
  "perPerson": 1725
}
```

**✨ What This Tests:** Budget calculation feature

---

### ✅ TEST 6: Get Single Destination by ID

**What:** Get detailed info about one destination  
**Method:** GET  
**URL:** `http://localhost:5000/api/destinations/{destination-id}`

**Steps:**
1. Copy a destination ID from previous tests
2. Create new request
3. Method: GET
4. URL: Replace {destination-id} with actual ID
5. Click "Send"

**Expected Response:**
```json
Status: 200 OK
{
  "id": "uuid",
  "name": "Bali, Indonesia",
  "description": "Full description...",
  // All destination details
}
```

---

### ✅ TEST 7: Create New Destination (Protected)

**What:** Add a new destination to database  
**Method:** POST  
**URL:** `http://localhost:5000/api/destinations`

**Steps:**
1. Create new request
2. Method: POST
3. URL: `http://localhost:5000/api/destinations`
4. Click "Headers" tab
5. Add header:
   
   | KEY | VALUE |
   |-----|-------|
   | Authorization | Bearer test-token-123 |

6. Click "Body" tab
7. Select "raw" and "JSON"
8. Paste this JSON:
   ```json
   {
     "name": "Reykjavik, Iceland",
     "description": "Land of fire and ice with stunning northern lights, geothermal pools, and dramatic landscapes.",
     "interests": ["adventure", "nature", "photography"],
     "climate": "cold",
     "best_seasons": ["summer", "winter"],
     "avg_daily_cost": 180,
     "avg_flight_cost": 700,
     "avg_accommodation_cost": 250,
     "avg_food_cost": 90,
     "avg_activities_cost": 150,
     "images": ["https://example.com/iceland1.jpg"],
     "off_the_beaten_path": false,
     "country": "Iceland",
     "continent": "Europe"
   }
   ```
9. Click "Send"

**Expected Response:**
```json
Status: 201 Created
{
  "id": "new-uuid",
  "name": "Reykjavik, Iceland",
  // All the data you sent
}
```

**✨ What This Tests:** Creating new resources with authentication

---

### 👤 USER API TESTS

---

### ✅ TEST 8: Create a New User

**What:** Register a new user  
**Method:** POST  
**URL:** `http://localhost:5000/api/users`

**Steps:**
1. Method: POST
2. URL: `http://localhost:5000/api/users`
3. Body → raw → JSON:
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "preferences": {
       "interests": ["adventure", "culture"],
       "budget": 1500
     }
   }
   ```
4. Click "Send"
5. **SAVE THE USER ID** from response for next tests!

**Expected Response:**
```json
Status: 201 Created
{
  "id": "user-uuid-save-this",
  "name": "John Doe",
  "email": "john@example.com",
  "preferences": {...}
}
```

---

### ✅ TEST 9: Get User Preferences

**What:** Retrieve user's travel preferences  
**Method:** GET  
**URL:** `http://localhost:5000/api/users/{user-id}/preferences`

**Steps:**
1. Method: GET
2. URL: Replace {user-id} with ID from TEST 8
3. Click "Send"

**Expected Response:**
```json
Status: 200 OK
{
  "interests": ["adventure", "culture"],
  "budget": 1500
}
```

---

### ✅ TEST 10: Update User Preferences

**What:** Change user's travel preferences  
**Method:** PUT  
**URL:** `http://localhost:5000/api/users/{user-id}/preferences`

**Steps:**
1. Method: PUT
2. URL: Use your user ID
3. Body → raw → JSON:
   ```json
   {
     "interests": ["relaxation", "beach", "food"],
     "budget": 2500,
     "travelDates": "2026-07-01 to 2026-07-15"
   }
   ```
4. Click "Send"

**Expected Response:**
```json
Status: 200 OK
{
  "id": "user-uuid",
  "preferences": {
    "interests": ["relaxation", "beach", "food"],
    "budget": 2500,
    "travelDates": "2026-07-01 to 2026-07-15"
  }
}
```

---

### ⭐ REVIEWS API TESTS

---

### ✅ TEST 11: Create a Review

**What:** Post a review for a destination  
**Method:** POST  
**URL:** `http://localhost:5000/api/reviews`

**Steps:**
1. Method: POST
2. URL: `http://localhost:5000/api/reviews`
3. Body → raw → JSON:
   ```json
   {
     "destination_id": "PASTE-DESTINATION-ID",
     "user_id": "PASTE-YOUR-USER-ID",
     "rating": 5,
     "title": "Incredible experience!",
     "content": "This destination exceeded all my expectations. The culture is rich, the food is amazing, and the people are so welcoming.",
     "tips": [
       "Visit in May for best weather",
       "Learn a few local phrases",
       "Try the street food"
     ],
     "photos": [
       "https://example.com/photo1.jpg",
       "https://example.com/photo2.jpg"
     ]
   }
   ```
4. Click "Send"
5. **SAVE THE REVIEW ID** for later!

**Expected Response:**
```json
Status: 201 Created
{
  "id": "review-uuid",
  "rating": 5,
  "title": "Incredible experience!",
  ...
}
```

---

### ✅ TEST 12: Get Reviews for a Destination

**What:** See all reviews for a specific destination  
**Method:** GET  
**URL:** `http://localhost:5000/api/reviews/destination/{destination-id}`

**Steps:**
1. Method: GET
2. URL: Replace {destination-id} with actual ID
3. Click "Send"

**Expected Response:**
```json
Status: 200 OK
[
  {
    "id": "review-uuid",
    "rating": 5,
    "title": "Incredible experience!",
    "content": "...",
    "tips": ["tip1", "tip2"],
    "created_at": "2026-02-28T10:00:00"
  },
  // More reviews...
]
```

---

### 📔 JOURNAL API TESTS

---

### ✅ TEST 13: Create a Travel Journal

**What:** Document a travel experience  
**Method:** POST  
**URL:** `http://localhost:5000/api/journals`

**Steps:**
1. Method: POST
2. URL: `http://localhost:5000/api/journals`
3. Body → raw → JSON:
   ```json
   {
     "user_id": "YOUR-USER-ID",
     "destination_id": "DESTINATION-ID",
     "title": "My Amazing Bali Adventure",
     "content": "Day 1: Arrived in Denpasar, the tropical air hit me immediately...\n\nDay 2: Explored the rice terraces in Ubud, absolutely breathtaking...\n\nDay 3: Beach day at Seminyak, perfect waves for surfing...",
     "photos": [
       "https://example.com/journal-photo1.jpg",
       "https://example.com/journal-photo2.jpg"
     ],
     "is_public": true,
     "trip_dates": "2026-06-01 to 2026-06-10"
   }
   ```
4. Click "Send"

**Expected Response:**
```json
Status: 201 Created
{
  "id": "journal-uuid",
  "title": "My Amazing Bali Adventure",
  "is_public": true,
  ...
}
```

---

### ✅ TEST 14: Get All Public Journals

**What:** Browse public travel journals  
**Method:** GET  
**URL:** `http://localhost:5000/api/journals`

**Steps:**
1. Method: GET
2. URL: `http://localhost:5000/api/journals`
3. Click "Send"

**Expected Response:**
```json
Status: 200 OK
[
  {
    "id": "journal-uuid",
    "title": "My Amazing Bali Adventure",
    "content": "...",
    "is_public": true,
    ...
  }
]
```

---

### ✅ TEST 15: Get User's Journals

**What:** Get all journals by a specific user  
**Method:** GET  
**URL:** `http://localhost:5000/api/journals/user/{user-id}`

**Steps:**
1. Method: GET
2. URL: Replace {user-id} with actual user ID
3. Click "Send"

**Expected Response:**
```json
Status: 200 OK
[
  // All journals created by this user
]
```

---

## 💾 Part 5: Saving Your Tests (Creating a Collection)

### Why Create a Collection?
- Save all your tests in one place
- Run all tests at once
- Share tests with team members
- Export/Import for backup

### Steps to Create Collection:

1. **Create Collection:**
   - Click "Collections" in left sidebar
   - Click "+" or "Create Collection"
   - Name it: "Travel Inspiration API"
   - Click "Create"

2. **Add Requests to Collection:**
   - For each test request you created
   - Click "Save" button (top right)
   - Select "Travel Inspiration API" collection
   - Give request a name (e.g., "Get All Destinations")
   - Click "Save"

3. **Organize with Folders:**
   - Right-click collection
   - "Add Folder"
   - Create folders: "Destinations", "Users", "Reviews", "Journals"
   - Drag requests into appropriate folders

---

## 🎨 Part 6: Using Variables (Advanced)

### Why Use Variables?
- Don't repeat URLs
- Easy to switch between local/production
- Change values in one place

### Setup Environment:

1. Click "⚙️ Environments" (top right)
2. Click "Create Environment"
3. Name it: "Local Development"
4. Add variables:

   | VARIABLE | INITIAL VALUE | CURRENT VALUE |
   |----------|---------------|---------------|
   | base_url | http://localhost:5000 | http://localhost:5000 |
   | api_url | {{base_url}}/api | {{base_url}}/api |
   | auth_token | Bearer test-token-123 | Bearer test-token-123 |

5. Click "Save"
6. Select "Local Development" from dropdown (top right)

### Use Variables in Requests:

Instead of: `http://localhost:5000/api/destinations`  
Use: `{{api_url}}/destinations`

In Headers, instead of: `Bearer test-token-123`  
Use: `{{auth_token}}`

---

## 🧪 Part 7: Running All Tests at Once

### Collection Runner:

1. Click your "Travel Inspiration API" collection
2. Click "Run" button (has ▶️ icon)
3. Select which requests to run
4. Click "Run Travel Inspiration API"
5. Watch all tests execute!

**Results Screen Shows:**
- ✅ Which tests passed (green)
- ❌ Which tests failed (red)
- Response times
- Status codes

---

## 🔍 Part 8: Understanding Response Codes

| Code | Meaning | What It Typically Means |
|------|---------|-------------------------|
| 200 | OK | Request successful (GET, PUT) |
| 201 | Created | Successfully created (POST) |
| 204 | No Content | Successfully deleted (DELETE) |
| 400 | Bad Request | Invalid data sent |
| 401 | Unauthorized | Missing/invalid auth token |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Backend code error |

---

## ❌ Part 9: Troubleshooting Common Issues

### Issue 1: "Could not get response" / Connection Error
**Solution:**
- Check if backend server is running
- Look at terminal - should say "Server running on port 5000"
- Try: `http://localhost:5000` in browser

### Issue 2: 500 Internal Server Error
**Solution:**
- Check backend terminal for error logs
- Database might not be set up
- Run database-schema.sql in Supabase

### Issue 3: 404 Not Found
**Solution:**
- Check URL spelling
- Make sure you use `/api/` in path
- Verify endpoint exists in README

### Issue 4: Empty Array Response `[]`
**Solution:**
- Database might be empty
- Run sample data from database-schema.sql
- Check Supabase to confirm data exists

### Issue 5: "Unexpected token in JSON"
**Solution:**
- Check JSON syntax in Body
- Make sure commas are correct
- Use JSON validator: jsonlint.com

---

## 📊 Part 10: Testing Checklist

Use this checklist to verify all features:

### ✅ Destinations
- [ ] Get all destinations
- [ ] Search with filters (interests, budget, climate)
- [ ] Get personalized recommendations
- [ ] Get budget estimate
- [ ] Get single destination by ID
- [ ] Create new destination
- [ ] Update destination
- [ ] Delete destination

### ✅ Users
- [ ] Create user
- [ ] Get user by ID
- [ ] Get user preferences
- [ ] Update user preferences

### ✅ Reviews
- [ ] Create review
- [ ] Get all reviews
- [ ] Get reviews by destination
- [ ] Update review
- [ ] Delete review

### ✅ Journals
- [ ] Create journal entry
- [ ] Get all public journals
- [ ] Get user's journals
- [ ] Get journal by ID
- [ ] Update journal
- [ ] Delete journal

---

## 📦 Part 11: Exporting Your Collection

### To Share or Backup:

1. Right-click "Travel Inspiration API" collection
2. Click "Export"
3. Choose "Collection v2.1" format
4. Click "Export"
5. Save file to your computer

### To Import:

1. Click "Import" button (top left)
2. Select exported JSON file
3. Click "Import"

---

## 🎯 Part 12: Quick Testing Workflow

**For daily testing:**

1. ✅ Start backend server
2. ✅ Open Postman
3. ✅ Select "Local Development" environment
4. ✅ Run Collection Runner
5. ✅ Check all tests pass
6. ✅ Test new features individually

---

## 💡 Pro Tips

1. **Use Ctrl+Enter** to send request quickly
2. **Use Collections** to organize tests
3. **Use Variables** for reusable values
4. **Save responses** as examples for documentation
5. **Add descriptions** to requests for clarity
6. **Use folders** to group related endpoints
7. **Export collection** regularly for backup

---

## 📚 Additional Resources

- Postman Learning Center: https://learning.postman.com
- REST API Tutorial: https://restfulapi.net
- HTTP Status Codes: https://httpstatuses.com

---

## ✅ Success Criteria

Your API is working correctly when:

✅ All GET requests return 200 OK  
✅ POST requests create data (201 Created)  
✅ PUT requests update data (200 OK)  
✅ DELETE requests work (200 OK or 204)  
✅ Search filters return correct results  
✅ Budget calculator returns breakdown  
✅ Recommendations match interests  
✅ Reviews link to destinations  
✅ Journals appear in listings  

---

**🎉 Congratulations! You now know how to test APIs with Postman!**
