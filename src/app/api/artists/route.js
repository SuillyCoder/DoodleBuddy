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
    previewImage: '/artistAssets/artStation/artPreview/Even_Amundsen_Prev.webp',
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

  //Here are the new ones
    {
  name: 'Ilya Kuvshinov',
  artstationUrl: 'https://www.artstation.com/kuvshinov_ilya',
  imageUrl: '/artistAssets/artStation/profilePreview/Ilya_Kuvshinov.jpg',
  description: 'Russian-Japanese illustrator known for semi-realistic anime-style portraits with stunning use of color and light. His character designs blend Eastern and Western influences creating emotionally expressive faces with soft, painterly techniques.',
  previewImage: '/artistAssets/artStation/artPreview/Ilya_Kuvshinov_Prev.jpg',
},
{
  name: 'Wenjun Lin',
  artstationUrl: 'https://www.artstation.com/junc',
  imageUrl: '/artistAssets/artStation/profilePreview/Wenjun_Lin.jpg',
  description: 'Senior concept artist at Blizzard Entertainment creating epic fantasy characters and creatures. Specializes in detailed armor designs and dynamic action poses with masterful understanding of anatomy and form.',
  previewImage: '/artistAssets/artStation/artPreview/Wenjun_Lin_Prev.webp',
},
{
  name: 'Karla Ortiz',
  artstationUrl: 'https://www.artstation.com/karlaortiz',
  imageUrl: '/artistAssets/artStation/profilePreview/Karla_Ortiz.jpg',
  description: 'Award-winning concept artist for Marvel films including Doctor Strange and Black Panther. Creates powerful character designs with dramatic lighting and rich cultural influences that bring authenticity to fantasy worlds.',
  previewImage: '/artistAssets/artStation/artPreview/Karla_Ortiz_Prev.jpg',
},
{
  name: 'Tan Zhi Hui',
  artstationUrl: 'https://www.artstation.com/kudaman',
  imageUrl: '/artistAssets/artStation/profilePreview/Tan_Zhi_Hui.jpg',
  description: 'Singapore-based artist specializing in character illustrations with painterly style and atmospheric backgrounds. Known for creating contemplative character moments with beautiful color harmonies and soft lighting.',
  previewImage: '/artistAssets/artStation/artPreview/Tan_Zhi_Hui_Prev.jpg',
},
{
  name: 'Yongjae Choi',
  artstationUrl: 'https://www.artstation.com/indus',
  imageUrl: '/artistAssets/artStation/profilePreview/Yongjae_Choi.jpg',
  description: 'Korean concept artist creating stylized characters with strong silhouettes and vibrant color schemes. His work features bold shapes and graphic design sensibilities that make characters instantly recognizable and memorable.',
  previewImage: '/artistAssets/artStation/artPreview/Yongjae_Choi_Prev.jpg',
},
{
  name: 'Zeronis',
  artstationUrl: 'https://www.artstation.com/zeronis-pk',
  imageUrl: '/artistAssets/artStation/profilePreview/Zeronis.jpg',
  description: 'Former Riot Games senior concept artist known for creating iconic League of Legends champion designs. Masters dynamic poses and fashionable character designs with impeccable sense of style and movement.',
  previewImage: '/artistAssets/artStation/artPreview/Zeronis_Prev.jpg',
},
{
  name: 'Mélanie Delon',
  artstationUrl: 'https://www.artstation.com/melaniedelon',
  imageUrl: '/artistAssets/artStation/profilePreview/Mélanie_Delon.jpg',
  description: 'French digital painter renowned for ethereal fantasy portraits with dreamy atmospheres. Creates mystical characters with delicate features and romantic lighting that evoke fairy tale enchantment.',
  previewImage: '/artistAssets/artStation/artPreview/Mélanie_Delon_Prev.jpg',
},
{
  name: 'Jeong-Hwan Paul Ahn',
  artstationUrl: 'https://www.artstation.com/ahnjeonghwanp',
  imageUrl: '/artistAssets/artStation/profilePreview/Jeong-Hwan_Paul_Ahn.jpg',
  description: 'Concept artist specializing in realistic character designs for games and film. Known for detailed costume designs and practical armor that balance fantasy aesthetics with believable functionality.',
  previewImage: '/artistAssets/artStation/artPreview/Jeong-Hwan_Paul_Ahn_Prev.jpg',
},
{
  name: 'Guweiz',
  artstationUrl: 'https://www.artstation.com/guweiz',
  imageUrl: '/artistAssets/artStation/profilePreview/Guweiz.jpg',
  description: 'Hong Kong illustrator creating stunning anime-inspired character art with cinematic compositions. His work features dramatic lighting and urban environments that tell compelling visual stories.',
  previewImage: '/artistAssets/artStation/artPreview/Guweiz_Prev.jpg',
},
{
  name: 'Lap Pun Cheung',
  artstationUrl: 'https://www.artstation.com/lappuncheung',
  imageUrl: '/artistAssets/artStation/profilePreview/Lap_Pun_Cheung.jpg',
  description: 'Senior concept artist creating memorable character designs for AAA games. Specializes in creature design and fantasy characters with strong anatomical foundation and imaginative detail work.',
  previewImage: '/artistAssets/artStation/artPreview/Lap_Pun_Cheung_Prev.webp',
},
{
  name: 'Ross Tran',
  artstationUrl: 'https://www.artstation.com/rossdraws',
  imageUrl: '/artistAssets/artStation/profilePreview/Ross_Tran.jpg',
  description: 'YouTuber and illustrator known for vibrant anime-style characters and tutorial content. Creates energetic character art with bold colors and dynamic compositions that celebrate diversity and positivity.',
  previewImage: '/artistAssets/artStation/artPreview/Ross_Tran_Prev.jpg',
},
{
  name: 'Svetlana Tigai',
  artstationUrl: 'https://www.artstation.com/tsevtka',
  imageUrl: '/artistAssets/artStation/profilePreview/Svetlana_Tigai.jpg',
  description: 'Ukrainian artist specializing in whimsical fantasy characters and creature design. Her soft, painterly style brings warmth and personality to every character with charming expressions and storytelling details.',
  previewImage: '/artistAssets/artStation/artPreview/Svetlana_Tigai_Prev.jpg',
},
{
  name: 'Anthony Jones',
  artstationUrl: 'https://www.artstation.com/robotpencil',
  imageUrl: '/artistAssets/artStation/profilePreview/Anthony_Jones.jpg',
  description: 'Concept artist and educator known for bold graphic character designs with strong color theory. His energetic painting style and emphasis on shapes over details creates striking, memorable character silhouettes.',
  previewImage: '/artistAssets/artStation/artPreview/Anthony_Jones_Prev.jpg',
},
{
  name: 'Alexandra Fomina',
  artstationUrl: 'https://www.artstation.com/moshimoshibe',
  imageUrl: '/artistAssets/artStation/profilePreview/Alexandra_Fomina.jpg',
  description: 'Character designer for animated films creating expressive cartoon-style characters. Her work features appealing shapes, strong poses, and personality-filled designs perfect for animation and children\'s media.',
  previewImage: '/artistAssets/artStation/artPreview/Alexandra_Fomina_Prev.jpg',
},
{
  name: 'Sam Yang',
  artstationUrl: 'https://www.artstation.com/samdoesarts',
  imageUrl: '/artistAssets/artStation/profilePreview/Sam_Yang.jpg',
  description: 'Digital artist creating stylized portrait illustrations with anime influences and soft rendering. Known for capturing likeness while maintaining a distinctive semi-realistic style with beautiful lighting and color work.',
  previewImage: '/artistAssets/artStation/artPreview/Sam_Yang_Prev.jpg',
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
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artists' },
      { status: 500 }
    );
  }
}