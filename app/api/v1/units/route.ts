// app/api/v1/units/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: units, error } = await supabase
    .from('unit_penanggungjawab')
      .select('id, nama_unit, nama_pic')
      .order('nama_unit', { ascending: true });

    if (error) {
      console.error('Error fetching units:', error);
      return NextResponse.json(
        { error: 'Failed to fetch units' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: units || [],
      message: 'Units fetched successfully'
    });
  } catch (error) {
    console.error('Error in units API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
