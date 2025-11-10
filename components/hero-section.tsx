import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative h-screen bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(/images/hero.png)'}}>
      <div className="absolute inset-0 bg-[#003867] bg-opacity-60"></div>
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white px-4">
          <div className="flex justify-center">
            <Image
              src="/images/klinik_hero.png"
              alt="Klinik Pemerintah Digital"
              width={500}
              height={200}
              className="max-w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
