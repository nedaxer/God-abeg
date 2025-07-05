// Global type augmentations for better TypeScript compatibility

declare global {
  // Express middleware types
  namespace Express {
    interface Request {
      session: {
        userId?: string;
        isAdmin?: boolean;
        adminAuthenticated?: boolean;
        adminId?: string;
        [key: string]: any;
      };
      user?: any;
    }
  }
}

// Module augmentations
declare module "express-session" {
  interface SessionData {
    userId?: string;
    isAdmin?: boolean;
    adminAuthenticated?: boolean;
    adminId?: string;
  }
}

// Mongoose/MongoDB flexible types
declare module "mongoose" {
  interface Query<ResultType, DocType, THelpers = {}, RawDocType = DocType> {
    lean(): Query<any, DocType, THelpers, RawDocType>;
    exec(): Promise<any>;
  }
  
  interface Model<T> {
    find(filter?: any, projection?: any, options?: any): Query<any[], T>;
    findOne(filter?: any, projection?: any, options?: any): Query<T | null, T>;
    findById(id: any, projection?: any, options?: any): Query<T | null, T>;
    findByIdAndUpdate(id: any, update: any, options?: any): Query<T | null, T>;
    updateOne(filter: any, update: any, options?: any): Query<any, T>;
    updateMany(filter: any, update: any, options?: any): Query<any, T>;
    deleteOne(filter: any, options?: any): Query<any, T>;
    deleteMany(filter: any, options?: any): Query<any, T>;
    create(doc: any): Promise<T>;
    aggregate(pipeline: any[]): any;
  }
}

// Additional type utilities
export type RequestHandler = (req: any, res: any, next?: any) => any;
export type MiddlewareFunction = (req: any, res: any, next: any) => any;

export {};