// Trips service - localStorage based for saved trip plans
const TRIPS_KEY = 'savedTravelTrips';

export const getAllTrips = () => {
  const trips = localStorage.getItem(TRIPS_KEY);
  return trips ? JSON.parse(trips) : [];
};

export const saveTrip = (trip) => {
  const trips = getAllTrips();
  const newTrip = {
    ...trip,
    id: trip.id || Date.now().toString(),
    createdAt: trip.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Update existing trip or add new one
  const existingIndex = trips.findIndex(t => t.id === newTrip.id);
  if (existingIndex >= 0) {
    trips[existingIndex] = newTrip;
  } else {
    trips.push(newTrip);
  }
  
  localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
  return newTrip;
};

export const getTripById = (tripId) => {
  const trips = getAllTrips();
  return trips.find(t => t.id === tripId);
};

export const deleteTrip = (tripId) => {
  const trips = getAllTrips();
  const updated = trips.filter(t => t.id !== tripId);
  localStorage.setItem(TRIPS_KEY, JSON.stringify(updated));
  return updated;
};

export const clearAllTrips = () => {
  localStorage.removeItem(TRIPS_KEY);
};
