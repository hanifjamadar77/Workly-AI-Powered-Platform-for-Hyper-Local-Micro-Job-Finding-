// locationUtils.ts - Debug version

// City coordinates database (expand this with your cities)
const cityCoordinates: { [key: string]: { lat: number; lon: number } } = {
  // Maharashtra
  'mumbai': { lat: 19.0760, lon: 72.8777 },
  'pune': { lat: 18.5204, lon: 73.8567 },
  'nagpur': { lat: 21.1458, lon: 79.0882 },
  'thane': { lat: 19.2183, lon: 72.9781 },
  'pimpri': { lat: 18.6298, lon: 73.7997 },
  'nashik': { lat: 19.9975, lon: 73.7898 },
  'aurangabad': { lat: 19.8762, lon: 75.3433 },
  
  // Delhi
  'delhi': { lat: 28.7041, lon: 77.1025 },
  'new delhi': { lat: 28.6139, lon: 77.2090 },
  
  // Karnataka
  'bangalore': { lat: 12.9716, lon: 77.5946 },
  'bengaluru': { lat: 12.9716, lon: 77.5946 },
  'mysore': { lat: 12.2958, lon: 76.6394 },
  
  // Tamil Nadu
  'chennai': { lat: 13.0827, lon: 80.2707 },
  'coimbatore': { lat: 11.0168, lon: 76.9558 },
  
  // Add more cities as needed
};

/**
 * Get coordinates for a city name
 */
export const getCityCoordinates = (cityName: string): { lat: number; lon: number } | null => {
  if (!cityName) {
    // console.log('⚠️ getCityCoordinates: No city name provided');
    return null;
  }
  
  const normalizedCity = cityName.toLowerCase().trim();
  // console.log(`📍 Looking up coordinates for: "${normalizedCity}"`);
  
  const coords = cityCoordinates[normalizedCity];
  
  if (coords) {
    console.log(`✅ Found coordinates for ${cityName}:`, coords);
  } else {
    console.log(`❌ No coordinates found for "${cityName}". Available cities:`, Object.keys(cityCoordinates));
  }
  
  return coords || null;
};

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  // console.log(`📏 Calculating distance between (${lat1}, ${lon1}) and (${lat2}, ${lon2})`);
  
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  // console.log(`✅ Distance calculated: ${distance.toFixed(2)} km`);
  return distance;
};

const toRad = (value: number): number => {
  return (value * Math.PI) / 180;
};

/**
 * Sort jobs by distance from user location
 * ADDS distance property to each job
 */
export const sortJobsByDistance = (
  jobs: any[],
  userLat: number,
  userLon: number
): any[] => {
  console.log(`\n🔄 Sorting ${jobs.length} jobs by distance from (${userLat}, ${userLon})`);
  
  const jobsWithDistance = jobs.map((job) => {
    // console.log(`\n📦 Processing job: "${job.title}"`);
    // console.log(`   City: ${job.city}, State: ${job.state}`);
    
    if (!job.city || !job.state) {
      console.log(`   ⚠️ Missing location data, skipping distance calculation`);
      return { ...job, distance: 999999 }; // Large distance for jobs without location
    }
    
    // Get job's city coordinates
    const jobCoords = getCityCoordinates(job.city);
    
    if (!jobCoords) {
      console.log(`   ❌ Could not get coordinates for city: ${job.city}`);
      return { ...job, distance: 999999 };
    }
    
    // Calculate distance
    const distance = calculateDistance(
      userLat,
      userLon,
      jobCoords.lat,
      jobCoords.lon
    );
    
    // console.log(`   ✅ Distance for "${job.title}": ${distance.toFixed(2)} km`);
    
    return {
      ...job,
      distance: Math.round(distance * 10) / 10, // Round to 1 decimal
    };
  });
  
  // Sort by distance (ascending)
  const sorted = jobsWithDistance.sort((a, b) => a.distance - b.distance);
  
  // console.log('\n📊 Sorted jobs by distance:');
  sorted.slice(0, 5).forEach((job, index) => {
    console.log(`   ${index + 1}. ${job.title}: ${job.distance} km`);
  });
  
  return sorted;
};

/**
 * Filter jobs within a certain radius
 */
export const filterJobsByRadius = (
  jobs: any[],
  userLat: number,
  userLon: number,
  radiusKm: number
): any[] => {
  // console.log(`\n🔍 Filtering jobs within ${radiusKm} km radius`);
  
  const filtered = jobs.filter((job) => {
    const withinRadius = job.distance !== undefined && job.distance <= radiusKm;
    
    if (withinRadius) {
      console.log(`   ✅ "${job.title}" is ${job.distance} km away (within radius)`);
    } else if (job.distance !== undefined) {
      console.log(`   ❌ "${job.title}" is ${job.distance} km away (outside radius)`);
    }
    
    return withinRadius;
  });
  
  console.log(`\n📊 Found ${filtered.length} jobs within ${radiusKm} km`);
  
  return filtered;
};