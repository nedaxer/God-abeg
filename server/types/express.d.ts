import { Session } from 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    [key: string]: any;
  }
}

declare global {
  namespace Express {
    interface Request {
      session: Session & {
        userId?: string;
        [key: string]: any;
      };
    }
  }
}