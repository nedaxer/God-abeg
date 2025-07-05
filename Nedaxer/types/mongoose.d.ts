// Mongoose TypeScript overrides to resolve query method conflicts
declare module 'mongoose' {
  interface Query<ResultType, DocType, THelpers = {}, RawDocType = DocType> {
    // Override findOne to provide consistent signature
    findOne(filter?: any, projection?: any, options?: any): Query<ResultType, DocType, THelpers, RawDocType>;
    
    // Override find to provide consistent signature
    find(filter?: any, projection?: any, options?: any): Query<ResultType[], DocType, THelpers, RawDocType>;
    
    // Override findOneAndUpdate to provide consistent signature
    findOneAndUpdate(filter?: any, update?: any, options?: any): Query<ResultType, DocType, THelpers, RawDocType>;
    
    // Override findByIdAndUpdate to provide consistent signature
    findByIdAndUpdate(id?: any, update?: any, options?: any): Query<ResultType, DocType, THelpers, RawDocType>;
    
    // Override findById to provide consistent signature
    findById(id?: any, projection?: any, options?: any): Query<ResultType, DocType, THelpers, RawDocType>;
  }

  interface Model<T> {
    // Override static methods to provide consistent signatures
    findOne(filter?: any, projection?: any, options?: any): Query<T | null, T>;
    find(filter?: any, projection?: any, options?: any): Query<T[], T>;
    findById(id?: any, projection?: any, options?: any): Query<T | null, T>;
    findOneAndUpdate(filter?: any, update?: any, options?: any): Query<T | null, T>;
    findByIdAndUpdate(id?: any, update?: any, options?: any): Query<T | null, T>;
  }
}

export {};