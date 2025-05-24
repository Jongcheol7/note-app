import { Google } from "@lucia-auth/oauth/providers";

//Lucia용 Google OAuth provider 생성성
export const google = new Google(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/api/auth/callback/google" //리다이렉션 URL
);
