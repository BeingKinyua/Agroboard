import { NextRequest, NextResponse } from 'next/server';
import { SYSTEM_ROLES, BosRoleKey } from '../../../../lib/rbac/permissions';
import { createAdminClient } from '../../../../lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, workEmail, roleId, branch = 'Nairobi Central Hub' } = body;

    // 1. Basic Payload Validation
    if (!fullName || !workEmail || !roleId) {
      return NextResponse.json(
        { error: 'Full name, work email, and role are required.' },
        { status: 400 }
      );
    }

    const trimmedEmail = workEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // 2. Authoritative Role Verification (Reject arbitrary role strings)
    const authoritativeRole = SYSTEM_ROLES[roleId as BosRoleKey];
    if (!authoritativeRole) {
      return NextResponse.json(
        { error: `Invalid role specified. Must be one of: ${Object.keys(SYSTEM_ROLES).join(', ')}` },
        { status: 400 }
      );
    }

    // 3. Perform Admin Invitation via Supabase Admin (if configured)
    const adminClient = createAdminClient();
    let authUserId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    let invitationSentViaSupabase = false;

    if (adminClient) {
      const { data, error } = await adminClient.auth.admin.inviteUserByEmail(trimmedEmail, {
        data: {
          full_name: fullName.trim(),
          role: roleId,
          role_title: authoritativeRole.name,
          branch,
        },
      });

      if (error) {
        // If user already exists
        if (error.message?.includes('already been registered')) {
          return NextResponse.json(
            { error: 'A member with this work email already exists in the system.' },
            { status: 409 }
          );
        }
        return NextResponse.json(
          { error: `Supabase Auth Admin failed: ${error.message}` },
          { status: 500 }
        );
      }

      if (data?.user?.id) {
        authUserId = data.user.id;
        invitationSentViaSupabase = true;
      }
    }

    // 4. Return canonical invitation payload
    const newUser = {
      id: authUserId,
      name: fullName.trim(),
      email: trimmedEmail,
      role: roleId,
      roleTitle: authoritativeRole.name,
      department: authoritativeRole.department,
      branch,
      status: 'Invited' as const,
      invitedAt: new Date().toISOString(),
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      permissions: authoritativeRole.permissions,
    };

    return NextResponse.json({
      success: true,
      message: `Invitation successfully dispatched to ${trimmedEmail}.`,
      user: newUser,
      invitationSentViaSupabase,
    });
  } catch (err: any) {
    console.error('Error in /api/admin/invite:', err);
    return NextResponse.json(
      { error: err?.message || 'Internal server error while creating invitation.' },
      { status: 500 }
    );
  }
}
