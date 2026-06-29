import type { PoolConfig } from 'pg';
import type { ConnectionOptions } from 'node:tls';
import { readFileSync } from 'node:fs';

const CERT_VERIFYING_SSL_MODES = new Set(['verify-ca', 'verify-full']);
const TLS_REQUIRING_SSL_MODES = new Set(['allow', 'prefer', 'require', 'no-verify']);

const getDatabaseUrl = (connectionString?: string) => connectionString || process.env.DATABASE_URL;

const parseDatabaseUrl = (connectionString?: string) => {
  const databaseUrl = getDatabaseUrl(connectionString);
  if (!databaseUrl) return null;

  try {
    return new URL(databaseUrl);
  } catch {
    return null;
  }
};

const getSslMode = (databaseUrl: URL | null) =>
  (databaseUrl?.searchParams.get('sslmode') || process.env.PGSSLMODE || '').toLowerCase();

const readSslFile = (path: string | null | undefined, label: string) => {
  if (!path) return undefined;

  try {
    return readFileSync(path, 'utf8');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[SportRes DB] Could not read ${label} file at ${path}: ${message}`);
    return undefined;
  }
};

const removeSslSearchParams = (connectionString?: string) => {
  const databaseUrl = parseDatabaseUrl(connectionString);
  if (!databaseUrl) return getDatabaseUrl(connectionString);

  databaseUrl.searchParams.delete('sslmode');
  databaseUrl.searchParams.delete('sslcert');
  databaseUrl.searchParams.delete('sslkey');
  databaseUrl.searchParams.delete('sslrootcert');
  return databaseUrl.toString();
};

const createDatabaseSslConfig = (connectionString?: string): PoolConfig['ssl'] => {
  const databaseUrl = parseDatabaseUrl(connectionString);
  const sslmode = getSslMode(databaseUrl);
  const servername = databaseUrl?.hostname;
  const ca = readSslFile(databaseUrl?.searchParams.get('sslrootcert') || process.env.PGSSLROOTCERT, 'sslrootcert');
  const cert = readSslFile(databaseUrl?.searchParams.get('sslcert') || process.env.PGSSLCERT, 'sslcert');
  const key = readSslFile(databaseUrl?.searchParams.get('sslkey') || process.env.PGSSLKEY, 'sslkey');
  const certificateOptions = {
    ...(ca ? { ca } : {}),
    ...(cert ? { cert } : {}),
    ...(key ? { key } : {}),
  };

  if (CERT_VERIFYING_SSL_MODES.has(sslmode) || ca) {
    return {
      rejectUnauthorized: true,
      ...(servername ? { servername } : {}),
      ...certificateOptions,
    } satisfies ConnectionOptions;
  }

  if (sslmode === 'disable') {
    console.warn('[SportRes DB] Ignoring sslmode=disable because SSL is required for the configured database connection.');
  } else if (sslmode && !TLS_REQUIRING_SSL_MODES.has(sslmode)) {
    console.warn(`[SportRes DB] Unrecognized sslmode=${sslmode}; using encrypted PostgreSQL connection.`);
  }

  return {
    rejectUnauthorized: false,
    ...(servername ? { servername } : {}),
    ...certificateOptions,
  } satisfies ConnectionOptions;
};

export const createDatabasePoolConfig = (connectionString?: string): PoolConfig => ({
  connectionString: removeSslSearchParams(connectionString),
  ssl: createDatabaseSslConfig(connectionString),
});
