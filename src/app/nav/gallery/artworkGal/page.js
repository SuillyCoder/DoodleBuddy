'use client';

import { useState, useEffect } from 'react';
import { auth, storage, db } from '../../../../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { fetchUserData } from '../../../../../lib/mockData';
import Link from 'next/link';

export default function ArtworkGallery() {
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        const data = await fetchUserData(currentUser.uid);
        setImages(data?.artworkGalleryPics || []);
      } else {
        // Guest mode - load from localStorage (URLs only, no base64)
        const guestImages = localStorage.getItem('guest_artwork_gallery');
        setImages(guestImages ? JSON.parse(guestImages) : []);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Compress image before upload
  const compressImage = (file, maxWidth = 1920, quality = 0.8) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Resize if needed
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          }, 'image/jpeg', quality);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress({ current: 0, total: files.length });

    try {
      if (user) {
        // Authenticated user - compress and upload to Firebase Storage in parallel
        const uploadedURLs = [];
        
        // Process in batches of 3 for optimal performance
        const batchSize = 3;
        for (let i = 0; i < files.length; i += batchSize) {
          const batch = files.slice(i, i + batchSize);
          
          const batchPromises = batch.map(async (file, batchIndex) => {
            try {
              // Compress image first
              const compressedFile = await compressImage(file);
              
              const timestamp = Date.now() + batchIndex;
              const fileName = `${user.uid}/artwork/${timestamp}_${file.name}`;
              const storageRef = ref(storage, fileName);
              
              await uploadBytes(storageRef, compressedFile);
              const downloadURL = await getDownloadURL(storageRef);
              
              setUploadProgress(prev => ({ ...prev, current: prev.current + 1 }));
              return downloadURL;
            } catch (error) {
              console.error(`Failed to upload ${file.name}:`, error);
              return null;
            }
          });

          const batchResults = await Promise.all(batchPromises);
          uploadedURLs.push(...batchResults.filter(url => url !== null));
        }
        
        // Update Firestore in one operation
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          artworkGalleryPics: arrayUnion(...uploadedURLs)
        });

        setImages([...images, ...uploadedURLs]);
        alert(`${uploadedURLs.length} artwork(s) uploaded successfully!`);
      } else {
        // Guest mode - Store URLs as object URLs (temporary, no localStorage bloat)
        alert('⚠️ Guest Mode: Images are temporary and will be lost on page refresh. Sign in to save permanently!');
        
        const objectURLs = files.map(file => URL.createObjectURL(file));
        setImages([...images, ...objectURLs]);
        
        // Don't store in localStorage to avoid quota issues
        // Guest uploads are session-only
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload some images. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress({ current: 0, total: 0 });
      e.target.value = ''; // Reset file input
    }
  };

  const handleFavorite = async (imageUrl) => {
    if (!user) {
      alert('Sign in to add favorites!');
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      const currentFavorites = userDoc.data()?.favoritesGalleryPics || [];
      
      if (currentFavorites.includes(imageUrl)) {
        alert('Already in favorites!');
        return;
      }
      
      await updateDoc(userRef, {
        favoritesGalleryPics: arrayUnion(imageUrl)
      });
      alert('Added to favorites!');
    } catch (error) {
      console.error('Favorite error:', error);
      alert('Failed to add to favorites');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <Link href="/nav/gallery" className="text-indigo-600 hover:text-indigo-700 mb-4 inline-block">
          ← Back to Galleries
        </Link>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Artwork Gallery</h1>
            <p className="text-gray-600 mt-2">{images.length} artworks</p>
            {!user && (
              <p className="text-amber-600 text-sm mt-1">
                ⚠️ Guest mode: Images are temporary. Sign in to save!
              </p>
            )}
          </div>
          
          {/* Upload Button */}
          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
            <div className={`px-6 py-3 rounded-lg transition font-medium ${
              uploading 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}>
              {uploading 
                ? `Uploading ${uploadProgress.current}/${uploadProgress.total}...` 
                : '+ Upload Artwork'}
            </div>
          </label>
        </div>
      </div>

      {/* Gallery Grid - 5 columns */}
      <div className="max-w-7xl mx-auto">
        {images.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">No artworks yet</p>
            <p className="text-gray-400">Upload your completed artworks to showcase them!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {images.map((imageUrl, index) => (
              <div key={index} className="group relative aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={imageUrl}
                  alt={`Artwork ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleFavorite(imageUrl)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition"
                    title="Add to favorites"
                  >
                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}