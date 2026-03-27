#!/usr/bin/env bash
set -e

if [ -n "${POSTGRES_TEST_DB:-}" ]; then
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE "$POSTGRES_TEST_DB";
EOSQL
fi
