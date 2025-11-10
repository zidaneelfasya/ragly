import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// API endpoint untuk mendapatkan unit user yang sedang login
export async function GET() {
  const supabase = await createClient();
  
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'User tidak ditemukan atau belum login', details: userError?.message },
        { status: 401 }
      );
    }

    // Get user's assigned units
    const { data: userUnits, error: unitsError } = await supabase
      .from('user_unit_penanggungjawab')
      .select(`
        unit_id,
        unit_penanggungjawab(
          id,
          nama_unit,
          nama_pic
        )
      `)
      .eq('user_id', user.id);

    if (unitsError) {
      return NextResponse.json(
        { error: 'Gagal mengambil data unit user', details: unitsError.message },
        { status: 500 }
      );
    }

    // Transform data untuk memudahkan penggunaan
const transformedUnits = userUnits?.map(item => {
      // Handle case where unit_penanggungjawab might be an array or single object
      const unit = Array.isArray(item.unit_penanggungjawab) 
        ? item.unit_penanggungjawab[0] 
        : item.unit_penanggungjawab;
      
      return {
        unit_id: item.unit_id,
        unit_name: unit?.nama_unit || null,
        unit_pic_name: unit?.nama_pic || null
      };
    }) || [];

    return NextResponse.json({
      success: true,
      data: {
        user_id: user.id,
        email: user.email,
        units: transformedUnits
      },
      message: 'Data unit user berhasil diambil'
    });

  } catch (error) {
    console.error('Error in GET /api/v1/users/units:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
