import { Document, Model } from 'mongoose';

declare module 'mongoose' {
  interface Model<IUser> {
    credentialsCheck(email: string, password: string): Promise<IUser | null>;
  }
}

export type Role = 'athlete' | 'coach'