// Global type declarations to resolve import conflicts for local hosting
declare module "drizzle-orm" {
  export const eq: any;
  export const desc: any;
  export const sum: any;
  export const count: any;
  export const and: any;
  export const or: any;
  export const gte: any;
  export const lte: any;
  export const like: any;
  export const inArray: any;
}

declare module "../../shared/schema" {
  export const users: any;
  export const userBalances: any;
  export const transactions: any;
  export const stakingRates: any;
  export const marketPrices: any;
  export const currencies: any;
  export const adminCredits: any;
}

declare module "../db" {
  export const db: any;
}

// MongoDB compatibility types
declare global {
  namespace Express {
    interface Request {
      session: {
        userId?: string;
        [key: string]: any;
      };
    }
  }
}