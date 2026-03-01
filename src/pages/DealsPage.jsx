import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllDestinations } from '../services/destinationService';
import PrimaryButton from '../components/PrimaryButton';
import Loading from '../components/Loading';

// Mock deals data - in production, this would come from travel APIs
const generateDeals = (destinations) => {
  const dealTypes = ['flight', 'hotel', 'package'];
  const discounts = [15, 20, 25, 30, 35, 40];
  
  return destinations.slice(0, 8).map((dest, index) => ({
    id: `deal-${dest.id}-${index}`,
    destinationId: dest.id,
    destination: dest.name,
    country: dest.country,
    image: dest.images?.[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    type: dealTypes[index % dealTypes.length],
    discount: discounts[index % discounts.length],
    originalPrice: Math.round(dest.avg_daily_cost * 7 * (index % 2 === 0 ? 1.5 : 2)),
    validUntil: new Date(Date.now() + (Math.floor(Math.random() * 30) + 7) * 24 * 60 * 60 * 1000).toISOString(),
    provider: ['Expedia', 'Booking.com', 'Kayak', 'Hotels.com'][index % 4],
    featured: index < 3
  }));
};

export default function DealsPage() {
  const [deals, setDeals] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const destData = await getAllDestinations();
        setDestinations(destData);
        const dealsData = generateDeals(destData);
        setDeals(dealsData);
      } catch (error) {
        console.error('Error fetching deals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredDeals = filterType === 'all' 
    ? deals 
    : deals.filter(deal => deal.type === filterType);

  const calculateSavings = (originalPrice, discount) => {
    return Math.round(originalPrice * (discount / 100));
  };

  const calculateFinalPrice = (originalPrice, discount) => {
    return originalPrice - calculateSavings(originalPrice, discount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDealIcon = (type) => {
    switch(type) {
      case 'flight': return '✈️';
      case 'hotel': return '🏨';
      case 'package': return '📦';
      default: return '🎫';
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🔥 Exclusive Travel Deals
          </h1>
          <p className="text-xl text-gray-600">
            Save big on flights, hotels, and vacation packages
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Limited time offers - Book before they're gone!
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          {[
            { id: 'all', label: 'All Deals', icon: '🌍' },
            { id: 'flight', label: 'Flights', icon: '✈️' },
            { id: 'hotel', label: 'Hotels', icon: '🏨' },
            { id: 'package', label: 'Packages', icon: '📦' }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setFilterType(filter.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                filterType === filter.id
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:shadow-md'
              }`}
            >
              <span className="mr-2">{filter.icon}</span>
              {filter.label}
            </button>
          ))}
        </div>

        {/* Featured Deals */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">⭐ Featured Deals</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {deals.filter(deal => deal.featured).map(deal => (
              <div key={deal.id} className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow relative">
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-4 py-2 bg-red-600 text-white font-bold rounded-full text-lg shadow-lg">
                    {deal.discount}% OFF
                  </span>
                </div>
                <div className="relative h-56">
                  <img
                    src={deal.image}
                    alt={deal.destination}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{getDealIcon(deal.type)}</span>
                    <span className="text-sm font-medium text-gray-500 uppercase">{deal.type}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">{deal.destination}</h3>
                  <p className="text-gray-600 mb-4">{deal.country}</p>
                  
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-3xl font-bold text-green-600">
                      ${calculateFinalPrice(deal.originalPrice, deal.discount).toLocaleString()}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      ${deal.originalPrice.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">You Save:</span>
                      <span className="font-bold text-green-600">
                        ${calculateSavings(deal.originalPrice, deal.discount).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Valid Until:</span>
                      <span className="font-semibold">{formatDate(deal.validUntil)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Provider:</span>
                      <span className="font-semibold">{deal.provider}</span>
                    </div>
                  </div>
                  
                  <Link to={`/destination/${deal.destinationId}`}>
                    <PrimaryButton className="w-full">
                      View Destination
                    </PrimaryButton>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Deals */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">All Deals</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.filter(deal => !deal.featured).map(deal => (
              <div key={deal.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <img
                    src={deal.image}
                    alt={deal.destination}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-orange-500 text-white font-bold rounded-full shadow-lg">
                      -{deal.discount}%
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{getDealIcon(deal.type)}</span>
                    <span className="text-xs font-medium text-gray-500 uppercase">{deal.type}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{deal.destination}</h3>
                  <p className="text-sm text-gray-600 mb-3">{deal.country}</p>
                  
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-bold text-green-600">
                      ${calculateFinalPrice(deal.originalPrice, deal.discount).toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ${deal.originalPrice.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-3">
                    Valid until {formatDate(deal.validUntil)}
                  </div>
                  
                  <Link to={`/destination/${deal.destinationId}`}>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                      View Deal
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Never Miss a Deal!</h2>
          <p className="text-lg mb-6">Get exclusive travel deals delivered to your inbox</p>
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-8 py-3 bg-white text-blue-600 font-bold rounded-full hover:bg-gray-100 transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
