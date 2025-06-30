// This is the simplest way to protect routes.
// It will automatically redirect unauthenticated users to the page
// you defined in the `pages: { signIn: ... }` option in your authOptions.
export { default } from 'next-auth/middleware';

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