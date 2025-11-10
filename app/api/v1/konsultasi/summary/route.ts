import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const supabase = await createClient();

	try {
		// Get current user
		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser();

		if (userError || !user) {
			return NextResponse.json(
				{ error: "User tidak ditemukan atau belum login" },
				{ status: 401 }
			);
		}

		// Get user's assigned units to check if superadmin
		const { data: userUnits } = await supabase
			.from("user_unit_penanggungjawab")
			.select("unit_id")
			.eq("user_id", user.id);

		const isSuperAdmin = userUnits?.some((unit) => unit.unit_id === 1) || false;

		// Base query for statistics - adjust based on user access
		let filteredData;

		if (!isSuperAdmin && userUnits && userUnits.length > 0) {
			// Filter by user's units if not superadmin
			const userUnitIds = userUnits.map((unit) => unit.unit_id);

			// Get konsultasi IDs that belong to user's units
			const { data: userKonsultasiIds } = await supabase
				.from("konsultasi_unit")
				.select("konsultasi_id")
				.in("unit_id", userUnitIds);

			const konsultasiIds =
				userKonsultasiIds?.map((item) => item.konsultasi_id) || [];

			if (konsultasiIds.length === 0) {
				// User has no consultations
				filteredData = [];
			} else {
				// Get konsultasi data for user's units
				const { data } = await supabase
					.from("konsultasi_spbe")
					.select("*")
					.in("id", konsultasiIds);
				filteredData = data || [];
			}
		} else {
			// Get all data for superadmin
			const { data } = await supabase.from("konsultasi_spbe").select("*");
			filteredData = data || [];
		}

		// 1. Total konsultasi
		const totalCount = filteredData.length;

		// 2. Statistics by status
		const statusStats = filteredData.reduce(
			(acc: Record<string, number>, item: any) => {
				acc[item.status] = (acc[item.status] || 0) + 1;
				return acc;
			},
			{}
		);

		// 3. Statistics by kategori
		const kategoriStats = filteredData.reduce(
			(acc: Record<string, number>, item: any) => {
				acc[item.kategori] = (acc[item.kategori] || 0) + 1;
				return acc;
			},
			{}
		);

		// 4. Monthly trend (last 12 months)
		const twelveMonthsAgo = new Date();
		twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

		const monthlyData = filteredData.filter(
			(item: any) => new Date(item.created_at) >= twelveMonthsAgo
		);

		const monthlyStats = monthlyData.reduce(
			(acc: Record<string, number>, item: any) => {
				const month = new Date(item.created_at).toISOString().slice(0, 7); // YYYY-MM format
				acc[month] = (acc[month] || 0) + 1;
				return acc;
			},
			{}
		);

		// 4.5. Statistics by topik (get from join table)
		let topikStats = {};
		if (isSuperAdmin) {
			// Get all topik data for superadmin
			const { data: topikData } = await supabase.from("konsultasi_topik")
				.select(`
          topik_id,
          topik_konsultasi(nama_topik)
        `);

			topikStats =
				topikData?.reduce((acc: Record<string, number>, item: any) => {
					const topikName = item.topik_konsultasi?.nama_topik || "Unknown";
					acc[topikName] = (acc[topikName] || 0) + 1;
					return acc;
				}, {}) || {};
		} else {
			// Get topik data filtered by user's consultations
			const konsultasiIds = filteredData.map((item: any) => item.id);
			if (konsultasiIds.length > 0) {
				const { data: topikData } = await supabase
					.from("konsultasi_topik")
					.select(
						`
            topik_id,
            topik_konsultasi(nama_topik)
          `
					)
					.in("konsultasi_id", konsultasiIds);

				topikStats =
					topikData?.reduce((acc: Record<string, number>, item: any) => {
						const topikName = item.topik_konsultasi?.nama_topik || "Unknown";
						acc[topikName] = (acc[topikName] || 0) + 1;
						return acc;
					}, {}) || {};
			}
		}

		// Generate complete months array for the last 12 months
		const monthlyTrend = [];
		for (let i = 11; i >= 0; i--) {
			const date = new Date();
			date.setMonth(date.getMonth() - i);
			const monthKey = date.toISOString().slice(0, 7);
			const monthName = date.toLocaleDateString("id-ID", {
				year: "numeric",
				month: "long",
			});

			monthlyTrend.push({
				month: monthKey,
				monthName,
				count: monthlyStats[monthKey] || 0,
			});
		}

		// 5. Top units (for superadmin) or user units performance
		let unitStats = [];
		if (isSuperAdmin) {
			const { data: unitData } = await supabase.from("konsultasi_unit").select(`
          unit_id,
          unit_penanggungjawab(nama_unit),
          konsultasi_spbe(id)
        `);

			const unitCounts =
				unitData?.reduce((acc: Record<number, any>, item: any) => {
					const unitId = item.unit_id;
					if (!acc[unitId]) {
						acc[unitId] = {
							unit_id: unitId,
							unit_name: item.unit_penanggungjawab?.nama_unit || "Unknown",
							count: 0,
						};
					}
					acc[unitId].count += 1;
					return acc;
				}, {}) || {};

			unitStats = Object.values(unitCounts)
				.sort((a: any, b: any) => b.count - a.count)
				.slice(0, 5); // Top 5 units
		} else {
			// For regular users, show their unit's performance
			const userUnitIds = userUnits?.map((unit) => unit.unit_id) || [];
			const { data: userUnitData } = await supabase
				.from("unit_penanggungjawab")
				.select("id, nama_unit")
				.in("id", userUnitIds);

			for (const unit of userUnitData || []) {
				const { count } = await supabase
					.from("konsultasi_unit")
					.select("*", { count: "exact", head: true })
					.eq("unit_id", unit.id);

				unitStats.push({
					unit_id: unit.id,
					unit_name: unit.nama_unit,
					count: count || 0,
				});
			}
		}

		// 6. Recent activity (last 30 days)
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		const recentData = filteredData.filter(
			(item: any) => new Date(item.created_at) >= thirtyDaysAgo
		);
		const recentCount = recentData.length;

		// 7. Status distribution for charts
		const statusDistribution = Object.entries(statusStats).map(
			([status, count]) => ({
				name: status,
				value: count,
				color: getStatusColor(status),
			})
		);

		const kategoriDistribution = Object.entries(kategoriStats).map(
			([kategori, count]) => ({
				name: kategori,
				value: count,
				color: getKategoriColor(kategori),
			})
		);

		// Convert topik stats to chart format
		const topikDistribution = Object.entries(topikStats)
			.sort(([, a], [, b]) => (b as number) - (a as number))
			.slice(0, 10) // Top 10 topics
			.map(([topik, count]) => ({
				name: topik.length > 30 ? topik.substring(0, 30) + "..." : topik, // Truncate long names
				fullName: topik,
				value: count,
				color: getTopikColor(topik),
			}));

		// 8. Statistics by provinsi (normalize case and capitalize first letter of each word)
		const provinsiStats = filteredData.reduce(
			(acc: Record<string, number>, item: any) => {
				if (item.asal_provinsi) {
					// Normalize: lowercase all then capitalize first letter of each word
					const normalizedProvinsi = item.asal_provinsi
						.toLowerCase()
						.split(' ')
						.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
						.join(' ');
					
					acc[normalizedProvinsi] = (acc[normalizedProvinsi] || 0) + 1;
				}
				return acc;
			},
			{}
		);

		// 9. Extract keywords from consultation descriptions using RAKE
		const keywordStats: Record<string, number> = {};

		// Extract text from uraian_kebutuhan_konsultasi
		const consultationTexts = filteredData
			.filter((item: any) => item.uraian_kebutuhan_konsultasi)
			.map((item: any) => item.uraian_kebutuhan_konsultasi);

		// Process each consultation text with RAKE algorithm
		for (const text of consultationTexts) {
			try {
				const keywords = extractKeywordsWithRAKE(text);
				
				// Count keyword frequency
				keywords.forEach((keyword) => {
					keywordStats[keyword] = (keywordStats[keyword] || 0) + 1;
				});
			} catch (error) {
				// If keyword extraction fails for a text, continue with others
				console.warn("Keyword extraction failed for text:", error);
			}
		}

		// Get top keywords
		const topKeywords = Object.entries(keywordStats)
			.sort(([, a], [, b]) => (b as number) - (a as number))
			.slice(0, 10) // Top 10 keywords
			.map(([keyword, count]) => ({
				keyword,
				count,
				color: getKeywordColor(keyword),
			}));

      console.log('Extracted keywords:', Object.entries(provinsiStats).length);
      console.log('Top keywords:', provinsiStats);
		return NextResponse.json({
			success: true,
			data: {
				overview: {
					total: totalCount || 0,
					recentActivity: recentCount || 0,
					accessLevel: isSuperAdmin ? "superadmin" : "unit-restricted",
				},
				statusStats,
				kategoriStats,
				topikStats,
				provinsiStats,
				keywordStats,
				monthlyTrend,
				unitStats,
				topKeywords,
				charts: {
					statusDistribution,
					kategoriDistribution,
					topikDistribution,
				},
			},
		});
	} catch (error) {
		console.error("Error fetching summary data:", error);
		return NextResponse.json(
			{
				error: "Internal server error",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

// RAKE (Rapid Automatic Keyword Extraction) Algorithm Implementation
function extractKeywordsWithRAKE(text: string): string[] {
	// Step 1: Split text into sentences and then into words
	const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
	
	// Step 2: Remove stop words and get candidate keywords
	const allCandidates: string[] = [];
	
	sentences.forEach(sentence => {
		// Split by delimiters (punctuation, stop words)
		const words = sentence.toLowerCase()
			.replace(/[^\w\s]/g, ' ') // Remove punctuation
			.split(/\s+/)
			.filter(word => word.length > 0);
		
		// Group consecutive non-stop words into candidate phrases
		let currentPhrase: string[] = [];
		
		words.forEach(word => {
			if (isStopWord(word)) {
				// If we hit a stop word, save current phrase if it exists
				if (currentPhrase.length > 0) {
					allCandidates.push(currentPhrase.join(' '));
					currentPhrase = [];
				}
			} else {
				currentPhrase.push(word);
			}
		});
		
		// Don't forget the last phrase
		if (currentPhrase.length > 0) {
			allCandidates.push(currentPhrase.join(' '));
		}
	});
	
	// Step 3: Calculate word scores using degree and frequency
	const wordFreq: Record<string, number> = {};
	const wordDegree: Record<string, number> = {};
	
	// Count word frequency and degree (co-occurrence)
	allCandidates.forEach(candidate => {
		const words = candidate.split(' ');
		
		words.forEach(word => {
			wordFreq[word] = (wordFreq[word] || 0) + 1;
			wordDegree[word] = (wordDegree[word] || 0) + words.length - 1;
		});
	});
	
	// Calculate word scores (degree + frequency)
	const wordScores: Record<string, number> = {};
	Object.keys(wordFreq).forEach(word => {
		wordScores[word] = wordDegree[word] + wordFreq[word];
	});
	
	// Step 4: Calculate phrase scores
	const candidateScores: Array<{ phrase: string, score: number }> = [];
	
	allCandidates.forEach(candidate => {
		const words = candidate.split(' ');
		const score = words.reduce((sum, word) => sum + (wordScores[word] || 0), 0);
		
		// Only include meaningful phrases (length > 2 chars, not all numbers)
		if (candidate.length > 2 && !candidate.match(/^\d+$/)) {
			candidateScores.push({ phrase: candidate, score });
		}
	});
	
	// Step 5: Sort by score and return top candidates
	return candidateScores
		.sort((a, b) => b.score - a.score)
		.slice(0, 20) // Take top 20 candidates per text
		.map(item => item.phrase)
		.filter(phrase => phrase.length >= 3); // Minimum length filter
}

// Enhanced stop words list for Indonesian and English
function isStopWord(word: string): boolean {
	const stopWords = [
		// Indonesian stop words
		'yang', 'untuk', 'dengan', 'dari', 'pada', 'dalam', 'oleh', 'dan', 'atau',
		'ini', 'itu', 'tersebut', 'adalah', 'akan', 'dapat', 'harus', 'bisa',
		'sudah', 'telah', 'sedang', 'masih', 'juga', 'saja', 'serta', 'seperti',
		'bagaimana', 'dimana', 'mengapa', 'kapan', 'siapa', 'apa', 'mana',
		'lebih', 'sangat', 'paling', 'sekali', 'begitu', 'cukup', 'kurang',
		'tentang', 'terhadap', 'kepada', 'bagi', 'antara', 'tanpa', 'selain',
		'sebelum', 'sesudah', 'selama', 'sambil', 'hingga', 'sampai', 'sejak',
		'terkait', 'berkaitan', 'mengenai', 'sehubungan', 'berdasarkan',
		'yaitu', 'yakni', 'bahwa', 'bahkan', 'namun', 'tetapi', 'namanya',
		'melalui', 'melalu', 'via', 'lewat', 'demi', 'guna', 'supaya', 'agar',
		'bila', 'jika', 'kalau', 'ketika', 'saat', 'waktu', 'masa', 'kala',
		'kami', 'kita', 'saya', 'anda', 'mereka', 'dia', 'beliau', 'nya',
		'mu', 'ku', 'kamu', 'engkau', 'kalian', 'kau',
		'ada', 'tidak', 'bukan', 'tak', 'belum', 'pernah', 'tidak',
		'ke', 'di', 'se', 'per', 'ter', 'ber', 'me', 'men', 'mem', 'meng','apakah',
		
		// English stop words
		'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
		'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before',
		'after', 'above', 'below', 'between', 'among', 'under', 'over',
		'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
		'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
		'could', 'can', 'may', 'might', 'must', 'shall',
		'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
		'my', 'your', 'his', 'her', 'its', 'our', 'their',
		'this', 'that', 'these', 'those', 'here', 'there', 'where', 'when',
		'who', 'what', 'which', 'how', 'why',
		'if', 'then', 'else', 'while', 'since', 'until', 'unless'
	];
	
	return stopWords.includes(word.toLowerCase()) || word.length <= 2;
}

// Helper function to check if a word is a common word that should be excluded (keeping for backward compatibility)
function isCommonWord(word: string): boolean {
	const commonWords = [
		'yang', 'untuk', 'dengan', 'dari', 'pada', 'dalam', 'oleh', 'dan', 'atau',
		'ini', 'itu', 'tersebut', 'adalah', 'akan', 'dapat', 'harus', 'bisa',
		'sudah', 'telah', 'sedang', 'masih', 'juga', 'saja', 'serta', 'seperti',
		'bagaimana', 'dimana', 'mengapa', 'kapan', 'siapa', 'apa', 'mana',
		'lebih', 'sangat', 'paling', 'sekali', 'begitu', 'cukup', 'kurang',
		'tentang', 'terhadap', 'kepada', 'bagi', 'antara', 'tanpa', 'selain',
		'sebelum', 'sesudah', 'selama', 'sambil', 'hingga', 'sampai', 'sejak',
		'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
		'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before',
		'after', 'above', 'below', 'between', 'among', 'under', 'over',
		'terkait', 'berkaitan', 'mengenai', 'sehubungan', 'berdasarkan'
	];
	
	return commonWords.includes(word.toLowerCase());
}

// Helper functions for colors
function getStatusColor(status: string): string {
	switch (status) {
		case "new":
			return "#ef4444"; // red
		case "on process":
			return "#f59e0b"; // amber
		case "ready to send":
			return "#3b82f6"; // blue
		case "konsultasi zoom":
			return "#8b5cf6"; // violet
		case "done":
			return "#10b981"; // emerald
		case "FU pertanyaan":
			return "#f97316"; // orange
		case "cancel":
			return "#6b7280"; // gray
		default:
			return "#6b7280";
	}
}

function getKategoriColor(kategori: string): string {
	switch (kategori) {
		case "tata kelola":
			return "#6366f1"; // indigo
		case "infrastruktur":
			return "#06b6d4"; // cyan
		case "aplikasi":
			return "#10b981"; // emerald
		case "keamanan informasi":
			return "#ef4444"; // red
		case "SDM":
			return "#ec4899"; // pink
		default:
			return "#6b7280";
	}
}

function getTopikColor(topik: string): string {
	// Generate consistent colors for topics based on hash
	const colors = [
		"#8b5cf6", // violet
		"#f59e0b", // amber
		"#06b6d4", // cyan
		"#84cc16", // lime
		"#f97316", // orange
		"#3b82f6", // blue
		"#ec4899", // pink
		"#10b981", // emerald
		"#6366f1", // indigo
		"#ef4444", // red
	];

	// Simple hash function to get consistent color for each topic
	let hash = 0;
	for (let i = 0; i < topik.length; i++) {
		const char = topik.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32bit integer
	}

	return colors[Math.abs(hash) % colors.length];
}

function getKeywordColor(keyword: string): string {
	// Generate consistent colors for keywords
	const colors = [
		"#10b981", // emerald
		"#3b82f6", // blue
		"#8b5cf6", // violet
		"#f59e0b", // amber
		"#ef4444", // red
		"#06b6d4", // cyan
		"#84cc16", // lime
		"#f97316", // orange
		"#ec4899", // pink
		"#6366f1", // indigo
	];

	// Simple hash function to get consistent color for each keyword
	let hash = 0;
	for (let i = 0; i < keyword.length; i++) {
		const char = keyword.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32bit integer
	}

	return colors[Math.abs(hash) % colors.length];
}

function getProvinsiColor(provinsi: string): string {
	// Generate consistent colors for provinces
	const colors = [
		"#2563eb", // blue-600
		"#059669", // emerald-600
		"#dc2626", // red-600
		"#7c3aed", // violet-600
		"#ea580c", // orange-600
		"#0891b2", // cyan-600
		"#65a30d", // lime-600
		"#c2410c", // orange-700
		"#be185d", // pink-700
		"#4338ca", // indigo-700
		"#0d9488", // teal-600
		"#7c2d12", // orange-900
		"#92400e", // amber-800
		"#155e75", // cyan-800
		"#374151", // gray-700
		"#581c87", // purple-800
		"#991b1b", // red-800
		"#166534", // green-800
		"#1e40af", // blue-700
		"#b91c1c", // red-600
	];

	// Simple hash function to get consistent color for each province
	let hash = 0;
	for (let i = 0; i < provinsi.length; i++) {
		const char = provinsi.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32bit integer
	}

	return colors[Math.abs(hash) % colors.length];
}
