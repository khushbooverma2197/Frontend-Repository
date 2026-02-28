import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getAllDestinations } from '../services/destinationService';
import { createJournal, updateJournal, getJournalById } from '../services/journalService';
import PrimaryButton from '../components/PrimaryButton';
import Loading from '../components/Loading';

export default function JournalFormPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const preselectedDestinationId = searchParams.get('destination');

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    destinationId: preselectedDestinationId || '',
    title: '',
    content: '',
    visitDate: '',
    rating: 5,
    photos: [],
    highlights: '',
    isPublic: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const destData = await getAllDestinations();
        setDestinations(destData);

        if (isEditing) {
          const journalData = await getJournalById(id);
          setFormData({
            destinationId: journalData.destinationId || '',
            title: journalData.title || '',
            content: journalData.content || '',
            visitDate: journalData.visitDate || '',
            rating: journalData.rating || 5,
            photos: journalData.photos || [],
            highlights: journalData.highlights ? journalData.highlights.join(', ') : '',
            isPublic: journalData.isPublic || false
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEditing]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const journalData = {
        ...formData,
        highlights: formData.highlights.split(',').map(h => h.trim()).filter(h => h)
      };

      if (isEditing) {
        await updateJournal(id, journalData);
      } else {
        await createJournal(journalData);
      }

      navigate('/journals');
    } catch (error) {
      console.error('Error saving journal:', error);
      alert('Failed to save journal: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            {isEditing ? 'Edit Journal Entry' : 'Create New Journal Entry'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Destination */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination *
              </label>
              <select
                name="destinationId"
                value={formData.destinationId}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a destination</option>
                {destinations.map(dest => (
                  <option key={dest.id} value={dest.id}>
                    {dest.name}, {dest.country}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entry Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="My Amazing Trip to..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Visit Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visit Date
              </label>
              <input
                type="date"
                name="visitDate"
                value={formData.visitDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Experience *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows="8"
                placeholder="Share your travel story, experiences, and memories..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Highlights */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Highlights (comma-separated)
              </label>
              <input
                type="text"
                name="highlights"
                value={formData.highlights}
                onChange={handleInputChange}
                placeholder="Sunset view, Local cuisine, Friendly people"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Rating
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                    className="focus:outline-none"
                  >
                    <svg
                      className={`w-10 h-10 ${
                        star <= formData.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  </button>
                ))}
                <span className="ml-2 text-gray-600">{formData.rating} / 5</span>
              </div>
            </div>

            {/* Public/Private */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleInputChange}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <label className="ml-3 text-gray-700">
                Make this journal entry public (visible to other travelers)
              </label>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4 pt-6">
              <PrimaryButton
                type="submit"
                disabled={submitting}
                fullWidth
              >
                {submitting ? 'Saving...' : isEditing ? 'Update Entry' : 'Create Entry'}
              </PrimaryButton>
              <button
                type="button"
                onClick={() => navigate('/journals')}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
