import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import DestinationDetailPage from './pages/DestinationDetailPage';
import BudgetPlannerPage from './pages/BudgetPlannerPage';
import JournalsPage from './pages/JournalsPage';
import JournalFormPage from './pages/JournalFormPage';
import JournalDetailPage from './pages/JournalDetailPage';
import ReviewsPage from './pages/ReviewsPage';
import PreferencesPage from './pages/PreferencesPage';
import TripPlannerPage from './pages/TripPlannerPage';
import MyTripsPage from './pages/MyTripsPage';
import DealsPage from './pages/DealsPage';
import CommunityPage from './pages/CommunityPage';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/destination/:id" element={<DestinationDetailPage />} />
          <Route path="/budget" element={<BudgetPlannerPage />} />
          <Route path="/journals" element={<JournalsPage />} />
          <Route path="/journals/new" element={<JournalFormPage />} />
          <Route path="/journals/:id" element={<JournalDetailPage />} />
          <Route path="/journals/:id/edit" element={<JournalFormPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/preferences" element={<PreferencesPage />} />
          <Route path="/trip-planner" element={<TripPlannerPage />} />
          <Route path="/my-trips" element={<MyTripsPage />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/community" element={<CommunityPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
