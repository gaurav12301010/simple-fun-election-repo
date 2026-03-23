import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { name, dob } = body;
    if (!name || !dob) return NextResponse.json({ error: 'Name and DOB are required.' }, { status: 400 });

    const supabase = getSupabaseAdmin();
    const { data: user } = await supabase.from('users').select('status').eq('id', session.id).single();

    if (user?.status !== 'review') {
      return NextResponse.json({ error: 'You can only update details if your application is under review.' }, { status: 400 });
    }

    // Accept all editable fields
    const updatePayload: Record<string, any> = {
      name, dob,
      status: 'pending',
      admin_message: null,
    };

    const editableFields = [
      'gender', 'address', 'height', 'blood_group', 'eye_color',
      'favorite_subject', 'trust_reason', 'child_income',
      'partner_name', 'crush_count', 'mobile_usage', 'early_riser',
      'photo_url', 'signature_url'
    ];

    editableFields.forEach(field => {
      if (body[field] !== undefined) {
        updatePayload[field] = body[field] || null;
      }
    });

    const { error } = await supabase
      .from('users')
      .update(updatePayload)
      .eq('id', session.id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
