export interface JwtPayload {
  sub: number;
  sessionId: string;
  iat: number;
  exp: number;
}
