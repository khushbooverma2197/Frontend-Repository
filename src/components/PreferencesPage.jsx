import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../components/PrimaryButton';

const INTEREST_OPTIONS = [
  { id: 'adventure', label: 'Adventure', icon: '🏔️', description: 'Thrilling experiences and outdoor activities' },
  { id: 'relaxation', label: 'Relaxation', icon: '🧘', description: 'Peaceful getaways and spa retreats' },
  { id: 'culture', label: 'Culture', icon: '🏛️', description: 'Museums, history, and cultural immersion' },
  { id: 'beach', label: 'Beach', icon: '🏖️', description: 'Coastal destinations and water activities' },
  { id: 'nature', label: 'Nature', icon: '🌲', description: 'National parks and wildlife' },
  { id: 'food', label: 'Food & Culinary', icon: '🍜', description: 'Local cuisine and food tours' },
  { id: 'history', label: 'History', icon: '📜', description: 'Historical sites and landmarks' },
  { id: 'photography', label: 'Photography', icon: '📸', description: 'Scenic locations for photography' }
];

const BUDGET_RANGES = [
  { id: 'budget', label: 'Budget Friendly', range: '$0-$75/day', max: 75 },
  { id: 'mid-range', label: 'Mid-Range', range: '$76-$150/day', max: 150 },
  { id: 'luxury', label: 'Luxury', range: '$151+/day', max: 999999 }
];

export default function PreferencesPage() {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('userPreferences');
    return saved ? JSON.parse(saved) : {
      interests: [],
      budget: 'mid-range',
      travelerType: 'solo',
      preferredSeasons: []
    };
  });

  const toggleInterest = (interestId) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handleSave = () => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    localStorage.setItem('preferencesSet', 'true');
    alert('Preferences saved! You\'ll now see personalized recommendations.');
    navigate('/');
  };

  const handleSkip = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Personalize Your Travel Experience
          </h1>
          <p className="text-xl text-gray-600">
            Tell us about your preferences to get tailored destination recommendations
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-10">
          {/* Interests Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              What interests you?
            </h2>
            <p className="text-gray-600 mb-6">Select all that apply</p>
            <div className="grid md:grid-cols-2 gap-4">
              {INTEREST_OPTIONS.map(interest => (
                <button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    preferences.interests.includes(interest.id)
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start">
                    <span className="text-3xl mr-3">{interest.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-800">{interest.label}</h3>
                      <p className="text-sm text-gray-600">{interest.description}</p>
                    </div>
                    {preferences.interests.includes(interest.id) && (
                      <svg className="w-6 h-6 text-blue-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Budget Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              What's your typical daily budget?
            </h2>
            <div className="space-y-3">
              {BUDGET_RANGES.map(budget => (
                <button
                  key={budget.id}
                  onClick={() => setPreferences(prev => ({ ...prev, budget: budget.id }))}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    preferences.budget === budget.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{budget.label}</h3>
                      <p className="text-sm text-gray-600">{budget.range}</p>
                    </div>
                    {preferences.budget === budget.id && (
                      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Traveler Type */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              How do you prefer to travel?
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { id: 'solo', label: 'Solo Traveler', icon: '🚶' },
                { id: 'couple', label: 'Couple', icon: '👫' },
                { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
                { id: 'group', label: 'Group', icon: '👥' }
              ].map(type => (
                <button
                  key={type.id}
                  onClick={() => setPreferences(prev => ({ ...prev, travelerType: type.id }))}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    preferences.travelerType === type.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-4xl block mb-2">{type.icon}</span>
                  <span className="font-semibold">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              onClick={handleSkip}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Skip for Now
            </button>
            <PrimaryButton
              onClick={handleSave}
              disabled={preferences.interests.length === 0}
              className="flex-1"
            >
              Save Preferences
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
