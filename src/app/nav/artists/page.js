'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ArtistInspo() {
  const [artstationArtists, setArtstationArtists] = useState([]);
  const [mainArtist, setMainArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dailyCountdown, setDailyCountdown] = useState('');
  const [weeklyCountdown, setWeeklyCountdown] = useState('');
  const [hoveredArtist, setHoveredArtist] = useState(null);

  useEffect(() => {
    fetchArtists();
    updateCountdowns();
    
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchArtists = async () => {
    try {
       const testDate = new URLSearchParams(window.location.search).get('testDate');
      const url = testDate ? `/api/artists?testDate=${testDate}` : '/api/artists';

      const response = await fetch(url)
      const data = await response.json();
      
      setArtstationArtists(data.artstationArtists);
      setMainArtist(data.mainArtist);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching artists:', error);
      setLoading(false);
    }
  };

  const updateCountdowns = () => {
    const now = new Date();
    
    // Daily countdown (resets at midnight)
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const dailyDiff = tomorrow - now;
    
    const dailyHours = Math.floor(dailyDiff / (1000 * 60 * 60));
    const dailyMinutes = Math.floor((dailyDiff % (1000 * 60 * 60)) / (1000 * 60));
    const dailySeconds = Math.floor((dailyDiff % (1000 * 60)) / 1000);
    
    setDailyCountdown(
      `${dailyHours.toString().padStart(2, '0')}:${dailyMinutes.toString().padStart(2, '0')}:${dailySeconds.toString().padStart(2, '0')}`
    );
    
    // Weekly countdown (resets on Monday)
    const nextMonday = new Date(now);
    const daysUntilMonday = (8 - now.getDay()) % 7 || 7;
    nextMonday.setDate(now.getDate() + daysUntilMonday);
    nextMonday.setHours(0, 0, 0, 0);
    const weeklyDiff = nextMonday - now;
    
    const weeklyDays = Math.floor(weeklyDiff / (1000 * 60 * 60 * 24));
    const weeklyHours = Math.floor((weeklyDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const weeklyMinutes = Math.floor((weeklyDiff % (1000 * 60 * 60)) / (1000 * 60));
    const weeklySeconds = Math.floor((weeklyDiff % (1000 * 60)) / 1000);
    
    const weeklyParts = [];
    if (weeklyDays > 0) weeklyParts.push(`${weeklyDays}d`);
    weeklyParts.push(`${weeklyHours.toString().padStart(2, '0')}h`);
    weeklyParts.push(`${weeklyMinutes.toString().padStart(2, '0')}m`);
    weeklyParts.push(`${weeklySeconds.toString().padStart(2, '0')}s`);
    
    setWeeklyCountdown(weeklyParts.join(':'));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading artists...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-indigo-600 hover:text-indigo-700 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-bold text-gray-900 text-center mb-2">
            ARTIST INSPO
          </h1>
        </div>

        {/* Daily Artists Section */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">DAILY ARTISTS</h2>
            <p className="text-gray-600">
              Refreshes in: <span className="font-mono font-semibold">{dailyCountdown}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{artstationArtists.map((artist, index) => (
    <div key={index} className="space-y-2"> {/* wrapper so button can be outside the card */}
      <div
        className="relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition"
        onMouseEnter={() => setHoveredArtist(artist)}
        onMouseLeave={() => setHoveredArtist(null)}
      >
        <div className="aspect-square w-full overflow-hidden bg-linear-to-br from-blue-100 to-green-100">
          <img 
            src={artist.imageUrl}
            alt={`${artist.name}'s profile`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-3 text-center font-semibold text-2xl text-gray-900">
          {artist.name}
        </div>

        {/* Hover Panel */}
        {hoveredArtist === artist && (
          <div className="absolute inset-0 bg-white z-10 p-6 flex flex-col md:flex-row gap-4 shadow-2xl">
            {/* Left: Description */}
            <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{artist.name}</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {artist.description}
              </p>
            </div>
            
            {/* Right: Preview Image */}
            <div className="w-full md:w-1/2 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={artist.previewImage}
                alt={`${artist.name}'s work preview`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
      <div className="p-3 text-center">
        <a
          href={artist.artstationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-semibold text-sm"
        >
          VIEW ON ARTSTATION
        </a>
      </div>
    </div>
))}          
    </div>
        </div>

        {/* Weekly Featured Artist */}
        {mainArtist && (
          <div className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">ARTIST OF THE WEEK</h2>
              <p className="text-gray-600">
                Refreshes in: <span className="font-mono font-semibold">{weeklyCountdown}</span>
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Left: Large Image */}
                <div className="aspect-square md:aspect-auto bg-linear-to-br from-blue-100 to-green-100">
                  <img 
                    src={mainArtist.imageUrl}
                    alt={`${mainArtist.name}'s featured work`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Right: Bio and Profile Button */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="text-center font-semibold text-4xl md:text-5xl text-gray-900 mb-6">
                    {mainArtist.name}
                  </div>
                  <p className="text-gray-700 text-lg text-justify leading-relaxed mb-8">
                    {mainArtist.bio}
                  </p>
                  <div className="text-center">
                    <a
                      href={mainArtist.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-semibold text-base"
                    >
                      VIEW PROFILE
                    </a>
                  </div>
                </div>
              </div>

              {/* Sample Works */}
              {mainArtist.sampleWorks && mainArtist.sampleWorks.length > 0 && (
                <div className="p-8 bg-gray-50">
                  <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">Sample Work</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mainArtist.sampleWorks.map((work, index) => (
                      <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={work}
                          alt={`${mainArtist.name} sample work ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}