// user.d.ts ??

import { Document, Model } from 'mongoose';

declare module 'mongoose' {
  interface Model<IAthlete> {
    credentialsCheck(email: string, password: string): Promise<IAthlete | null>;
  }
}

