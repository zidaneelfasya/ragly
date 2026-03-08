"use client";

import { useEffect, useRef, useState } from "react";

interface Step {
  title: string;
  description: string;
  videoSrc: string;
}

const steps: Step[] = [
  {
    title: "Landing Page Experience",
    description: "Discover our intuitive platform designed for seamless chatbot integration",
    videoSrc: "/landing/videos/landing-demo.mp4",
  },
  {
    title: "Create Your Chatbot",
    description: "Build and customize your AI chatbot in minutes with our powerful tools",
    videoSrc: "/landing/videos/create-chatbot-demo.mp4",
  },
  {
    title: "Test and Deploy",
    description: "Preview, test, and deploy your chatbot to engage with your users",
    videoSrc: "/landing/videos/test-chatbot-demo.mp4",
  },
];

export default function ProductJourneySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const [cardDims, setCardDims] = useState({ width: 800, height: 502 });

  // Compute card dimensions so the full card (including rounded corners) fits in the viewport.
  // Formula: available height = vh minus all fixed UI (navbar, header, timeline, paddings)
  // then derive width from video height * (16/9) to preserve aspect ratio.
  useEffect(() => {
    const updateCardDims = () => {
      const vh = window.innerHeight;
      const chromeBarH = 44; // approx browser-chrome bar inside the card
      // Reserved space: pt-16(64) + pb-12(48) + header(~116) + track margins mt-6+mb-8(56) + timeline(~50) + buffer(26)
      const reservedH = 360;
      const availableH = Math.max(vh - reservedH, 200);
      const videoH = availableH - chromeBarH;
      const videoW = videoH * (16 / 9);
      // Cap at 1100px so it doesn't get too wide on very tall screens
      const finalW = Math.min(Math.round(videoW), 1100);
      // Recalculate height based on capped width to keep 16:9 ratio
      const finalH = Math.round(finalW * (9 / 16) + chromeBarH);
      setCardDims({ width: finalW, height: finalH });
    };

    updateCardDims();
    window.addEventListener('resize', updateCardDims);
    return () => window.removeEventListener('resize', updateCardDims);
  }, []);

  // Track when the section enters the viewport for the first time
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsSectionVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Handle horizontal scroll animation
  // Uses JS-driven fixed positioning instead of CSS sticky to work
  // correctly even when a parent element has overflow:hidden.
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !containerRef.current || !trackRef.current) return;

      const section = sectionRef.current;
      const container = containerRef.current;
      const track = trackRef.current;
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;

      // --- Sticky positioning via JS ---
      if (rect.top <= 0 && rect.bottom >= viewportHeight) {
        // In the sticky zone: pin to viewport
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.bottom = '';
      } else if (rect.top > 0) {
        // Section not yet reached: sit at the top of the section
        container.style.position = 'absolute';
        container.style.top = '0';
        container.style.bottom = '';
      } else {
        // Section fully scrolled past: sit at the bottom of the section
        container.style.position = 'absolute';
        container.style.top = 'auto';
        container.style.bottom = '0';
      }

      // --- Horizontal translation ---
      const scrollProgress = Math.max(
        0,
        Math.min(1, -rect.top / (sectionHeight - viewportHeight))
      );

      const maxScroll = track.scrollWidth - window.innerWidth;
      const translateX = scrollProgress * maxScroll;
      track.style.transform = `translateX(-${translateX}px)`;

      // --- Determine which card is centered ---
      const cards = track.querySelectorAll("[data-card-index]");
      let closestIndex = 0;
      let minDistance = Infinity;

      cards.forEach((card, index) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const viewportCenter = window.innerWidth / 2;
        const distance = Math.abs(cardCenter - viewportCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle video playback based on active index — only after section is visible
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (isSectionVisible && index === activeIndex) {
        video.play().catch(() => {
          // Ignore play errors (autoplay restrictions)
        });
      } else {
        video.pause();
      }
    });
  }, [activeIndex, isSectionVisible]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[400vh] bg-transparent"
      aria-label="Product Journey"
    >
      {/* Sticky Container – position is managed by the scroll handler above */}
      <div
        ref={containerRef}
        className="h-screen overflow-hidden flex flex-col justify-between pt-16 pb-8 md:pb-12 left-0 w-full"
        style={{ position: 'absolute', top: 0 }}
      >
        
        {/* Header */}
        <div className="z-10 text-center px-4 flex-shrink-0">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
            See How It Works
          </h2>
          <p className="text-md md:text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Our AI chatbot platform in three simple steps
          </p>
        </div>

        {/* Horizontal Track (Videos) */}
        <div className="flex-1 flex items-center w-full relative z-10 overflow-hidden mt-6 mb-8">
          <div
            ref={trackRef}
            className="flex items-center gap-[15vw] px-[calc(50vw-45vw)] md:px-[calc(50vw-350px)] lg:px-[calc(50vw-450px)] xl:px-[calc(50vw-500px)] transition-transform duration-[50ms] ease-out will-change-transform"
          >
            {steps.map((step, index) => (
              <div
                key={index}
                data-card-index={index}
                className="flex-shrink-0 group"
              >
                <BrowserCard
                  step={step}
                  index={index}
                  isActive={activeIndex === index}
                  videoRef={(el) => (videoRefs.current[index] = el)}
                  cardDims={cardDims}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Static Horizontal Timeline */}
        <div className="hidden md:block w-full max-w-5xl mx-auto px-4 relative z-20 flex-shrink-0">
          {/* Connecting line background */}
          <div className="absolute top-[20px] left-[15%] right-[15%] h-[2px] dark:bg-white/10 bg-black/10" />
          {/* Active connecting line */}
          <div 
            className="absolute top-[20px] left-[15%] h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700 ease-out"
            style={{ width: `${(activeIndex / (steps.length - 1)) * 70}%` }}
          />
          
          <div className="relative flex justify-between">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`flex flex-col items-center w-[30%] text-center transition-all duration-500 cursor-pointer 
                  ${Math.abs(activeIndex - index) === 0 ? "scale-105 opacity-100" : "scale-90 opacity-100"}
                `}
                onClick={() => {
                  // Optional: allows users to click the timeline to scroll to that step
                  // Complex due to scroll position, easier strictly as an indicator
                }}
              >
                {/* Node */}
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base relative z-10 transition-all duration-500
                  ${activeIndex >= index 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] border-none' 
                    : 'dark:bg-black bg-background text-muted-foreground dark:border-white/20 border-border border'
                  }
                `}>
                  {index + 1}
                </div>
                
                {/* Title & Description */}
                {/* <div className="mt-6 md:mt-8">
                  <h3 className={`text-lg md:text-xl font-bold transition-colors duration-500 ${activeIndex === index ? 'text-white' : 'text-white/70'}`}>
                    {step.title}
                  </h3>
                  <p className={`mt-2 text-sm md:text-base leading-relaxed transition-colors duration-500 ${activeIndex === index ? 'text-white/80' : 'text-white/40'}`}>
                    {step.description}
                  </p>
                </div> */}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Version - Vertical Stack purely displaying elements appropriately */}
      <div className="md:hidden absolute inset-0 pt-32 pb-16 px-4 flex flex-col gap-16 overflow-y-auto">
        {steps.map((step, index) => (
          <div key={index} className="w-full relative">
            <div className="mb-6 space-y-2 text-center">
              <div className="inline-flex w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center text-white font-bold text-sm mb-2 shadow-lg shadow-blue-500/30">
                {index + 1}
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {step.description}
              </p>
            </div>
            <MobileBrowserCard step={step} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
}

// Desktop Browser Card Component
interface BrowserCardProps {
  step: Step;
  index: number;
  isActive: boolean;
  videoRef: (el: HTMLVideoElement | null) => void;
  cardDims: { width: number; height: number };
}

function BrowserCard({ step, index, isActive, videoRef, cardDims }: BrowserCardProps) {
  return (
    <div
      className={`
        hidden md:block 
        transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]
        ${isActive ? "scale-100 opacity-100 z-20" : "scale-[0.85] opacity-40 z-10"}
      `}
      style={{ width: cardDims.width, height: cardDims.height }}
    >
      {/* Card Container */}
      <div
        className={`
          h-full flex flex-col
          rounded-[24px] overflow-hidden 
          dark:bg-black/40 bg-gray-900
          border
          backdrop-blur-xl
          shadow-2xl 
          transition-all duration-700
          ${isActive ? "dark:border-white/30 border-gray-600 shadow-blue-500/20 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)]" : "dark:border-white/10 border-gray-700 shadow-black/50"}
        `}
      >
        {/* Browser Chrome */}
        <div className="flex-shrink-0 dark:bg-gradient-to-r dark:from-white/10 dark:to-white/5 bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-2 border-b dark:border-white/10 border-gray-700 flex items-center gap-2">
          <div className="flex gap-2.5">
            <div className={`w-3 h-3 rounded-full transition-colors duration-500 ${isActive ? 'bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-white/20'}`}></div>
            <div className={`w-3 h-3 rounded-full transition-colors duration-500 ${isActive ? 'bg-yellow-500/80 shadow-[0_0_8px_rgba(234,179,8,0.6)]' : 'bg-white/20'}`}></div>
            <div className={`w-3 h-3 rounded-full transition-colors duration-500 ${isActive ? 'bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-white/20'}`}></div>
          </div>
          <div className="flex-1 max-w-sm mx-auto flex items-center justify-center">
            <div className={`w-full max-w-[200px] h-6 rounded-md transition-colors duration-500 ${isActive ? 'bg-white/10 text-white/50' : 'bg-white/5 text-transparent'} text-xs flex items-center justify-center`}>
              {isActive ? 'demo.ragly.ai' : ''}
            </div>
          </div>
          <div className="w-[50px]"></div> 
        </div>

        {/* Video Container - fills remaining card height, preserving 4:3 via dynamic card dimensions */}
        <div className="relative flex-1 overflow-hidden rounded-b-[22px]">
          <video
            ref={videoRef}
            src={step.videoSrc}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            preload="metadata"
          />

          {/* Overlay gradient for depth */}
          <div className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${isActive ? 'bg-transparent' : 'bg-black/50'}`} />
        </div>
      </div>
    </div>
  );
}

// Mobile Browser Card Component
interface MobileBrowserCardProps {
  step: Step;
  index: number;
}

function MobileBrowserCard({ step, index }: MobileBrowserCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="rounded-[20px] overflow-hidden dark:bg-black/40 bg-gray-900 dark:border-white/20 border-gray-700 border backdrop-blur-xl shadow-2xl">
      {/* Browser Chrome */}
      <div className="dark:bg-gradient-to-r dark:from-white/10 dark:to-white/5 bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-3 border-b dark:border-white/10 border-gray-700 flex items-center gap-2">
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500/80"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500/80"></div>
          <div className="w-2 h-2 rounded-full bg-green-500/80"></div>
        </div>
        <div className="flex-1 ml-4 flex justify-center">
          <div className="bg-white/10 rounded-md px-4 py-1 text-[11px] text-white/50 w-full max-w-[150px] text-center">
            demo.ragly.ai
          </div>
        </div>
        <div className="w-[44px]"></div>
      </div>

      {/* Video Container - 16:9 Aspect Ratio */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-b-[18px]">
        <video
          ref={videoRef}
          src={step.videoSrc}
          className="w-full h-full object-cover rounded-b-[18px]"
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

