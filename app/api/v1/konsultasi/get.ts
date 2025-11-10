import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  
  // Get search parameters
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const status = searchParams.get('status');
  const kategori = searchParams.get('kategori');
  const pic_id = searchParams.get('pic_id');
  const instansi = searchParams.get('instansi');
  const limit = searchParams.get('limit');
  const offset = searchParams.get('offset');
  const sortBy = searchParams.get('sortBy') || 'created_at';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  try {
    // Base query with joins to get related data
    let query = supabase
      .from('konsultasi_spbe')
      .select(`
        *,
        pic_list:pic_id(
          id,
          nama_pic
        ),
        konsultasi_unit(
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
          topik_konsultasi(
            id,
            nama_topik
          )
        )
      `);

    // Apply filters
    if (id) {
      const { data, error } = await query.eq('id', parseInt(id)).single();
      
      if (error) {
        return NextResponse.json(
          { error: 'Data tidak ditemukan', details: error.message },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: data,
        message: 'Data konsultasi berhasil diambil'
      });
    }

    // Apply other filters for list queries
    if (status) {
      query = query.eq('status', status);
    }
    
    if (kategori) {
      query = query.eq('kategori', kategori);
    }
    
    if (pic_id) {
      query = query.eq('pic_id', parseInt(pic_id));
    }
    
    if (instansi) {
      query = query.ilike('instansi_organisasi', `%${instansi}%`);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
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

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('konsultasi_spbe')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      success: true,
      data: data,
      pagination: {
        total: totalCount || 0,
        limit: limit ? parseInt(limit) : data?.length || 0,
        offset: offset ? parseInt(offset) : 0,
        hasNext: totalCount ? (parseInt(offset || '0') + (parseInt(limit || '10'))) < totalCount : false
      },
      message: 'Data konsultasi berhasil diambil'
    });

  } catch (error) {
    console.error('Error in GET /api/v1/konsultasi:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET endpoint untuk statistics
export async function getStats() {
  const supabase = await createClient();
  
  try {
    // Get statistics by status
    const { data: statusData } = await supabase
      .from('konsultasi_spbe')
      .select('status');
      
    const statusStats = statusData?.reduce((acc: Record<string, number>, item: any) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {}) || {};

    // Get statistics by kategori
    const { data: kategoriData } = await supabase
      .from('konsultasi_spbe')
      .select('kategori');
      
    const kategoriStats = kategoriData?.reduce((acc: Record<string, number>, item: any) => {
      acc[item.kategori] = (acc[item.kategori] || 0) + 1;
      return acc;
    }, {}) || {};

    // Get total count
    const { count: totalCount } = await supabase
      .from('konsultasi_spbe')
      .select('*', { count: 'exact', head: true });

    // Get monthly stats (last 6 months)
    const { data: monthlyData } = await supabase
      .from('konsultasi_spbe')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString());
      
    const monthlyStats = monthlyData?.reduce((acc: Record<string, number>, item: any) => {
      const month = new Date(item.created_at).toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {}) || {};

    return NextResponse.json({
      success: true,
      data: {
        total: totalCount || 0,
        byStatus: statusStats || {},
        byKategori: kategoriStats || {},
        monthly: monthlyStats || {}
      },
      message: 'Statistik konsultasi berhasil diambil'
    });

  } catch (error) {
    console.error('Error in getStats:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil statistik', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}