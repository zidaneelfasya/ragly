import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('topik_konsultasi')
      .select('*')
      .order('nama_topik', { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: 'Gagal mengambil daftar topik konsultasi', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
      message: 'Daftar topik konsultasi berhasil diambil'
    });

  } catch (error) {
    console.error('Error in GET /api/v1/konsultasi/topics:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
