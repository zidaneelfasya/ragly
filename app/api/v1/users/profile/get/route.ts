import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET endpoint untuk mengambil data user dan profile
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check user authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id'); // Optional: get specific user by ID (admin only)

    // Determine which user's profile to fetch
    const targetUserId = userId || user.id;

    // If requesting another user's profile, check if current user is admin
    if (userId && userId !== user.id) {
      // Check if current user is admin (you can modify this logic based on your admin system)
      const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // You might want to add admin role checking here
      // For now, we'll allow it but you should implement proper authorization
    }

    // Fetch user profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', targetUserId)
      .single();

    if (profileError) {
      // If profile doesn't exist, return user data without profile
      if (profileError.code === 'PGRST116') {
        return NextResponse.json({
          success: true,
          data: {
            user: {
              id: user.id,
              email: user.email,
              created_at: user.created_at,
              updated_at: user.updated_at,
              last_sign_in_at: user.last_sign_in_at,
            },
            profile: null
          },
          message: 'User data retrieved successfully (no profile found)'
        });
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch profile', details: profileError.message },
        { status: 500 }
      );
    }

    // Tambahkan pengecekan unit_id = 1 (superadmin)
    let role = profile.role;
    // Cek unit assignment
    const { data: userUnits, error: unitsError } = await supabase
      .from('user_unit_penanggungjawab')
      .select('unit_id')
      .eq('user_id', targetUserId);
    interface UserUnit {
      unit_id: number;
    }
    if (!unitsError && userUnits && userUnits.some((u: UserUnit) => u.unit_id === 1)) {
      role = 'superadmin';
    }

    // Return combined user and profile data, override role jika superadmin
    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          updated_at: user.updated_at,
          last_sign_in_at: user.last_sign_in_at,
        },
        profile: {
          ...profile,
          role: role || null
        }
      },
      message: 'User and profile data retrieved successfully'
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch user profile', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// PUT endpoint untuk update profile
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check user authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();
    const { full_name, phone, nip, jabatan, satuan_kerja, instansi } = body;

    // Update or insert profile
    const profileData = {
      id: user.id,
      full_name: full_name?.trim() || null,
      phone: phone?.trim() || null,
      email: user.email,
      nip: nip?.trim() || null,
      jabatan: jabatan?.trim() || null,
      satuan_kerja: satuan_kerja?.trim() || null,
      instansi: instansi?.trim() || null,
      updated_at: new Date().toISOString()
    };

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .upsert(profileData, {
        onConflict: 'id',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: 'Failed to update profile', details: profileError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
        profile
      },
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update profile', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// POST endpoint untuk create profile (alias untuk PUT)
export async function POST(request: NextRequest) {
  return PUT(request);
}