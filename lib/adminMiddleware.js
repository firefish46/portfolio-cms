//lib/adminMiddleware
import { verifyToken } from "./auth";

export function requireAdmin(request) {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;

  const decoded = verifyToken(token);
  return decoded;
}
