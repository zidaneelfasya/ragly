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

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  
  try {
    const body = await request.json();
    
    // Add timestamps for new data
    const currentTimestamp = new Date().toISOString();
    const dataWithTimestamps = {
      ...body,
      timestamp: currentTimestamp,
      created_at: currentTimestamp,
      updated_at: currentTimestamp
    };
    
    const { data, error } = await supabase
      .from('konsultasi_spbe')
      .insert([dataWithTimestamps])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Gagal menyimpan data konsultasi', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
      message: 'Data konsultasi berhasil disimpan'
    }, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/v1/konsultasi:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID konsultasi diperlukan untuk update' },
        { status: 400 }
      );
    }

    // Add updated timestamp to all updates
    const dataWithTimestamp = {
      ...updateData,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('konsultasi_spbe')
      .update(dataWithTimestamp)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Gagal mengupdate data konsultasi', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
      message: 'Data konsultasi berhasil diupdate'
    });

  } catch (error) {
    console.error('Error in PUT /api/v1/konsultasi:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID konsultasi diperlukan untuk delete' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('konsultasi_spbe')
      .delete()
      .eq('id', parseInt(id));

    if (error) {
      return NextResponse.json(
        { error: 'Gagal menghapus data konsultasi', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Data konsultasi berhasil dihapus'
    });

  } catch (error) {
    console.error('Error in DELETE /api/v1/konsultasi:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
