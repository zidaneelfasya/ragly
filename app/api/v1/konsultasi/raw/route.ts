import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  
  // Get search parameters
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'full'; // 'full', 'basic', 'export'
  const limit = searchParams.get('limit');
  const offset = searchParams.get('offset');
  const sortBy = searchParams.get('sortBy') || 'created_at';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  try {
    let selectFields = '*';
    
    // Berbagai format data berdasarkan kebutuhan
    switch (format) {
      case 'basic':
        selectFields = `
          id,
          nama_lengkap,
          instansi_organisasi,
          status,
          kategori,
          created_at,
          pic_list:pic_id(nama_pic)
        `;
        break;
        
      case 'export':
        selectFields = `
          id,
          timestamp,
          nama_lengkap,
          nomor_telepon,
          instansi_organisasi,
          asal_kota_kabupaten,
          asal_provinsi,
          uraian_kebutuhan_konsultasi,
          skor_indeks_spbe,
          kondisi_implementasi_spbe,
          fokus_tujuan,
          mekanisme_konsultasi,
          surat_permohonan,
          butuh_konsultasi_lanjut,
          status,
          solusi,
          kategori,
          ticket,
          created_at,
          updated_at,
          pic_list:pic_id(nama_pic)
        `;
        break;
        
      case 'full':
      default:
        selectFields = `
          *,
          pic_list:pic_id(
            id,
            nama_pic
          ),
          konsultasi_unit(
            konsultasi_id,
            unit_id,
            unit_penanggungjawab(
              id,
              nama_unit,
              pic_list:pic_id(
                id,
                nama_pic
              )
            )
          ),
          konsultasi_topik(
            konsultasi_id,
            topik_id,
            topik_konsultasi(
              id,
              nama_topik
            )
          )
        `;
        break;
    }

    let query = supabase
      .from('konsultasi_spbe')
      .select(selectFields);

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination jika ada
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    
    if (offset && limit) {
      query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Gagal mengambil data konsultasi', details: error.message },
        { status: 500 }
      );
    }

    // Get total count
    const { count: totalCount } = await supabase
      .from('konsultasi_spbe')
      .select('*', { count: 'exact', head: true });

    // Get summary statistics
    const { data: statusStats } = await supabase
      .from('konsultasi_spbe')
      .select('status');
      
    const statusSummary = statusStats?.reduce((acc: Record<string, number>, item: any) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {}) || {};

    const { data: kategoriStats } = await supabase
      .from('konsultasi_spbe')
      .select('kategori');
      
    const kategoriSummary = kategoriStats?.reduce((acc: Record<string, number>, item: any) => {
      acc[item.kategori] = (acc[item.kategori] || 0) + 1;
      return acc;
    }, {}) || {};

    return NextResponse.json({
      success: true,
      data: data,
      pagination: {
        total: totalCount || 0,
        limit: limit ? parseInt(limit) : data?.length || 0,
        offset: offset ? parseInt(offset) : 0,
        hasNext: totalCount ? (parseInt(offset || '0') + (parseInt(limit || String(totalCount)))) < totalCount : false,
        currentPage: Math.floor((parseInt(offset || '0')) / (parseInt(limit || '10'))) + 1,
        totalPages: Math.ceil((totalCount || 0) / (parseInt(limit || '10')))
      },
      summary: {
        total: totalCount || 0,
        byStatus: statusSummary,
        byKategori: kategoriSummary
      },
      meta: {
        format: format,
        sortBy: sortBy,
        sortOrder: sortOrder,
        timestamp: new Date().toISOString()
      },
      message: `Berhasil mengambil ${data?.length || 0} dari ${totalCount || 0} data konsultasi (format: ${format})`
    });

  } catch (error) {
    console.error('Error in GET /api/v1/konsultasi/raw:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
