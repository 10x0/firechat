import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const loggedIn = req.cookies.has('__session');
  console.log(loggedIn);

  const authRoutes = ['/login', '/register'];

  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isAuthRoute && loggedIn) {
    return NextResponse.redirect(new URL('/', nextUrl));
  }
  if (!isAuthRoute && !loggedIn) {
    return NextResponse.redirect(new URL('/login', nextUrl));
  }

  return null;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
