import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/home", "/pokedex", "/fight"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.startsWith("/auth/login");
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/login", "/:path*"],
};
