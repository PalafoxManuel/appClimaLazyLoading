// types/firebase-auth.d.ts
import 'firebase/auth'; // extiende el módulo

declare module 'firebase/auth' {
  import { Persistence } from '@firebase/auth';
  export function getReactNativePersistence(storage: any): Persistence;
}