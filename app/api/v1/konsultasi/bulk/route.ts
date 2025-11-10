import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  
  try {
    // Mengambil SEMUA data konsultasi tanpa pagination
    const { data: allKonsultasi, error: konsultasiError } = await supabase
      .from('konsultasi_spbe')
      .select(`
        *,
        pic_list:pic_id(
          id,
          nama_pic
        )
      `)
      .order('created_at', { ascending: false });

    if (konsultasiError) {
      return NextResponse.json(
        { error: 'Gagal mengambil data konsultasi', details: konsultasiError.message },
        { status: 500 }
      );
    }

    // Mengambil semua data PIC
    const { data: allPic, error: picError } = await supabase
      .from('pic_list')
      .select('*')
      .order('nama_pic', { ascending: true });

    if (picError) {
      return NextResponse.json(
        { error: 'Gagal mengambil data PIC', details: picError.message },
        { status: 500 }
      );
    }

    // Mengambil semua data unit penanggung jawab
    const { data: allUnits, error: unitsError } = await supabase
      .from('unit_penanggungjawab')
      .select(`
        *,
        pic_list:pic_id(
          id,
          nama_pic
        )
      `)
      .order('nama_unit', { ascending: true });

    if (unitsError) {
      return NextResponse.json(
        { error: 'Gagal mengambil data unit', details: unitsError.message },
        { status: 500 }
      );
    }

    // Mengambil semua data topik konsultasi
    const { data: allTopics, error: topicsError } = await supabase
      .from('topik_konsultasi')
      .select('*')
      .order('nama_topik', { ascending: true });

    if (topicsError) {
      return NextResponse.json(
        { error: 'Gagal mengambil data topik', details: topicsError.message },
        { status: 500 }
      );
    }

    // Mengambil relasi konsultasi-unit
    const { data: konsultasiUnits, error: kuError } = await supabase
      .from('konsultasi_unit')
      .select(`
        *,
        unit_penanggungjawab(
          id,
          nama_unit,
          pic_list:pic_id(nama_pic)
        )
      `);

    if (kuError) {
      return NextResponse.json(
        { error: 'Gagal mengambil relasi konsultasi-unit', details: kuError.message },
        { status: 500 }
      );
    }

    // Mengambil relasi konsultasi-topik
    const { data: konsultasiTopics, error: ktError } = await supabase
      .from('konsultasi_topik')
      .select(`
        *,
        topik_konsultasi(
          id,
          nama_topik
        )
      `);

    if (ktError) {
      return NextResponse.json(
        { error: 'Gagal mengambil relasi konsultasi-topik', details: ktError.message },
        { status: 500 }
      );
    }

    // Membuat mapping untuk relasi
    const unitMap = new Map();
    konsultasiUnits?.forEach((ku: any) => {
      if (!unitMap.has(ku.konsultasi_id)) {
        unitMap.set(ku.konsultasi_id, []);
      }
      unitMap.get(ku.konsultasi_id).push({
        unit_id: ku.unit_id,
        unit_name: ku.unit_penanggungjawab?.nama_unit,
        unit_pic: ku.unit_penanggungjawab?.pic_list?.nama_pic
      });
    });

    const topicMap = new Map();
    konsultasiTopics?.forEach((kt: any) => {
      if (!topicMap.has(kt.konsultasi_id)) {
        topicMap.set(kt.konsultasi_id, []);
      }
      topicMap.get(kt.konsultasi_id).push({
        topik_id: kt.topik_id,
        topik_name: kt.topik_konsultasi?.nama_topik
      });
    });

    // Menggabungkan semua data
    const completeData = allKonsultasi?.map(konsultasi => ({
      ...konsultasi,
      pic_name: konsultasi.pic_list?.nama_pic || null,
      units: unitMap.get(konsultasi.id) || [],
      topics: topicMap.get(konsultasi.id) || []
    }));

    // Statistik lengkap
    const stats = {
      total_konsultasi: allKonsultasi?.length || 0,
      total_pic: allPic?.length || 0,
      total_units: allUnits?.length || 0,
      total_topics: allTopics?.length || 0,
      by_status: allKonsultasi?.reduce((acc: Record<string, number>, item: any) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {}) || {},
      by_kategori: allKonsultasi?.reduce((acc: Record<string, number>, item: any) => {
        acc[item.kategori] = (acc[item.kategori] || 0) + 1;
        return acc;
      }, {}) || {},
      by_pic: allKonsultasi?.reduce((acc: Record<string, number>, item: any) => {
        const picName = item.pic_list?.nama_pic || 'Belum Ditentukan';
        acc[picName] = (acc[picName] || 0) + 1;
        return acc;
      }, {}) || {}
    };

    return NextResponse.json({
      success: true,
      data: {
        konsultasi: completeData,
        pic_list: allPic,
        units: allUnits,
        topics: allTopics
      },
      statistics: stats,
      meta: {
        total_records: {
          konsultasi: allKonsultasi?.length || 0,
          pic: allPic?.length || 0,
          units: allUnits?.length || 0,
          topics: allTopics?.length || 0
        },
        last_updated: new Date().toISOString(),
        format: 'complete_dataset'
      },
      message: 'Berhasil mengambil semua data konsultasi SPBE beserta semua data pendukung'
    });

  } catch (error) {
    console.error('Error in GET /api/v1/konsultasi/bulk:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
