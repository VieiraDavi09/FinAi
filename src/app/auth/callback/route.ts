import { NextRequest, NextResponse } from 'next/server';

// Supabase OAuth callback handler
// This route is called by Supabase after Google authentication.
// It exchanges the temporary 'code' for a full session.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    try {
      // Dynamic import to avoid build errors when Supabase is not configured
      const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');

      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          // Redirect to dashboard after successful authentication
          return NextResponse.redirect(`${origin}${next}`);
        }
        // Auth error — redirect to login with error param
        return NextResponse.redirect(
          `${origin}/login?error=auth_callback_failed`
        );
      }
    } catch {
      // Supabase not configured — fallback redirect
    }
  }

  // No code or not configured — redirect to login
  return NextResponse.redirect(`${origin}/login`);
}
