import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { useAuth } from './context/AuthContext';

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-gray-50" />;
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace /> : <SignupPage />} />

          <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" replace />} />
          <Route path="/destination/:id" element={isAuthenticated ? <DestinationDetailPage /> : <Navigate to="/login" replace />} />
          <Route path="/budget" element={isAuthenticated ? <BudgetPlannerPage /> : <Navigate to="/login" replace />} />
          <Route path="/journals" element={isAuthenticated ? <JournalsPage /> : <Navigate to="/login" replace />} />
          <Route path="/journals/new" element={isAuthenticated ? <JournalFormPage /> : <Navigate to="/login" replace />} />
          <Route path="/journals/:id" element={isAuthenticated ? <JournalDetailPage /> : <Navigate to="/login" replace />} />
          <Route path="/journals/:id/edit" element={isAuthenticated ? <JournalFormPage /> : <Navigate to="/login" replace />} />
          <Route path="/reviews" element={isAuthenticated ? <ReviewsPage /> : <Navigate to="/login" replace />} />
          <Route path="/preferences" element={isAuthenticated ? <PreferencesPage /> : <Navigate to="/login" replace />} />
          <Route path="/trip-planner" element={isAuthenticated ? <TripPlannerPage /> : <Navigate to="/login" replace />} />
          <Route path="/my-trips" element={isAuthenticated ? <MyTripsPage /> : <Navigate to="/login" replace />} />
          <Route path="/deals" element={isAuthenticated ? <DealsPage /> : <Navigate to="/login" replace />} />
          <Route path="/community" element={isAuthenticated ? <CommunityPage /> : <Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
