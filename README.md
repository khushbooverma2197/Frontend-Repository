# Travel Inspiration Platform - Frontend

## 🎯 Project Overview
A modern travel inspiration platform built with React, helping travelers like Chloe discover personalized destination recommendations, plan trips, estimate budgets, and share travel experiences.

## ✨ Features Implemented
✅ **Personalized Destination Recommendations** - Search destinations based on interests  
✅ **Immersive Photo Galleries** - High-resolution destination images  
✅ **Trip Planning Tools** - Save and organize favorite destinations  
✅ **Traveler Reviews & Insights** - Read authentic experiences from fellow travelers  
✅ **Budget Estimator** - Calculate trip costs with detailed breakdown  
✅ **Travel Journal** - Document and share travel adventures  
✅ **Destination Filters** - Filter by climate, season, budget, interests  
✅ **Local Experiences** - Discover unique activities at each destination  
✅ **Social Sharing** - Share travel stories and inspiration  
✅ **Responsive Design** - Mobile-friendly interface  

## 🛠 Tech Stack
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **ShadCN UI** - Component library
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing
- **Vite** - Fast build tool and dev server
- **Context API** - State management

## 📂 Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── PrimaryButton.jsx
│   ├── DestinationCard.jsx
│   ├── FilterPanel.jsx
│   ├── ReviewCard.jsx
│   └── JournalEntry.jsx
├── pages/              # Page components
│   ├── HomePage.jsx
│   ├── DestinationsPage.jsx
│   ├── DestinationDetailPage.jsx
│   ├── MyTripsPage.jsx
│   └── JournalsPage.jsx
├── context/            # React Context
│   └── UserPreferencesContext.jsx
├── services/           # API services
│   ├── api.js
│   ├── destinationService.js
│   ├── reviewService.js
│   └── journalService.js
├── hooks/              # Custom hooks
│   └── useUserPreferences.js
├── utils/              # Helper functions
│   └── formatCurrency.js
└── App.jsx             # Root component
```

## 🔧 Installation Steps

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup
1. Clone the repository:
```bash
git clone <your-frontend-repo-url>
cd Frontend-Repository
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
Create a `.env` file in the root:
```env
VITE_API_URL=http://localhost:5000/api
```

For production (deployed backend):
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

4. Start the development server:
```bash
npm run dev
```

The app will run on `http://localhost:5173`

## 🏗 Building for Production
```bash
npm run build
```

The build output will be in the `dist/` folder.

## 🚀 Deployment to Netlify

### Method 1: Netlify CLI
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod
```

### Method 2: GitHub Integration
1. Push code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Connect your repository
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Add environment variable:
   - `VITE_API_URL`: Your deployed backend URL
7. Deploy!

## 🎨 UI Components (ShadCN)
To add more ShadCN components:
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
```

## 📱 Key Features Guide

### 1. Destination Discovery
- Browse all destinations
- Filter by interests, climate, season, budget
- View detailed destination information
- See high-quality photo galleries

### 2. Personalized Recommendations
- Set your travel preferences
- Get AI-powered destination suggestions
- Match destinations to your interests

### 3. Budget Planning
- Calculate trip costs
- See breakdown: flights, accommodation, food, activities
- Adjust for trip duration and number of travelers
- Compare costs across destinations

### 4. Reviews & Insights
- Read authentic traveler reviews
- View ratings and tips
- Learn from real experiences
- See photos from other travelers

### 5. Travel Journal
- Document your trips
- Add photos and stories
- Share publicly or keep private
- Inspire other travelers

## 🔌 API Integration

### Axios Configuration
The app uses a centralized Axios instance in [src/services/api.js](src/services/api.js):
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});
```

### Service Modules
- `destinationService.js` - Destination-related API calls
- `reviewService.js` - Review operations
- `journalService.js` - Journal management

## 📦 Dependencies Explained

### Core
- **react** & **react-dom** - React library
- **react-router-dom** - Navigation and routing
- **axios** - API requests

### UI & Styling
- **tailwindcss** - Utility CSS
- **@radix-ui/react-*** - Accessible component primitives
- **lucide-react** - Icon library
- **clsx** & **tailwind-merge** - Conditional styling

### Development
- **vite** - Build tool
- **eslint** - Code linting

## 🎯 User Flow
1. **Landing** → User arrives at homepage
2. **Set Preferences** → Choose interests, budget, travel dates
3. **Browse Destinations** → View personalized recommendations
4. **Filter & Search** → Refine results
5. **View Details** → See destination info, photos, reviews
6. **Estimate Budget** → Calculate trip costs
7. **Save Favorites** → Add to trip planning list
8. **Read Reviews** → Learn from other travelers
9. **Plan Trip** → Organize itinerary
10. **Create Journal** → Document and share experience

## 🔗 Links
- **Deployed Frontend:** [Your Netlify URL]
- **Backend Repository:** [Link to backend repo]
- **Backend API:** [Your Render URL]
- **Video Demo:** [YouTube/Loom link]

## 📸 Screenshots
[Add screenshots of your application here]
- Homepage with destination grid
- Destination detail page
- Budget estimator interface
- Travel journal view

## 🎥 Video Walkthrough
[Link to video demonstration]

## 🔐 Login Credentials
If authentication is implemented:
- **Email:** demo@example.com
- **Password:** demo123

## 👤 Author
[Your Name]

## 📄 License
ISC

## 🙏 Acknowledgments
- ShadCN UI for beautiful components
- Tailwind CSS for styling
- Supabase for backend infrastructure
