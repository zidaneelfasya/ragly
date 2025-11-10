"use client";

import { TicketStatusSteps, TicketStatus } from "../../components/ticket-status-steps";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

// 🔹 Fetch tiket pakai Axios
async function fetchTicket(ticketCode: string) {
  const res = await axios.get(`/api/v1/tickets`, {
    params: { ticket: ticketCode },
  });
  return res.data;
}

export default function TicketStatusPage() {
  const searchParams = useSearchParams();
  const ticketCode = searchParams.get("ticket"); // ambil dari query string
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticketCode) {
      setError("Kode tiket tidak ditemukan di URL");
      setLoading(false);
      return;
    }

    fetchTicket(ticketCode)
      .then((data) => {
        setTicket(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || err.message);
        setLoading(false);
      });
  }, [ticketCode]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  }
  if (!ticket) {
    return <div className="flex items-center justify-center min-h-screen">Data tiket tidak ditemukan.</div>;
  }

  const status: TicketStatus = ticket.solusi ? "selesai" : "proses";

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl">
        <TicketStatusSteps
          status={status}
          submittedAt={ticket.created_at}
          answeredAt={ticket.updated_at}
        />
        
        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <span className="font-semibold text-xl">Pertanyaan &amp; Jawaban</span>
          </CardHeader>
          <CardContent>
            {/* ✅ Topik tampil */}
            <div className="mb-4 text-sm text-gray-600">
              Topik: {ticket.topik_konsultasi?.nama_topik || "Tidak diketahui"}
            </div>

            {/* ✅ Pertanyaan tampil */}
            <div className="mb-6 p-4 rounded-lg bg-gray-50">
              <div className="font-medium text-base mb-1">Pertanyaan:</div>
              <div className="text-muted-foreground text-lg">
                {ticket.uraian_kebutuhan_konsultasi || "Pertanyaan tidak ditemukan"}
              </div>
            </div>

            {/* ✅ Jawaban tampil */}
            <div className="p-4 rounded-lg bg-gray-50">
              <div className="font-medium text-base mb-1">Jawaban:</div>
              {ticket.solusi ? (
                <div className="text-muted-foreground text-lg">{ticket.solusi}</div>
              ) : (
                <div className="text-muted-foreground italic text-lg">
                  Belum ada jawaban, tiket masih dalam proses.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
