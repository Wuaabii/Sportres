import 'dotenv/config';
import process from 'node:process';
import readline from 'node:readline/promises';
import pg from 'pg';

const { Pool } = pg;
const DRY_RUN = process.argv.includes('--dry-run');
const CONFIRMATION = 'DELETE_BETA_USERS';
const TARGET_OWNER_NAME = 'Trần Thị Lan';
const REMOVABLE_ROLES = new Set(['player', 'user', 'customer', 'staff']);
const OPTIONAL_PAYMENT_TABLES = ['payments', 'payment_records', 'booking_payments'];

if (!process.env.DATABASE_URL) {
  console.error('[Beta Users Reset] DATABASE_URL is not configured.');
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const normalizeName = (value: unknown) =>
  String(value || '').normalize('NFC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('vi-VN');
const quoteIdentifier = (value: string) => `"${value.replaceAll('"', '""')}"`;

type UserRow = {
  id: string;
  username: string;
  full_name: string;
  phone: string;
  role: string;
};

type DatabaseSummary = {
  admins: number;
  venueOwners: number;
  venues: number;
  courts: number;
  users: number;
};

async function main() {
  console.log('[Beta Users Reset] BACKUP RECOMMENDED: create a PostgreSQL backup before continuing.');
  console.log(`[Beta Users Reset] Mode: ${DRY_RUN ? 'DRY RUN (transaction will be rolled back)' : 'LIVE DELETE'}`);

  const client = await pool.connect();
  try {
    await client.query('BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE');

    const tableRows = (await client.query(
      `SELECT table_name
       FROM information_schema.tables
       WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`,
    )).rows;
    const tables = new Set<string>(tableRows.map(row => row.table_name));
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

    const users = (await client.query<UserRow>(
      `SELECT id, username, full_name, phone, role::text AS role
       FROM users
       ORDER BY role, full_name`,
    )).rows;
    const namedOwners = users.filter(user =>
      user.role === 'venue_owner' && normalizeName(user.full_name) === normalizeName(TARGET_OWNER_NAME));
    if (namedOwners.length !== 1) {
      throw new Error(
        `Safety check failed: expected exactly one venue owner named "${TARGET_OWNER_NAME}", found ${namedOwners.length}.`,
      );
    }

    const targetUsers = users.filter(user =>
      REMOVABLE_ROLES.has(user.role) || user.id === namedOwners[0].id);
    if (targetUsers.some(user => user.role === 'admin')) {
      throw new Error('Safety check failed: an admin account entered the deletion set.');
    }
    const targetUserIds = targetUsers.map(user => user.id);

    await client.query(
      `CREATE TEMP TABLE beta_target_users (id UUID PRIMARY KEY) ON COMMIT DROP`,
    );
    await client.query(
      `INSERT INTO beta_target_users (id)
       SELECT UNNEST($1::uuid[])`,
      [targetUserIds],
    );
    await client.query(
      `CREATE TEMP TABLE beta_target_venues AS
       SELECT id FROM venues WHERE owner_id IN (SELECT id FROM beta_target_users)`,
    );
    await client.query(
      `CREATE TEMP TABLE beta_target_courts AS
       SELECT id FROM courts WHERE venue_id IN (SELECT id FROM beta_target_venues)`,
    );
    await client.query(
      `CREATE TEMP TABLE beta_target_bookings AS
       SELECT id, time_slot_id
       FROM bookings
       WHERE user_id IN (SELECT id FROM beta_target_users)
          OR venue_id IN (SELECT id FROM beta_target_venues)
          OR court_id IN (SELECT id FROM beta_target_courts)`,
    );
    await client.query(
      `CREATE TEMP TABLE beta_target_matches AS
       SELECT DISTINCT m.id
       FROM matches m
       WHERE m.creator_id IN (SELECT id FROM beta_target_users)
          OR m.venue_id IN (SELECT id FROM beta_target_venues)
          OR m.court_id IN (SELECT id FROM beta_target_courts)
          OR m.booking_id IN (SELECT id FROM beta_target_bookings)`,
    );

    const scalar = async (sql: string) => Number((await client.query(sql)).rows[0].count);
    const beforeSummary = await getSummary(client);
    const plan = {
      accounts: targetUsers.length,
      players: targetUsers.filter(user => ['player', 'user', 'customer'].includes(user.role)).length,
      staff: targetUsers.filter(user => user.role === 'staff').length,
      namedOwner: namedOwners[0],
      profiles: tables.has('user_profiles')
        ? await scalar('SELECT COUNT(*)::integer AS count FROM user_profiles WHERE user_id IN (SELECT id FROM beta_target_users)')
        : 0,
      venues: await scalar('SELECT COUNT(*)::integer AS count FROM beta_target_venues'),
      courts: await scalar('SELECT COUNT(*)::integer AS count FROM beta_target_courts'),
      schedules: tables.has('court_schedules')
        ? await scalar('SELECT COUNT(*)::integer AS count FROM court_schedules WHERE court_id IN (SELECT id FROM beta_target_courts)')
        : 0,
      slots: tables.has('time_slots')
        ? await scalar('SELECT COUNT(*)::integer AS count FROM time_slots WHERE court_id IN (SELECT id FROM beta_target_courts)')
        : 0,
      bookingSlotsReleased: tables.has('time_slots')
        ? await scalar(`SELECT COUNT(*)::integer AS count
                        FROM time_slots
                        WHERE NOT is_maintenance
                          AND (id IN (SELECT time_slot_id FROM beta_target_bookings)
                            OR booked_by IN (SELECT id FROM beta_target_users))`)
        : 0,
      bookings: await scalar('SELECT COUNT(*)::integer AS count FROM beta_target_bookings'),
      matches: await scalar('SELECT COUNT(*)::integer AS count FROM beta_target_matches'),
      participants: tables.has('match_participants')
        ? await scalar(`SELECT COUNT(*)::integer AS count FROM match_participants
                        WHERE user_id IN (SELECT id FROM beta_target_users)
                           OR match_id IN (SELECT id FROM beta_target_matches)`)
        : 0,
      reviews: tables.has('reviews')
        ? await scalar(`SELECT COUNT(*)::integer AS count FROM reviews
                        WHERE reviewer_id IN (SELECT id FROM beta_target_users)
                           OR venue_id IN (SELECT id FROM beta_target_venues)
                           OR court_id IN (SELECT id FROM beta_target_courts)
                           OR booking_id IN (SELECT id FROM beta_target_bookings)`)
        : 0,
      notifications: tables.has('notifications')
        ? await scalar(`SELECT COUNT(*)::integer AS count FROM notifications
                        WHERE user_id IN (SELECT id FROM beta_target_users)
                           OR reference_id IN (SELECT id FROM beta_target_bookings)
                           OR reference_id IN (SELECT id FROM beta_target_matches)
                           OR reference_id IN (SELECT id FROM beta_target_venues)`)
        : 0,
      favorites: tables.has('favorites')
        ? await scalar(`SELECT COUNT(*)::integer AS count FROM favorites
                        WHERE user_id IN (SELECT id FROM beta_target_users)
                           OR venue_id IN (SELECT id FROM beta_target_venues)`)
        : 0,
      walletTransactions: tables.has('wallet_transactions')
        ? await scalar(`SELECT COUNT(*)::integer AS count FROM wallet_transactions
                        WHERE user_id IN (SELECT id FROM beta_target_users)
                           OR reference_id IN (SELECT id FROM beta_target_bookings)
                           OR reference_id IN (SELECT id FROM beta_target_matches)`)
        : 0,
      optionalPayments: [] as Array<{ table: string; count: number }>,
    };
    for (const table of OPTIONAL_PAYMENT_TABLES) {
      if (!tables.has(table)) continue;
      const columns = columnsByTable.get(table) || new Set<string>();
      const clauses: string[] = [];
      if (columns.has('user_id')) clauses.push('user_id IN (SELECT id FROM beta_target_users)');
      if (columns.has('booking_id')) clauses.push('booking_id IN (SELECT id FROM beta_target_bookings)');
      if (columns.has('venue_id')) clauses.push('venue_id IN (SELECT id FROM beta_target_venues)');
      if (columns.has('owner_id')) clauses.push('owner_id IN (SELECT id FROM beta_target_users)');
      const count = clauses.length
        ? await scalar(`SELECT COUNT(*)::integer AS count FROM ${quoteIdentifier(table)} WHERE ${clauses.join(' OR ')}`)
        : 0;
      plan.optionalPayments.push({ table, count });
    }

    console.log('\n[Beta Users Reset] Accounts selected for deletion:');
    for (const user of targetUsers) {
      const marker = user.id === namedOwners[0].id ? ' [TARGET OWNER]' : '';
      console.log(`- ${user.role}: ${user.full_name} (@${user.username}, ${user.phone})${marker}`);
    }
    console.log('\n[Beta Users Reset] Related records selected:');
    console.log(`- User accounts: ${plan.accounts} (${plan.players} player/customer, ${plan.staff} staff, 1 target owner)`);
    console.log(`- Profiles: ${plan.profiles}`);
    console.log(`- Venues owned by selected accounts: ${plan.venues}`);
    console.log(`- Courts in those venues: ${plan.courts}`);
    console.log(`- Court schedules in those venues: ${plan.schedules}`);
    console.log(`- Time slots in those venues: ${plan.slots}`);
    console.log(`- Booking-held slots outside deleted venue trees released: ${plan.bookingSlotsReleased}`);
    console.log(`- Bookings/payment history: ${plan.bookings}`);
    console.log(`- Created matches tied to selected accounts/venues: ${plan.matches}`);
    console.log(`- Match participation rows: ${plan.participants}`);
    console.log(`- Reviews: ${plan.reviews}`);
    console.log(`- Notifications: ${plan.notifications}`);
    console.log(`- Favorites: ${plan.favorites}`);
    console.log(`- Wallet/payment transactions: ${plan.walletTransactions}`);
    for (const paymentTable of plan.optionalPayments) {
      console.log(`- ${paymentTable.table}: ${paymentTable.count}`);
    }
    console.log('\n[Beta Users Reset] Protected: every admin and every other venue owner with their venues, courts, schedules, and slots.');

    if (!DRY_RUN) {
      const prompt = readline.createInterface({ input: process.stdin, output: process.stdout });
      const answer = await prompt.question(`\nTYPE ${CONFIRMATION} to continue: `);
      prompt.close();
      if (answer.trim() !== CONFIRMATION) {
        await client.query('ROLLBACK');
        console.log('[Beta Users Reset] Cancelled. No data was changed.');
        return;
      }
    }

    if (tables.has('time_slots')) {
      await client.query(
        `UPDATE time_slots
         SET is_booked = FALSE, is_blocked = FALSE, booked_by = NULL
         WHERE NOT is_maintenance
           AND (id IN (SELECT time_slot_id FROM beta_target_bookings)
             OR booked_by IN (SELECT id FROM beta_target_users))
           AND court_id NOT IN (SELECT id FROM beta_target_courts)`,
      );
    }
    if (tables.has('match_participants')) {
      await client.query(
        `DELETE FROM match_participants
         WHERE user_id IN (SELECT id FROM beta_target_users)
            OR match_id IN (SELECT id FROM beta_target_matches)`,
      );
    }
    if (tables.has('reviews')) {
      await client.query(
        `DELETE FROM reviews
         WHERE reviewer_id IN (SELECT id FROM beta_target_users)
            OR venue_id IN (SELECT id FROM beta_target_venues)
            OR court_id IN (SELECT id FROM beta_target_courts)
            OR booking_id IN (SELECT id FROM beta_target_bookings)`,
      );
    }
    if (tables.has('notifications')) {
      await client.query(
        `DELETE FROM notifications
         WHERE user_id IN (SELECT id FROM beta_target_users)
            OR reference_id IN (SELECT id FROM beta_target_bookings)
            OR reference_id IN (SELECT id FROM beta_target_matches)
            OR reference_id IN (SELECT id FROM beta_target_venues)`,
      );
    }
    if (tables.has('favorites')) {
      await client.query(
        `DELETE FROM favorites
         WHERE user_id IN (SELECT id FROM beta_target_users)
            OR venue_id IN (SELECT id FROM beta_target_venues)`,
      );
    }
    if (tables.has('wallet_transactions')) {
      await client.query(
        `DELETE FROM wallet_transactions
         WHERE user_id IN (SELECT id FROM beta_target_users)
            OR reference_id IN (SELECT id FROM beta_target_bookings)
            OR reference_id IN (SELECT id FROM beta_target_matches)`,
      );
    }
    for (const table of OPTIONAL_PAYMENT_TABLES) {
      if (!tables.has(table)) continue;
      const columns = columnsByTable.get(table) || new Set<string>();
      const clauses: string[] = [];
      if (columns.has('user_id')) clauses.push('user_id IN (SELECT id FROM beta_target_users)');
      if (columns.has('booking_id')) clauses.push('booking_id IN (SELECT id FROM beta_target_bookings)');
      if (columns.has('venue_id')) clauses.push('venue_id IN (SELECT id FROM beta_target_venues)');
      if (columns.has('owner_id')) clauses.push('owner_id IN (SELECT id FROM beta_target_users)');
      if (clauses.length) {
        await client.query(`DELETE FROM ${quoteIdentifier(table)} WHERE ${clauses.join(' OR ')}`);
      }
    }
    await client.query('DELETE FROM matches WHERE id IN (SELECT id FROM beta_target_matches)');
    await client.query('DELETE FROM bookings WHERE id IN (SELECT id FROM beta_target_bookings)');
    await client.query('DELETE FROM users WHERE id IN (SELECT id FROM beta_target_users)');
    if (tables.has('conversations') && tables.has('conversation_members')) {
      await client.query(
        `DELETE FROM conversations c
         WHERE NOT EXISTS (SELECT 1 FROM conversation_members cm WHERE cm.conversation_id = c.id)`,
      );
    }

    const remainingTargetUsers = await scalar(
      `SELECT COUNT(*)::integer AS count FROM users WHERE id IN (SELECT id FROM beta_target_users)`,
    );
    const remainingPlayerStaff = await scalar(
      `SELECT COUNT(*)::integer AS count
       FROM users
       WHERE role::text IN ('player', 'user', 'customer', 'staff')`,
    );
    const remainingNamedOwnerRows = (await client.query<UserRow>(
      `SELECT id, username, full_name, phone, role::text AS role
       FROM users WHERE role::text = 'venue_owner'`,
    )).rows.filter(user => normalizeName(user.full_name) === normalizeName(TARGET_OWNER_NAME)).length;
    const orphanProfiles = tables.has('user_profiles')
      ? await scalar(`SELECT COUNT(*)::integer AS count FROM user_profiles up LEFT JOIN users u ON u.id = up.user_id WHERE u.id IS NULL`)
      : 0;
    const orphanVenues = await scalar(
      `SELECT COUNT(*)::integer AS count FROM venues v LEFT JOIN users u ON u.id = v.owner_id WHERE u.id IS NULL`,
    );
    const orphanCourts = await scalar(
      `SELECT COUNT(*)::integer AS count FROM courts c LEFT JOIN venues v ON v.id = c.venue_id WHERE v.id IS NULL`,
    );
    if (
      remainingTargetUsers
      || remainingPlayerStaff
      || remainingNamedOwnerRows
      || orphanProfiles
      || orphanVenues
      || orphanCourts
    ) {
      throw new Error(
        `Integrity check failed: targetUsers=${remainingTargetUsers}, playerStaff=${remainingPlayerStaff}, namedOwner=${remainingNamedOwnerRows}, orphanProfiles=${orphanProfiles}, orphanVenues=${orphanVenues}, orphanCourts=${orphanCourts}.`,
      );
    }

    const finalSummary = await getSummary(client);
    if (finalSummary.admins < 1) throw new Error('Safety check failed: cleanup would leave no admin account.');
    if (finalSummary.venueOwners !== beforeSummary.venueOwners - 1) {
      throw new Error('Safety check failed: unexpected venue owner count after cleanup.');
    }

    console.log(`\n[Beta Users Reset] ${DRY_RUN ? 'Projected' : 'Final'} summary:`);
    console.log(`- Admin count: ${finalSummary.admins}`);
    console.log(`- Venue owner count: ${finalSummary.venueOwners}`);
    console.log(`- Venue count: ${finalSummary.venues}`);
    console.log(`- Court count: ${finalSummary.courts}`);
    console.log(`- User count: ${finalSummary.users}`);

    if (DRY_RUN) {
      await client.query('ROLLBACK');
      console.log('\n[Beta Users Reset] Dry run complete. All simulated deletions were rolled back.');
    } else {
      await client.query('COMMIT');
      console.log('\n[Beta Users Reset] Cleanup completed successfully.');
    }
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}

async function getSummary(client: pg.PoolClient): Promise<DatabaseSummary> {
  const result = await client.query(
    `SELECT
       COUNT(*) FILTER (WHERE role::text = 'admin')::integer AS admins,
       COUNT(*) FILTER (WHERE role::text = 'venue_owner')::integer AS venue_owners,
       (SELECT COUNT(*)::integer FROM venues) AS venues,
       (SELECT COUNT(*)::integer FROM courts) AS courts,
       COUNT(*)::integer AS users
     FROM users`,
  );
  return {
    admins: Number(result.rows[0].admins),
    venueOwners: Number(result.rows[0].venue_owners),
    venues: Number(result.rows[0].venues),
    courts: Number(result.rows[0].courts),
    users: Number(result.rows[0].users),
  };
}

main()
  .catch(error => {
    console.error('[Beta Users Reset] Failed. Transaction rolled back.');
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
