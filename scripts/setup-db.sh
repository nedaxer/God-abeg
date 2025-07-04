#!/bin/bash

# Push database schema
npx drizzle-kit push

# Initialize database with default values
npx tsx scripts/init-db.ts

echo "Database setup completed!"