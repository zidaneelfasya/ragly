import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Helper function to check if user is admin (has unit_id = 1)
async function checkIsAdmin(supabase: any, userId: string): Promise<boolean> {
  try {
    const { data: userUnits, error } = await supabase
      .from('user_unit_penanggungjawab')
      .select('unit_id')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    // Check if user has superadmin unit (unit_id = 1)
    return userUnits?.some((unit: any) => unit.unit_id === 1) || false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

// GET endpoint untuk mengambil user tertentu
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if user is admin
    const isAdmin = await checkIsAdmin(supabase, user.id);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const { id } = params;

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (profileError) {
      console.error('Error fetching user:', profileError);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get unit assignment for this user (single unit)
    const { data: unitAssignment, error: unitsError } = await supabase
      .from('user_unit_penanggungjawab')
      .select('unit_id')
      .eq('user_id', id)
      .single();

    if (unitsError && unitsError.code !== 'PGRST116') {
      console.error('Error fetching unit assignment:', unitsError);
    }

    // Transform data to include unit_id (single unit)
    const transformedUser = {
      ...profile,
      unit_id: unitAssignment?.unit_id || null
    };

    return NextResponse.json({
      success: true,
      data: transformedUser
    });

  } catch (error) {
    console.error('Error in GET /api/v1/users/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT endpoint untuk mengupdate user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if user is admin
    const isAdmin = await checkIsAdmin(supabase, user.id);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { full_name, phone, email, nip, jabatan, satuan_kerja, instansi, unit_id } = body;

    // Update profile
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name,
        phone,
        email,
        nip,
        jabatan,
        satuan_kerja,
        instansi,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating user:', updateError);
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }

    // If email was changed, update it in auth.users too
    if (email) {
      const { error: authUpdateError } = await supabase.auth.admin.updateUserById(id, {
        email
      });

      if (authUpdateError) {
        console.error('Error updating auth email:', authUpdateError);
        // Continue anyway, profile was updated
      }
    }

    // Handle unit assignment
    if (unit_id !== undefined) {
      // First, delete existing assignment
      const { error: deleteError } = await supabase
        .from('user_unit_penanggungjawab')
        .delete()
        .eq('user_id', id);

      if (deleteError) {
        console.error('Error deleting existing unit assignment:', deleteError);
      }

      // Then, create new assignment if unit_id is provided
      if (unit_id) {
        const { error: insertError } = await supabase
          .from('user_unit_penanggungjawab')
          .insert({
            user_id: id,
            unit_id: unit_id
          });

        if (insertError) {
          console.error('Error creating new unit assignment:', insertError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: { ...updatedProfile, unit_id: unit_id || null },
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('Error in PUT /api/v1/users/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE endpoint untuk menghapus user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if user is admin
    const isAdmin = await checkIsAdmin(supabase, user.id);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const { id } = params;

    // Delete user from auth (this will cascade delete the profile due to foreign key)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(id);

    if (deleteError) {
      console.error('Error deleting user:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete user' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Error in DELETE /api/v1/users/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
