import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const user = request.cookies.get('user') ? JSON.parse(request.cookies.get('user')?.value || '{}') : null
  const isAuthPage = request.nextUrl.pathname.startsWith('/login')
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin')
  const selectedModule = request.cookies.get('selectedModule')?.value

  // If trying to access auth pages while logged in
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL(selectedModule || '/', request.url))
  }

  // If trying to access protected routes without auth
  if (!token && !isAuthPage) {
    const redirectUrl = new URL('/login', request.url)
    if (selectedModule) {
      redirectUrl.searchParams.set('callbackUrl', selectedModule)
    }
    return NextResponse.redirect(redirectUrl)
  }

  // Check admin access
  if (isAdminPage && !user?.isSuperAdmin) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}
// Add your protected routes here
export const config = {
  matcher: [
    '/fleet/:path*',
    '/admin/:path*',
    '/login',
    '/dashboard/:path*'
    // Add other protected routes
  ]
}