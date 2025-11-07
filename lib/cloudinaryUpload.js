/**
 * Cloudinary Upload Utilities
 * Handles image uploads to Cloudinary
 */

/**
 * Compress and upload image to Cloudinary
 * @param {File} file - Image file to upload
 * @param {string} folder - Cloudinary folder (reference or artwork)
 * @param {string} userId - User ID for organizing uploads
 * @returns {Promise<string>} - URL of uploaded image
 */
export const uploadToCloudinary = async (file, folder, userId) => {
  try {
    // Compress image before upload
    const compressedFile = await compressImage(file);
    
    const formData = new FormData();
    formData.append('file', compressedFile);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', `doodlebuddy/${userId}/${folder}`);
    formData.append('timestamp', Date.now());
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.secure_url; // Returns HTTPS URL
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

/**
 * Compress image before upload
 * @param {File} file - Original image file
 * @param {number} maxWidth - Maximum width in pixels
 * @param {number} quality - JPEG quality (0-1)
 * @returns {Promise<File>} - Compressed image file
 */
const compressImage = (file, maxWidth = 1920, quality = 0.8) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          },
          'image/jpeg',
          quality
        );
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Delete image from Cloudinary (requires backend)
 * Note: Deletion requires API secret, so must be done server-side
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<void>}
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      throw new Error('Delete failed');
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - Full Cloudinary URL
 * @returns {string} - Public ID
 */
export const getPublicIdFromUrl = (url) => {
  // Example URL: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/image.jpg
  // Public ID: folder/image
  const parts = url.split('/');
  const uploadIndex = parts.indexOf('upload');
  if (uploadIndex === -1) return '';
  
  // Get everything after 'upload/v{version}/'
  const publicIdParts = parts.slice(uploadIndex + 2);
  const publicId = publicIdParts.join('/').split('.')[0]; // Remove extension
  return publicId;
};