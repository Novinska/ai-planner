// types/user.ts
export interface GoogleUser {
  id: string;
  displayName: string;
  emails: { value: string; verified: boolean }[];
  photos: { value: string }[];
  accessToken: string;
  refreshToken?: string;
}
