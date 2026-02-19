export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/browse/:path*",
    "/listings/:path*",
    "/bookings/:path*",
    "/resources/:path*",
    "/guidance/:path*",
    "/chat/:path*",
    "/community/:path*",
    "/profile/:path*",
  ],
};
