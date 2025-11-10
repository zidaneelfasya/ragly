import Image from "next/image";
import Link from "next/link";

export function FeaturesContentSection() {
	return (
		<section className="py-16 bg-[#FEFEFE] relative">
			{/* Background Image */}
			<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
				<div className="w-full h-full flex items-center justify-center">
					<Image
						src="/images/klinik_features1.png"
						alt="Background Features"
						width={800}
						height={400}
						className="max-w-[60%] w-auto h-auto object-contain "
						priority
					/>
				</div>
			</div>
			
			{/* Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				{/* Features Header - Diperbaiki untuk responsivitas */}
				<div className="text-center mb-8 md:mb-12 lg:mb-16 px-4">
					<h2 className="text-[clamp(1.5rem,5vw,2.5rem)] font-bold text-gray-900 mb-2 md:mb-4 leading-tight">
						Tanya dan Akan Kami Jawab
					</h2>
					<h3 className="text-[clamp(1.5rem,5vw,2.5rem)] font-bold text-gray-900 leading-tight">
						Setiap Saat dan Setiap Waktu
					</h3>
				</div>

				{/* Feature Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 md:mb-16 px-4">
					<Link 
						href="/chatbot"
						className="group bg-[#003867] text-white px-8 py-4 rounded-lg font-semibold hover:transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-3 w-[240px] h-[60px] justify-center"
					>
						<svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
						</svg>
						Coba Chatbot
					</Link>
					<Link 
						href="/konsultasi"
						className="group bg-white text-[#003867] px-8 py-4 rounded-lg font-semibold border-2 border-[#003867] hover:bg-[#003867] hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-3 w-[240px] h-[60px] justify-center"
					>
						<svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z"/>
						</svg>
						Mulai Konsultasi
					</Link>
				</div>

				{/* Features Grid */}
				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16">
					{/* Service Card 1 */}
					<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
						<div className="bg-blue-100 w-16 h-16 rounded-lg mb-6 flex items-center justify-center">
							<svg
								className="w-8 h-8 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
								/>
							</svg>
						</div>
						<div className="flex items-start mb-3">
							<h3 className="text-lg font-semibold text-gray-900">
								Memberikan konsultasi dan pendampingan digital
							</h3>
						</div>
						<p className="text-gray-600 text-sm leading-relaxed">
							Layanan konsultasi komprehensif untuk transformasi digital
							pemerintah daerah dengan pendampingan ahli yang berpengalaman.
						</p>
					</div>

					{/* Service Card 2 */}
					<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
						<div className="bg-blue-100 w-16 h-16 rounded-lg mb-6 flex items-center justify-center">
							<svg
								className="w-8 h-8 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
								/>
							</svg>
						</div>
						<div className="flex items-start mb-3">
							<h3 className="text-lg font-semibold text-gray-900">
								Membantu penyusunan arsitektur SPBE daerah
							</h3>
						</div>
						<p className="text-gray-600 text-sm leading-relaxed">
							Dukungan teknis dalam merancang dan menyusun arsitektur Sistem
							Pemerintahan Berbasis Elektronik yang sesuai standar.
						</p>
					</div>

					{/* Service Card 3 */}
					<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
						<div className="bg-blue-100 w-16 h-16 rounded-lg mb-6 flex items-center justify-center">
							<svg
								className="w-8 h-8 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
								/>
							</svg>
						</div>
						<div className="flex items-start mb-3">
							<h3 className="text-lg font-semibold text-gray-900">
								Meningkatkan indeks SPBE melalui transformasi menyeluruh
							</h3>
						</div>
						<p className="text-gray-600 text-sm leading-relaxed">
							Program transformasi digital komprehensif untuk meningkatkan
							indeks SPBE dan kualitas layanan publik.
						</p>
					</div>

					{/* Service Card 4 */}
					<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
						<div className="bg-blue-100 w-16 h-16 rounded-lg mb-6 flex items-center justify-center">
							<svg
								className="w-8 h-8 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
								/>
							</svg>
						</div>
						<div className="flex items-start mb-3">
							<h3 className="text-lg font-semibold text-gray-900">
								Memfasilitasi kolaborasi antar daerah dan pusat
							</h3>
						</div>
						<p className="text-gray-600 text-sm leading-relaxed">
							Platform kolaborasi yang menghubungkan pemerintah daerah dengan
							pusat untuk berbagi best practices dan inovasi.
						</p>
					</div>
				</div>

				{/* Content Section */}
				<div className="max-w-4xl mx-auto px-4">
					<div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
						<div className="prose prose-lg max-w-none">
							<p className="text-gray-700 leading-relaxed text-justify">
								Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the 
								industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and 
								scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into 
								electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the 
								release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing 
								software like Aldus PageMaker including versions of Lorem Ipsum.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}