"use client";

import React from 'react';
import { UserProvider } from "@/app/context/user-context";
import { SummaryCards, DetailedStatsCards } from "@/components/summary-cards";
import { SummaryCharts, MonthlyComparisonChart } from "@/components/summary-charts";
import { TopikDistributionChart } from "@/components/topik-chart";
import { useSummaryData } from "@/hooks/useSummaryData";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";

function SummaryPageContent() {
  const { data, loading, error, refreshData } = useSummaryData();

  const handleRefresh = () => {
    toast.info("Memperbarui data ringkasan...");
    refreshData();
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Ringkasan Konsultasi SPBE</h2>
          <p className="text-muted-foreground">
            Dashboard ringkasan dan analisis data konsultasi
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          disabled={loading}
          variant="outline"
          size="sm"
        >
          <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Perbarui
        </Button>
      </div>

      {/* Main Summary Cards */}
      <SummaryCards data={data} loading={loading} error={error} />

      {/* Charts Section */}
      <SummaryCharts data={data} loading={loading} error={error} />

      {/* Topik Distribution Chart */}
      <TopikDistributionChart data={data} loading={loading} error={error} />

      {/* Detailed Stats */}
      <DetailedStatsCards data={data} loading={loading} error={error} />

      {/* Monthly Comparison */}
      <MonthlyComparisonChart data={data} loading={loading} error={error} />
    </div>
  );
}

export default function AdminSummaryPage() {
  return (
    <UserProvider>
      <SummaryPageContent />
    </UserProvider>
  );
}
