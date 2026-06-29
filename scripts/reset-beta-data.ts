import 'dotenv/config';
import process from 'node:process';
import readline from 'node:readline/promises';
import pg from 'pg';
import { createDatabasePoolConfig } from '../database-config.js';

const { Pool } = pg;
const DRY_RUN = process.argv.includes('--dry-run');
const CONFIRMATION = 'RESET_BETA';
const BOOKING_TRANSACTION_TYPES = [
  'booking_payment',
  'booking_refund',
  'match_payment',
  'match_refund',
];
const OPTIONAL_ACTIVITY_TABLES = [
  'payments',
  'payment_records',
  'booking_payments',
  'player_reviews',
];
const MATCH_STAT_COLUMNS = [
  'matches_joined',
  'total_matches_joined',
  'matches_played',
  'total_matches_played',
  'wins',
  'win_count',
  'losses',
  'loss_count',
  'draws',
  'draw_count',
];
const REPUTATION_COLUMNS = [
  'reputation',
  'reputation_score',
  'trust_score',
  'trust_percentage',
];

if (!process.env.DATABASE_URL) {
  console.error('[Beta Reset] DATABASE_URL is not configured.');
  process.exit(1);
}

const pool = new Pool(createDatabasePoolConfig());
const quoteIdentifier = (value: string) => `"${value.replaceAll('"', '""')}"`;

type ColumnInfo = {
  table_name: string;
  column_name: string;
};

type ResetPlanItem = {
  key: string;
  description: string;
  affected: number;
};

const printPlan = (items: ResetPlanItem[]) => {
  console.log('\n[Beta Reset] Planned activity cleanup:');
  for (const item of items) {
    console.log(`- ${item.description}: ${item.affected}`);
  }
  console.log('\n[Beta Reset] Preserved: users, login/phone data, venues, courts, court schedules, time slots, and owner relationships.');
  console.log('[Beta Reset] Manual slot locks and maintenance slots will remain unchanged.');
};

async function main() {
  console.log('[Beta Reset] BACKUP RECOMMENDED: create a PostgreSQL backup before continuing.');
  console.log(`[Beta Reset] Mode: ${DRY_RUN ? 'DRY RUN (no changes)' : 'LIVE RESET'}`);

  const client = await pool.connect();
  try {
    await client.query(DRY_RUN
      ? 'BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY'
      : 'BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE');

    const tableRows = (await client.query(
      `SELECT table_name
       FROM information_schema.tables
       WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`,
    )).rows;
    const tables = new Set<string>(tableRows.map(row => row.table_name));
    const columnRows = (await client.query<ColumnInfo>(
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

    const countTable = async (table: string, where = '', params: unknown[] = []) => {
      if (!tables.has(table)) return 0;
      const result = await client.query(
        `SELECT COUNT(*)::integer AS count FROM ${quoteIdentifier(table)} ${where}`,
        params,
      );
      return Number(result.rows[0].count);
    };

    const notificationClauses = [`type::text IN ('booking', 'match')`];
    if (tables.has('bookings')) notificationClauses.push('reference_id IN (SELECT id FROM bookings)');
    if (tables.has('matches')) notificationClauses.push('reference_id IN (SELECT id FROM matches)');
    const bookingNotificationWhere = `WHERE ${notificationClauses.join(' OR ')}`;
    const walletWhere = `WHERE type::text = ANY($1::text[])`;
    const slotWhere = `WHERE NOT is_maintenance AND (is_booked = TRUE OR booked_by IS NOT NULL)`;

    const statisticTargets = columnRows.filter(row =>
      MATCH_STAT_COLUMNS.includes(row.column_name) || REPUTATION_COLUMNS.includes(row.column_name));

    const plan: ResetPlanItem[] = [];
    const addPlan = (key: string, description: string, affected: number) =>
      plan.push({ key, description, affected });

    addPlan('notifications', 'Booking/match notifications deleted',
      tables.has('notifications')
        ? await countTable('notifications', bookingNotificationWhere)
        : 0);
    for (const table of OPTIONAL_ACTIVITY_TABLES) {
      if (tables.has(table)) addPlan(table, `${table} rows deleted`, await countTable(table));
    }
    addPlan('reviews', 'Court, venue, and booking reviews deleted', await countTable('reviews'));
    addPlan('wallet_transactions', 'Booking/match wallet transactions deleted',
      tables.has('wallet_transactions') ? await countTable('wallet_transactions', walletWhere, [BOOKING_TRANSACTION_TYPES]) : 0);
    addPlan('match_participants', 'Match participation rows deleted', await countTable('match_participants'));
    addPlan('matches', 'Match records deleted', await countTable('matches'));
    addPlan('booking_extras', 'Booking extra rows deleted', await countTable('booking_extras'));
    addPlan('bookings', 'Booking/payment verification records deleted', await countTable('bookings'));
    addPlan('time_slots', 'Booking-held time slots released', await countTable('time_slots', slotWhere));
    addPlan('venues', 'Venue rating summaries reset to 0',
      tables.has('venues')
        && columnsByTable.get('venues')?.has('rating')
        && columnsByTable.get('venues')?.has('reviews_count')
        ? await countTable('venues', 'WHERE rating <> 0 OR reviews_count <> 0')
        : 0);
    for (const target of statisticTargets) {
      const isReputation = REPUTATION_COLUMNS.includes(target.column_name);
      const targetValue = isReputation ? 100 : 0;
      addPlan(
        `stat:${target.table_name}.${target.column_name}`,
        `${target.table_name}.${target.column_name} reset to ${targetValue}`,
        await countTable(
          target.table_name,
          `WHERE ${quoteIdentifier(target.column_name)} IS DISTINCT FROM $1`,
          [targetValue],
        ),
      );
    }

    printPlan(plan);

    if (DRY_RUN) {
      await client.query('ROLLBACK');
      console.log('\n[Beta Reset] Dry run complete. No data was changed.');
      return;
    }

    const prompt = readline.createInterface({ input: process.stdin, output: process.stdout });
    const answer = await prompt.question(`\nType ${CONFIRMATION} to continue: `);
    prompt.close();
    if (answer.trim() !== CONFIRMATION) {
      await client.query('ROLLBACK');
      console.log('[Beta Reset] Cancelled. No data was changed.');
      return;
    }

    const results: ResetPlanItem[] = [];
    const recordResult = (key: string, description: string, affected: number | null) =>
      results.push({ key, description, affected: Number(affected || 0) });
    const deleteAll = async (table: string, description: string) => {
      if (!tables.has(table)) return;
      const result = await client.query(`DELETE FROM ${quoteIdentifier(table)}`);
      recordResult(table, description, result.rowCount);
    };

    if (tables.has('notifications')) {
      const result = await client.query(`DELETE FROM notifications ${bookingNotificationWhere}`);
      recordResult('notifications', 'Booking/match notifications deleted', result.rowCount);
    }
    for (const table of OPTIONAL_ACTIVITY_TABLES) {
      await deleteAll(table, `${table} rows deleted`);
    }
    await deleteAll('reviews', 'Court, venue, and booking reviews deleted');
    if (tables.has('wallet_transactions')) {
      const result = await client.query(`DELETE FROM wallet_transactions ${walletWhere}`, [BOOKING_TRANSACTION_TYPES]);
      recordResult('wallet_transactions', 'Booking/match wallet transactions deleted', result.rowCount);
    }
    await deleteAll('match_participants', 'Match participation rows deleted');
    await deleteAll('matches', 'Match records deleted');
    await deleteAll('booking_extras', 'Booking extra rows deleted');
    await deleteAll('bookings', 'Booking/payment verification records deleted');

    if (tables.has('time_slots')) {
      const result = await client.query(
        `UPDATE time_slots
         SET is_booked = FALSE, is_blocked = FALSE, booked_by = NULL
         ${slotWhere}`,
      );
      recordResult('time_slots', 'Booking-held time slots released', result.rowCount);
    }
    if (
      tables.has('venues')
      && columnsByTable.get('venues')?.has('rating')
      && columnsByTable.get('venues')?.has('reviews_count')
    ) {
      const result = await client.query(
        `UPDATE venues SET rating = 0, reviews_count = 0
         WHERE rating <> 0 OR reviews_count <> 0`,
      );
      recordResult('venues', 'Venue rating summaries reset to 0', result.rowCount);
    }
    for (const target of statisticTargets) {
      const targetValue = REPUTATION_COLUMNS.includes(target.column_name) ? 100 : 0;
      const result = await client.query(
        `UPDATE ${quoteIdentifier(target.table_name)}
         SET ${quoteIdentifier(target.column_name)} = $1
         WHERE ${quoteIdentifier(target.column_name)} IS DISTINCT FROM $1`,
        [targetValue],
      );
      recordResult(
        `stat:${target.table_name}.${target.column_name}`,
        `${target.table_name}.${target.column_name} reset to ${targetValue}`,
        result.rowCount,
      );
    }

    await client.query('COMMIT');
    console.log('\n[Beta Reset] Completed successfully:');
    for (const result of results) {
      console.log(`- ${result.description}: ${result.affected}`);
    }
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}

main()
  .catch(error => {
    console.error('[Beta Reset] Failed. Transaction rolled back.');
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
