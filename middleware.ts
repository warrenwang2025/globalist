import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token
    const { pathname, searchParams } = req.nextUrl
    
    
    // Skip middleware entirely for these paths
    if (pathname.startsWith('/api/') || 
        pathname.startsWith('/signin') || 
        pathname.startsWith('/signup') ||
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/favicon.ico') ||
        pathname.startsWith('/apple-touch-icon.png') ||
        pathname.startsWith('/icon-') ||
        pathname.includes('.png') ||
        pathname.includes('.jpg') ||
        pathname.includes('.jpeg') ||
        pathname.includes('.gif') ||
        pathname.includes('.svg') ||
        pathname.includes('.ico') ||
        pathname === '/') {
      return NextResponse.next()
    }
    
    // Check if user is authenticated and needs onboarding
    if (token) {
      // Check if token has required user information
      if (!token.id || !token.email) {
        console.warn("Token missing user information, redirecting to /signin");
        return NextResponse.redirect(new URL("/signin", req.url));
      }

      // Use the onboarding status from the JWT token instead of database query
      const isOnboarded = token.isOnboarded;
      
      // Check onboarding status
      if (!isOnboarded && pathname !== '/onboarding') {
        return NextResponse.redirect(new URL('/onboarding', req.url))
      }
      
      // If user is onboarded but trying to access onboarding page, redirect to dashboard
      // UNLESS they have the force-navigation query parameter
      if (isOnboarded && pathname === '/onboarding') {
        const forceNavigation = searchParams.get('force-navigation');
        if (!forceNavigation) {
          return NextResponse.redirect(new URL('/dashboard', req.url))
        }
      }
    }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

// The matcher config tells the middleware WHICH routes to protect.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (for login, register, logout)
     * - api/public (if you have any public API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - / (the public home page)
     * - /signin (the login page)
     * - /signup (the register page)
     */
    '/((?!api/auth|api/public|_next/static|_next/image|favicon.ico|signin|signup|$).*)',
  ],
};