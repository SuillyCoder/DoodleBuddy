export default function PromptsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-blue-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Creative Prompts
          </h1>
          <p className="text-xl text-gray-600">
            Get inspired with AI-powered drawing prompts
          </p>
        </div>

        {/* Two Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Preset Prompts */}
          <a href="/nav/prompts/presetPrompts">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-blue-400">
              <div className="text-6xl mb-4 text-center">🎨</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                Preset Prompts
              </h2>
              <p className="text-gray-600 text-center mb-4">
                Generate themed drawing prompts instantly. Choose from various categories like Anime, Sci-Fi, Pirates, and more!
              </p>
              <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800 text-center">
                ✨ Quick & themed inspiration
              </div>
            </div>
          </a>

          {/* Chat Prompts */}
          <a href="/nav/prompts/chatPrompts">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-purple-400">
              <div className="text-6xl mb-4 text-center">💬</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                Chat Prompts
              </h2>
              <p className="text-gray-600 text-center mb-4">
                Have a conversation with AI to brainstorm custom drawing ideas tailored to your preferences.
              </p>
              <div className="bg-purple-50 rounded-lg p-3 text-sm text-purple-800 text-center">
                🤖 Personalized AI assistance
              </div>
            </div>
          </a>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <a
            href="/"
            className="inline-block px-8 py-3 bg-gray-600 text-white font-semibold rounded-full hover:bg-gray-700 transition"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}