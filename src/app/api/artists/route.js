import { NextResponse } from 'next/server';
import { getCurrentFeaturedArtist } from '../../../../lib/featuredArtists';

/**
 * ArtStation artists pool with descriptions and preview images
 */
const artstationArtistsPool = [
  {
    name: 'Bastien Grivet',
    artstationUrl: 'https://www.artstation.com/grivetart',
    imageUrl: '/artistAssets/artStation/profilePreview/Bastien_Grivet.jpg',
    description: 'French concept artist specializing in vibrant sci-fi environments and vehicle design. Known for dynamic compositions featuring bold colors and intricate mechanical details that bring futuristic worlds to life.',
    previewImage: '/artistAssets/artStation/artPreview/Bastien_Grivet_Prev.jpg',
  },
  {
    name: 'Magdalena Pagowska',
    artstationUrl: 'https://www.artstation.com/len-yan',
    imageUrl: '/artistAssets/artStation/profilePreview/Magdalena_Pagowska.jpg',
    description: 'Character artist renowned for expressive portraits and fantasy character designs. Her work blends traditional painting techniques with digital tools to create emotionally resonant characters with stunning detail.',
    previewImage: '/artistAssets/artStation/artPreview/Magdalena_Pagowska_Prev.jpg',
  },
  {
    name: 'Robbie Trevino',
    artstationUrl: 'https://www.artstation.com/robbietrevino',
    imageUrl: '/artistAssets/artStation/profilePreview/Robbie_Trevino.jpg',
    description: 'Entertainment industry veteran creating atmospheric keyframes and concept art for games and film. Specializes in moody lighting and cinematic compositions that set the tone for epic narratives.',
    previewImage: '/artistAssets/artStation/artPreview/Robbie_Trevino_Prev.jpg',
  },
  {
    name: 'Atey Ghailan',
    artstationUrl: 'https://www.artstation.com/snatti',
    imageUrl: '/artistAssets/artStation/Atey_Ghailan.jpg',
    description: 'Illustrator famous for cozy, nostalgic scenes with warm color palettes. Creates inviting urban and domestic environments that evoke feelings of comfort and everyday magic through masterful use of light.',
    previewImage: '/artistAssets/artStation/artPreview/Atey_Ghailan_Prev.jpg',
  },
  {
    name: 'Even Amundsen',
    artstationUrl: 'https://www.artstation.com/mischeviouslittleelf',
    imageUrl: '/artistAssets/artStation/profilePreview/Even_Amundsen.jpg',
    description: 'Norwegian artist creating whimsical fantasy illustrations with playful characters and imaginative worlds. Her distinctive style combines soft textures with vibrant storytelling that captures childlike wonder.',
    previewImage: '/artistAssets/artStation/artPreview/Even_Amundsen_Prev.jpg',
  },
  {
    name: 'Anna Podedworna',
    artstationUrl: 'https://www.artstation.com/akreon',
    imageUrl: '/artistAssets/artStation/profilePreview/Anna_Podedworna.jpg',
    description: 'Senior concept artist for The Witcher series, known for dark fantasy character designs and dramatic portraits. Creates hauntingly beautiful artwork with rich textures and atmospheric depth.',
    previewImage: '/artistAssets/artStation/artPreview/Anna_Podedworna_Prev.jpg',
  },
  {
    name: 'Ian McQue',
    artstationUrl: 'https://www.instagram.com/ianmcque/?hl=en',
    imageUrl: '/artistAssets/artStation/profilePreview/Ian_McQue.jpg',
    description: 'British artist celebrated for imaginative steampunk vehicles and mechanical designs. His sketchy, energetic style brings retro-futuristic contraptions to life with incredible personality and charm.',
    previewImage: '/artistAssets/artStation/artPreview/Ian_McQue_Prev.webp',
  },
  {
    name: 'Marta Nael',
    artstationUrl: 'https://www.artstation.com/martanael',
    imageUrl: '/artistAssets/artStation/profilePreview/Marta_Nael.jpg',
    description: 'Concept artist and illustrator creating ethereal fantasy environments and character designs. Her dreamy, painterly approach to digital art produces mystical scenes filled with soft light and wonder.',
    previewImage: '/artistAssets/artStation/artPreview/Marta_Nael_Prev.jpg',
  },
  {
    name: 'Gediminas Pranckevicius',
    artstationUrl: 'https://www.artstation.com/gedomenas',
    imageUrl: '/artistAssets/artStation/profilePreview/Gediminas_Pranckevicius.jpg',
    description: 'Lithuanian artist known for surreal architectural concepts and impossible geometric structures. Creates mind-bending sci-fi environments that challenge perspective and invite exploration.',
    previewImage: '/artistAssets/artStation/artPreview/Gediminas_Pranckevicius_Prev.jpg',
  },
  {
    name: 'Sergey Kolesov',
    artstationUrl: 'https://www.artstation.com/peleng',
    imageUrl: '/artistAssets/artStation/profilePreview/Sergey_Kolesov.jpg',
    description: 'Russian concept artist with a distinctive graphic style combining bold shapes and limited color palettes. Creates striking character designs and environments for games with powerful visual impact.',
    previewImage: '/artistAssets/artStation/artPreview/Sergey_Kolesov_Prev.jpg',
  },
];

/**
 * Get daily seed (changes every day)
 */
function getDailySeed() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get weekly seed (changes every Monday)
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
 */
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Get 3 random artists for today (changes daily)
 */
function getDailyArtists() {
  const dailySeed = getDailySeed();
  const seedNumber = dailySeed.split('-').reduce((acc, val) => acc + parseInt(val), 0);
  
  const shuffled = [...artstationArtistsPool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seedNumber + i) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled.slice(0, 3);
}

/**
 * GET /api/artists
 * Returns 3 daily artists and the weekly featured artist
 */
export async function GET(request) {
  try {
    const dailyArtists = getDailyArtists();
    const mainArtist = getCurrentFeaturedArtist();
    
    return NextResponse.json({
      artstationArtists: dailyArtists,
      mainArtist,
      dailySeed: getDailySeed(),
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