import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllJournals, deleteJournal } from '../services/journalService';
import Loading from '../components/Loading';
import ErrorDisplay from '../components/ErrorDisplay';
import PrimaryButton from '../components/PrimaryButton';

export default function JournalsPage() {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJournals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllJournals();
      setJournals(data);
    } catch (err) {
      console.error('Error fetching journals:', err);
      setError(err.message || 'Failed to load journals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this journal entry?')) {
      return;
    }

    try {
      await deleteJournal(id);
      setJournals(journals.filter(j => j.id !== id));
    } catch (err) {
      alert('Failed to delete journal: ' + err.message);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorDisplay message={error} onRetry={fetchJournals} />;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">My Travel Journals</h1>
            <p className="text-gray-600">Document your adventures and memories</p>
          </div>
          <Link to="/journals/new">
            <PrimaryButton>
              <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Journal Entry
            </PrimaryButton>
          </Link>
        </div>

        {journals.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Journal Entries Yet</h3>
            <p className="text-gray-500 mb-6">Start documenting your travel experiences!</p>
            <Link to="/journals/new">
              <PrimaryButton>Create Your First Entry</PrimaryButton>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {journals.map((journal) => (
              <div key={journal.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                {journal.photos && journal.photos.length > 0 && (
                  <img
                    src={journal.photos[0]}
                    alt={journal.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">
                      {new Date(journal.visitDate || journal.createdAt).toLocaleDateString()}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      journal.isPublic 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {journal.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {journal.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {journal.content}
                  </p>

                  {journal.destinationName && (
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {journal.destinationName}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Link to={`/journals/${journal.id}`} className="flex-1">
                      <PrimaryButton fullWidth size="sm">
                        Read More
                      </PrimaryButton>
                    </Link>
                    <button
                      onClick={() => handleDelete(journal.id)}
                      className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
