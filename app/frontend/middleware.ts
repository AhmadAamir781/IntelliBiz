import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define protected routes based on roles
const protectedRoutes = {
  "/admin": ["Admin"],
  "/business": ["Shopkeeper", "Admin"],
  "/dashboard": ["User", "Shopkeeper", "Admin"],
}

export function middleware(request: NextRequest) {
  // const token = request.cookies.get("token")?.value || localStorage.getItem("token")
  const pathname = request.nextUrl.pathname

  // Check if the route is protected
  const isProtected = Object.keys(protectedRoutes).some((route) => pathname.startsWith(route))

  if (isProtected) {
    // Temporarily bypass authentication and authorization
    return NextResponse.next()

    // If you want to keep some checks, like for the token, you can use this:
    // if (!token) {
    //   const url = new URL(`/login-portal`, request.url)
    //   url.searchParams.set("callbackUrl", pathname)
    //   return NextResponse.redirect(url)
    // }
    
    // The rest of the logic is commented out, so it's no longer enforcing role-based access
    // try {
    //   const user = verifyToken(token)
    //   const requiredRoles = protectedRoutes[pathname]
    //   if (requiredRoles && !requiredRoles.includes(user.role)) {
    //     return new NextResponse("Unauthorized", { status: 403 })
    //   }
    //   return NextResponse.next()
    // } catch (error) {
    //   const url = new URL(`/login-portal`, request.url)
    //   url.searchParams.set("callbackUrl", pathname)
    //   return NextResponse.redirect(url)
    // }
  }

  // If the route is not protected, continue
  return NextResponse.next()
}

// Configure the middleware to run on all routes
export const config = {
  matcher: ["/admin/:path*", "/business/:path*", "/dashboard/:path*"],
}

// Mock token verification function (replace with your actual verification logic)
function verifyToken(token: string) {
  const payload = JSON.parse(atob(token.split(".")[1]))
  return {
    id: payload.id,
    email: payload.email,
    role: payload.role,
  }
}
