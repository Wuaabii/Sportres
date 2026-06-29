import dotenv from 'dotenv';
import pg from 'pg';
import { createDatabasePoolConfig } from '../database-config.js';

dotenv.config();

const { Pool } = pg;
const DRY_RUN = process.argv.includes('--dry-run');
const GEOCODE_DELAY_MS = 1100;

if (!process.env.DATABASE_URL) {
  console.error('[Court Coordinate Backfill] DATABASE_URL is not configured.');
  process.exit(1);
}

const pool = new Pool(createDatabasePoolConfig());

const normalizeVietnameseAddress = (value?: string | null) => {
  const normalized = String(value || '')
    .normalize('NFC')
    .replace(/\s+/g, ' ')
    .replace(/\s*,\s*/g, ', ')
    .replace(/,+/g, ',')
    .trim()
    .replace(/^,\s*|,\s*$/g, '');
  if (!normalized) return '';
  const lower = normalized.toLocaleLowerCase('vi-VN');
  return lower.includes('việt nam') || lower.includes('vietnam')
    ? normalized
    : `${normalized}, Việt Nam`;
};

const parseCoordinate = (value: unknown, min: number, max: number) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric >= min && numeric <= max ? numeric : undefined;
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function geocodeAddress(address: string) {
  const normalizedAddress = normalizeVietnameseAddress(address);
  if (!normalizedAddress) return null;

  const params = new URLSearchParams({
    q: normalizedAddress,
    format: 'jsonv2',
    limit: '1',
    addressdetails: '1',
  });
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'vi,en',
      'User-Agent': 'SportRes/1.0 court-coordinate-backfill',
    },
  });
  if (!response.ok) throw new Error(`Nominatim returned ${response.status}`);
  const results = await response.json() as Array<{ lat?: string; lon?: string }>;
  const latitude = parseCoordinate(results[0]?.lat, -90, 90);
  const longitude = parseCoordinate(results[0]?.lon, -180, 180);
  return latitude != null && longitude != null ? { latitude, longitude, normalizedAddress } : null;
}

async function main() {
  const client = await pool.connect();
  try {
    await client.query('ALTER TABLE courts ADD COLUMN IF NOT EXISTS address TEXT');
    await client.query('ALTER TABLE courts ADD COLUMN IF NOT EXISTS latitude double precision');
    await client.query('ALTER TABLE courts ADD COLUMN IF NOT EXISTS longitude double precision');

    const rows = (await client.query(
      `SELECT c.id, c.name, c.address AS court_address,
              v.address AS venue_address, v.district AS venue_district, v.city AS venue_city
       FROM courts c
       JOIN venues v ON v.id = c.venue_id
       WHERE c.latitude IS NULL OR c.longitude IS NULL
       ORDER BY v.name, c.name`,
    )).rows;

    console.log(`[Court Coordinate Backfill] Found ${rows.length} courts missing coordinates.`);
    let updated = 0;
    let skipped = 0;

    for (const row of rows) {
      const address = row.court_address || [row.venue_address, row.venue_district, row.venue_city].filter(Boolean).join(', ');
      if (!address) {
        skipped += 1;
        console.warn(`[Court Coordinate Backfill] Skipped ${row.id} (${row.name}): missing address.`);
        continue;
      }

      try {
        const result = await geocodeAddress(address);
        if (!result) {
          skipped += 1;
          console.warn(`[Court Coordinate Backfill] Could not geocode ${row.id} (${row.name}): ${address}`);
        } else {
          updated += 1;
          console.log(`[Court Coordinate Backfill] ${DRY_RUN ? 'Would update' : 'Updated'} ${row.name}: ${result.latitude}, ${result.longitude}`);
          if (!DRY_RUN) {
            await client.query(
              `UPDATE courts
               SET address = COALESCE(address, $2), latitude = $3, longitude = $4
               WHERE id = $1`,
              [row.id, address, result.latitude, result.longitude],
            );
          }
        }
      } catch (error: any) {
        skipped += 1;
        console.warn(`[Court Coordinate Backfill] Failed ${row.id} (${row.name}): ${error?.message || error}`);
      }

      await sleep(GEOCODE_DELAY_MS);
    }

    console.log(`[Court Coordinate Backfill] Done. ${DRY_RUN ? 'Would update' : 'Updated'}: ${updated}. Skipped: ${skipped}.`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(async error => {
  console.error('[Court Coordinate Backfill] Fatal error:', error);
  await pool.end().catch(() => undefined);
  process.exit(1);
});
