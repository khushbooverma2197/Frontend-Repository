// Simple caching utility for API responses
class Cache {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes default
  }

  // Generate cache key from URL and params
  generateKey(url, params = {}) {
    const paramString = JSON.stringify(params);
    return `${url}:${paramString}`;
  }

  // Set cache with TTL (time to live)
  set(key, data, ttl = this.defaultTTL) {
    this.cache.set(key, data);
    this.timestamps.set(key, Date.now() + ttl);
  }

  // Get cached data if valid
  get(key) {
    const timestamp = this.timestamps.get(key);
    
    // Check if cache exists and is still valid
    if (timestamp && Date.now() < timestamp) {
      return this.cache.get(key);
    }
    
    // Cache expired or doesn't exist
    this.delete(key);
    return null;
  }

  // Check if cache exists and is valid
  has(key) {
    return this.get(key) !== null;
  }

  // Delete specific cache entry
  delete(key) {
    this.cache.delete(key);
    this.timestamps.delete(key);
  }

  // Clear all cache
  clear() {
    this.cache.clear();
    this.timestamps.clear();
  }

  // Clear expired entries
  clearExpired() {
    const now = Date.now();
    for (const [key, timestamp] of this.timestamps.entries()) {
      if (now >= timestamp) {
        this.delete(key);
      }
    }
  }

  // Invalidate cache by pattern (e.g., all destination-related cache)
  invalidatePattern(pattern) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.delete(key);
      }
    }
  }
}

// Create singleton instance
const apiCache = new Cache();

// Clear expired cache every 10 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    apiCache.clearExpired();
  }, 10 * 60 * 1000);
}

// Export as both default and named
export { apiCache };
export default apiCache;
