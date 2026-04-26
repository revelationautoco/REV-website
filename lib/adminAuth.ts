const COOKIE_NAME = "rev_admin";

export function adminCookieName() {
  return COOKIE_NAME;
}

export function expectedAdminToken() {
  const token = process.env.ADMIN_TOKEN;
  if (!token) throw new Error("Missing ADMIN_TOKEN.");
  return token;
}

