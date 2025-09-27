export const BASE_URL = process.env.NEXT_PUBLIC_APP_URL;
export const API_URL = `${BASE_URL}/api`;

export const isPublicRoutes = ["/auth(.*)", "/"];

export const isProtectedRoutes = ["/dashboard(.*)"];

export const isBypassRoutes = [
  "/api/polar/webhook",
  "/api/inngest(.*)",
  "/api/auth(.*)",
  "/convex(.*)",
];
