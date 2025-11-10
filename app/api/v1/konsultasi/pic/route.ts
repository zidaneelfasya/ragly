import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('pic_list')
      .select('*')
      .order('nama_pic', { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: 'Gagal mengambil daftar PIC', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
      message: 'Daftar PIC berhasil diambil'
    });

  } catch (error) {
    console.error('Error in GET /api/v1/konsultasi/pic:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
