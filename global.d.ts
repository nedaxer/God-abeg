// Global type definitions for Vite server configuration compatibility

// Override Vite module types to fix server configuration compatibility
declare module 'vite' {
  // Extend ServerOptions to allow the current configuration
  interface ServerOptions {
    middlewareMode?: boolean;
    hmr?: {
      server?: any;
      host?: string;
      port?: number;
    };
    allowedHosts?: true | string[];
    host?: string;
    port?: number;
  }
}

// Additional TypeScript configuration for the project
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
  }
}

// Express session types
declare module 'express-session' {
  interface SessionData {
    userId?: string;
    [key: string]: any;
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    session: {
      userId?: string;
      [key: string]: any;
    };
  }
}

export {};