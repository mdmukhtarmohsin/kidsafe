import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/middleware"; // Adjust path if needed

export async function middleware(request: NextRequest) {
  console.log(`[Middleware] Path: ${request.nextUrl.pathname}`); // Log path
  const { supabase, response } = createClient(request);

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  // Log session status
  if (sessionError) {
    console.error("[Middleware] Error fetching session:", sessionError.message);
  } else {
    console.log(`[Middleware] Session found: ${!!session}`);
  }

  // Define public routes that don't require authentication
  const publicRoutes = ["/login", "/signup", "/child-login"]; // Root '/' is now protected

  // Check if this is a child route - these use localStorage instead of Supabase auth
  const isChildRoute = ["/child-dashboard"].includes(request.nextUrl.pathname);

  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);
  const isAuthRoute = ["/login", "/signup", "/child-login"].includes(
    request.nextUrl.pathname
  );

  // Log decision logic points
  console.log(
    `[Middleware] isAuthRoute: ${isAuthRoute}, isPublicRoute: ${isPublicRoute}, isChildRoute: ${isChildRoute}`
  );

  // For child routes, we don't need to check the Supabase session
  // The components will check localStorage for child session info
  if (isChildRoute) {
    console.log(
      "[Middleware] Child route - allowing access to be checked by component"
    );
    return response;
  }

  // If user is not logged in and trying to access a protected route
  if (!session && !isPublicRoute) {
    console.log("[Middleware] Redirecting unauthenticated user to /login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is logged in and trying to access login/signup
  if (session && isAuthRoute) {
    console.log(
      "[Middleware] Redirecting authenticated user from auth route to /dashboard"
    );
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If user is not logged in and accessing the root path, redirect to login
  // This condition is now covered by the !session && !isPublicRoute check above
  // as '/' is no longer in publicRoutes.

  console.log("[Middleware] Allowing request to proceed."); // Log allowing the request
  return response; // Continue processing the request
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
