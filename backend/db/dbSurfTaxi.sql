-- Run in Terminal --> psql -U marcschaer -d surf_taxi -a -f db/dbSurfTaxi.sql

\echo 'SURF-TAXI: Delete and recreate tables for surf_taxi db?'
\prompt 'Return for yes or control-C to cancel > ' foo

-- Delete and recreate tables for surf_taxi db
DROP TABLE IF EXISTS trip_members CASCADE;
DROP TABLE IF EXISTS trips CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Recreate tables
\i db/dbSchema.sql

-- Seed the tables
\i db/dbSeed.sql

