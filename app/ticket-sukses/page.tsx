"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { CheckCircle2 } from "lucide-react"

export default function TicketSuksesPage() {
	const [ticketId, setTicketId] = useState<string | null>(null)

	useEffect(() => {
		if (typeof window !== "undefined") {
			setTicketId(localStorage.getItem("last_ticket_id"))
		}
	}, [])

			return (
				<div className="min-h-screen flex items-center justify-center bg-background px-4">
					<Card className="w-full max-w-md shadow-xl bg-blue-900 text-white border border-blue-700">
				<CardHeader className="flex flex-col items-center space-y-3">
					<CheckCircle2 className="h-16 w-16 text-green-400" />
					<CardTitle className="text-2xl font-bold text-center">
						Tiket Berhasil Dibuat!
					</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col items-center space-y-4">
					{ticketId && (
						<p className="text-lg font-semibold text-green-300 text-center">
							Nomor Tiket: {ticketId}
						</p>
					)}
					<p className="text-gray-200 text-center">
						Terima kasih telah mengajukan konsultasi.
						<br />
						Tiket Konsultasi akan anda terima juga di Nomor WhatsApp yang telah anda daftarkan dan dipakai untuk melacak status konsultasi.
					</p>
					<Link href="/" className="w-full">
						<Button className="bg-green-600 hover:bg-green-700 text-white w-full">
							Kembali ke Beranda
						</Button>
					</Link>
					<Link href="/konsultasi-form" className="w-full">
						<Button className="bg-blue-500 hover:bg-blue-700 text-white w-full">
							Isi Form Konsultasi Lagi
						</Button>
					</Link>
				</CardContent>
			</Card>
		</div>
	)
}
 