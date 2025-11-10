import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
	BarChart3,
	TrendingUp,
	Users,
	Clock,
	CheckCircle2,
	AlertCircle,
} from "lucide-react";
import { IndonesiaMap } from "@/components/indonesia-map";

interface SummaryData {
	overview: {
		total: number;
		recentActivity: number;
		accessLevel: string;
	};
	statusStats: Record<string, number>;
	kategoriStats: Record<string, number>;
	topikStats: Record<string, number>;
	provinsiStats: Record<string, number>;
	keywordStats: Record<string, number>;
	monthlyTrend: Array<{
		month: string;
		monthName: string;
		count: number;
	}>;
	unitStats: Array<{
		unit_id: number;
		unit_name: string;
		count: number;
	}>;
	topKeywords: Array<{
		keyword: string;
		count: number;
		color: string;
	}>;
	charts: {
		statusDistribution: Array<{
			name: string;
			value: number;
			color: string;
		}>;
		kategoriDistribution: Array<{
			name: string;
			value: number;
			color: string;
		}>;
		topikDistribution: Array<{
			name: string;
			fullName: string;
			value: number;
			color: string;
		}>;
	};
}

interface SummaryCardsProps {
	data: SummaryData | null;
	loading: boolean;
	error?: string | null;
}

export function SummaryCards({ data, loading, error }: SummaryCardsProps) {
	if (loading) {
		return (
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{[...Array(4)].map((_, i) => (
					<Card key={i}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<Skeleton className="h-4 w-[100px]" />
							<Skeleton className="h-4 w-4" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-8 w-[60px] mb-2" />
							<Skeleton className="h-3 w-[120px]" />
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (error || !data) {
		return (
			<Card className="col-span-full">
				<CardContent className="flex items-center justify-center h-32">
					<div className="text-center">
						<AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
						<p className="text-muted-foreground">
							{error || "Gagal memuat data ringkasan"}
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	const { overview, statusStats, kategoriStats, unitStats } = data;

	// Calculate completion rate (done / total)
	const completionRate =
		overview.total > 0
			? Math.round(((statusStats.done || 0) / overview.total) * 100)
			: 0;

	// Calculate active consultations (not done or cancelled)
	const activeConsultations =
		overview.total - (statusStats.done || 0) - (statusStats.cancel || 0);

	// Get top performing unit
	const topUnit = unitStats.length > 0 ? unitStats[0] : null;

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{/* Total Konsultasi */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Total Konsultasi
					</CardTitle>
					<BarChart3 className="h-4 w-4 text-muted-foreground" />
				</CardHeader>

				<CardContent>
					<div className="text-2xl font-bold">
						{overview.total.toLocaleString("id-ID")}
					</div>
					<div className="text-xs text-muted-foreground">
						<Badge variant="secondary" className="text-xs">
							{overview.accessLevel === "superadmin"
								? "Semua Data"
								: "Data Unit"}
						</Badge>
					</div>
				</CardContent>
			</Card>

			{/* Aktivitas Terbaru */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Aktivitas 30 Hari
					</CardTitle>
					<Clock className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{overview.recentActivity.toLocaleString("id-ID")}
					</div>
					<p className="text-xs text-muted-foreground">
						Konsultasi baru bulan ini
					</p>
				</CardContent>
			</Card>

			{/* Tingkat Penyelesaian */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Tingkat Penyelesaian
					</CardTitle>
					<CheckCircle2 className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{completionRate}%</div>
					<p className="text-xs text-muted-foreground">
						{statusStats.done || 0} dari {overview.total} selesai
					</p>
				</CardContent>
			</Card>

			{/* Konsultasi Aktif */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Sedang Berjalan</CardTitle>
					<TrendingUp className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{activeConsultations.toLocaleString("id-ID")}
					</div>
					<p className="text-xs text-muted-foreground">Konsultasi aktif</p>
				</CardContent>
			</Card>
		</div>
	);
}

// Additional component for detailed stats cards
export function DetailedStatsCards({ data, loading }: SummaryCardsProps) {
	if (loading) {
		return (
			<div className="grid gap-4 md:grid-cols-2">
				{[...Array(4)].map((_, i) => (
					<Card key={i}>
						<CardHeader>
							<Skeleton className="h-5 w-[150px]" />
							<Skeleton className="h-4 w-[200px]" />
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								{[...Array(3)].map((_, j) => (
									<div key={j} className="flex justify-between">
										<Skeleton className="h-4 w-[100px]" />
										<Skeleton className="h-4 w-[50px]" />
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (!data) return null;

	const {
		statusStats,
		kategoriStats,
		topikStats,
		provinsiStats,
		unitStats,
		topKeywords,
	} = data;

	return (
		<>
			<div className="grid gap-4 md:grid-cols-2">
				{/* Status Breakdown */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Distribusi Status</CardTitle>
						<CardDescription>
							Breakdown konsultasi berdasarkan status saat ini
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{Object.entries(statusStats)
								.sort(([, a], [, b]) => (b as number) - (a as number))
								.map(([status, count]) => (
									<div
										key={status}
										className="flex items-center justify-between"
									>
										<div className="flex items-center gap-2">
											<div
												className="w-3 h-3 rounded-full"
												style={{ backgroundColor: getStatusColor(status) }}
											/>
											<span className="text-sm capitalize">
												{status.replace("_", " ")}
											</span>
										</div>
										<Badge variant="outline">{count}</Badge>
									</div>
								))}
						</div>
					</CardContent>
				</Card>

				{/* Kategori Breakdown */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Distribusi Kategori</CardTitle>
						<CardDescription>
							Breakdown konsultasi berdasarkan kategori SPBE
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{Object.entries(kategoriStats)
								.sort(([, a], [, b]) => (b as number) - (a as number))
								.map(([kategori, count]) => (
									<div
										key={kategori}
										className="flex items-center justify-between"
									>
										<div className="flex items-center gap-2">
											<div
												className="w-3 h-3 rounded-full"
												style={{ backgroundColor: getKategoriColor(kategori) }}
											/>
											<span className="text-sm capitalize">{kategori}</span>
										</div>
										<Badge variant="outline">{count}</Badge>
									</div>
								))}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Grid untuk Distribusi Topik dan Kata Kunci Populer */}
			<div className="grid gap-4 md:grid-cols-2 mt-4">
				{/* Topik Breakdown */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Distribusi Topik</CardTitle>
						<CardDescription>
							Top topik konsultasi yang paling sering
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{Object.entries(topikStats)
								.sort(([, a], [, b]) => (b as number) - (a as number))
								.slice(0, 10) // Show top 10 topics
								.map(([topik, count]) => (
									<div
										key={topik}
										className="flex items-center justify-between"
									>
										<div className="flex items-center gap-2">
											<div
												className="w-3 h-3 rounded-full"
												style={{ backgroundColor: getTopikColor(topik) }}
											/>
											<span className="text-sm" title={topik}>
												{topik.length > 50
													? topik.substring(0, 40) + "..."
													: topik}
											</span>
										</div>
										<Badge variant="outline">{count}</Badge>
									</div>
								))}
						</div>
					</CardContent>
				</Card>

				{/* Keywords Breakdown */}
				{topKeywords && topKeywords.length > 0 ? (
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Kata Kunci Populer</CardTitle>
							<CardDescription>
								Kata kunci yang sering muncul dalam konsultasi
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{topKeywords.slice(0, 8).map((item) => (
									<div
										key={item.keyword}
										className="flex items-center justify-between"
									>
										<div className="flex items-center gap-2">
											<div
												className="w-3 h-3 rounded-full"
												style={{ backgroundColor: item.color }}
											/>
											<span className="text-sm capitalize" title={item.keyword}>
												{item.keyword.length > 40
													? item.keyword.substring(0, 40) + "..."
													: item.keyword}
											</span>
										</div>
										<Badge variant="outline">{item.count}</Badge>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				) : (
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Kata Kunci Populer</CardTitle>
							<CardDescription>
								Kata kunci yang sering muncul dalam konsultasi
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="text-center text-muted-foreground py-4">
								Belum ada data kata kunci tersedia
							</div>
						</CardContent>
					</Card>
				)}
			</div>

			{/* Grid untuk Peta Distribusi Provinsi */}
			<div className="mt-4">
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Peta Distribusi Provinsi</CardTitle>
						<CardDescription>
							Visualisasi sebaran konsultasi berdasarkan provinsi di Indonesia
						</CardDescription>
					</CardHeader>
					<CardContent>
						<IndonesiaMap provinsiStats={provinsiStats} className="w-full" />
					</CardContent>
				</Card>
			</div>

			{/* Grid untuk Distribusi Provinsi */}
			<div className="mt-4">
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Distribusi Provinsi</CardTitle>
						<CardDescription>
							Asal provinsi konsultasi berdasarkan wilayah
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{Object.entries(provinsiStats)
								.sort(([, a], [, b]) => (b as number) - (a as number))
								.slice(0, 15) // Show top 15 provinces
								.map(([provinsi, count]) => (
									<div
										key={provinsi}
										className="flex items-center justify-between"
									>
										<div className="flex items-center gap-2">
											<div
												className="w-3 h-3 rounded-full"
												style={{ backgroundColor: getProvinsiColor(provinsi) }}
											/>
											<span className="text-sm" title={provinsi}>
												{provinsi}
											</span>
										</div>
										<Badge variant="outline">{count} konsultasi</Badge>
									</div>
								))}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Grid untuk Top Units */}
			{unitStats.length > 0 && (
				<div className="mt-4">
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Unit Konsultasi</CardTitle>
							<CardDescription>Jumlah Konsultasi Per Unit</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{unitStats.slice(0, 10).map((unit, index) => (
									<div
										key={unit.unit_id}
										className="flex items-center justify-between"
									>
										<div className="flex items-center gap-3">
											<div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
												{index + 1}
											</div>
											<span className="text-sm">{unit.unit_name}</span>
										</div>
										<Badge variant="outline">{unit.count} konsultasi</Badge>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			)}
		</>
	);
}

// Helper functions (same as in API)
function getStatusColor(status: string): string {
	switch (status) {
		case "new":
			return "#ef4444";
		case "on process":
			return "#f59e0b";
		case "ready to send":
			return "#3b82f6";
		case "konsultasi zoom":
			return "#8b5cf6";
		case "done":
			return "#10b981";
		case "FU pertanyaan":
			return "#f97316";
		case "cancel":
			return "#6b7280";
		default:
			return "#6b7280";
	}
}

function getKategoriColor(kategori: string): string {
	switch (kategori) {
		case "tata kelola":
			return "#6366f1";
		case "infrastruktur":
			return "#06b6d4";
		case "aplikasi":
			return "#10b981";
		case "keamanan informasi":
			return "#ef4444";
		case "SDM":
			return "#ec4899";
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
