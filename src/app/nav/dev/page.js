export default function DevPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-5xl w-full">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-12 text-center">
          MEET THE DEV
        </h1>
        
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Developer Image */}
          <div className="shrink-0">
            <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-blue-100 shadow-lg">
              <img 
                src="/New_Github_Pic.jpg"  
                alt="Developer" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              Hey there! I'm the creator of DoodleBuddy, a passionate developer who loves building 
              tools that bring creativity to life. I believe in the power of simple, intuitive 
              design and the joy of creating something from nothing. Whether you're sketching 
              your next masterpiece or just doodling for fun, I'm here to make your experience 
              as smooth and enjoyable as possible.
            </p>

            <a
              href="https://forms.gle/5sFEAgeuUR6fue4n7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg text-center"
            >
              APP SURVEY
            </a>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block px-6 py-3 bg-gray-800 text-white font-semibold rounded-full hover:bg-gray-900 transition-all"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}