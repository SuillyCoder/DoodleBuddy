import { NextResponse } from 'next/server';
import { getCurrentFeaturedArtist } from '../../../../lib/featuredArtists';

/**
 * ArtStation artists pool
 * These are curated artists from ArtStation with strong portfolios
 * The API will randomly select 3 each week
 */
const artstationArtistsPool = [
  {
    name: 'Bastien Grivet',
    artstationUrl: 'https://www.artstation.com/grivetart',
    imageUrl: '/artistAssets/artStation/Bastien_Grivet.jpg',
  },
  {
    name: 'Magdalena Pagowska',
    artstationUrl: 'https://www.artstation.com/len-yan',
    imageUrl: '/artistAssets/artStation/Magdalena_Pagowska.jpg',
  },
  {
    name: 'Robbie Trevino',
    artstationUrl: 'https://www.artstation.com/robbietrevino',
    imageUrl: '/artistAssets/artStation/Robbie_Trevino.jpg',
  },
  {
    name: 'Atey Ghailan',
    artstationUrl: 'https://www.artstation.com/snatti',
    imageUrl: '/artistAssets/artStation/Atey_Ghailan.jpg',
  },
  {
    name: 'Even Amundsen',
    artstationUrl: 'https://www.artstation.com/mischeviouslittleelf',
    imageUrl: '/artistAssets/artStation/Even_Amundsen.jpg',
  },
  {
    name: 'Anna Podedworna',
    artstationUrl: 'https://www.artstation.com/akreon',
    imageUrl: '/artistAssets/artStation/Anna_Podedworna.jpg',
  },
  {
    name: 'Ian McQue',
    artstationUrl: 'https://www.instagram.com/ianmcque/?hl=en',
    imageUrl: '/artistAssets/artStation/Ian_McQue.jpg',
  },
  {
    name: 'Marta Nael',
    artstationUrl: 'https://www.artstation.com/martanael',
    imageUrl: '/artistAssets/artStation/Marta_Nael.jpg',
  },
  {
    name: 'Gediminas Pranckevicius',
    artstationUrl: 'https://www.artstation.com/gedomenas',
    imageUrl: '/artistAssets/artStation/Gediminas_Pranckevicius.jpg',
  },
  {
    name: 'Sergey Kolesov',
    artstationUrl: 'https://www.artstation.com/peleng',
    imageUrl: '/artistAssets/artStation/Sergey_Kolesov.jpg',
  },
];

/**
 * Get a deterministic weekly seed based on the current week
 * This ensures the same 3 artists are shown for the entire week
 */
function getWeeklySeed() {
  const now = new Date();
  const year = now.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const days = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  
  return `${year}-W${weekNumber}`;
}

/**
 * Seeded random number generator
 * Ensures consistent "random" selection for the same week
 */
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Get 3 random ArtStation artists for this week
 */
function getWeeklyArtists() {
  const weekSeed = getWeeklySeed();
  
  // Convert week string to number for seeding
  const seedNumber = weekSeed.split('-W').reduce((acc, val) => acc + parseInt(val), 0);
  
  // Fisher-Yates shuffle with seeded random
  const shuffled = [...artstationArtistsPool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seedNumber + i) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // Return first 3
  return shuffled.slice(0, 3);
}

/**
 * GET /api/artists
 * Returns 3 random ArtStation artists and the main featured artist
 */
export async function GET(request) {
  try {
    const artstationArtists = getWeeklyArtists();
    const mainArtist = getCurrentFeaturedArtist();
    
    return NextResponse.json({
      artstationArtists,
      mainArtist,
      weekSeed: getWeeklySeed(),
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artists' },
      { status: 500 }
    );
  }
}