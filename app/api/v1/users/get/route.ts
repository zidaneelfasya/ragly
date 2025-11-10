import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  const user = data.user;
  if (error || !data.user) {
    return new Response(JSON.stringify({ error: 'User not authenticated' }), { status: 401 });
  }
   return NextResponse.json({
        success: true,
        data: {
          user_id: user?.id ,
          email: user?.email,
          user_metadata: user?.user_metadata || {},
        },
        message: 'Data unit user berhasil diambil'
      });
}