import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import DestinationDetailPage from './pages/DestinationDetailPage';
import BudgetPlannerPage from './pages/BudgetPlannerPage';
import JournalsPage from './pages/JournalsPage';
import JournalFormPage from './pages/JournalFormPage';
import ReviewsPage from './pages/ReviewsPage';

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
          <Route path="/journals/:id/edit" element={<JournalFormPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
