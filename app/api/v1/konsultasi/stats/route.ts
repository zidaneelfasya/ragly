import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
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

    // Get statistics by PIC
    const { data: picData } = await supabase
      .from('konsultasi_spbe')
      .select(`
        pic_id,
        pic_list:pic_id(nama_pic)
      `);
      
    const picStats = picData?.reduce((acc: Record<string, { count: number, pic_name: string }>, item: any) => {
      const picName = item.pic_list?.nama_pic || 'Belum Ditentukan';
      const picId = item.pic_id?.toString() || 'null';
      
      if (!acc[picId]) {
        acc[picId] = { count: 0, pic_name: picName };
      }
      acc[picId].count += 1;
      return acc;
    }, {}) || {};

    // Get total count
    const { count: totalCount } = await supabase
      .from('konsultasi_spbe')
      .select('*', { count: 'exact', head: true });

    // Get monthly stats (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const { data: monthlyData } = await supabase
      .from('konsultasi_spbe')
      .select('created_at')
      .gte('created_at', sixMonthsAgo.toISOString());
      
    const monthlyStats = monthlyData?.reduce((acc: Record<string, number>, item: any) => {
      const month = new Date(item.created_at).toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {}) || {};

    // Get recent consultations
    const { data: recentData } = await supabase
      .from('konsultasi_spbe')
      .select(`
        id,
        nama_lengkap,
        instansi_organisasi,
        status,
        kategori,
        created_at,
        pic_list:pic_id(nama_pic)
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    return NextResponse.json({
      success: true,
      data: {
        total: totalCount || 0,
        byStatus: statusStats,
        byKategori: kategoriStats,
        byPIC: picStats,
        monthly: monthlyStats,
        recent: recentData || []
      },
      message: 'Statistik konsultasi berhasil diambil'
    });

  } catch (error) {
    console.error('Error in GET /api/v1/konsultasi/stats:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil statistik', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
