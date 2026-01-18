#!/bin/sh
set -e

echo "⏳ Waiting for PostgreSQL to be ready..."
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER"; do
  echo "Waiting for database connection..."
  sleep 2
done

echo "✅ PostgreSQL is ready!"
echo "🔄 Running database migrations..."
./migrate

echo "🚀 Starting API server..."
exec ./api
