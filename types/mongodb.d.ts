declare module 'mongodb' {
  // Extended MongoDB type declarations for better compatibility
  export interface MongoClient {
    connect(): Promise<MongoClient>;
    db(name?: string): Db;
    close(): Promise<void>;
  }
  
  export interface Db {
    collection(name: string): Collection;
  }
  
  export interface Collection {
    find(filter?: any): any;
    findOne(filter?: any): any;
    insertOne(doc: any): any;
    insertMany(docs: any[]): any;
    updateOne(filter: any, update: any): any;
    updateMany(filter: any, update: any): any;
    deleteOne(filter: any): any;
    deleteMany(filter: any): any;
    aggregate(pipeline: any[]): any;
  }
}