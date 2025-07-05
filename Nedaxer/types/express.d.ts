declare global {
  namespace Express {
    interface Request {
      session: {
        userId?: string;
        adminAuthenticated?: boolean;
        adminId?: string;
        [key: string]: any;
      };
    }
    
    interface SessionData {
      userId?: string;
      adminAuthenticated?: boolean;
      adminId?: string;
    }

    // Override RequestHandler to be more permissive
    interface RequestHandler<
      P = any,
      ResBody = any,
      ReqBody = any,
      ReqQuery = any,
      LocalsObj extends Record<string, any> = Record<string, any>
    > {
      (
        req: Request<P, ResBody, ReqBody, ReqQuery, LocalsObj>,
        res: Response<ResBody, LocalsObj>,
        next?: NextFunction,
      ): void | Promise<void> | any;
    }

    // Override Router to accept more flexible handler types
    interface Router {
      get(path: string, ...handlers: Array<RequestHandler | any>): this;
      post(path: string, ...handlers: Array<RequestHandler | any>): this;
      put(path: string, ...handlers: Array<RequestHandler | any>): this;
      delete(path: string, ...handlers: Array<RequestHandler | any>): this;
      patch(path: string, ...handlers: Array<RequestHandler | any>): this;
    }

    interface Application extends Router {
      use(...handlers: Array<RequestHandler | any>): this;
      use(path: string, ...handlers: Array<RequestHandler | any>): this;
    }
  }
}

export {};