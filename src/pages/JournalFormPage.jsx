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
  const [uploadError, setUploadError] = useState('');

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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadError('');

    const oversized = files.filter(f => f.size > 5 * 1024 * 1024);
    if (oversized.length > 0) {
      setUploadError('Some images exceed 5 MB and were skipped.');
    }

    const validFiles = files.filter(f => f.size <= 5 * 1024 * 1024);
    const totalAfter = formData.photos.length + validFiles.length;
    if (totalAfter > 6) {
      setUploadError('Maximum 6 photos allowed per journal entry.');
      return;
    }

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, ev.target.result]
        }));
      };
      reader.readAsDataURL(file);
    });

    // Reset input so the same file can be re-added if removed
    e.target.value = '';
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const journalData = {
        destinationId: formData.destinationId,
        title: formData.title || 'Untitled',
        content: formData.content || '',
        visitDate: formData.visitDate || new Date().toISOString().split('T')[0],
        rating: parseInt(formData.rating) || 5,
        photos: Array.isArray(formData.photos) ? formData.photos : [],
        highlights: typeof formData.highlights === 'string' 
          ? formData.highlights.split(',').map(h => h.trim()).filter(h => h)
          : (Array.isArray(formData.highlights) ? formData.highlights : []),
        isPublic: Boolean(formData.isPublic)
      };
      
      console.log('Submitting journal:', journalData);

      if (isEditing) {
        await updateJournal(id, journalData);
      } else {
        await createJournal(journalData);
      }

      navigate('/journals');
    } catch (error) {
      console.error('Error saving journal:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.details || error.response?.data?.error || error.message;
      alert('Failed to save journal: ' + errorMessage);
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

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photos
                <span className="ml-2 text-xs font-normal text-gray-400">Up to 6 images, max 5 MB each</span>
              </label>

              {/* Upload zone */}
              <label
                htmlFor="photo-upload"
                className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-blue-50 hover:border-blue-400 transition-colors group"
              >
                <svg className="w-10 h-10 text-gray-400 group-hover:text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-500 group-hover:text-blue-600 font-medium">Click to browse images from your PC</span>
                <span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP, GIF supported</span>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>

              {uploadError && (
                <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {uploadError}
                </p>
              )}

              {/* Preview grid */}
              {formData.photos.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover rounded-xl border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                        title="Remove photo"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-1.5 left-1.5 text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded-md font-medium">Cover</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
