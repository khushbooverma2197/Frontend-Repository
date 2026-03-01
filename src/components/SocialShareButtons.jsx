import { useState } from 'react';
import PropTypes from 'prop-types';

export default function SocialShareButtons({ destination, className = '' }) {
  const [copied, setCopied] = useState(false);

  const url = `${window.location.origin}/destinations/${destination.id}`;
  const title = `Check out ${destination.name} - ${destination.country}`;
  const text = `${destination.name}: ${destination.description?.substring(0, 100)}...`;

  const shareToSocial = (platform) => {
    let shareUrl = '';
    
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'pinterest':
        const imageUrl = destination.images?.[0] || '';
        shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
        break;
      default:
        return;
    }
    
    if (platform === 'email') {
      window.location.href = shareUrl;
    } else {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
        <span>🔗</span> Share this destination
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <button
          onClick={() => shareToSocial('facebook')}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <span className="text-xl">📘</span>
          <span>Facebook</span>
        </button>
        
        <button
          onClick={() => shareToSocial('twitter')}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition font-medium"
        >
          <span className="text-xl">🐦</span>
          <span>Twitter</span>
        </button>
        
        <button
          onClick={() => shareToSocial('pinterest')}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
        >
          <span className="text-xl">📌</span>
          <span>Pinterest</span>
        </button>
        
        <button
          onClick={() => shareToSocial('linkedin')}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition font-medium"
        >
          <span className="text-xl">💼</span>
          <span>LinkedIn</span>
        </button>
        
        <button
          onClick={() => shareToSocial('whatsapp')}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
        >
          <span className="text-xl">💬</span>
          <span>WhatsApp</span>
        </button>
        
        <button
          onClick={() => shareToSocial('email')}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
        >
          <span className="text-xl">📧</span>
          <span>Email</span>
        </button>
      </div>

      <button
        onClick={copyLink}
        className={`w-full py-3 px-4 border-2 rounded-lg font-medium transition ${
          copied
            ? 'border-green-500 bg-green-50 text-green-700'
            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
        }`}
      >
        {copied ? (
          <span className="flex items-center justify-center gap-2">
            <span className="text-xl">✅</span>
            <span>Link copied!</span>
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span className="text-xl">🔗</span>
            <span>Copy link to clipboard</span>
          </span>
        )}
      </button>
    </div>
  );
}

SocialShareButtons.propTypes = {
  destination: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    country: PropTypes.string,
    description: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  className: PropTypes.string
};
