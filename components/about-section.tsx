import Image from 'next/image';
import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-[#040404] overflow-hidden flex items-center justify-center">
      {/* Background Gradient Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top gradient orb */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-[#0147a3] to-[#5aa2fa] opacity-50 blur-3xl"></div>
        
        {/* Bottom right gradient orb */}
        <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-tr from-[#5aa2fa] to-[#0147a3] opacity-10 blur-3xl"></div>
        
        {/* Center accent gradient */}
        <div className="absolute top-1/3 right-1/3 w-[400px] h-[200px] rounded-full bg-gradient-to-r from-[#0147a3]/5 to-[#5aa2fa]/5 blur-3xl"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Side - Mobile Mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <Image
                src="/images/about.png"
                alt="Klinik Pemerintah Digital Mobile App"
                width={640}
                height={900}
                className="max-w-full h-auto"
                priority
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="text-left space-y-8">
            {/* Title */}
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#5aa2fa] to-[#0147a3] leading-tight">
                KLINIK PEMERINTAH DIGITAL
              </h2>
            </div>

            {/* Subtitle */}
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-semibold text-white leading-tight">
                Solusi Pemerataan Transformasi Daerah Berbasis Teknologi
              </h3>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed max-w-2xl">
                Klinik Pemerintah Digital adalah program pendampingan strategis dari Kementerian Komunikasi dan Digital yang ditujukan bagi pemerintah daerah untuk mempercepat transformasi digital.
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <button className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2">
                Learn More
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
        </div>
      </div>
    </div>
  );
};

export default AboutSection;