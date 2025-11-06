export const featuredArtists = [
  {
    week: '2024-W45', // Week identifier (Year-Week format)
    name: 'Loish (Lois van Baarle)',
    bio: 'Loish is a Dutch digital artist renowned for her vibrant character illustrations and distinctive style that blends painterly techniques with modern digital tools. Her work celebrates femininity and diversity through expressive portraits featuring bold colors and fluid brush strokes. With over a decade of professional experience, she has inspired countless artists through her tutorials and art books.',
    imageUrl: '/artistAssets/mainFeature/Loish.jpg',
    profileUrl: 'https://www.loish.net',
  },
  {
    week: '2024-W46',
    name: 'James Gurney',
    bio: 'James Gurney is the celebrated creator of the Dinotopia series and a master of plein air painting and scientific illustration. His meticulous approach combines traditional techniques with imaginative world-building, creating scenes that feel both fantastical and believable. As an influential art educator, he shares his expertise through his blog "Gurney Journey" and instructional books on color and light.',
    imageUrl: '/artistAssets/mainFeature/James_Gurney.jpg',
    profileUrl: 'https://gurneyjourney.blogspot.com',
  },
  {
    week: '2024-W47',
    name: 'Sakimichan',
    bio: 'Sakimichan is a Canadian digital artist celebrated for her stunning character art and detailed fantasy illustrations. Known for her masterful use of light, color, and anatomy, she creates captivating fan art and original characters that resonate with millions of followers worldwide. Her educational content on Patreon has helped countless aspiring artists improve their digital painting skills.',
    imageUrl: '/artistAssets/mainFeature/Sakimichan.jpg',
    profileUrl: 'https://www.deviantart.com/sakimichan',
  },
  // Add more artists here as weeks progress
  // Copy the structure above and update the week number, details, and URLs
];

/**
 * Get the current week's featured artist
 * Returns the artist for the current week, or the latest one if current week not found
 */
export const getCurrentFeaturedArtist = () => {
  const now = new Date();
  const year = now.getFullYear();
  
  // Calculate week number (ISO 8601)
  const startOfYear = new Date(year, 0, 1);
  const days = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  const currentWeek = `${year}-W${weekNumber.toString().padStart(2, '0')}`;
  
  // Find artist for current week
  const currentArtist = featuredArtists.find(artist => artist.week === currentWeek);
  
  // If not found, return the most recent one (last in array)
  return currentArtist || featuredArtists[featuredArtists.length - 1];
};