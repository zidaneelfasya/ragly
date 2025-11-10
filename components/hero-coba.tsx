"use client";
import Image from "next/image";
import React from "react";

// Custom CSS for animations
const customStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(2deg); }
  }
  
  @keyframes pulse-glow {
    0%, 100% { opacity: 0.1; }
    50% { opacity: 0.3; }
  }
  
  @keyframes gradient-shift {
    0% { transform: translateX(-100%) translateY(-100%) rotate(0deg); }
    50% { transform: translateX(0%) translateY(0%) rotate(180deg); }
    100% { transform: translateX(-100%) translateY(-100%) rotate(360deg); }
  }
  
  .float-animation { animation: float 6s ease-in-out infinite; }
  .float-animation-delayed { animation: float 6s ease-in-out infinite 2s; }
  .pulse-glow { animation: pulse-glow 4s ease-in-out infinite; }
  .gradient-shift { animation: gradient-shift 20s linear infinite; }
  
  .fade-in-up {
    opacity: 0;
    transform: translateY(30px);
    animation: fadeInUp 1s ease-out forwards;
  }
  
  .fade-in-up-delay-1 {
    animation-delay: 0.2s;
  }
  
  .fade-in-up-delay-2 {
    animation-delay: 0.4s;
  }
  
  .fade-in-up-delay-3 {
    animation-delay: 0.6s;
  }
  
  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export default function HeroSection() {
	return (
		<div className="relative min-h-screen overflow-hidden flex items-center justify-center"
			 style={{
				backgroundImage: 'url(/images/bg-hero.png)',
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat'
			 }}>
			<style jsx>{customStyles}</style>
			
			{/* Dark overlay for better text readability */}
			<div className="absolute inset-0 bg-black/40 z-0"></div>

			{/* Background Gradient Decorations */}
			<div className="absolute inset-0 pointer-events-none z-10">{/* Animated gradient overlay */}
				<div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#0147a3]/5 via-transparent to-[#5aa2fa]/5 gradient-shift"></div>
			</div>

			{/* Main Content Container */}
			<div className="relative z-20 w-full h-screen flex flex-col">{/* Logo Section */}
				<div className="flex items-center justify-center mt-40 mb-auto fade-in-up">
					<Image
						src="/images/klinik_hero.png"
						alt="Klinik Pemerintah Digital"
						width={720}
						height={500}
						className="max-w-full h-auto transition-transform duration-700 hover:scale-105"
						priority
					/>
				</div>

				{/* Bottom Content Layout */}
				<div className="flex flex-col justify-center lg:flex-row lg:items-end lg:justify-between px-8 lg:px-16 pb-20 gap-8">
					{/* Main Heading */}
					<div className="text-left max-w-4xl">
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight fade-in-up fade-in-up-delay-1">
							Chatbot Konsultasi
						</h1>
						<p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed mb-2 fade-in-up fade-in-up-delay-2">
							yang bisa menjawab segala keperluan
						</p>
						<p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed mb-6 lg:mb-0 fade-in-up fade-in-up-delay-2">
							pemerintah daerah
						</p>
					</div>

					{/* CTA Button */}
					<div className="flex justify-center lg:justify-end lg:items-end fade-in-up fade-in-up-delay-3">
						<button className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2">
                Coba Sekarang
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

				{/* Floating Elements */}
				<div className="absolute inset-0 pointer-events-none z-10">
					{/* Floating particles */}
					<div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#5aa2fa] rounded-full opacity-40 float-animation"></div>
					<div className="absolute top-3/4 left-3/4 w-1 h-1 bg-[#0147a3] rounded-full opacity-50 float-animation-delayed"></div>
					<div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-[#5aa2fa] rounded-full opacity-30 float-animation"></div>
					<div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-[#0147a3] rounded-full opacity-40 float-animation-delayed"></div>
				</div>
			</div>

			{/* Bottom Gradient Line */}
			{/* <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0147a3] via-[#5aa2fa] to-[#0147a3] opacity-30"></div> */}
		</div>
	);
}
