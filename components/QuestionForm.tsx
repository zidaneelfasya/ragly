"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function TicketDialog() {
  const [ticketId, setTicketId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleCreateTicket = async () => {
    setLoading(true)
    try {
      // simulasi API buat tiket
      const newTicketId = "TCK-" + Math.floor(Math.random() * 1000000)
      setTicketId(newTicketId)
    } catch (error) {
      console.error("Gagal membuat tiket", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Buat Tiket Baru</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Buat Tiket</DialogTitle>
          <DialogDescription>
            Masukkan detail untuk membuat tiket baru.
          </DialogDescription>
        </DialogHeader>

        {/* Input bisa ditambahkan di sini */}
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">
              Subject
            </Label>
            <Input id="subject" className="col-span-3" />
          </div>
        </div>

        {/* Button Buat Tiket */}
        <Button onClick={handleCreateTicket} disabled={loading}>
          {loading ? "Membuat..." : "Buat Tiket"}
        </Button>

        {/* ✅ Jika tiket berhasil dibuat, tampilkan ID */}
        {ticketId && (
          <p className="text-green-600 text-sm mt-3">
            ✅ Tiket berhasil dibuat dengan ID: <b>{ticketId}</b>
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}
