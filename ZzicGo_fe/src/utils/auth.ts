import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string;       // userId가 들어오는 위치
  providerId: string;
  role: string;
  exp: number;
  iat: number;
}

export function getMyUserId(): number | null {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return Number(decoded.sub);  // 여기서 userId
  } catch (e) {
    console.error("JWT decode error:", e);
    return null;
  }
}
