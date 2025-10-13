// utils/geocoding.js
const GOOGLE_API_KEY = "AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao";

export const getCoordinatesFromAddress = async (address) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`
    );
    const data = await response.json();
    
    if (data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        lat: location.lat,
        lon: location.lng
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};