"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TicketCekPage() {
  const [ticketCode, setTicketCode] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketCode) return;
    router.push(`/ticket-status?ticket=${ticketCode}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">Cek Status Tiket</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Input
              type="text"
              value={ticketCode}
              onChange={(e) => setTicketCode(e.target.value)}
              placeholder="Masukkan kode tiket (contoh: TICKET-ABC123)"
              className="mb-4"
              required
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Lihat Status
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
