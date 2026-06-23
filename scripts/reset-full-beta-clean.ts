import 'dotenv/config';
import process from 'node:process';
import readline from 'node:readline/promises';
import bcrypt from 'bcryptjs';
import pg from 'pg';

const { Pool } = pg;
const DRY_RUN = process.argv.includes('--dry-run');
const CONFIRMATION = 'RESET_FULL_BETA';
const ADMIN_PHONE = '0914181298';
const ADMIN_PASSWORD = '0103042763';
const ADMIN_USERNAME = 'admin';
const ADMIN_NAME = 'SportRes Admin';

const DELETE_ORDER = [
  'messages',
  'conversation_members',
  'conversations',
  'friend_requests',
  'tournament_registrations',
  'tournaments',
  'notifications',
  'favorites',
  'venue_reviews',
  'player_reviews',
  'reviews',
  'wallet_transactions',
  'payments',
  'payment_verifications',
  'payment_records',
  'booking_payments',
  'booking_extras',
  'match_participants',
  'matches',
  'bookings',
  'time_slots',
  'court_schedules',
  'schedules',
  'courts',
  'venue_requests',
  'venues',
  'user_sport_skills',
  'user_profiles',
  'users',
] as const;

if (!process.env.DATABASE_URL) {
  console.error('[Full Beta Reset] DATABASE_URL is not configured.');
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const quoteIdentifier = (value: string) => `"${value.replaceAll('"', '""')}"`;

async function main() {
  console.log('[Full Beta Reset] BACKUP REQUIRED: create and verify a PostgreSQL backup before continuing.');
  console.log(`[Full Beta Reset] Mode: ${DRY_RUN ? 'DRY RUN (all changes will be rolled back)' : 'LIVE RESET'}`);

  const client = await pool.connect();
  try {
    await client.query('BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE');

    const tableRows = (await client.query(
      `SELECT table_name
       FROM information_schema.tables
       WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`,
    )).rows;
    const tables = new Set<string>(tableRows.map(row => row.table_name));
    if (!tables.has('users')) throw new Error('Required table "users" does not exist.');

    const columnRows = (await client.query(
      `SELECT table_name, column_name
       FROM information_schema.columns
       WHERE table_schema = 'public'`,
    )).rows;
    const columnsByTable = new Map<string, Set<string>>();
    for (const row of columnRows) {
      const columns = columnsByTable.get(row.table_name) || new Set<string>();
      columns.add(row.column_name);
      columnsByTable.set(row.table_name, columns);
    }

    const existingDeleteTables = DELETE_ORDER.filter(table => tables.has(table));
    const countsBefore = new Map<string, number>();
    for (const table of existingDeleteTables) {
      const result = await client.query(`SELECT COUNT(*)::integer AS count FROM ${quoteIdentifier(table)}`);
      countsBefore.set(table, Number(result.rows[0].count));
    }

    console.log('\n[Full Beta Reset] Rows selected for deletion:');
    for (const table of existingDeleteTables) {
      console.log(`- ${table}: ${countsBefore.get(table) || 0}`);
    }
    console.log('\n[Full Beta Reset] Final account to create:');
    console.log(`- phone: ${ADMIN_PHONE}`);
    console.log(`- username: ${ADMIN_USERNAME}`);
    console.log(`- full_name: ${ADMIN_NAME}`);
    console.log('- role: admin');
    console.log('- password: bcrypt hash will be generated during this transaction');

    if (!DRY_RUN) {
      const prompt = readline.createInterface({ input: process.stdin, output: process.stdout });
      const answer = await prompt.question(`\nType ${CONFIRMATION} to continue: `);
      prompt.close();
      if (answer.trim() !== CONFIRMATION) {
        await client.query('ROLLBACK');
        console.log('[Full Beta Reset] Cancelled. No data was changed.');
        return;
      }
    }

    for (const table of existingDeleteTables) {
      await client.query(`DELETE FROM ${quoteIdentifier(table)}`);
    }

    const usersColumns = columnsByTable.get('users') || new Set<string>();
    const insertColumns = ['username', 'phone', 'password_hash', 'role'];
    const insertValues: unknown[] = [
      ADMIN_USERNAME,
      ADMIN_PHONE,
      await bcrypt.hash(ADMIN_PASSWORD, 12),
      'admin',
    ];
    if (usersColumns.has('full_name')) {
      insertColumns.push('full_name');
      insertValues.push(ADMIN_NAME);
    }
    if (usersColumns.has('email')) {
      insertColumns.push('email');
      insertValues.push(null);
    }
    if (usersColumns.has('status')) {
      insertColumns.push('status');
      insertValues.push('active');
    }
    const placeholders = insertValues.map((_, index) => `$${index + 1}`).join(', ');
    const adminResult = await client.query(
      `INSERT INTO users (${insertColumns.map(quoteIdentifier).join(', ')})
       VALUES (${placeholders})
       RETURNING *`,
      insertValues,
    );
    const admin = adminResult.rows[0];

    if (tables.has('user_profiles')) {
      const profileColumns = columnsByTable.get('user_profiles') || new Set<string>();
      const columns = ['user_id', 'display_name'];
      const values: unknown[] = [admin.id, ADMIN_NAME];
      if (profileColumns.has('wallet_balance')) {
        columns.push('wallet_balance');
        values.push(0);
      }
      if (profileColumns.has('points')) {
        columns.push('points');
        values.push(0);
      }
      const profilePlaceholders = values.map((_, index) => `$${index + 1}`).join(', ');
      await client.query(
        `INSERT INTO user_profiles (${columns.map(quoteIdentifier).join(', ')})
         VALUES (${profilePlaceholders})`,
        values,
      );
    }

    const serialColumns = (await client.query(
      `SELECT table_name, column_name
       FROM information_schema.columns
       WHERE table_schema = 'public' AND column_default LIKE 'nextval(%'`,
    )).rows;
    for (const serial of serialColumns) {
      if (!existingDeleteTables.includes(serial.table_name)) continue;
      const sequenceResult = await client.query(
        'SELECT pg_get_serial_sequence($1, $2) AS sequence_name',
        [`public.${serial.table_name}`, serial.column_name],
      );
      const sequenceName = sequenceResult.rows[0]?.sequence_name;
      if (sequenceName) await client.query('SELECT setval($1::regclass, 1, false)', [sequenceName]);
    }

    const summary = await getSummary(client, tables);
    const storedAdmin = (await client.query(
      `SELECT username, phone, password_hash, role::text AS role,
              ${usersColumns.has('full_name') ? 'full_name' : 'NULL::text AS full_name'},
              ${usersColumns.has('email') ? 'email' : 'NULL::text AS email'}
       FROM users`,
    )).rows[0];
    const passwordWorks = await bcrypt.compare(ADMIN_PASSWORD, storedAdmin.password_hash);

    const expectedZeroKeys = [
      'venueOwners',
      'players',
      'staff',
      'venues',
      'courts',
      'schedules',
      'timeSlots',
      'bookings',
      'matches',
      'payments',
      'reviews',
      'notifications',
      'favorites',
    ] as const;
    const invalidZeroCounts = expectedZeroKeys.filter(key => summary[key] !== 0);
    if (
      summary.users !== 1
      || summary.admins !== 1
      || invalidZeroCounts.length
      || storedAdmin.username !== ADMIN_USERNAME
      || storedAdmin.phone !== ADMIN_PHONE
      || storedAdmin.role !== 'admin'
      || storedAdmin.full_name !== ADMIN_NAME
      || storedAdmin.email !== null
      || !passwordWorks
    ) {
      throw new Error(
        `Final verification failed. Non-zero fields: ${invalidZeroCounts.join(', ') || 'none'}, users=${summary.users}, admins=${summary.admins}.`,
      );
    }

    console.log(`\n[Full Beta Reset] ${DRY_RUN ? 'Projected' : 'Final'} counts:`);
    console.log(`- users: ${summary.users}`);
    console.log(`- admins: ${summary.admins}`);
    console.log(`- venue owners: ${summary.venueOwners}`);
    console.log(`- players: ${summary.players}`);
    console.log(`- staff: ${summary.staff}`);
    console.log(`- venues: ${summary.venues}`);
    console.log(`- courts: ${summary.courts}`);
    console.log(`- schedules: ${summary.schedules}`);
    console.log(`- time slots: ${summary.timeSlots}`);
    console.log(`- bookings: ${summary.bookings}`);
    console.log(`- matches: ${summary.matches}`);
    console.log(`- payments: ${summary.payments}`);
    console.log(`- reviews: ${summary.reviews}`);
    console.log(`- notifications: ${summary.notifications}`);
    console.log(`- favorites: ${summary.favorites}`);
    console.log(`- admin bcrypt login verification: ${passwordWorks ? 'PASS' : 'FAIL'}`);

    if (DRY_RUN) {
      await client.query('ROLLBACK');
      console.log('\n[Full Beta Reset] Dry run complete. All deletions and admin recreation were rolled back.');
    } else {
      await client.query('COMMIT');
      console.log('\n[Full Beta Reset] Full beta cleanup completed successfully.');
    }
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}

async function getSummary(client: pg.PoolClient, tables: Set<string>) {
  const count = async (table: string) => {
    if (!tables.has(table)) return 0;
    const result = await client.query(`SELECT COUNT(*)::integer AS count FROM ${quoteIdentifier(table)}`);
    return Number(result.rows[0].count);
  };
  const roleCounts = (await client.query(
    `SELECT
       COUNT(*)::integer AS users,
       COUNT(*) FILTER (WHERE role::text = 'admin')::integer AS admins,
       COUNT(*) FILTER (WHERE role::text = 'venue_owner')::integer AS venue_owners,
       COUNT(*) FILTER (WHERE role::text IN ('player', 'user', 'customer'))::integer AS players,
       COUNT(*) FILTER (WHERE role::text = 'staff')::integer AS staff
     FROM users`,
  )).rows[0];
  let payments = 0;
  for (const table of ['payments', 'payment_verifications', 'payment_records', 'booking_payments']) {
    payments += await count(table);
  }

  return {
    users: Number(roleCounts.users),
    admins: Number(roleCounts.admins),
    venueOwners: Number(roleCounts.venue_owners),
    players: Number(roleCounts.players),
    staff: Number(roleCounts.staff),
    venues: await count('venues'),
    courts: await count('courts'),
    schedules: (await count('court_schedules')) + (await count('schedules')),
    timeSlots: await count('time_slots'),
    bookings: await count('bookings'),
    matches: await count('matches'),
    payments,
    reviews: (await count('reviews')) + (await count('venue_reviews')) + (await count('player_reviews')),
    notifications: await count('notifications'),
    favorites: await count('favorites'),
  };
}

main()
  .catch(error => {
    console.error('[Full Beta Reset] Failed. Transaction rolled back.');
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
