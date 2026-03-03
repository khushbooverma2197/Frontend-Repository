import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllJournals } from '../services/journalService';
import Loading from '../components/Loading';

export default function CommunityPage() {
  const [publicJournals, setPublicJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('recent');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const data = await getAllJournals();
        // Filter only public journals
        const publicOnly = data.filter(j => j.isPublic);
        setPublicJournals(publicOnly);
      } catch (error) {
        console.error('Error fetching community journals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJournals();
  }, []);

  const sortedJournals = [...publicJournals].sort((a, b) => {
    if (filter === 'recent') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (filter === 'rating') {
      return (b.rating || 0) - (a.rating || 0);
    }
    return 0;
  });

  const shareToSocial = (journal, platform) => {
    const url = `${window.location.origin}/journals/${journal.id}`;
    const text = `Check out my travel experience: ${journal.title}`;
    
    let shareUrl = '';
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const copyLink = (journalId) => {
    const url = `${window.location.origin}/journals/${journalId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(journalId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">
            Travel Community
          </h1>
          <p className="text-gray-500">
            Share your adventures and get inspired by fellow travelers
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex gap-3">
            <button
              onClick={() => setFilter('recent')}
              className={`px-5 py-2 rounded-full font-semibold transition-all text-sm ${
                filter === 'recent'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              Recent
            </button>
            <button
              onClick={() => setFilter('rating')}
              className={`px-5 py-2 rounded-full font-semibold transition-all text-sm ${
                filter === 'rating'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              Top Rated
            </button>
          </div>
          
          <Link to="/journals/new">
            <button className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all text-sm">
              + Share Your Story
            </button>
          </Link>
        </div>

        {/* Community Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Travel Stories', value: publicJournals.length, icon: '📖' },
            { label: 'Destinations', value: new Set(publicJournals.map(j => j.destinationId)).size, icon: '🗺️' },
            { label: 'Photos Shared', value: publicJournals.reduce((sum, j) => sum + (j.photos?.length || 0), 0), icon: '📸' },
            { label: 'Active Travelers', value: Math.ceil(publicJournals.length / 2), icon: '👥' }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Journal Feed */}
        {sortedJournals.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No public stories yet</h3>
            <p className="text-gray-500 mb-6">Be the first to share your travel experience!</p>
            <Link to="/journals/new">
              <button className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition">
                Share Your Story
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedJournals.map(journal => (
              <div key={journal.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md overflow-hidden transition-all duration-200">
                {/* Journal Image */}
                <Link to={`/journals/${journal.id}`}>
                  <div className="relative h-52 overflow-hidden group bg-gradient-to-br from-blue-50 to-purple-50">
                    {journal.photos && journal.photos.length > 0 ? (
                      <>
                        <img
                          src={journal.photos[0]}
                          alt={journal.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        {journal.photos.length > 1 && (
                          <span className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            {journal.photos.length}
                          </span>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-14 h-14 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                    )}
                  </div>
                </Link>
                
                {/* Journal Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {journal.title?.[0]?.toUpperCase() || 'T'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Traveler</p>
                        <p className="text-xs text-gray-500">
                          {new Date(journal.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {journal.rating && (
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm font-bold">{journal.rating}</span>
                      </div>
                    )}
                  </div>

                  <Link to={`/journals/${journal.id}`}>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-blue-600 transition line-clamp-2">
                      {journal.title}
                    </h3>
                  </Link>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {journal.content}
                  </p>

                  {/* Highlights */}
                  {journal.highlights && journal.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {journal.highlights.slice(0, 2).map((highlight, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                          {highlight}
                        </span>
                      ))}
                      {journal.highlights.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{journal.highlights.length - 2} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Share Buttons */}
                  <div className="flex items-center gap-2 pt-4 border-t">
                    <button
                      onClick={() => shareToSocial(journal, 'facebook')}
                      className="flex-1 py-2 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition"
                      title="Share on Facebook"
                    >
                      📘 Share
                    </button>
                    <button
                      onClick={() => shareToSocial(journal, 'twitter')}
                      className="flex-1 py-2 bg-sky-500 text-white text-xs font-medium rounded hover:bg-sky-600 transition"
                      title="Share on Twitter"
                    >
                      🐦 Tweet
                    </button>
                    <button
                      onClick={() => shareToSocial(journal, 'whatsapp')}
                      className="flex-1 py-2 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition"
                      title="Share on WhatsApp"
                    >
                      💬 Send
                    </button>
                    <button
                      onClick={() => copyLink(journal.id)}
                      className={`p-2 rounded-lg transition text-xs font-medium ${
                        copiedId === journal.id
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      title="Copy link"
                    >
                      {copiedId === journal.id ? '✓' : '🔗'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Join Our Travel Community</h2>
          <p className="text-lg mb-6">Share your experiences, inspire others, and discover amazing destinations</p>
          <div className="flex justify-center gap-4">
            <Link to="/journals/new">
              <button className="px-8 py-4 bg-white text-purple-600 font-bold rounded-full hover:bg-gray-100 transition text-lg">
                Share Your Story
              </button>
            </Link>
            <Link to="/journals">
              <button className="px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition text-lg">
                View All Journals
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
