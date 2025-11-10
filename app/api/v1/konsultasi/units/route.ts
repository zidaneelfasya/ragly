import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('unit_penanggungjawab')
      .select('*')
      .order('nama_unit', { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: 'Gagal mengambil daftar unit penanggung jawab', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
      message: 'Daftar unit penanggung jawab berhasil diambil'
    });

  } catch (error) {
    console.error('Error in GET /api/v1/konsultasi/units:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  
  try {
    const body = await request.json();
    const { konsultasi_id, unit_ids } = body;

    // Validate input
    if (!konsultasi_id || !Array.isArray(unit_ids)) {
      return NextResponse.json(
        { error: 'konsultasi_id dan unit_ids (array) diperlukan' },
        { status: 400 }
      );
    }

    // First, delete existing relationships for this konsultasi
    const { error: deleteError } = await supabase
      .from('konsultasi_unit')
      .delete()
      .eq('konsultasi_id', konsultasi_id);

    if (deleteError) {
      return NextResponse.json(
        { error: 'Gagal menghapus relasi unit lama', details: deleteError.message },
        { status: 500 }
      );
    }

    // If no units selected, just return success
    if (unit_ids.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Unit penanggung jawab berhasil diperbarui (tidak ada unit yang dipilih)'
      });
    }

    // Insert new relationships
    const insertData = unit_ids.map(unit_id => ({
      konsultasi_id,
      unit_id
    }));

    const { error: insertError } = await supabase
      .from('konsultasi_unit')
      .insert(insertData);

    if (insertError) {
      return NextResponse.json(
        { error: 'Gagal menambahkan relasi unit baru', details: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Unit penanggung jawab berhasil diperbarui untuk konsultasi #${konsultasi_id}`
    });

  } catch (error) {
    console.error('Error in PUT /api/v1/konsultasi/units:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
