// Database stub for compatibility
// This file provides compatibility stubs for PostgreSQL functions when using MongoDB

export const db = {
  select: () => ({
    from: () => ({
      where: () => [{}]
    })
  }),
  insert: () => ({
    into: () => ({
      values: () => ({
        returning: () => [{}]
      })
    })
  }),
  update: () => ({
    set: () => ({
      where: () => ({
        returning: () => [{}]
      })
    })
  }),
  delete: () => ({
    from: () => ({
      where: () => ({
        returning: () => [{}]
      })
    })
  })
};

// Export empty functions for Drizzle ORM compatibility
export const eq = () => {};
export const desc = () => {};
export const sum = () => {};
export const count = () => {};
export const and = () => {};
export const or = () => {};
export const gte = () => {};
export const lte = () => {};
export const like = () => {};
export const inArray = () => {};