import Image from "next/image";

export function FeaturesSection() {
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
						className="max-w-[60%] max-h-[60%] w-auto h-auto object-contain"
						priority
					/>
				</div>
			</div>
			
			{/* Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
						Tanya dan Akan Kami Jawab
					</h2>
					<h3 className="text-3xl md:text-4xl font-bold text-gray-900">
						Setiap Saat dan Setiap Waktu
					</h3>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
			</div>
		</section>
	);
}
