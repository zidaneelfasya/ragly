import React from 'react';

export default function FeatureSection() {
  return (
    <section className="min-h-screen bg-[#040404] flex items-center justify-center py-20 px-8 lg:px-16 relative">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Title and Main Card */}
          <div className="space-y-8">
            {/* Title */}
            <div>
              <h2 className="text-6xl lg:text-7xl font-bold text-blue-500 mb-4">
                FEATURE
              </h2>
              <h3 className="text-2xl lg:text-3xl font-medium text-white">
                Konsultasi Chatbot
              </h3>
            </div>

            {/* Main Feature Card */}
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 backdrop-blur-sm border border-blue-700/30 rounded-2xl p-8 space-y-6">
              <h4 className="text-xl font-semibold text-white">
                System 24/7
              </h4>
              <p className="text-gray-300 leading-relaxed">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
              </p>
              <button className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2">
                Coba Chatbot
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Side - Feature Grid Wrapper */}
          <div className="bg-gradient-to-br from-[#001B3D] to-[#0147A3] rounded-2xl p-8 border border-white border-opacity-15 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Feature Card 1 */}
              <div className="bg-gradient-to-t from-[#001B3D] to-[#0147A3] backdrop-blur-sm border border-white border-opacity-20 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
                <h5 className="text-lg font-semibold text-blue-300 mb-3">
                  System 24/7
                </h5>
                <p className="text-gray-200 text-sm leading-relaxed">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it.
                </p>
              </div>

              {/* Feature Card 2 */}
              <div className="bg-gradient-to-t from-[#001B3D] to-[#0147A3] backdrop-blur-sm border border-white border-opacity-20 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
                <h5 className="text-lg font-semibold text-blue-300 mb-3">
                  System 24/7
                </h5>
                <p className="text-gray-200 text-sm leading-relaxed">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it.
                </p>
              </div>

              {/* Feature Card 3 */}
              <div className="bg-gradient-to-t from-[#001B3D] to-[#0147A3] backdrop-blur-sm border border-white border-opacity-20 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
                <h5 className="text-lg font-semibold text-blue-300 mb-3">
                  System 24/7
                </h5>
                <p className="text-gray-200 text-sm leading-relaxed">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it.
                </p>
              </div>

              {/* Feature Card 4 */}
              <div className="bg-gradient-to-t from-[#001B3D] to-[#0147A3] backdrop-blur-sm border border-white border-opacity-20 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
                <h5 className="text-lg font-semibold text-blue-300 mb-3">
                  System 24/7
                </h5>
                <p className="text-gray-200 text-sm leading-relaxed">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
        
        {/* Gradient orbs */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-gradient-to-br from-blue-600/20 to-blue-800/10 blur-3xl" />
        <div className="absolute bottom-20 left-20 w-48 h-48 rounded-full bg-gradient-to-tr from-blue-500/15 to-blue-700/10 blur-2xl" />
      </div>
    </section>
  );
}