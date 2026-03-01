// Favorites service - localStorage based
const FAVORITES_KEY = 'travelFavorites';

export const getFavorites = () => {
  const favorites = localStorage.getItem(FAVORITES_KEY);
  return favorites ? JSON.parse(favorites) : [];
};

export const addToFavorites = (destination) => {
  const favorites = getFavorites();
  if (!favorites.find(fav => fav.id === destination.id)) {
    favorites.push({
      id: destination.id,
      name: destination.name,
      country: destination.country,
      images: destination.images,
      avg_daily_cost: destination.avg_daily_cost,
      addedAt: new Date().toISOString()
    });
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
  return favorites;
};

export const removeFromFavorites = (destinationId) => {
  const favorites = getFavorites();
  const updated = favorites.filter(fav => fav.id !== destinationId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
};

export const isFavorite = (destinationId) => {
  const favorites = getFavorites();
  return favorites.some(fav => fav.id === destinationId);
};

export const clearFavorites = () => {
  localStorage.removeItem(FAVORITES_KEY);
};
