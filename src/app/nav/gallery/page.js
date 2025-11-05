export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Gallery
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Browse through your collection of doodles and artwork.
        </p>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
          <p className="text-purple-800">
            🖼️ This page will display your personal gallery of saved doodles and creations.
          </p>
        </div>

        <a
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
        >
          ← Back to Home
        </a>
      </div>
    </div>
  );
}