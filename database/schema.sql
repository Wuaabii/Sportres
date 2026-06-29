SET client_encoding = 'UTF8';

-- ============================================================
-- SportRes Platform - PostgreSQL Database Schema
-- Version: 2.6.0
-- PostgreSQL: 18 compatible
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Recreate SportRes objects in dependency order so this file can be
-- re-run before loading seed data.
DROP TABLE IF EXISTS
    booking_extras,
    bookings,
    time_slots,
    court_schedules,
    match_participants,
    matches,
    tournament_registrations,
    tournaments,
    wallet_transactions,
    reviews,
    notifications,
    favorites,
    friend_requests,
    messages,
    conversation_members,
    conversations,
    courts,
    venue_requests,
    venues,
    user_sport_skills,
    user_profiles,
    users
CASCADE;

DROP FUNCTION IF EXISTS validate_booking_court_venue() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

DROP TYPE IF EXISTS
    friend_status,
    court_status,
    venue_status,
    notification_type,
    transaction_type,
    tournament_status,
    match_status,
    booking_status,
    gender_type,
    skill_level,
    sport_type,
    user_status,
    user_role,
    tier_type
CASCADE;

-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE user_role AS ENUM ('player', 'venue_owner', 'staff', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'banned', 'pending');
CREATE TYPE sport_type AS ENUM ('soccer', 'badminton', 'tennis', 'basketball', 'pickleball', 'volleyball', 'golf');
CREATE TYPE skill_level AS ENUM ('Beginner', 'Intermediate', 'Advanced', 'Pro');
CREATE TYPE gender_type AS ENUM ('Nam', 'Nữ', 'Khác');
CREATE TYPE booking_status AS ENUM ('pending_payment_verification', 'confirmed', 'cancelled', 'payment_rejected', 'completed');
CREATE TYPE match_status AS ENUM ('open', 'full', 'in_progress', 'finished', 'cancelled');
CREATE TYPE tournament_status AS ENUM ('upcoming', 'ongoing', 'finished', 'cancelled');
CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal', 'booking_payment', 'booking_refund', 'match_payment', 'match_refund', 'reward');
CREATE TYPE notification_type AS ENUM ('booking', 'match', 'tournament', 'message', 'system', 'promotion');
CREATE TYPE venue_status AS ENUM ('active', 'pending_approval', 'maintenance', 'closed');
CREATE TYPE court_status AS ENUM ('open', 'closed', 'maintenance');
CREATE TYPE friend_status AS ENUM ('pending', 'accepted', 'rejected');
CREATE TYPE tier_type AS ENUM ('Đồng', 'Bạc', 'Vàng', 'Kim cương');

-- ============================================================
-- CORE USER TABLES
-- ============================================================

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username        VARCHAR(50) UNIQUE NOT NULL,
    full_name       VARCHAR(100) NOT NULL,
    email           VARCHAR(255) UNIQUE,
    phone           VARCHAR(20) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    role            user_role NOT NULL DEFAULT 'player',
    status          user_status NOT NULL DEFAULT 'active',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at   TIMESTAMPTZ
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

CREATE TABLE user_profiles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    display_name    VARCHAR(100) NOT NULL,
    avatar_url      TEXT,
    gender          gender_type,
    active_area     VARCHAR(255),
    bio             TEXT,
    wallet_balance  INTEGER NOT NULL DEFAULT 0,
    points          INTEGER NOT NULL DEFAULT 0,
    tier            tier_type NOT NULL DEFAULT 'Đồng',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id)
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

CREATE TABLE user_sport_skills (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sport           sport_type NOT NULL,
    skill           skill_level NOT NULL DEFAULT 'Beginner',
    is_favorite     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, sport)
);

CREATE INDEX idx_user_sport_skills_user_id ON user_sport_skills(user_id);

-- ============================================================
-- VENUES AND COURTS
-- ============================================================

CREATE TABLE venues (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    address         TEXT NOT NULL,
    district        VARCHAR(100),
    city            VARCHAR(100) NOT NULL DEFAULT 'Hà Nội',
    description     TEXT,
    image_url       TEXT,
    latitude        NUMERIC(10,7),
    longitude       NUMERIC(10,7),
    rating          NUMERIC(2,1) NOT NULL DEFAULT 0.0,
    reviews_count   INTEGER NOT NULL DEFAULT 0,
    status          VARCHAR(20) NOT NULL DEFAULT 'pending',
    amenities       TEXT[],
    opening_hour    TIME NOT NULL DEFAULT '05:00',
    closing_hour    TIME NOT NULL DEFAULT '22:00',
    phone           VARCHAR(20),
    internal_note   TEXT,
    primary_sport   sport_type,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_venues_owner_id ON venues(owner_id);
CREATE INDEX idx_venues_status ON venues(status);
CREATE INDEX idx_venues_city ON venues(city);
CREATE INDEX idx_venues_coordinates ON venues(latitude, longitude);

CREATE TABLE venue_requests (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name             VARCHAR(255) NOT NULL,
    address          TEXT NOT NULL,
    district         VARCHAR(100),
    sport            sport_type NOT NULL,
    price_per_hour   INTEGER NOT NULL DEFAULT 0,
    opening_hour     TIME NOT NULL DEFAULT '05:00',
    closing_hour     TIME NOT NULL DEFAULT '22:00',
    closed_days      VARCHAR(255) NOT NULL DEFAULT 'Không',
    description      TEXT,
    image_url        TEXT,
    status           venue_status NOT NULL DEFAULT 'pending_approval',
    rejection_reason TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at      TIMESTAMPTZ
);

CREATE INDEX idx_venue_requests_owner_id ON venue_requests(owner_id);
CREATE INDEX idx_venue_requests_status ON venue_requests(status);

CREATE TABLE courts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id        UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    address         TEXT,
    sport           sport_type NOT NULL,
    status          court_status NOT NULL DEFAULT 'open',
    image_url       TEXT,
    price_min       INTEGER NOT NULL DEFAULT 0,
    price_peak      INTEGER NOT NULL DEFAULT 0,
    capacity        INTEGER,
    description     TEXT,
    latitude        DOUBLE PRECISION,
    longitude       DOUBLE PRECISION,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_courts_venue_id ON courts(venue_id);
CREATE INDEX idx_courts_sport ON courts(sport);
CREATE INDEX idx_courts_status ON courts(status);

CREATE TABLE court_schedules (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    court_id        UUID NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
    date            DATE NOT NULL,
    opening_time    TIME NOT NULL DEFAULT '06:00',
    closing_time    TIME NOT NULL DEFAULT '22:00',
    slot_duration   INTEGER NOT NULL DEFAULT 60 CHECK (slot_duration IN (30, 60, 90, 120)),
    status          court_status NOT NULL DEFAULT 'open',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (court_id, date)
);

CREATE INDEX idx_court_schedules_court_date ON court_schedules(court_id, date);

CREATE TABLE time_slots (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    court_id        UUID NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
    date            DATE NOT NULL,
    start_time      TIME NOT NULL,
    end_time        TIME NOT NULL,
    price           INTEGER NOT NULL,
    is_peak         BOOLEAN NOT NULL DEFAULT FALSE,
    is_booked       BOOLEAN NOT NULL DEFAULT FALSE,
    is_blocked      BOOLEAN NOT NULL DEFAULT FALSE,
    is_maintenance  BOOLEAN NOT NULL DEFAULT FALSE,
    booked_by       UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (court_id, date, start_time, end_time)
);

CREATE INDEX idx_time_slots_court_date ON time_slots(court_id, date);
CREATE INDEX idx_time_slots_booked ON time_slots(is_booked);

-- ============================================================
-- BOOKINGS
-- ============================================================

CREATE TABLE bookings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    court_id        UUID NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
    venue_id        UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    time_slot_id    UUID NOT NULL REFERENCES time_slots(id) ON DELETE CASCADE,
    date            DATE NOT NULL,
    time_range      VARCHAR(50) NOT NULL,
    total_price     INTEGER NOT NULL,
    status          booking_status NOT NULL DEFAULT 'pending_payment_verification',
    payment_status  VARCHAR(40) NOT NULL DEFAULT 'pending_transfer',
    booking_group_id UUID,
    booking_code    VARCHAR(50) UNIQUE NOT NULL,
    transfer_content VARCHAR(60) NOT NULL,
    qr_code         VARCHAR(100) UNIQUE,
    notes           TEXT,
    cancelled_at    TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT bookings_transfer_content_matches_code CHECK (transfer_content = booking_code)
);

CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_court_id ON bookings(court_id);
CREATE INDEX idx_bookings_venue_id ON bookings(venue_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX idx_bookings_group_id ON bookings(booking_group_id);
CREATE INDEX idx_bookings_date ON bookings(date);

CREATE OR REPLACE FUNCTION validate_booking_court_venue()
RETURNS TRIGGER AS $$
DECLARE
    expected_venue_id UUID;
    expected_slot_court_id UUID;
BEGIN
    SELECT venue_id INTO expected_venue_id
    FROM courts
    WHERE id = NEW.court_id;

    IF expected_venue_id IS NULL THEN
        RAISE EXCEPTION 'Invalid booking court_id: %', NEW.court_id;
    END IF;

    IF expected_venue_id <> NEW.venue_id THEN
        RAISE EXCEPTION 'Booking venue_id % does not match court % venue_id %',
            NEW.venue_id, NEW.court_id, expected_venue_id;
    END IF;

    SELECT court_id INTO expected_slot_court_id
    FROM time_slots
    WHERE id = NEW.time_slot_id;

    IF expected_slot_court_id IS NULL THEN
        RAISE EXCEPTION 'Invalid booking time_slot_id: %', NEW.time_slot_id;
    END IF;

    IF expected_slot_court_id <> NEW.court_id THEN
        RAISE EXCEPTION 'Booking time_slot_id % belongs to court %, not court %',
            NEW.time_slot_id, expected_slot_court_id, NEW.court_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_booking_court_venue
BEFORE INSERT OR UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION validate_booking_court_venue();

CREATE TABLE booking_extras (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id      UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    item_name       VARCHAR(100) NOT NULL,
    quantity        INTEGER NOT NULL DEFAULT 1,
    unit_price      INTEGER NOT NULL,
    total_price     INTEGER NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_booking_extras_booking_id ON booking_extras(booking_id);

-- ============================================================
-- MATCHES
-- ============================================================

CREATE TABLE matches (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    booking_id       UUID UNIQUE REFERENCES bookings(id) ON DELETE SET NULL,
    court_id         UUID REFERENCES courts(id) ON DELETE SET NULL,
    venue_id         UUID REFERENCES venues(id) ON DELETE SET NULL,
    title            VARCHAR(255) NOT NULL,
    sport            sport_type NOT NULL,
    address          TEXT,
    match_date       DATE NOT NULL,
    match_time       TIME NOT NULL,
    skill_level      skill_level NOT NULL DEFAULT 'Intermediate',
    max_players      INTEGER NOT NULL DEFAULT 10,
    price_per_player INTEGER NOT NULL DEFAULT 0,
    status           match_status NOT NULL DEFAULT 'open',
    description      TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_matches_creator_id ON matches(creator_id);
CREATE INDEX idx_matches_booking_id ON matches(booking_id);
CREATE INDEX idx_matches_sport ON matches(sport);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_date ON matches(match_date);

CREATE TABLE match_participants (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id    UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (match_id, user_id)
);

CREATE INDEX idx_match_participants_match_id ON match_participants(match_id);
CREATE INDEX idx_match_participants_user_id ON match_participants(user_id);

-- ============================================================
-- TOURNAMENTS
-- ============================================================

CREATE TABLE tournaments (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organizer_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title              VARCHAR(255) NOT NULL,
    sport              sport_type NOT NULL,
    status             tournament_status NOT NULL DEFAULT 'upcoming',
    start_date         DATE NOT NULL,
    end_date           DATE NOT NULL,
    venue_name         VARCHAR(255),
    venue_address      TEXT,
    participants_limit INTEGER NOT NULL DEFAULT 16,
    registered_count   INTEGER NOT NULL DEFAULT 0,
    prize_pool         VARCHAR(100),
    entry_fee          INTEGER DEFAULT 0,
    image_url          TEXT,
    description        TEXT,
    rules              TEXT,
    bracket_data       JSONB,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tournaments_sport ON tournaments(sport);
CREATE INDEX idx_tournaments_status ON tournaments(status);

CREATE TABLE tournament_registrations (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id  UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    team_name      VARCHAR(100),
    registered_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (tournament_id, user_id)
);

CREATE INDEX idx_tournament_registrations_tournament ON tournament_registrations(tournament_id);

-- ============================================================
-- MESSAGING AND SOCIAL
-- ============================================================

CREATE TABLE conversations (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type        VARCHAR(20) NOT NULL DEFAULT 'direct',
    title       VARCHAR(255),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE conversation_members (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_read_at    TIMESTAMPTZ,
    UNIQUE (conversation_id, user_id)
);

CREATE INDEX idx_conversation_members_user ON conversation_members(user_id);

CREATE TABLE messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content         TEXT NOT NULL,
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

CREATE TABLE friend_requests (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status       friend_status NOT NULL DEFAULT 'pending',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    responded_at TIMESTAMPTZ,
    UNIQUE (sender_id, receiver_id)
);

CREATE INDEX idx_friend_requests_sender ON friend_requests(sender_id);
CREATE INDEX idx_friend_requests_receiver ON friend_requests(receiver_id);

-- ============================================================
-- REVIEWS, WALLET, NOTIFICATIONS, FAVORITES
-- ============================================================

CREATE TABLE reviews (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reviewer_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    venue_id     UUID REFERENCES venues(id) ON DELETE CASCADE,
    court_id     UUID REFERENCES courts(id) ON DELETE SET NULL,
    booking_id   UUID REFERENCES bookings(id) ON DELETE SET NULL,
    rating       INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment      TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_venue ON reviews(venue_id);
CREATE INDEX idx_reviews_reviewer ON reviews(reviewer_id);

CREATE TABLE wallet_transactions (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type           transaction_type NOT NULL,
    amount         INTEGER NOT NULL,
    balance_after  INTEGER NOT NULL,
    reference_id   UUID,
    description    TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_wallet_transactions_user ON wallet_transactions(user_id);
CREATE INDEX idx_wallet_transactions_type ON wallet_transactions(type);
CREATE INDEX idx_wallet_transactions_created ON wallet_transactions(created_at);

CREATE TABLE notifications (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type          notification_type NOT NULL DEFAULT 'system',
    title         VARCHAR(255) NOT NULL,
    body          TEXT NOT NULL,
    is_read       BOOLEAN NOT NULL DEFAULT FALSE,
    reference_id  UUID,
    event_key     VARCHAR(255) UNIQUE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

CREATE TABLE favorites (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    venue_id    UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, venue_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_venues_updated_at BEFORE UPDATE ON venues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_courts_updated_at BEFORE UPDATE ON courts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_matches_updated_at BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_tournaments_updated_at BEFORE UPDATE ON tournaments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- END OF SCHEMA
-- ============================================================
