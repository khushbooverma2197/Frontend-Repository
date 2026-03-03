import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getJournalById, deleteJournal } from '../services/journalService';
import { getDestinationById } from '../services/destinationService';
import Loading from '../components/Loading';
import ErrorDisplay from '../components/ErrorDisplay';
import PrimaryButton from '../components/PrimaryButton';

export default function JournalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [journal, setJournal] = useState(null);
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const journalData = await getJournalById(id);
        setJournal(journalData);
        
        // Fetch destination details if available
        if (journalData.destinationId) {
          try {
            const destData = await getDestinationById(journalData.destinationId);
            setDestination(destData);
          } catch (err) {
            console.error('Error fetching destination:', err);
          }
        }
      } catch (err) {
        console.error('Error fetching journal:', err);
        setError(err.message || 'Failed to load journal');
      } finally {
        setLoading(false);
      }
    };

    fetchJournal();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this journal entry?')) {
      return;
    }

    try {
      await deleteJournal(id);
      navigate('/journals');
    } catch (err) {
      alert('Failed to delete journal: ' + err.message);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorDisplay message={error} />;
  if (!journal) return <ErrorDisplay message="Journal not found" />;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/journals" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Journals
        </Link>

        {/* Journal Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          {journal.photos && journal.photos.length > 0 && (
            <div className="w-full h-96 overflow-hidden">
              <img
                src={journal.photos[0]}
                alt={journal.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  {journal.title}
                </h1>
                
                {destination && (
                  <Link 
                    to={`/destination/${destination.id}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {destination.name}, {destination.country}
                  </Link>
                )}
              </div>

              <div className="flex space-x-2 ml-4">
                <Link to={`/journals/${id}/edit`}>
                  <PrimaryButton variant="secondary">
                    <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </PrimaryButton>
                </Link>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Meta Information */}
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(journal.visitDate || journal.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>

              {journal.rating && (
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold">{journal.rating}/5</span>
                </div>
              )}

              <span className={`px-2 py-1 text-xs rounded-full ${
                journal.isPublic 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {journal.isPublic ? 'Public' : 'Private'}
              </span>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {journal.content}
              </div>
            </div>

            {/* Highlights */}
            {journal.highlights && journal.highlights.length > 0 && (
              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  ✨ Highlights
                </h3>
                <ul className="space-y-2">
                  {journal.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Photo Gallery */}
            {journal.photos && journal.photos.length > 0 && (
              <div className="mt-8">
                <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  Photos
                  <span className="text-xs font-normal text-gray-400">{journal.photos.length} image{journal.photos.length !== 1 ? 's' : ''}</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {journal.photos.map((photo, index) => (
                    <a
                      key={index}
                      href={photo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative group block aspect-square"
                    >
                      <img
                        src={photo}
                        alt={`${journal.title} - Photo ${index + 1}`}
                        className="w-full h-full object-cover rounded-xl border border-gray-100 group-hover:opacity-90 transition-opacity"
                      />
                      {index === 0 && (
                        <span className="absolute top-2 left-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-md font-medium">Cover</span>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-7 h-7 text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Destination Card */}
        {destination && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              About {destination.name}
            </h3>
            <p className="text-gray-600 mb-4">{destination.description}</p>
            <Link to={`/destination/${destination.id}`}>
              <PrimaryButton>
                View Destination Details
              </PrimaryButton>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
