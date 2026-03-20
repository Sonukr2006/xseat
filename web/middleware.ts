import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/', '/splash', '/auth/login', '/auth/signup', '/auth/otp'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon') || pathname.startsWith('/public')) {
    return NextResponse.next();
  }

  const sessionCookie = req.cookies.get('connect.sid');
  const authCookie = req.cookies.get('xseat_auth');
  if (!sessionCookie && !authCookie) {
    const url = req.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
