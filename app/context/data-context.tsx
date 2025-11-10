// contexts/data-context.tsx
"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

interface PICData {
  id: number;
  nama_pic: string;
}

interface UnitData {
  id: number;
  nama_unit: string;
  nama_pic: string | null;
}

interface DataContextType {
  picList: PICData[];
  unitList: UnitData[];
  loading: boolean;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [picList, setPicList] = useState<PICData[]>([])
  const [unitList, setUnitList] = useState<UnitData[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch both PIC and Unit data in parallel
      const [picResponse, unitResponse] = await Promise.all([
        fetch('/api/v1/konsultasi/pic'),
        fetch('/api/v1/konsultasi/units')
      ])

      if (!picResponse.ok || !unitResponse.ok) {
        throw new Error('Failed to fetch data')
      }

      const [picResult, unitResult] = await Promise.all([
        picResponse.json(),
        unitResponse.json()
      ])

      if (picResult.success) setPicList(picResult.data || [])
      if (unitResult.success) setUnitList(unitResult.data || [])
      
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <DataContext.Provider value={{ picList, unitList, loading, refreshData: fetchData }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}