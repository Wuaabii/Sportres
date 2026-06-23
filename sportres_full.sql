--
-- PostgreSQL database dump
--

\restrict Wl8SzQyvL0AzzUl5pqSE0vKE4dRsdT9pEWbzPP2aIojkeLhBt9DFmpdNquD6Wuh

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.wallet_transactions DROP CONSTRAINT IF EXISTS wallet_transactions_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.venues DROP CONSTRAINT IF EXISTS venues_owner_id_fkey;
ALTER TABLE IF EXISTS ONLY public.venue_requests DROP CONSTRAINT IF EXISTS venue_requests_owner_id_fkey;
ALTER TABLE IF EXISTS ONLY public.user_sport_skills DROP CONSTRAINT IF EXISTS user_sport_skills_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.tournaments DROP CONSTRAINT IF EXISTS tournaments_organizer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.tournament_registrations DROP CONSTRAINT IF EXISTS tournament_registrations_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.tournament_registrations DROP CONSTRAINT IF EXISTS tournament_registrations_tournament_id_fkey;
ALTER TABLE IF EXISTS ONLY public.time_slots DROP CONSTRAINT IF EXISTS time_slots_court_id_fkey;
ALTER TABLE IF EXISTS ONLY public.time_slots DROP CONSTRAINT IF EXISTS time_slots_booked_by_fkey;
ALTER TABLE IF EXISTS ONLY public.reviews DROP CONSTRAINT IF EXISTS reviews_venue_id_fkey;
ALTER TABLE IF EXISTS ONLY public.reviews DROP CONSTRAINT IF EXISTS reviews_reviewer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.reviews DROP CONSTRAINT IF EXISTS reviews_court_id_fkey;
ALTER TABLE IF EXISTS ONLY public.reviews DROP CONSTRAINT IF EXISTS reviews_booking_id_fkey;
ALTER TABLE IF EXISTS ONLY public.notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;
ALTER TABLE IF EXISTS ONLY public.messages DROP CONSTRAINT IF EXISTS messages_conversation_id_fkey;
ALTER TABLE IF EXISTS ONLY public.matches DROP CONSTRAINT IF EXISTS matches_venue_id_fkey;
ALTER TABLE IF EXISTS ONLY public.matches DROP CONSTRAINT IF EXISTS matches_creator_id_fkey;
ALTER TABLE IF EXISTS ONLY public.matches DROP CONSTRAINT IF EXISTS matches_court_id_fkey;
ALTER TABLE IF EXISTS ONLY public.matches DROP CONSTRAINT IF EXISTS matches_booking_id_fkey;
ALTER TABLE IF EXISTS ONLY public.match_participants DROP CONSTRAINT IF EXISTS match_participants_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.match_participants DROP CONSTRAINT IF EXISTS match_participants_match_id_fkey;
ALTER TABLE IF EXISTS ONLY public.friend_requests DROP CONSTRAINT IF EXISTS friend_requests_sender_id_fkey;
ALTER TABLE IF EXISTS ONLY public.friend_requests DROP CONSTRAINT IF EXISTS friend_requests_receiver_id_fkey;
ALTER TABLE IF EXISTS ONLY public.favorites DROP CONSTRAINT IF EXISTS favorites_venue_id_fkey;
ALTER TABLE IF EXISTS ONLY public.favorites DROP CONSTRAINT IF EXISTS favorites_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.courts DROP CONSTRAINT IF EXISTS courts_venue_id_fkey;
ALTER TABLE IF EXISTS ONLY public.court_schedules DROP CONSTRAINT IF EXISTS court_schedules_court_id_fkey;
ALTER TABLE IF EXISTS ONLY public.conversation_members DROP CONSTRAINT IF EXISTS conversation_members_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.conversation_members DROP CONSTRAINT IF EXISTS conversation_members_conversation_id_fkey;
ALTER TABLE IF EXISTS ONLY public.bookings DROP CONSTRAINT IF EXISTS bookings_venue_id_fkey;
ALTER TABLE IF EXISTS ONLY public.bookings DROP CONSTRAINT IF EXISTS bookings_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.bookings DROP CONSTRAINT IF EXISTS bookings_time_slot_id_fkey;
ALTER TABLE IF EXISTS ONLY public.bookings DROP CONSTRAINT IF EXISTS bookings_court_id_fkey;
ALTER TABLE IF EXISTS ONLY public.booking_extras DROP CONSTRAINT IF EXISTS booking_extras_booking_id_fkey;
DROP TRIGGER IF EXISTS trg_venues_updated_at ON public.venues;
DROP TRIGGER IF EXISTS trg_validate_booking_court_venue ON public.bookings;
DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS trg_user_profiles_updated_at ON public.user_profiles;
DROP TRIGGER IF EXISTS trg_tournaments_updated_at ON public.tournaments;
DROP TRIGGER IF EXISTS trg_matches_updated_at ON public.matches;
DROP TRIGGER IF EXISTS trg_courts_updated_at ON public.courts;
DROP TRIGGER IF EXISTS trg_conversations_updated_at ON public.conversations;
DROP TRIGGER IF EXISTS trg_bookings_updated_at ON public.bookings;
DROP INDEX IF EXISTS public.idx_wallet_transactions_user;
DROP INDEX IF EXISTS public.idx_wallet_transactions_type;
DROP INDEX IF EXISTS public.idx_wallet_transactions_created;
DROP INDEX IF EXISTS public.idx_venues_status;
DROP INDEX IF EXISTS public.idx_venues_owner_id;
DROP INDEX IF EXISTS public.idx_venues_coordinates;
DROP INDEX IF EXISTS public.idx_venues_city;
DROP INDEX IF EXISTS public.idx_venue_requests_status;
DROP INDEX IF EXISTS public.idx_venue_requests_owner_id;
DROP INDEX IF EXISTS public.idx_users_username;
DROP INDEX IF EXISTS public.idx_users_status;
DROP INDEX IF EXISTS public.idx_users_role;
DROP INDEX IF EXISTS public.idx_user_sport_skills_user_id;
DROP INDEX IF EXISTS public.idx_user_profiles_user_id;
DROP INDEX IF EXISTS public.idx_tournaments_status;
DROP INDEX IF EXISTS public.idx_tournaments_sport;
DROP INDEX IF EXISTS public.idx_tournament_registrations_tournament;
DROP INDEX IF EXISTS public.idx_time_slots_court_date;
DROP INDEX IF EXISTS public.idx_time_slots_booked;
DROP INDEX IF EXISTS public.idx_reviews_venue;
DROP INDEX IF EXISTS public.idx_reviews_reviewer;
DROP INDEX IF EXISTS public.idx_notifications_user;
DROP INDEX IF EXISTS public.idx_notifications_read;
DROP INDEX IF EXISTS public.idx_messages_sender;
DROP INDEX IF EXISTS public.idx_messages_created_at;
DROP INDEX IF EXISTS public.idx_messages_conversation;
DROP INDEX IF EXISTS public.idx_matches_status;
DROP INDEX IF EXISTS public.idx_matches_sport;
DROP INDEX IF EXISTS public.idx_matches_date;
DROP INDEX IF EXISTS public.idx_matches_creator_id;
DROP INDEX IF EXISTS public.idx_matches_booking_id;
DROP INDEX IF EXISTS public.idx_match_participants_user_id;
DROP INDEX IF EXISTS public.idx_match_participants_match_id;
DROP INDEX IF EXISTS public.idx_friend_requests_sender;
DROP INDEX IF EXISTS public.idx_friend_requests_receiver;
DROP INDEX IF EXISTS public.idx_favorites_user;
DROP INDEX IF EXISTS public.idx_courts_venue_id;
DROP INDEX IF EXISTS public.idx_courts_status;
DROP INDEX IF EXISTS public.idx_courts_sport;
DROP INDEX IF EXISTS public.idx_conversation_members_user;
DROP INDEX IF EXISTS public.idx_bookings_venue_id;
DROP INDEX IF EXISTS public.idx_bookings_user_id;
DROP INDEX IF EXISTS public.idx_bookings_status;
DROP INDEX IF EXISTS public.idx_bookings_payment_status;
DROP INDEX IF EXISTS public.idx_bookings_date;
DROP INDEX IF EXISTS public.idx_bookings_court_id;
DROP INDEX IF EXISTS public.idx_bookings_booking_code;
DROP INDEX IF EXISTS public.idx_booking_extras_booking_id;
ALTER TABLE IF EXISTS ONLY public.wallet_transactions DROP CONSTRAINT IF EXISTS wallet_transactions_pkey;
ALTER TABLE IF EXISTS ONLY public.venues DROP CONSTRAINT IF EXISTS venues_pkey;
ALTER TABLE IF EXISTS ONLY public.venue_requests DROP CONSTRAINT IF EXISTS venue_requests_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_phone_key;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE IF EXISTS ONLY public.user_sport_skills DROP CONSTRAINT IF EXISTS user_sport_skills_user_id_sport_key;
ALTER TABLE IF EXISTS ONLY public.user_sport_skills DROP CONSTRAINT IF EXISTS user_sport_skills_pkey;
ALTER TABLE IF EXISTS ONLY public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_user_id_key;
ALTER TABLE IF EXISTS ONLY public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_pkey;
ALTER TABLE IF EXISTS ONLY public.tournaments DROP CONSTRAINT IF EXISTS tournaments_pkey;
ALTER TABLE IF EXISTS ONLY public.tournament_registrations DROP CONSTRAINT IF EXISTS tournament_registrations_tournament_id_user_id_key;
ALTER TABLE IF EXISTS ONLY public.tournament_registrations DROP CONSTRAINT IF EXISTS tournament_registrations_pkey;
ALTER TABLE IF EXISTS ONLY public.time_slots DROP CONSTRAINT IF EXISTS time_slots_pkey;
ALTER TABLE IF EXISTS ONLY public.time_slots DROP CONSTRAINT IF EXISTS time_slots_court_id_date_start_time_end_time_key;
ALTER TABLE IF EXISTS ONLY public.reviews DROP CONSTRAINT IF EXISTS reviews_pkey;
ALTER TABLE IF EXISTS ONLY public.notifications DROP CONSTRAINT IF EXISTS notifications_pkey;
ALTER TABLE IF EXISTS ONLY public.messages DROP CONSTRAINT IF EXISTS messages_pkey;
ALTER TABLE IF EXISTS ONLY public.matches DROP CONSTRAINT IF EXISTS matches_pkey;
ALTER TABLE IF EXISTS ONLY public.match_participants DROP CONSTRAINT IF EXISTS match_participants_pkey;
ALTER TABLE IF EXISTS ONLY public.match_participants DROP CONSTRAINT IF EXISTS match_participants_match_id_user_id_key;
ALTER TABLE IF EXISTS ONLY public.friend_requests DROP CONSTRAINT IF EXISTS friend_requests_sender_id_receiver_id_key;
ALTER TABLE IF EXISTS ONLY public.friend_requests DROP CONSTRAINT IF EXISTS friend_requests_pkey;
ALTER TABLE IF EXISTS ONLY public.favorites DROP CONSTRAINT IF EXISTS favorites_user_id_venue_id_key;
ALTER TABLE IF EXISTS ONLY public.favorites DROP CONSTRAINT IF EXISTS favorites_pkey;
ALTER TABLE IF EXISTS ONLY public.courts DROP CONSTRAINT IF EXISTS courts_pkey;
ALTER TABLE IF EXISTS ONLY public.court_schedules DROP CONSTRAINT IF EXISTS court_schedules_pkey;
ALTER TABLE IF EXISTS ONLY public.court_schedules DROP CONSTRAINT IF EXISTS court_schedules_court_id_date_key;
ALTER TABLE IF EXISTS ONLY public.conversations DROP CONSTRAINT IF EXISTS conversations_pkey;
ALTER TABLE IF EXISTS ONLY public.conversation_members DROP CONSTRAINT IF EXISTS conversation_members_pkey;
ALTER TABLE IF EXISTS ONLY public.conversation_members DROP CONSTRAINT IF EXISTS conversation_members_conversation_id_user_id_key;
ALTER TABLE IF EXISTS ONLY public.bookings DROP CONSTRAINT IF EXISTS bookings_qr_code_key;
ALTER TABLE IF EXISTS ONLY public.bookings DROP CONSTRAINT IF EXISTS bookings_pkey;
ALTER TABLE IF EXISTS ONLY public.booking_extras DROP CONSTRAINT IF EXISTS booking_extras_pkey;
DROP TABLE IF EXISTS public.wallet_transactions;
DROP TABLE IF EXISTS public.venues;
DROP TABLE IF EXISTS public.venue_requests;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.user_sport_skills;
DROP TABLE IF EXISTS public.user_profiles;
DROP TABLE IF EXISTS public.tournaments;
DROP TABLE IF EXISTS public.tournament_registrations;
DROP TABLE IF EXISTS public.time_slots;
DROP TABLE IF EXISTS public.reviews;
DROP TABLE IF EXISTS public.notifications;
DROP TABLE IF EXISTS public.messages;
DROP TABLE IF EXISTS public.matches;
DROP TABLE IF EXISTS public.match_participants;
DROP TABLE IF EXISTS public.friend_requests;
DROP TABLE IF EXISTS public.favorites;
DROP TABLE IF EXISTS public.courts;
DROP TABLE IF EXISTS public.court_schedules;
DROP TABLE IF EXISTS public.conversations;
DROP TABLE IF EXISTS public.conversation_members;
DROP TABLE IF EXISTS public.bookings;
DROP TABLE IF EXISTS public.booking_extras;
DROP FUNCTION IF EXISTS public.validate_booking_court_venue();
DROP FUNCTION IF EXISTS public.update_updated_at_column();
DROP TYPE IF EXISTS public.venue_status;
DROP TYPE IF EXISTS public.user_status;
DROP TYPE IF EXISTS public.user_role;
DROP TYPE IF EXISTS public.transaction_type;
DROP TYPE IF EXISTS public.tournament_status;
DROP TYPE IF EXISTS public.tier_type;
DROP TYPE IF EXISTS public.sport_type;
DROP TYPE IF EXISTS public.skill_level;
DROP TYPE IF EXISTS public.notification_type;
DROP TYPE IF EXISTS public.match_status;
DROP TYPE IF EXISTS public.gender_type;
DROP TYPE IF EXISTS public.friend_status;
DROP TYPE IF EXISTS public.court_status;
DROP TYPE IF EXISTS public.booking_status;
DROP EXTENSION IF EXISTS pgcrypto;
--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: booking_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.booking_status AS ENUM (
    'pending',
    'confirmed',
    'rejected',
    'cancelled',
    'completed',
    'pending_payment_verification',
    'payment_rejected'
);


--
-- Name: court_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.court_status AS ENUM (
    'open',
    'closed',
    'maintenance'
);


--
-- Name: friend_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.friend_status AS ENUM (
    'pending',
    'accepted',
    'rejected'
);


--
-- Name: gender_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.gender_type AS ENUM (
    'Nam',
    'Nữ',
    'Khác'
);


--
-- Name: match_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.match_status AS ENUM (
    'open',
    'full',
    'in_progress',
    'finished',
    'cancelled'
);


--
-- Name: notification_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.notification_type AS ENUM (
    'booking',
    'match',
    'tournament',
    'message',
    'system',
    'promotion'
);


--
-- Name: skill_level; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.skill_level AS ENUM (
    'Beginner',
    'Intermediate',
    'Advanced',
    'Pro'
);


--
-- Name: sport_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.sport_type AS ENUM (
    'soccer',
    'badminton',
    'tennis',
    'basketball',
    'pickleball',
    'volleyball',
    'golf'
);


--
-- Name: tier_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.tier_type AS ENUM (
    'Đồng',
    'Bạc',
    'Vàng',
    'Kim cương'
);


--
-- Name: tournament_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.tournament_status AS ENUM (
    'upcoming',
    'ongoing',
    'finished',
    'cancelled'
);


--
-- Name: transaction_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.transaction_type AS ENUM (
    'deposit',
    'withdrawal',
    'booking_payment',
    'booking_refund',
    'match_payment',
    'match_refund',
    'reward'
);


--
-- Name: user_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_role AS ENUM (
    'player',
    'venue_owner',
    'staff',
    'admin'
);


--
-- Name: user_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_status AS ENUM (
    'active',
    'inactive',
    'banned',
    'pending'
);


--
-- Name: venue_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.venue_status AS ENUM (
    'active',
    'pending_approval',
    'maintenance',
    'closed'
);


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


--
-- Name: validate_booking_court_venue(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.validate_booking_court_venue() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: booking_extras; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.booking_extras (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    booking_id uuid NOT NULL,
    item_name character varying(100) NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    unit_price integer NOT NULL,
    total_price integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: bookings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bookings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    court_id uuid NOT NULL,
    venue_id uuid NOT NULL,
    time_slot_id uuid NOT NULL,
    date date NOT NULL,
    time_range character varying(50) NOT NULL,
    total_price integer NOT NULL,
    status public.booking_status DEFAULT 'pending'::public.booking_status NOT NULL,
    qr_code character varying(100),
    notes text,
    cancelled_at timestamp with time zone,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    payment_status character varying(40) DEFAULT 'pending_transfer'::character varying,
    booking_code character varying(50) NOT NULL,
    transfer_content character varying(60) NOT NULL,
    CONSTRAINT bookings_transfer_content_matches_code CHECK (((transfer_content)::text = (booking_code)::text))
);


--
-- Name: conversation_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversation_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    conversation_id uuid NOT NULL,
    user_id uuid NOT NULL,
    joined_at timestamp with time zone DEFAULT now() NOT NULL,
    last_read_at timestamp with time zone
);


--
-- Name: conversations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type character varying(20) DEFAULT 'direct'::character varying NOT NULL,
    title character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: court_schedules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.court_schedules (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    court_id uuid NOT NULL,
    date date NOT NULL,
    opening_time time without time zone DEFAULT '06:00:00'::time without time zone NOT NULL,
    closing_time time without time zone DEFAULT '22:00:00'::time without time zone NOT NULL,
    slot_duration integer DEFAULT 60 NOT NULL,
    status public.court_status DEFAULT 'open'::public.court_status NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT court_schedules_slot_duration_check CHECK ((slot_duration = ANY (ARRAY[30, 60, 90, 120])))
);


--
-- Name: courts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.courts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    venue_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    sport public.sport_type NOT NULL,
    status public.court_status DEFAULT 'open'::public.court_status NOT NULL,
    price_min integer DEFAULT 0 NOT NULL,
    price_peak integer DEFAULT 0 NOT NULL,
    capacity integer,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: favorites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.favorites (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    venue_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: friend_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.friend_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    sender_id uuid NOT NULL,
    receiver_id uuid NOT NULL,
    status public.friend_status DEFAULT 'pending'::public.friend_status NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    responded_at timestamp with time zone
);


--
-- Name: match_participants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.match_participants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    match_id uuid NOT NULL,
    user_id uuid NOT NULL,
    joined_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: matches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.matches (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    creator_id uuid NOT NULL,
    court_id uuid,
    venue_id uuid,
    title character varying(255) NOT NULL,
    sport public.sport_type NOT NULL,
    address text,
    match_date date NOT NULL,
    match_time time without time zone NOT NULL,
    skill_level public.skill_level DEFAULT 'Intermediate'::public.skill_level NOT NULL,
    max_players integer DEFAULT 10 NOT NULL,
    price_per_player integer DEFAULT 0 NOT NULL,
    status public.match_status DEFAULT 'open'::public.match_status NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    booking_id uuid
);


--
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    conversation_id uuid NOT NULL,
    sender_id uuid NOT NULL,
    content text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    type public.notification_type DEFAULT 'system'::public.notification_type NOT NULL,
    title character varying(255) NOT NULL,
    body text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    reference_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    reviewer_id uuid NOT NULL,
    venue_id uuid,
    court_id uuid,
    booking_id uuid,
    rating integer NOT NULL,
    comment text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


--
-- Name: time_slots; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.time_slots (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    court_id uuid NOT NULL,
    date date NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    price integer NOT NULL,
    is_peak boolean DEFAULT false NOT NULL,
    is_booked boolean DEFAULT false NOT NULL,
    booked_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    is_blocked boolean DEFAULT false NOT NULL,
    is_maintenance boolean DEFAULT false NOT NULL
);


--
-- Name: tournament_registrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tournament_registrations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tournament_id uuid NOT NULL,
    user_id uuid NOT NULL,
    team_name character varying(100),
    registered_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: tournaments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tournaments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organizer_id uuid NOT NULL,
    title character varying(255) NOT NULL,
    sport public.sport_type NOT NULL,
    status public.tournament_status DEFAULT 'upcoming'::public.tournament_status NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    venue_name character varying(255),
    venue_address text,
    participants_limit integer DEFAULT 16 NOT NULL,
    registered_count integer DEFAULT 0 NOT NULL,
    prize_pool character varying(100),
    entry_fee integer DEFAULT 0,
    image_url text,
    description text,
    rules text,
    bracket_data jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    display_name character varying(100) NOT NULL,
    avatar_url text,
    gender public.gender_type,
    active_area character varying(255),
    bio text,
    wallet_balance integer DEFAULT 0 NOT NULL,
    points integer DEFAULT 0 NOT NULL,
    tier public.tier_type DEFAULT 'Đồng'::public.tier_type NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    profile_completed boolean DEFAULT false NOT NULL
);


--
-- Name: user_sport_skills; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_sport_skills (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    sport public.sport_type NOT NULL,
    skill public.skill_level DEFAULT 'Beginner'::public.skill_level NOT NULL,
    is_favorite boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(255),
    phone character varying(20) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role public.user_role DEFAULT 'player'::public.user_role NOT NULL,
    status public.user_status DEFAULT 'active'::public.user_status NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_login_at timestamp with time zone,
    full_name character varying(100) NOT NULL
);


--
-- Name: venue_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.venue_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    owner_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    address text NOT NULL,
    district character varying(100),
    sport public.sport_type NOT NULL,
    price_per_hour integer DEFAULT 0 NOT NULL,
    opening_hour time without time zone DEFAULT '05:00:00'::time without time zone NOT NULL,
    closing_hour time without time zone DEFAULT '22:00:00'::time without time zone NOT NULL,
    closed_days character varying(255) DEFAULT 'Không'::character varying NOT NULL,
    description text,
    image_url text,
    status public.venue_status DEFAULT 'pending_approval'::public.venue_status NOT NULL,
    rejection_reason text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    reviewed_at timestamp with time zone
);


--
-- Name: venues; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.venues (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    owner_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    address text NOT NULL,
    district character varying(100),
    city character varying(100) DEFAULT 'Hà Nội'::character varying NOT NULL,
    description text,
    image_url text,
    latitude numeric(10,7),
    longitude numeric(10,7),
    rating numeric(2,1) DEFAULT 0.0 NOT NULL,
    reviews_count integer DEFAULT 0 NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    amenities text[],
    opening_hour time without time zone DEFAULT '05:00:00'::time without time zone NOT NULL,
    closing_hour time without time zone DEFAULT '22:00:00'::time without time zone NOT NULL,
    phone character varying(20),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    internal_note text
);


--
-- Name: wallet_transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.wallet_transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    type public.transaction_type NOT NULL,
    amount integer NOT NULL,
    balance_after integer NOT NULL,
    reference_id uuid,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Data for Name: booking_extras; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.booking_extras (id, booking_id, item_name, quantity, unit_price, total_price, created_at) FROM stdin;
\.


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.bookings (id, user_id, court_id, venue_id, time_slot_id, date, time_range, total_price, status, qr_code, notes, cancelled_at, completed_at, created_at, updated_at, payment_status, booking_code, transfer_content) FROM stdin;
\.


--
-- Data for Name: conversation_members; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.conversation_members (id, conversation_id, user_id, joined_at, last_read_at) FROM stdin;
\.


--
-- Data for Name: conversations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.conversations (id, type, title, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: court_schedules; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.court_schedules (id, court_id, date, opening_time, closing_time, slot_duration, status, created_at, updated_at) FROM stdin;
5b128176-fc51-45da-8bb3-2c86f9d2dda3	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-22	06:00:00	22:00:00	60	open	2026-06-22 21:27:44.290931+07	2026-06-22 21:27:44.290931+07
f012d0b2-b04f-43da-9608-12ba3fce0400	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-23	06:00:00	22:00:00	60	open	2026-06-22 21:27:44.337823+07	2026-06-22 21:27:44.337823+07
6482b0af-3951-436d-a2c9-24c157ae22cf	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-24	06:00:00	22:00:00	60	open	2026-06-22 21:27:44.344582+07	2026-06-22 21:27:44.344582+07
35677156-02f0-44d0-81c7-e1feb077f579	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-25	06:00:00	22:00:00	60	open	2026-06-22 21:27:44.349312+07	2026-06-22 21:27:44.349312+07
9cb9ff82-9954-4f48-8f4d-4b42b326080c	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-26	06:00:00	22:00:00	60	open	2026-06-22 21:27:44.353683+07	2026-06-22 21:27:44.353683+07
b87b2cd5-6226-4422-83fe-18bb977eafea	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-27	06:00:00	22:00:00	60	open	2026-06-22 21:27:44.359986+07	2026-06-22 21:27:44.359986+07
38d5398f-0d87-41c6-9899-3f819f80b858	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-28	06:00:00	22:00:00	60	open	2026-06-22 21:27:44.365208+07	2026-06-22 21:27:44.365208+07
7eb883ee-edab-4994-af09-48f2f39c1d70	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-29	06:00:00	22:00:00	60	open	2026-06-22 21:27:44.369102+07	2026-06-22 21:27:44.369102+07
85b7287a-c8e0-42bc-be97-5e02781041c8	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-30	06:00:00	22:00:00	60	open	2026-06-22 21:27:44.375076+07	2026-06-22 21:27:44.375076+07
8b209188-e121-458f-9b3e-73f4f2a00046	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-01	06:00:00	22:00:00	60	open	2026-06-22 21:27:44.380611+07	2026-06-22 21:27:44.380611+07
629eb82b-9100-4031-98cb-5a735c4b4309	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-02	06:00:00	22:00:00	60	open	2026-06-22 21:27:44.387667+07	2026-06-22 21:27:44.387667+07
4fd70f13-9abc-40f5-bcb6-123a011435a3	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-03	06:00:00	22:00:00	60	open	2026-06-22 21:27:44.3931+07	2026-06-22 21:27:44.3931+07
a5ba7b7a-26f9-46b7-afc0-9d0907e84cb9	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-04	06:00:00	22:00:00	60	open	2026-06-22 21:27:44.397511+07	2026-06-22 21:27:44.397511+07
6a9af3ad-ca7a-4edc-a8ea-64cbfec1fc96	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-05	06:00:00	22:00:00	60	open	2026-06-22 21:27:44.402141+07	2026-06-22 21:27:44.402141+07
c88cea43-9216-4986-a54d-09591b4a24fe	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-06	06:00:00	22:00:00	60	open	2026-06-23 07:21:43.193157+07	2026-06-23 07:21:43.193157+07
3bf400bb-3910-4dc8-b17e-a85f9e62d1c7	a4933c12-7bec-407c-a04a-690297489580	2026-06-23	06:00:00	22:00:00	60	open	2026-06-23 07:23:45.727789+07	2026-06-23 07:23:52.224+07
69315d4b-e836-47f6-865a-dc243c169f2f	a4933c12-7bec-407c-a04a-690297489580	2026-06-24	06:00:00	22:00:00	60	open	2026-06-23 07:36:04.709923+07	2026-06-23 07:36:04.709923+07
6d410aef-df52-4f9c-9dc8-610241dd7f93	a4933c12-7bec-407c-a04a-690297489580	2026-06-25	06:00:00	22:00:00	60	open	2026-06-23 07:36:04.75286+07	2026-06-23 07:36:04.75286+07
5741791f-acf2-4af9-ace4-4e52ac9963d6	a4933c12-7bec-407c-a04a-690297489580	2026-06-26	06:00:00	22:00:00	60	open	2026-06-23 07:36:04.762431+07	2026-06-23 07:36:04.762431+07
07fc450d-3c48-4242-96a8-ec5671370590	a4933c12-7bec-407c-a04a-690297489580	2026-06-27	06:00:00	22:00:00	60	open	2026-06-23 07:36:04.780475+07	2026-06-23 07:36:04.780475+07
5411d398-f1c7-4fb6-9c81-50fbb6f72513	a4933c12-7bec-407c-a04a-690297489580	2026-06-28	06:00:00	22:00:00	60	open	2026-06-23 07:36:04.786304+07	2026-06-23 07:36:04.786304+07
09dfd73c-5e3b-48ed-9063-9b0b5f48e083	a4933c12-7bec-407c-a04a-690297489580	2026-06-29	06:00:00	22:00:00	60	open	2026-06-23 07:36:04.794368+07	2026-06-23 07:36:04.794368+07
08c28474-3336-417d-b665-a613656fbbf0	a4933c12-7bec-407c-a04a-690297489580	2026-06-30	06:00:00	22:00:00	60	open	2026-06-23 07:36:04.799401+07	2026-06-23 07:36:04.799401+07
c37d1221-17c5-406d-afdc-6eb1a96016ef	a4933c12-7bec-407c-a04a-690297489580	2026-07-01	06:00:00	22:00:00	60	open	2026-06-23 07:36:04.805379+07	2026-06-23 07:36:04.805379+07
fb5418ea-3d95-475c-a3e0-1592cdf2ddc8	a4933c12-7bec-407c-a04a-690297489580	2026-07-02	06:00:00	22:00:00	60	open	2026-06-23 07:36:04.811115+07	2026-06-23 07:36:04.811115+07
f22ad3c4-551d-4267-879f-8d7987c9096e	a4933c12-7bec-407c-a04a-690297489580	2026-07-03	06:00:00	22:00:00	60	open	2026-06-23 07:36:04.815653+07	2026-06-23 07:36:04.815653+07
6caad963-f74d-4f37-bc9a-8522ca6c6486	a4933c12-7bec-407c-a04a-690297489580	2026-07-04	06:00:00	22:00:00	60	open	2026-06-23 07:36:04.820027+07	2026-06-23 07:36:04.820027+07
d456d580-91f3-4c81-b4e4-fa042b3ba75f	a4933c12-7bec-407c-a04a-690297489580	2026-07-05	06:00:00	22:00:00	60	open	2026-06-23 07:36:04.826066+07	2026-06-23 07:36:04.826066+07
ed2f7bfc-acaf-429a-9733-9338da96ea38	a4933c12-7bec-407c-a04a-690297489580	2026-07-06	06:00:00	22:00:00	60	open	2026-06-23 07:36:04.831545+07	2026-06-23 07:36:04.831545+07
\.


--
-- Data for Name: courts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.courts (id, venue_id, name, sport, status, price_min, price_peak, capacity, description, created_at, updated_at) FROM stdin;
1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	5311f3aa-013c-41e5-ab9b-612c3449919f	Queen Bee Sports - Sân 1	badminton	open	120000	120000	\N	\N	2026-06-22 21:27:44.076404+07	2026-06-23 07:23:14.523415+07
a4933c12-7bec-407c-a04a-690297489580	5311f3aa-013c-41e5-ab9b-612c3449919f	Queen Bee Sports - Sân 2	badminton	open	120000	120000	\N	\N	2026-06-23 07:23:42.172911+07	2026-06-23 07:23:52.224+07
\.


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.favorites (id, user_id, venue_id, created_at) FROM stdin;
\.


--
-- Data for Name: friend_requests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.friend_requests (id, sender_id, receiver_id, status, created_at, responded_at) FROM stdin;
\.


--
-- Data for Name: match_participants; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.match_participants (id, match_id, user_id, joined_at) FROM stdin;
\.


--
-- Data for Name: matches; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.matches (id, creator_id, court_id, venue_id, title, sport, address, match_date, match_time, skill_level, max_players, price_per_player, status, description, created_at, updated_at, booking_id) FROM stdin;
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.messages (id, conversation_id, sender_id, content, is_read, created_at) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notifications (id, user_id, type, title, body, is_read, reference_id, created_at) FROM stdin;
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reviews (id, reviewer_id, venue_id, court_id, booking_id, rating, comment, created_at) FROM stdin;
\.


--
-- Data for Name: time_slots; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.time_slots (id, court_id, date, start_time, end_time, price, is_peak, is_booked, booked_by, created_at, is_blocked, is_maintenance) FROM stdin;
7b97c92c-e8f7-42d7-9a09-76ce08e31f78	a4933c12-7bec-407c-a04a-690297489580	2026-06-23	06:00:00	07:00:00	120000	f	f	\N	2026-06-23 07:23:52.224+07	f	f
b7829eb2-af7d-4b3c-9351-78a49a95cfb5	a4933c12-7bec-407c-a04a-690297489580	2026-06-23	07:00:00	08:00:00	120000	f	f	\N	2026-06-23 07:23:52.224+07	f	f
483cb4c6-357a-4358-825b-3ad8134aa093	a4933c12-7bec-407c-a04a-690297489580	2026-06-23	08:00:00	09:00:00	120000	f	f	\N	2026-06-23 07:23:52.224+07	f	f
e063f7f9-c449-4ce7-94bb-d251c60281a9	a4933c12-7bec-407c-a04a-690297489580	2026-06-23	09:00:00	10:00:00	120000	f	f	\N	2026-06-23 07:23:52.224+07	f	f
305f55a8-e37d-4b8f-992e-0fd4cb4ee0e4	a4933c12-7bec-407c-a04a-690297489580	2026-06-23	10:00:00	11:00:00	120000	f	f	\N	2026-06-23 07:23:52.224+07	f	f
ea2adc47-2391-4d89-b244-e7527fa6689a	a4933c12-7bec-407c-a04a-690297489580	2026-06-23	11:00:00	12:00:00	120000	f	f	\N	2026-06-23 07:23:52.224+07	f	f
0d04fbad-4f07-4b9d-b42d-1b6cd3621e25	a4933c12-7bec-407c-a04a-690297489580	2026-06-23	12:00:00	13:00:00	120000	f	f	\N	2026-06-23 07:23:52.224+07	f	f
f8a2657d-7106-43fb-9ccd-93f6b469db5d	a4933c12-7bec-407c-a04a-690297489580	2026-06-23	13:00:00	14:00:00	120000	f	f	\N	2026-06-23 07:23:52.224+07	f	f
84b0ad25-a612-4852-9c44-1f10db7c551c	a4933c12-7bec-407c-a04a-690297489580	2026-06-23	14:00:00	15:00:00	120000	f	f	\N	2026-06-23 07:23:52.224+07	f	f
e43b5081-6f43-4b3c-9d9b-1075cab36d9b	a4933c12-7bec-407c-a04a-690297489580	2026-06-23	15:00:00	16:00:00	120000	f	f	\N	2026-06-23 07:23:52.224+07	f	f
3e1b9c96-e22f-4d11-8e95-2acbb0398802	a4933c12-7bec-407c-a04a-690297489580	2026-06-23	16:00:00	17:00:00	120000	t	f	\N	2026-06-23 07:23:52.224+07	f	f
7d1e6b04-a73e-4e0e-8e50-97f0c71b88e3	a4933c12-7bec-407c-a04a-690297489580	2026-06-23	17:00:00	18:00:00	120000	t	f	\N	2026-06-23 07:23:52.224+07	f	f
1616b95e-c0ac-4862-8406-893a8b6772ce	a4933c12-7bec-407c-a04a-690297489580	2026-06-23	18:00:00	19:00:00	120000	t	f	\N	2026-06-23 07:23:52.224+07	f	f
b4caa01f-72f3-43ab-950b-f5ef5d76628f	a4933c12-7bec-407c-a04a-690297489580	2026-06-23	19:00:00	20:00:00	120000	t	f	\N	2026-06-23 07:23:52.224+07	f	f
a3183d41-22d8-472b-92f0-6c2ebcbe7259	a4933c12-7bec-407c-a04a-690297489580	2026-06-23	20:00:00	21:00:00	120000	t	f	\N	2026-06-23 07:23:52.224+07	f	f
94e83d10-75ab-4ad4-9050-3aca43ed392f	a4933c12-7bec-407c-a04a-690297489580	2026-06-23	21:00:00	22:00:00	120000	f	f	\N	2026-06-23 07:23:52.224+07	f	f
03e3c928-fd3c-45c5-a008-aabaaf065ff3	a4933c12-7bec-407c-a04a-690297489580	2026-06-24	06:00:00	07:00:00	120000	f	f	\N	2026-06-23 07:36:04.727196+07	f	f
e97dc4a3-cc1e-4603-80c5-65116249d77d	a4933c12-7bec-407c-a04a-690297489580	2026-06-24	07:00:00	08:00:00	120000	f	f	\N	2026-06-23 07:36:04.727196+07	f	f
1ff4f807-6594-4414-9f58-8d3ce49833c1	a4933c12-7bec-407c-a04a-690297489580	2026-06-24	08:00:00	09:00:00	120000	f	f	\N	2026-06-23 07:36:04.727196+07	f	f
8663fb7f-96ee-4207-8929-348d1f814782	a4933c12-7bec-407c-a04a-690297489580	2026-06-24	09:00:00	10:00:00	120000	f	f	\N	2026-06-23 07:36:04.727196+07	f	f
8ec9ed95-68f2-4fdc-8a12-be4464752ac2	a4933c12-7bec-407c-a04a-690297489580	2026-06-24	10:00:00	11:00:00	120000	f	f	\N	2026-06-23 07:36:04.727196+07	f	f
4352ba8b-891a-4fcb-a565-990ca36a2d14	a4933c12-7bec-407c-a04a-690297489580	2026-06-24	11:00:00	12:00:00	120000	f	f	\N	2026-06-23 07:36:04.727196+07	f	f
9bd8eca8-7a7f-4bb6-9f10-fdcdaa0cf254	a4933c12-7bec-407c-a04a-690297489580	2026-06-24	12:00:00	13:00:00	120000	f	f	\N	2026-06-23 07:36:04.727196+07	f	f
c779aa13-00ce-425d-9fb1-55b698136b78	a4933c12-7bec-407c-a04a-690297489580	2026-06-24	13:00:00	14:00:00	120000	f	f	\N	2026-06-23 07:36:04.727196+07	f	f
27bbb58e-8394-43cc-8ecc-1e96555c5580	a4933c12-7bec-407c-a04a-690297489580	2026-06-24	14:00:00	15:00:00	120000	f	f	\N	2026-06-23 07:36:04.727196+07	f	f
110b8999-70d7-4618-9242-b08c4e537834	a4933c12-7bec-407c-a04a-690297489580	2026-06-24	15:00:00	16:00:00	120000	f	f	\N	2026-06-23 07:36:04.727196+07	f	f
190b3e0e-b583-4033-8af6-63d88a4157d9	a4933c12-7bec-407c-a04a-690297489580	2026-06-24	16:00:00	17:00:00	120000	t	f	\N	2026-06-23 07:36:04.727196+07	f	f
cac97500-d373-465e-9ab4-2105519acdbe	a4933c12-7bec-407c-a04a-690297489580	2026-06-24	17:00:00	18:00:00	120000	t	f	\N	2026-06-23 07:36:04.727196+07	f	f
be984408-46af-4ea4-8cdf-966c5b0b66c2	a4933c12-7bec-407c-a04a-690297489580	2026-06-24	18:00:00	19:00:00	120000	t	f	\N	2026-06-23 07:36:04.727196+07	f	f
63ed740d-9eb1-4c79-a0d2-56aec892e76b	a4933c12-7bec-407c-a04a-690297489580	2026-06-24	19:00:00	20:00:00	120000	t	f	\N	2026-06-23 07:36:04.727196+07	f	f
d55b6fc4-ed5e-4a60-8c1e-c530cc724621	a4933c12-7bec-407c-a04a-690297489580	2026-06-24	20:00:00	21:00:00	120000	t	f	\N	2026-06-23 07:36:04.727196+07	f	f
4a60682b-0ff4-44dd-b294-fd63550dcf5b	a4933c12-7bec-407c-a04a-690297489580	2026-06-24	21:00:00	22:00:00	120000	f	f	\N	2026-06-23 07:36:04.727196+07	f	f
8c5051cb-b229-49cd-ae3c-d28640f5be71	a4933c12-7bec-407c-a04a-690297489580	2026-06-25	06:00:00	07:00:00	120000	f	f	\N	2026-06-23 07:36:04.75665+07	f	f
e3f21b0b-a1c3-462e-b6b4-7cc45db32634	a4933c12-7bec-407c-a04a-690297489580	2026-06-25	07:00:00	08:00:00	120000	f	f	\N	2026-06-23 07:36:04.75665+07	f	f
a563d8b5-7984-4903-a27b-6f4990d31272	a4933c12-7bec-407c-a04a-690297489580	2026-06-25	08:00:00	09:00:00	120000	f	f	\N	2026-06-23 07:36:04.75665+07	f	f
778e18bc-f5eb-4bfd-be80-afd8ccdac0fd	a4933c12-7bec-407c-a04a-690297489580	2026-06-25	09:00:00	10:00:00	120000	f	f	\N	2026-06-23 07:36:04.75665+07	f	f
43abca75-8f30-4ae5-9f79-cbe24d1054e8	a4933c12-7bec-407c-a04a-690297489580	2026-06-25	10:00:00	11:00:00	120000	f	f	\N	2026-06-23 07:36:04.75665+07	f	f
0906394e-0912-4fb3-ac92-cc0b5b2c1240	a4933c12-7bec-407c-a04a-690297489580	2026-06-25	11:00:00	12:00:00	120000	f	f	\N	2026-06-23 07:36:04.75665+07	f	f
a36d3512-90af-49b9-aac9-66490f0ff951	a4933c12-7bec-407c-a04a-690297489580	2026-06-25	12:00:00	13:00:00	120000	f	f	\N	2026-06-23 07:36:04.75665+07	f	f
23c9c75d-6d51-4a21-a6d5-c1ec36c34f6e	a4933c12-7bec-407c-a04a-690297489580	2026-06-25	13:00:00	14:00:00	120000	f	f	\N	2026-06-23 07:36:04.75665+07	f	f
951d031c-51a0-42cd-911f-918888d54bcd	a4933c12-7bec-407c-a04a-690297489580	2026-06-25	14:00:00	15:00:00	120000	f	f	\N	2026-06-23 07:36:04.75665+07	f	f
62697e05-5b6f-40e8-a030-e5354887d2e3	a4933c12-7bec-407c-a04a-690297489580	2026-06-25	15:00:00	16:00:00	120000	f	f	\N	2026-06-23 07:36:04.75665+07	f	f
2f3eceb8-52e0-430e-a295-2f78e1c6486c	a4933c12-7bec-407c-a04a-690297489580	2026-06-25	16:00:00	17:00:00	120000	t	f	\N	2026-06-23 07:36:04.75665+07	f	f
d7d22b51-9bea-4bc5-818c-ce7be9a22f82	a4933c12-7bec-407c-a04a-690297489580	2026-06-25	17:00:00	18:00:00	120000	t	f	\N	2026-06-23 07:36:04.75665+07	f	f
c1881eeb-917b-4316-98a5-7adc99139975	a4933c12-7bec-407c-a04a-690297489580	2026-06-25	18:00:00	19:00:00	120000	t	f	\N	2026-06-23 07:36:04.75665+07	f	f
971d7de4-9e36-4e9e-8c02-0e89be741b5c	a4933c12-7bec-407c-a04a-690297489580	2026-06-25	19:00:00	20:00:00	120000	t	f	\N	2026-06-23 07:36:04.75665+07	f	f
9dcd0a4d-ebb0-4d51-8772-a1e5c97a9352	a4933c12-7bec-407c-a04a-690297489580	2026-06-25	20:00:00	21:00:00	120000	t	f	\N	2026-06-23 07:36:04.75665+07	f	f
53847a58-a7ec-4411-8ee9-7be4e141284a	a4933c12-7bec-407c-a04a-690297489580	2026-06-25	21:00:00	22:00:00	120000	f	f	\N	2026-06-23 07:36:04.75665+07	f	f
4809f078-5a25-417b-8d9c-83b2651286b6	a4933c12-7bec-407c-a04a-690297489580	2026-06-26	06:00:00	07:00:00	120000	f	f	\N	2026-06-23 07:36:04.765259+07	f	f
95f80d1c-d118-4f1e-8a23-7b101b042974	a4933c12-7bec-407c-a04a-690297489580	2026-06-26	07:00:00	08:00:00	120000	f	f	\N	2026-06-23 07:36:04.765259+07	f	f
8d8a8e04-619c-486c-8465-211fbccb04c0	a4933c12-7bec-407c-a04a-690297489580	2026-06-26	08:00:00	09:00:00	120000	f	f	\N	2026-06-23 07:36:04.765259+07	f	f
9ce8868f-b386-47b9-99c4-9298ca584401	a4933c12-7bec-407c-a04a-690297489580	2026-06-26	09:00:00	10:00:00	120000	f	f	\N	2026-06-23 07:36:04.765259+07	f	f
4d2d287b-87b0-490e-8ff8-e3986760f804	a4933c12-7bec-407c-a04a-690297489580	2026-06-26	10:00:00	11:00:00	120000	f	f	\N	2026-06-23 07:36:04.765259+07	f	f
8b359d49-45bc-40c2-8779-78c2f0f1f81b	a4933c12-7bec-407c-a04a-690297489580	2026-06-26	11:00:00	12:00:00	120000	f	f	\N	2026-06-23 07:36:04.765259+07	f	f
a857266c-eded-43a9-82a2-4a5a79269b27	a4933c12-7bec-407c-a04a-690297489580	2026-06-26	12:00:00	13:00:00	120000	f	f	\N	2026-06-23 07:36:04.765259+07	f	f
16bfa033-9d0c-445c-a69c-d49f7cda8d13	a4933c12-7bec-407c-a04a-690297489580	2026-06-26	13:00:00	14:00:00	120000	f	f	\N	2026-06-23 07:36:04.765259+07	f	f
0498374c-ec16-4851-957f-64c619e92b8a	a4933c12-7bec-407c-a04a-690297489580	2026-06-26	14:00:00	15:00:00	120000	f	f	\N	2026-06-23 07:36:04.765259+07	f	f
81764481-0ca4-4bdd-9a59-cdd96d8e4316	a4933c12-7bec-407c-a04a-690297489580	2026-06-26	15:00:00	16:00:00	120000	f	f	\N	2026-06-23 07:36:04.765259+07	f	f
7189a2ce-7488-43f0-a80f-89957b2f7a03	a4933c12-7bec-407c-a04a-690297489580	2026-06-26	16:00:00	17:00:00	120000	t	f	\N	2026-06-23 07:36:04.765259+07	f	f
b2151b81-016f-4daa-b801-1fd0ed3cf5d9	a4933c12-7bec-407c-a04a-690297489580	2026-06-26	17:00:00	18:00:00	120000	t	f	\N	2026-06-23 07:36:04.765259+07	f	f
9a997200-a0ae-421f-9692-86be19ab9ee1	a4933c12-7bec-407c-a04a-690297489580	2026-06-26	18:00:00	19:00:00	120000	t	f	\N	2026-06-23 07:36:04.765259+07	f	f
e1dd8fc4-fda8-43b0-b9c9-21de4a40ef00	a4933c12-7bec-407c-a04a-690297489580	2026-06-26	19:00:00	20:00:00	120000	t	f	\N	2026-06-23 07:36:04.765259+07	f	f
02f70670-926d-4949-a352-f9d623679f0d	a4933c12-7bec-407c-a04a-690297489580	2026-06-26	20:00:00	21:00:00	120000	t	f	\N	2026-06-23 07:36:04.765259+07	f	f
a0defe58-b92d-45ca-83df-4785da36b30e	a4933c12-7bec-407c-a04a-690297489580	2026-06-26	21:00:00	22:00:00	120000	f	f	\N	2026-06-23 07:36:04.765259+07	f	f
d9e3d23f-94a4-47b5-b3c8-286fbbdf551d	a4933c12-7bec-407c-a04a-690297489580	2026-06-27	06:00:00	07:00:00	120000	f	f	\N	2026-06-23 07:36:04.783074+07	f	f
784eac8a-448d-44de-ab07-99816914f4f7	a4933c12-7bec-407c-a04a-690297489580	2026-06-27	07:00:00	08:00:00	120000	f	f	\N	2026-06-23 07:36:04.783074+07	f	f
6f19d2b5-38cc-4f3f-bc09-c7bc9e5c5c20	a4933c12-7bec-407c-a04a-690297489580	2026-06-27	08:00:00	09:00:00	120000	f	f	\N	2026-06-23 07:36:04.783074+07	f	f
74f6ee1a-e9c5-46df-8799-e723aa2587ce	a4933c12-7bec-407c-a04a-690297489580	2026-06-27	09:00:00	10:00:00	120000	f	f	\N	2026-06-23 07:36:04.783074+07	f	f
605ec6cd-73e2-481b-b5c1-526ff3dd1495	a4933c12-7bec-407c-a04a-690297489580	2026-06-27	10:00:00	11:00:00	120000	f	f	\N	2026-06-23 07:36:04.783074+07	f	f
23b8b049-ec37-4413-a7d1-2781377c7ec4	a4933c12-7bec-407c-a04a-690297489580	2026-06-27	11:00:00	12:00:00	120000	f	f	\N	2026-06-23 07:36:04.783074+07	f	f
9fc09559-3712-473a-88e7-6721d4b687fe	a4933c12-7bec-407c-a04a-690297489580	2026-06-27	12:00:00	13:00:00	120000	f	f	\N	2026-06-23 07:36:04.783074+07	f	f
9beabe7f-d190-4861-a545-6627cb734f40	a4933c12-7bec-407c-a04a-690297489580	2026-06-27	13:00:00	14:00:00	120000	f	f	\N	2026-06-23 07:36:04.783074+07	f	f
6c9282d6-91aa-4d9f-9052-c607e993a166	a4933c12-7bec-407c-a04a-690297489580	2026-06-27	14:00:00	15:00:00	120000	f	f	\N	2026-06-23 07:36:04.783074+07	f	f
e7060577-c14d-44eb-9a92-a4c8a02d9c2c	a4933c12-7bec-407c-a04a-690297489580	2026-06-27	15:00:00	16:00:00	120000	f	f	\N	2026-06-23 07:36:04.783074+07	f	f
ee45793f-f6e3-4aa0-bd6d-4f59c1d094c9	a4933c12-7bec-407c-a04a-690297489580	2026-06-27	16:00:00	17:00:00	120000	t	f	\N	2026-06-23 07:36:04.783074+07	f	f
acb06106-2aad-4d12-83e3-bb967b165af4	a4933c12-7bec-407c-a04a-690297489580	2026-06-27	17:00:00	18:00:00	120000	t	f	\N	2026-06-23 07:36:04.783074+07	f	f
9a3174df-0f40-431e-b314-d9556027abf0	a4933c12-7bec-407c-a04a-690297489580	2026-06-27	18:00:00	19:00:00	120000	t	f	\N	2026-06-23 07:36:04.783074+07	f	f
41ee867f-cbc0-4ab4-9ae5-eeaf516a1ce3	a4933c12-7bec-407c-a04a-690297489580	2026-06-27	19:00:00	20:00:00	120000	t	f	\N	2026-06-23 07:36:04.783074+07	f	f
f8c71d9b-49a4-4d41-aefb-422b7835ff8a	a4933c12-7bec-407c-a04a-690297489580	2026-06-27	20:00:00	21:00:00	120000	t	f	\N	2026-06-23 07:36:04.783074+07	f	f
ad8f8de4-8a41-432c-8d09-7909528f1538	a4933c12-7bec-407c-a04a-690297489580	2026-06-27	21:00:00	22:00:00	120000	f	f	\N	2026-06-23 07:36:04.783074+07	f	f
e2c876bc-4180-4c90-b056-4f94dd8732b7	a4933c12-7bec-407c-a04a-690297489580	2026-06-28	06:00:00	07:00:00	120000	f	f	\N	2026-06-23 07:36:04.790615+07	f	f
9f6bcb67-8d08-4be8-b887-36f0263e8613	a4933c12-7bec-407c-a04a-690297489580	2026-06-28	07:00:00	08:00:00	120000	f	f	\N	2026-06-23 07:36:04.790615+07	f	f
5c2f142e-e56b-4c97-bcc6-2fb82667a886	a4933c12-7bec-407c-a04a-690297489580	2026-06-28	08:00:00	09:00:00	120000	f	f	\N	2026-06-23 07:36:04.790615+07	f	f
c335a261-81bb-4b1d-9ae5-d2747311bedf	a4933c12-7bec-407c-a04a-690297489580	2026-06-28	09:00:00	10:00:00	120000	f	f	\N	2026-06-23 07:36:04.790615+07	f	f
4b28abb9-5a9f-4ed8-b05b-b27a05ff6cf1	a4933c12-7bec-407c-a04a-690297489580	2026-06-28	10:00:00	11:00:00	120000	f	f	\N	2026-06-23 07:36:04.790615+07	f	f
491b874e-5aab-4175-a647-4da79001900c	a4933c12-7bec-407c-a04a-690297489580	2026-06-28	11:00:00	12:00:00	120000	f	f	\N	2026-06-23 07:36:04.790615+07	f	f
aa68d3f1-89c9-415b-b192-4fef74aa7e4c	a4933c12-7bec-407c-a04a-690297489580	2026-06-28	12:00:00	13:00:00	120000	f	f	\N	2026-06-23 07:36:04.790615+07	f	f
5d9152de-7663-401c-8709-1dd6aea4fd6b	a4933c12-7bec-407c-a04a-690297489580	2026-06-28	13:00:00	14:00:00	120000	f	f	\N	2026-06-23 07:36:04.790615+07	f	f
7f0ee952-4170-4a52-a38f-d5953392421e	a4933c12-7bec-407c-a04a-690297489580	2026-06-28	14:00:00	15:00:00	120000	f	f	\N	2026-06-23 07:36:04.790615+07	f	f
0099c156-50c3-4deb-8e1b-aff5cd870701	a4933c12-7bec-407c-a04a-690297489580	2026-06-28	15:00:00	16:00:00	120000	f	f	\N	2026-06-23 07:36:04.790615+07	f	f
2a53e3e7-f6c0-4f7c-91ad-d507236b6b7c	a4933c12-7bec-407c-a04a-690297489580	2026-06-28	16:00:00	17:00:00	120000	t	f	\N	2026-06-23 07:36:04.790615+07	f	f
a160fc35-ce17-450d-aed0-92b73f4a7638	a4933c12-7bec-407c-a04a-690297489580	2026-06-28	17:00:00	18:00:00	120000	t	f	\N	2026-06-23 07:36:04.790615+07	f	f
d1f890b6-db4d-46ae-b778-63a823b38468	a4933c12-7bec-407c-a04a-690297489580	2026-06-28	18:00:00	19:00:00	120000	t	f	\N	2026-06-23 07:36:04.790615+07	f	f
96946715-98e8-4de5-a06a-8b68a0f7f956	a4933c12-7bec-407c-a04a-690297489580	2026-06-28	19:00:00	20:00:00	120000	t	f	\N	2026-06-23 07:36:04.790615+07	f	f
83b94471-f084-4495-b325-76aec0946c72	a4933c12-7bec-407c-a04a-690297489580	2026-06-28	20:00:00	21:00:00	120000	t	f	\N	2026-06-23 07:36:04.790615+07	f	f
37912cad-7e2a-4890-b376-4099a82fa773	a4933c12-7bec-407c-a04a-690297489580	2026-06-28	21:00:00	22:00:00	120000	f	f	\N	2026-06-23 07:36:04.790615+07	f	f
9b88dc82-78dd-4437-9a91-e124953de9cd	a4933c12-7bec-407c-a04a-690297489580	2026-06-29	06:00:00	07:00:00	120000	f	f	\N	2026-06-23 07:36:04.796672+07	f	f
37534a2d-7337-4bc9-b52f-fe0d2599f530	a4933c12-7bec-407c-a04a-690297489580	2026-06-29	07:00:00	08:00:00	120000	f	f	\N	2026-06-23 07:36:04.796672+07	f	f
3efa7a3a-46ec-4fd5-a80f-423349705bdf	a4933c12-7bec-407c-a04a-690297489580	2026-06-29	08:00:00	09:00:00	120000	f	f	\N	2026-06-23 07:36:04.796672+07	f	f
a087abbd-a211-4883-83bc-fe828ec670a0	a4933c12-7bec-407c-a04a-690297489580	2026-06-29	09:00:00	10:00:00	120000	f	f	\N	2026-06-23 07:36:04.796672+07	f	f
e6c37c36-7190-44e2-b850-afdb2e9cba5b	a4933c12-7bec-407c-a04a-690297489580	2026-06-29	10:00:00	11:00:00	120000	f	f	\N	2026-06-23 07:36:04.796672+07	f	f
f5caa9db-a59e-4e8f-87d4-4b4eb943b478	a4933c12-7bec-407c-a04a-690297489580	2026-06-29	11:00:00	12:00:00	120000	f	f	\N	2026-06-23 07:36:04.796672+07	f	f
a7926e44-d2e9-4cba-81ed-d780513a3b75	a4933c12-7bec-407c-a04a-690297489580	2026-06-29	12:00:00	13:00:00	120000	f	f	\N	2026-06-23 07:36:04.796672+07	f	f
5ec75178-374f-4604-8dce-de6d9b8ade38	a4933c12-7bec-407c-a04a-690297489580	2026-06-29	13:00:00	14:00:00	120000	f	f	\N	2026-06-23 07:36:04.796672+07	f	f
575ad1d9-4ce2-4ce2-a6d8-f6e3b21f0a26	a4933c12-7bec-407c-a04a-690297489580	2026-06-29	14:00:00	15:00:00	120000	f	f	\N	2026-06-23 07:36:04.796672+07	f	f
f9109003-0afd-4d7e-a97a-fb465ddc7e22	a4933c12-7bec-407c-a04a-690297489580	2026-06-29	15:00:00	16:00:00	120000	f	f	\N	2026-06-23 07:36:04.796672+07	f	f
0c1b053a-596b-4d46-954c-0bb4b2c45def	a4933c12-7bec-407c-a04a-690297489580	2026-06-29	16:00:00	17:00:00	120000	t	f	\N	2026-06-23 07:36:04.796672+07	f	f
fcd7d415-59f2-43fe-93af-79abd61a53f5	a4933c12-7bec-407c-a04a-690297489580	2026-06-29	17:00:00	18:00:00	120000	t	f	\N	2026-06-23 07:36:04.796672+07	f	f
d8f20580-cbdf-4f26-b410-4562ab039150	a4933c12-7bec-407c-a04a-690297489580	2026-06-29	18:00:00	19:00:00	120000	t	f	\N	2026-06-23 07:36:04.796672+07	f	f
2ababc58-7aea-44f7-9e11-155338f8b19f	a4933c12-7bec-407c-a04a-690297489580	2026-06-29	19:00:00	20:00:00	120000	t	f	\N	2026-06-23 07:36:04.796672+07	f	f
18a9d7f0-4cd6-47fe-bd8a-6f9105021d05	a4933c12-7bec-407c-a04a-690297489580	2026-06-29	20:00:00	21:00:00	120000	t	f	\N	2026-06-23 07:36:04.796672+07	f	f
56cb1efc-bf1f-40b4-b019-d93659e5ecbc	a4933c12-7bec-407c-a04a-690297489580	2026-06-29	21:00:00	22:00:00	120000	f	f	\N	2026-06-23 07:36:04.796672+07	f	f
f2e9ab29-3b23-4c81-a050-7595fe544dbd	a4933c12-7bec-407c-a04a-690297489580	2026-06-30	06:00:00	07:00:00	120000	f	f	\N	2026-06-23 07:36:04.801792+07	f	f
a18a35b4-d5f9-4ce0-8d62-e0e4bd492cba	a4933c12-7bec-407c-a04a-690297489580	2026-06-30	07:00:00	08:00:00	120000	f	f	\N	2026-06-23 07:36:04.801792+07	f	f
b015d970-fb94-4f65-9f77-29e1e7128d7c	a4933c12-7bec-407c-a04a-690297489580	2026-06-30	08:00:00	09:00:00	120000	f	f	\N	2026-06-23 07:36:04.801792+07	f	f
79136ade-cef3-470f-9f83-6a9610b7aba5	a4933c12-7bec-407c-a04a-690297489580	2026-06-30	09:00:00	10:00:00	120000	f	f	\N	2026-06-23 07:36:04.801792+07	f	f
ff76ad0d-9c5d-4f3b-b92a-da16f43cea4b	a4933c12-7bec-407c-a04a-690297489580	2026-06-30	10:00:00	11:00:00	120000	f	f	\N	2026-06-23 07:36:04.801792+07	f	f
2bc0f63f-3fbc-42e6-b3d6-294a5b81b879	a4933c12-7bec-407c-a04a-690297489580	2026-06-30	11:00:00	12:00:00	120000	f	f	\N	2026-06-23 07:36:04.801792+07	f	f
f83afd6e-96fa-4764-9b56-fea7ca9d9194	a4933c12-7bec-407c-a04a-690297489580	2026-06-30	12:00:00	13:00:00	120000	f	f	\N	2026-06-23 07:36:04.801792+07	f	f
8619f3bc-79ce-4e51-9cbe-fcca24735e58	a4933c12-7bec-407c-a04a-690297489580	2026-06-30	13:00:00	14:00:00	120000	f	f	\N	2026-06-23 07:36:04.801792+07	f	f
95bf6d7c-32ba-4a0d-8eb8-cd6e17e94cf8	a4933c12-7bec-407c-a04a-690297489580	2026-06-30	14:00:00	15:00:00	120000	f	f	\N	2026-06-23 07:36:04.801792+07	f	f
caa351b5-c7d7-4140-b0a2-29d7fe126e2a	a4933c12-7bec-407c-a04a-690297489580	2026-06-30	15:00:00	16:00:00	120000	f	f	\N	2026-06-23 07:36:04.801792+07	f	f
ea172e09-c360-410d-9c0b-3938aa075e6a	a4933c12-7bec-407c-a04a-690297489580	2026-06-30	16:00:00	17:00:00	120000	t	f	\N	2026-06-23 07:36:04.801792+07	f	f
22bff364-a5a3-4bb7-8af2-f24bc4d6e0b1	a4933c12-7bec-407c-a04a-690297489580	2026-06-30	17:00:00	18:00:00	120000	t	f	\N	2026-06-23 07:36:04.801792+07	f	f
2b28518d-6a4b-497a-a122-206172f77dbf	a4933c12-7bec-407c-a04a-690297489580	2026-06-30	18:00:00	19:00:00	120000	t	f	\N	2026-06-23 07:36:04.801792+07	f	f
c04ce133-a7ab-4bc7-80f4-585b553efe7b	a4933c12-7bec-407c-a04a-690297489580	2026-06-30	19:00:00	20:00:00	120000	t	f	\N	2026-06-23 07:36:04.801792+07	f	f
08229385-19bc-4772-97b3-7cad2f196311	a4933c12-7bec-407c-a04a-690297489580	2026-06-30	20:00:00	21:00:00	120000	t	f	\N	2026-06-23 07:36:04.801792+07	f	f
7ec81430-7255-401c-b93e-f999ed093644	a4933c12-7bec-407c-a04a-690297489580	2026-06-30	21:00:00	22:00:00	120000	f	f	\N	2026-06-23 07:36:04.801792+07	f	f
dcd57600-6590-4c0c-891f-98ec0cbf1fd1	a4933c12-7bec-407c-a04a-690297489580	2026-07-01	06:00:00	07:00:00	120000	f	f	\N	2026-06-23 07:36:04.808235+07	f	f
177bfa50-3ec1-484c-b8b3-87367955b45f	a4933c12-7bec-407c-a04a-690297489580	2026-07-01	07:00:00	08:00:00	120000	f	f	\N	2026-06-23 07:36:04.808235+07	f	f
6c5502f3-50ba-43bf-8f83-522b40f312c4	a4933c12-7bec-407c-a04a-690297489580	2026-07-01	08:00:00	09:00:00	120000	f	f	\N	2026-06-23 07:36:04.808235+07	f	f
f70512dc-81a0-43bf-a569-0a6458bb22dd	a4933c12-7bec-407c-a04a-690297489580	2026-07-01	09:00:00	10:00:00	120000	f	f	\N	2026-06-23 07:36:04.808235+07	f	f
36ba11fe-308d-4efe-92c8-54005a20e88d	a4933c12-7bec-407c-a04a-690297489580	2026-07-01	10:00:00	11:00:00	120000	f	f	\N	2026-06-23 07:36:04.808235+07	f	f
a880caf7-3c60-4cb1-b921-870640278a8f	a4933c12-7bec-407c-a04a-690297489580	2026-07-01	11:00:00	12:00:00	120000	f	f	\N	2026-06-23 07:36:04.808235+07	f	f
e8c82018-0893-4f70-8d90-bf1ec1740c94	a4933c12-7bec-407c-a04a-690297489580	2026-07-01	12:00:00	13:00:00	120000	f	f	\N	2026-06-23 07:36:04.808235+07	f	f
e041d995-cdbf-483b-bd46-6cd641f2f867	a4933c12-7bec-407c-a04a-690297489580	2026-07-01	13:00:00	14:00:00	120000	f	f	\N	2026-06-23 07:36:04.808235+07	f	f
3feabb50-b4f4-4ac9-bc42-c0bc68ec5c89	a4933c12-7bec-407c-a04a-690297489580	2026-07-01	14:00:00	15:00:00	120000	f	f	\N	2026-06-23 07:36:04.808235+07	f	f
38c6d0cd-7c51-4eff-838d-301a63f38d84	a4933c12-7bec-407c-a04a-690297489580	2026-07-01	15:00:00	16:00:00	120000	f	f	\N	2026-06-23 07:36:04.808235+07	f	f
02750b32-0835-497b-ae5e-4adf5a07e1b1	a4933c12-7bec-407c-a04a-690297489580	2026-07-01	16:00:00	17:00:00	120000	t	f	\N	2026-06-23 07:36:04.808235+07	f	f
8595e641-d8aa-4f21-a77b-bb5cedf9c7e2	a4933c12-7bec-407c-a04a-690297489580	2026-07-01	17:00:00	18:00:00	120000	t	f	\N	2026-06-23 07:36:04.808235+07	f	f
f8c2f8a0-84ef-4bad-b1ab-85e6ab314b08	a4933c12-7bec-407c-a04a-690297489580	2026-07-01	18:00:00	19:00:00	120000	t	f	\N	2026-06-23 07:36:04.808235+07	f	f
909b3a29-972f-4ce9-b1b5-5d5a251bd99c	a4933c12-7bec-407c-a04a-690297489580	2026-07-01	19:00:00	20:00:00	120000	t	f	\N	2026-06-23 07:36:04.808235+07	f	f
f93aa80a-0f29-4e9c-a858-ddf01539d7b7	a4933c12-7bec-407c-a04a-690297489580	2026-07-01	20:00:00	21:00:00	120000	t	f	\N	2026-06-23 07:36:04.808235+07	f	f
313f818e-44b8-4122-b432-01b974f2178e	a4933c12-7bec-407c-a04a-690297489580	2026-07-01	21:00:00	22:00:00	120000	f	f	\N	2026-06-23 07:36:04.808235+07	f	f
322356e1-1d3c-44e2-a358-cdca3ffb65d0	a4933c12-7bec-407c-a04a-690297489580	2026-07-02	06:00:00	07:00:00	120000	f	f	\N	2026-06-23 07:36:04.813815+07	f	f
d13b5b22-2622-4e02-b829-a6cc2698c109	a4933c12-7bec-407c-a04a-690297489580	2026-07-02	07:00:00	08:00:00	120000	f	f	\N	2026-06-23 07:36:04.813815+07	f	f
a5996267-3674-4108-a751-76f2cb397f44	a4933c12-7bec-407c-a04a-690297489580	2026-07-02	08:00:00	09:00:00	120000	f	f	\N	2026-06-23 07:36:04.813815+07	f	f
345691e4-2576-4cfd-8433-94c1f1d2b319	a4933c12-7bec-407c-a04a-690297489580	2026-07-02	09:00:00	10:00:00	120000	f	f	\N	2026-06-23 07:36:04.813815+07	f	f
cf99a0d4-5d5a-49a9-b56c-332e216a0284	a4933c12-7bec-407c-a04a-690297489580	2026-07-02	10:00:00	11:00:00	120000	f	f	\N	2026-06-23 07:36:04.813815+07	f	f
ffc49704-21f9-46bd-8685-3aa168e32fcc	a4933c12-7bec-407c-a04a-690297489580	2026-07-02	11:00:00	12:00:00	120000	f	f	\N	2026-06-23 07:36:04.813815+07	f	f
1a04e464-0c72-43c9-bf3e-c01973ed75a2	a4933c12-7bec-407c-a04a-690297489580	2026-07-02	12:00:00	13:00:00	120000	f	f	\N	2026-06-23 07:36:04.813815+07	f	f
c23d1cf5-8956-4f62-9308-173cb6fcd7cc	a4933c12-7bec-407c-a04a-690297489580	2026-07-02	13:00:00	14:00:00	120000	f	f	\N	2026-06-23 07:36:04.813815+07	f	f
c42af470-4c85-43a1-aa65-796d60adfc53	a4933c12-7bec-407c-a04a-690297489580	2026-07-02	14:00:00	15:00:00	120000	f	f	\N	2026-06-23 07:36:04.813815+07	f	f
2cd702a1-1efc-463b-adc2-2b0040463d23	a4933c12-7bec-407c-a04a-690297489580	2026-07-02	15:00:00	16:00:00	120000	f	f	\N	2026-06-23 07:36:04.813815+07	f	f
bbb2b742-71ff-41bf-a4a7-3fc305852cfd	a4933c12-7bec-407c-a04a-690297489580	2026-07-02	16:00:00	17:00:00	120000	t	f	\N	2026-06-23 07:36:04.813815+07	f	f
67a436e3-c803-49a1-95a5-8396d06273c4	a4933c12-7bec-407c-a04a-690297489580	2026-07-02	17:00:00	18:00:00	120000	t	f	\N	2026-06-23 07:36:04.813815+07	f	f
733be085-c47d-4fcb-bd59-b347741f2362	a4933c12-7bec-407c-a04a-690297489580	2026-07-02	18:00:00	19:00:00	120000	t	f	\N	2026-06-23 07:36:04.813815+07	f	f
c34a1f4b-eba7-4694-b242-b060e39fb756	a4933c12-7bec-407c-a04a-690297489580	2026-07-02	19:00:00	20:00:00	120000	t	f	\N	2026-06-23 07:36:04.813815+07	f	f
caaf7771-0198-44e9-a996-c3cf3f1912e4	a4933c12-7bec-407c-a04a-690297489580	2026-07-02	20:00:00	21:00:00	120000	t	f	\N	2026-06-23 07:36:04.813815+07	f	f
65dc8e77-9154-45b0-b9d2-05d2d1f91318	a4933c12-7bec-407c-a04a-690297489580	2026-07-02	21:00:00	22:00:00	120000	f	f	\N	2026-06-23 07:36:04.813815+07	f	f
f96c6fc2-7043-432a-9bda-b706b18e8de2	a4933c12-7bec-407c-a04a-690297489580	2026-07-03	06:00:00	07:00:00	120000	f	f	\N	2026-06-23 07:36:04.817503+07	f	f
d747ecb4-363e-409a-8838-11818e7607cf	a4933c12-7bec-407c-a04a-690297489580	2026-07-03	07:00:00	08:00:00	120000	f	f	\N	2026-06-23 07:36:04.817503+07	f	f
9a9f3c6d-7534-4f2f-bebe-8a005c3a4596	a4933c12-7bec-407c-a04a-690297489580	2026-07-03	08:00:00	09:00:00	120000	f	f	\N	2026-06-23 07:36:04.817503+07	f	f
1e2fbee8-0eeb-46f5-86ab-6c73eaa66dfb	a4933c12-7bec-407c-a04a-690297489580	2026-07-03	09:00:00	10:00:00	120000	f	f	\N	2026-06-23 07:36:04.817503+07	f	f
521fe8ff-f4f0-4686-936a-6c705638cd34	a4933c12-7bec-407c-a04a-690297489580	2026-07-03	10:00:00	11:00:00	120000	f	f	\N	2026-06-23 07:36:04.817503+07	f	f
aa785612-c042-483a-a3cc-e70fc04280b4	a4933c12-7bec-407c-a04a-690297489580	2026-07-03	11:00:00	12:00:00	120000	f	f	\N	2026-06-23 07:36:04.817503+07	f	f
c896d43b-c7cd-4c08-b708-843f185e3c34	a4933c12-7bec-407c-a04a-690297489580	2026-07-03	12:00:00	13:00:00	120000	f	f	\N	2026-06-23 07:36:04.817503+07	f	f
2556be74-8c5f-43d2-adb6-542e3cbe047a	a4933c12-7bec-407c-a04a-690297489580	2026-07-03	13:00:00	14:00:00	120000	f	f	\N	2026-06-23 07:36:04.817503+07	f	f
6951d623-45c5-4b32-b527-11326c7784ae	a4933c12-7bec-407c-a04a-690297489580	2026-07-03	14:00:00	15:00:00	120000	f	f	\N	2026-06-23 07:36:04.817503+07	f	f
eb6b655e-9704-4993-bfbc-f5c600715629	a4933c12-7bec-407c-a04a-690297489580	2026-07-03	15:00:00	16:00:00	120000	f	f	\N	2026-06-23 07:36:04.817503+07	f	f
90209150-bd8d-4e8d-8b43-a617847b0f8b	a4933c12-7bec-407c-a04a-690297489580	2026-07-03	16:00:00	17:00:00	120000	t	f	\N	2026-06-23 07:36:04.817503+07	f	f
38338a67-5961-42d2-88bb-62c6da802517	a4933c12-7bec-407c-a04a-690297489580	2026-07-03	17:00:00	18:00:00	120000	t	f	\N	2026-06-23 07:36:04.817503+07	f	f
797ebb7f-c389-489e-9a7b-8bfaa2bb929e	a4933c12-7bec-407c-a04a-690297489580	2026-07-03	18:00:00	19:00:00	120000	t	f	\N	2026-06-23 07:36:04.817503+07	f	f
ead9043c-4ba0-4726-b1bf-0a17fddc7c50	a4933c12-7bec-407c-a04a-690297489580	2026-07-03	19:00:00	20:00:00	120000	t	f	\N	2026-06-23 07:36:04.817503+07	f	f
938c3718-b6bb-4fbf-bdcc-199fe5423875	a4933c12-7bec-407c-a04a-690297489580	2026-07-03	20:00:00	21:00:00	120000	t	f	\N	2026-06-23 07:36:04.817503+07	f	f
22178eba-8d6a-44ee-ae4a-d516301ac3d7	a4933c12-7bec-407c-a04a-690297489580	2026-07-03	21:00:00	22:00:00	120000	f	f	\N	2026-06-23 07:36:04.817503+07	f	f
24f9226e-d59c-45f5-b0d0-7748915752bd	a4933c12-7bec-407c-a04a-690297489580	2026-07-04	06:00:00	07:00:00	120000	f	f	\N	2026-06-23 07:36:04.823341+07	f	f
32b3028d-8c0f-4b93-bd95-ceee48635d46	a4933c12-7bec-407c-a04a-690297489580	2026-07-04	07:00:00	08:00:00	120000	f	f	\N	2026-06-23 07:36:04.823341+07	f	f
e3e4e132-73cc-47f6-8285-8a9d1add5c44	a4933c12-7bec-407c-a04a-690297489580	2026-07-04	08:00:00	09:00:00	120000	f	f	\N	2026-06-23 07:36:04.823341+07	f	f
299d99e0-d4c4-4743-873a-be3388ead888	a4933c12-7bec-407c-a04a-690297489580	2026-07-04	09:00:00	10:00:00	120000	f	f	\N	2026-06-23 07:36:04.823341+07	f	f
051301cc-35a0-41d4-bc84-f4fc53645995	a4933c12-7bec-407c-a04a-690297489580	2026-07-04	10:00:00	11:00:00	120000	f	f	\N	2026-06-23 07:36:04.823341+07	f	f
6505d645-ec34-48b8-9faf-e2de7c016129	a4933c12-7bec-407c-a04a-690297489580	2026-07-04	11:00:00	12:00:00	120000	f	f	\N	2026-06-23 07:36:04.823341+07	f	f
fc0171d2-d8fa-4fe4-a8e4-cab866a6871c	a4933c12-7bec-407c-a04a-690297489580	2026-07-04	12:00:00	13:00:00	120000	f	f	\N	2026-06-23 07:36:04.823341+07	f	f
70a29077-34bd-49b2-bd6b-aaa6da5b3e3b	a4933c12-7bec-407c-a04a-690297489580	2026-07-04	13:00:00	14:00:00	120000	f	f	\N	2026-06-23 07:36:04.823341+07	f	f
fa5ae4a5-0c7a-4d89-8c5f-d3d52774bcda	a4933c12-7bec-407c-a04a-690297489580	2026-07-04	14:00:00	15:00:00	120000	f	f	\N	2026-06-23 07:36:04.823341+07	f	f
269d2f50-4b32-487f-8db0-cbeac3600502	a4933c12-7bec-407c-a04a-690297489580	2026-07-04	15:00:00	16:00:00	120000	f	f	\N	2026-06-23 07:36:04.823341+07	f	f
8bfa8542-4bde-4634-8cae-bc9f12c2985c	a4933c12-7bec-407c-a04a-690297489580	2026-07-04	16:00:00	17:00:00	120000	t	f	\N	2026-06-23 07:36:04.823341+07	f	f
4651561e-1604-4f32-ae54-44a87e0fd603	a4933c12-7bec-407c-a04a-690297489580	2026-07-04	17:00:00	18:00:00	120000	t	f	\N	2026-06-23 07:36:04.823341+07	f	f
19c83b1c-96a1-44e2-a77b-33d31d16060a	a4933c12-7bec-407c-a04a-690297489580	2026-07-04	18:00:00	19:00:00	120000	t	f	\N	2026-06-23 07:36:04.823341+07	f	f
a2a0a737-7ce4-43ae-b48f-3684f749f7e2	a4933c12-7bec-407c-a04a-690297489580	2026-07-04	19:00:00	20:00:00	120000	t	f	\N	2026-06-23 07:36:04.823341+07	f	f
0bd927fc-e21d-4f58-a601-fb55b607558d	a4933c12-7bec-407c-a04a-690297489580	2026-07-04	20:00:00	21:00:00	120000	t	f	\N	2026-06-23 07:36:04.823341+07	f	f
2196c6b1-c6eb-4385-938e-a41ed89de2ea	a4933c12-7bec-407c-a04a-690297489580	2026-07-04	21:00:00	22:00:00	120000	f	f	\N	2026-06-23 07:36:04.823341+07	f	f
9c7af678-e1c8-43ab-a762-325c5eafe017	a4933c12-7bec-407c-a04a-690297489580	2026-07-05	06:00:00	07:00:00	120000	f	f	\N	2026-06-23 07:36:04.828954+07	f	f
0e105fc2-4133-4924-89eb-990b6e127a72	a4933c12-7bec-407c-a04a-690297489580	2026-07-05	07:00:00	08:00:00	120000	f	f	\N	2026-06-23 07:36:04.828954+07	f	f
e8a1d79b-adbb-4f68-b6d6-227e0d5fb472	a4933c12-7bec-407c-a04a-690297489580	2026-07-05	08:00:00	09:00:00	120000	f	f	\N	2026-06-23 07:36:04.828954+07	f	f
87d1188e-5722-4633-a24e-d817c6c8227e	a4933c12-7bec-407c-a04a-690297489580	2026-07-05	09:00:00	10:00:00	120000	f	f	\N	2026-06-23 07:36:04.828954+07	f	f
956ede6c-7a0f-4d50-9968-2aac9f1ac785	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-22	06:00:00	07:00:00	0	f	f	\N	2026-06-22 21:27:44.326203+07	f	f
078600f2-1b4f-4eff-965b-80f891f54bbc	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-22	07:00:00	08:00:00	0	f	f	\N	2026-06-22 21:27:44.326203+07	f	f
2efcac80-6be8-404f-941a-9eb1ad1e5861	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-22	08:00:00	09:00:00	0	f	f	\N	2026-06-22 21:27:44.326203+07	f	f
54f6d85e-5933-41ba-89ea-ea709c39d526	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-22	09:00:00	10:00:00	0	f	f	\N	2026-06-22 21:27:44.326203+07	f	f
1bdd2362-f594-44da-9773-8ac5dd3dda53	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-22	10:00:00	11:00:00	0	f	f	\N	2026-06-22 21:27:44.326203+07	f	f
33571131-ca2b-436a-91f2-6c82f4d76d8f	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-22	11:00:00	12:00:00	0	f	f	\N	2026-06-22 21:27:44.326203+07	f	f
a3a5a3c3-3d93-4954-87d8-48acda122916	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-22	12:00:00	13:00:00	0	f	f	\N	2026-06-22 21:27:44.326203+07	f	f
42b669f0-9de5-49db-9470-9c658ac8558b	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-22	13:00:00	14:00:00	0	f	f	\N	2026-06-22 21:27:44.326203+07	f	f
1ecd5c38-2c17-4073-a3a1-09cb9252d238	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-22	14:00:00	15:00:00	0	f	f	\N	2026-06-22 21:27:44.326203+07	f	f
30a5fed8-bf05-441a-a0f9-f97c617c6ecf	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-22	15:00:00	16:00:00	0	f	f	\N	2026-06-22 21:27:44.326203+07	f	f
82705d21-d0a3-4496-8a4d-5b4e92c44ae7	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-22	16:00:00	17:00:00	0	t	f	\N	2026-06-22 21:27:44.326203+07	f	f
62158576-1414-4ed2-9225-0e4dda0c8b3f	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-22	17:00:00	18:00:00	0	t	f	\N	2026-06-22 21:27:44.326203+07	f	f
7642862a-2145-4ef8-99c7-131ef5cb12bd	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-22	18:00:00	19:00:00	0	t	f	\N	2026-06-22 21:27:44.326203+07	f	f
1a8ffb7b-2798-4644-8627-93d69560c2d8	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-22	19:00:00	20:00:00	0	t	f	\N	2026-06-22 21:27:44.326203+07	f	f
311c6513-3c98-45ca-9fd7-4d1f1a924a62	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-22	20:00:00	21:00:00	0	t	f	\N	2026-06-22 21:27:44.326203+07	f	f
e46756eb-37bf-4ff8-a57a-035ef45f3c63	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-22	21:00:00	22:00:00	0	f	f	\N	2026-06-22 21:27:44.326203+07	f	f
a2344ea6-5948-4458-a497-d417d46c06ec	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-23	06:00:00	07:00:00	0	f	f	\N	2026-06-22 21:27:44.341608+07	f	f
3c085450-27df-4606-8684-83fda6094b66	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-23	07:00:00	08:00:00	0	f	f	\N	2026-06-22 21:27:44.341608+07	f	f
dbf1959e-3acb-4a34-8fe0-bea913cf3e74	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-23	08:00:00	09:00:00	0	f	f	\N	2026-06-22 21:27:44.341608+07	f	f
eb066081-e035-4e63-b5cc-0bf346418b62	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-23	09:00:00	10:00:00	0	f	f	\N	2026-06-22 21:27:44.341608+07	f	f
356d00cc-3ab4-4c4d-84c8-b706cb0837fd	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-23	10:00:00	11:00:00	0	f	f	\N	2026-06-22 21:27:44.341608+07	f	f
6c687c8a-2adc-4bd0-9ae6-b7375d853dac	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-23	11:00:00	12:00:00	0	f	f	\N	2026-06-22 21:27:44.341608+07	f	f
131354dd-f4c4-4a51-8bf7-746803edaf1e	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-23	12:00:00	13:00:00	0	f	f	\N	2026-06-22 21:27:44.341608+07	f	f
3d7dc289-0c5c-4a24-a483-acc3c6708eee	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-23	13:00:00	14:00:00	0	f	f	\N	2026-06-22 21:27:44.341608+07	f	f
f4c0d209-b337-44e1-92a3-6d98c19f8df5	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-23	14:00:00	15:00:00	0	f	f	\N	2026-06-22 21:27:44.341608+07	f	f
4fa04031-578e-454f-8b03-56516d46125e	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-23	15:00:00	16:00:00	0	f	f	\N	2026-06-22 21:27:44.341608+07	f	f
1573c4d3-f190-4962-891c-d0f7e716cba1	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-23	16:00:00	17:00:00	0	t	f	\N	2026-06-22 21:27:44.341608+07	f	f
9917bb20-ba32-4b91-8d7d-f8511b98ac45	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-23	17:00:00	18:00:00	0	t	f	\N	2026-06-22 21:27:44.341608+07	f	f
9ca94ed6-44d0-43e4-8c29-0b1d8a26c92e	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-23	18:00:00	19:00:00	0	t	f	\N	2026-06-22 21:27:44.341608+07	f	f
038e4c7e-448c-408a-bff8-0f28974f0a33	a4933c12-7bec-407c-a04a-690297489580	2026-07-05	10:00:00	11:00:00	120000	f	f	\N	2026-06-23 07:36:04.828954+07	f	f
f49fa0cb-e73b-4731-8906-3a3c0259f40d	a4933c12-7bec-407c-a04a-690297489580	2026-07-05	11:00:00	12:00:00	120000	f	f	\N	2026-06-23 07:36:04.828954+07	f	f
cc98a325-8301-40e9-a56e-2a849612a615	a4933c12-7bec-407c-a04a-690297489580	2026-07-05	12:00:00	13:00:00	120000	f	f	\N	2026-06-23 07:36:04.828954+07	f	f
4181de5e-465c-405a-a752-ee1a5227873e	a4933c12-7bec-407c-a04a-690297489580	2026-07-05	13:00:00	14:00:00	120000	f	f	\N	2026-06-23 07:36:04.828954+07	f	f
d505f5b4-3aa1-4052-a913-4bc98f7fde78	a4933c12-7bec-407c-a04a-690297489580	2026-07-05	14:00:00	15:00:00	120000	f	f	\N	2026-06-23 07:36:04.828954+07	f	f
ffb112ae-38fd-4453-82ed-1eca98b20415	a4933c12-7bec-407c-a04a-690297489580	2026-07-05	15:00:00	16:00:00	120000	f	f	\N	2026-06-23 07:36:04.828954+07	f	f
689d3793-22c3-4b9d-8184-40cc8c7af423	a4933c12-7bec-407c-a04a-690297489580	2026-07-05	16:00:00	17:00:00	120000	t	f	\N	2026-06-23 07:36:04.828954+07	f	f
5af069d9-4fef-4dc9-9b75-3bde7aee5df8	a4933c12-7bec-407c-a04a-690297489580	2026-07-05	17:00:00	18:00:00	120000	t	f	\N	2026-06-23 07:36:04.828954+07	f	f
82d2e1a4-b8e0-4e6a-a498-af3463bb6ea0	a4933c12-7bec-407c-a04a-690297489580	2026-07-05	18:00:00	19:00:00	120000	t	f	\N	2026-06-23 07:36:04.828954+07	f	f
b0138331-db2f-4ea2-ac5c-68ec6a110faf	a4933c12-7bec-407c-a04a-690297489580	2026-07-05	19:00:00	20:00:00	120000	t	f	\N	2026-06-23 07:36:04.828954+07	f	f
5cec0c8d-3d8f-4b07-808d-c99d62fb1c83	a4933c12-7bec-407c-a04a-690297489580	2026-07-05	20:00:00	21:00:00	120000	t	f	\N	2026-06-23 07:36:04.828954+07	f	f
493d40ad-f436-4398-9afd-af6bde120544	a4933c12-7bec-407c-a04a-690297489580	2026-07-05	21:00:00	22:00:00	120000	f	f	\N	2026-06-23 07:36:04.828954+07	f	f
e3b3dcaa-1db1-4d5e-8a06-f284afe91b73	a4933c12-7bec-407c-a04a-690297489580	2026-07-06	06:00:00	07:00:00	120000	f	f	\N	2026-06-23 07:36:04.833527+07	f	f
dffd735c-d185-4465-b737-c108facae008	a4933c12-7bec-407c-a04a-690297489580	2026-07-06	07:00:00	08:00:00	120000	f	f	\N	2026-06-23 07:36:04.833527+07	f	f
16b97062-a20e-4bd8-a211-be0b5ca6e055	a4933c12-7bec-407c-a04a-690297489580	2026-07-06	08:00:00	09:00:00	120000	f	f	\N	2026-06-23 07:36:04.833527+07	f	f
f4cd8b24-3740-4d38-a7ed-5f636da4d01b	a4933c12-7bec-407c-a04a-690297489580	2026-07-06	09:00:00	10:00:00	120000	f	f	\N	2026-06-23 07:36:04.833527+07	f	f
719a8bd1-565c-4956-a0ee-e376717cdc0a	a4933c12-7bec-407c-a04a-690297489580	2026-07-06	10:00:00	11:00:00	120000	f	f	\N	2026-06-23 07:36:04.833527+07	f	f
ca30976a-18ef-44bb-bfb9-f531bbb6a8ef	a4933c12-7bec-407c-a04a-690297489580	2026-07-06	11:00:00	12:00:00	120000	f	f	\N	2026-06-23 07:36:04.833527+07	f	f
b972ffb5-7525-405b-94a4-25078e991aeb	a4933c12-7bec-407c-a04a-690297489580	2026-07-06	12:00:00	13:00:00	120000	f	f	\N	2026-06-23 07:36:04.833527+07	f	f
9b71c335-0240-449f-999b-9ff19eac6dde	a4933c12-7bec-407c-a04a-690297489580	2026-07-06	13:00:00	14:00:00	120000	f	f	\N	2026-06-23 07:36:04.833527+07	f	f
6863cb96-5bf5-4d2e-a05a-328eaa8f2c7f	a4933c12-7bec-407c-a04a-690297489580	2026-07-06	14:00:00	15:00:00	120000	f	f	\N	2026-06-23 07:36:04.833527+07	f	f
6244f6c3-c86c-4508-9188-2476899b0477	a4933c12-7bec-407c-a04a-690297489580	2026-07-06	15:00:00	16:00:00	120000	f	f	\N	2026-06-23 07:36:04.833527+07	f	f
aa73200e-0b3d-4c90-bf7a-dcd9513378be	a4933c12-7bec-407c-a04a-690297489580	2026-07-06	16:00:00	17:00:00	120000	t	f	\N	2026-06-23 07:36:04.833527+07	f	f
3402986a-4e04-47a9-90ee-36a08e486a94	a4933c12-7bec-407c-a04a-690297489580	2026-07-06	17:00:00	18:00:00	120000	t	f	\N	2026-06-23 07:36:04.833527+07	f	f
28887a2b-1e63-4adb-9d55-a6533cf83068	a4933c12-7bec-407c-a04a-690297489580	2026-07-06	18:00:00	19:00:00	120000	t	f	\N	2026-06-23 07:36:04.833527+07	f	f
cf7b3fb9-3925-4ad8-82ae-5107a4fe24cd	a4933c12-7bec-407c-a04a-690297489580	2026-07-06	19:00:00	20:00:00	120000	t	f	\N	2026-06-23 07:36:04.833527+07	f	f
f78f7dbc-1708-4b1e-88db-800f4fd82f78	a4933c12-7bec-407c-a04a-690297489580	2026-07-06	20:00:00	21:00:00	120000	t	f	\N	2026-06-23 07:36:04.833527+07	f	f
c0f5e0c9-cc31-498f-9584-175dd6554757	a4933c12-7bec-407c-a04a-690297489580	2026-07-06	21:00:00	22:00:00	120000	f	f	\N	2026-06-23 07:36:04.833527+07	f	f
9e183129-12f3-4ae8-9f91-7087b7eaee82	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-23	19:00:00	20:00:00	0	t	f	\N	2026-06-22 21:27:44.341608+07	f	f
f2393a82-9ca0-4359-b780-de38205d89fd	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-23	20:00:00	21:00:00	0	t	f	\N	2026-06-22 21:27:44.341608+07	f	f
dd53e18d-7f13-4a37-99f4-78f53d98ba0e	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-23	21:00:00	22:00:00	0	f	f	\N	2026-06-22 21:27:44.341608+07	f	f
5273fbce-be5b-4e53-b2ce-2e9362e6e4d9	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-24	06:00:00	07:00:00	0	f	f	\N	2026-06-22 21:27:44.347187+07	f	f
94c30382-7752-4e39-abbe-97f9b82d4e00	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-24	07:00:00	08:00:00	0	f	f	\N	2026-06-22 21:27:44.347187+07	f	f
d396f908-644a-4b5b-adce-b6562b6b6300	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-24	08:00:00	09:00:00	0	f	f	\N	2026-06-22 21:27:44.347187+07	f	f
e6583ee8-8532-4ec3-af4b-93097b4b2c07	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-24	09:00:00	10:00:00	0	f	f	\N	2026-06-22 21:27:44.347187+07	f	f
6a9d0d45-2dd7-4c3e-8eab-3997cf42d49a	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-24	10:00:00	11:00:00	0	f	f	\N	2026-06-22 21:27:44.347187+07	f	f
1ea65c10-1386-4f61-877b-6ce85decffb3	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-24	11:00:00	12:00:00	0	f	f	\N	2026-06-22 21:27:44.347187+07	f	f
d4c2af0b-d285-477f-b940-d65a21b3f131	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-24	12:00:00	13:00:00	0	f	f	\N	2026-06-22 21:27:44.347187+07	f	f
330430b3-a3a2-40c2-a1ce-cca4fb3e9027	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-24	13:00:00	14:00:00	0	f	f	\N	2026-06-22 21:27:44.347187+07	f	f
4e805838-4cf7-4ae7-a6f8-a4104b847edf	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-24	14:00:00	15:00:00	0	f	f	\N	2026-06-22 21:27:44.347187+07	f	f
23be500f-42a1-4660-ad5e-1715beeb19f9	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-24	15:00:00	16:00:00	0	f	f	\N	2026-06-22 21:27:44.347187+07	f	f
5f9d4012-981a-446b-8397-30dd8e4928ad	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-24	16:00:00	17:00:00	0	t	f	\N	2026-06-22 21:27:44.347187+07	f	f
661123c2-2b13-413d-916d-ac81ce318415	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-24	17:00:00	18:00:00	0	t	f	\N	2026-06-22 21:27:44.347187+07	f	f
e338e16e-d0a0-4af5-8345-aee9d9e56681	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-24	18:00:00	19:00:00	0	t	f	\N	2026-06-22 21:27:44.347187+07	f	f
ccd0e239-1103-4980-abd1-4496292071c7	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-24	19:00:00	20:00:00	0	t	f	\N	2026-06-22 21:27:44.347187+07	f	f
4756e714-81c8-4189-b3ef-8159a590c53d	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-24	20:00:00	21:00:00	0	t	f	\N	2026-06-22 21:27:44.347187+07	f	f
790fc914-4684-4285-91ed-3eda78a95b2e	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-24	21:00:00	22:00:00	0	f	f	\N	2026-06-22 21:27:44.347187+07	f	f
171d3348-ec84-459b-9ed8-546beeed69dd	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-25	06:00:00	07:00:00	0	f	f	\N	2026-06-22 21:27:44.351432+07	f	f
ed89844e-cfd1-4b0a-a4a2-2831e9e334d1	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-25	07:00:00	08:00:00	0	f	f	\N	2026-06-22 21:27:44.351432+07	f	f
536a0203-91ff-4041-b266-a4c59d3de1e1	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-25	08:00:00	09:00:00	0	f	f	\N	2026-06-22 21:27:44.351432+07	f	f
128b2188-8c21-4d01-b707-649b401a7637	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-25	09:00:00	10:00:00	0	f	f	\N	2026-06-22 21:27:44.351432+07	f	f
5d2a1351-c7e2-4637-b4c3-e85c4605fc9b	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-25	10:00:00	11:00:00	0	f	f	\N	2026-06-22 21:27:44.351432+07	f	f
27c7da3b-06a0-4ade-822b-fdd1a6d9d32f	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-25	11:00:00	12:00:00	0	f	f	\N	2026-06-22 21:27:44.351432+07	f	f
93fb77e7-07a3-42aa-8924-7f7c525c4d19	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-25	12:00:00	13:00:00	0	f	f	\N	2026-06-22 21:27:44.351432+07	f	f
5f1bb3a5-821d-429c-93bc-c578411c616c	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-25	13:00:00	14:00:00	0	f	f	\N	2026-06-22 21:27:44.351432+07	f	f
5c4836d7-4b87-4f91-a6eb-fa9285201791	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-25	14:00:00	15:00:00	0	f	f	\N	2026-06-22 21:27:44.351432+07	f	f
48501046-1310-4e9e-9c8e-bf7e0a1e9e6a	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-25	15:00:00	16:00:00	0	f	f	\N	2026-06-22 21:27:44.351432+07	f	f
5b92215e-891a-45d8-8f2a-3d231c6066e6	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-25	16:00:00	17:00:00	0	t	f	\N	2026-06-22 21:27:44.351432+07	f	f
92870d32-1674-4910-97e3-1e252722b294	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-25	17:00:00	18:00:00	0	t	f	\N	2026-06-22 21:27:44.351432+07	f	f
1279ee44-3119-4e77-8487-99f430c4815e	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-25	18:00:00	19:00:00	0	t	f	\N	2026-06-22 21:27:44.351432+07	f	f
a190fc95-4827-4dad-a477-d057f4212d21	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-25	19:00:00	20:00:00	0	t	f	\N	2026-06-22 21:27:44.351432+07	f	f
5b3d736f-a917-4dc0-ae6f-b16c8ef8249d	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-25	20:00:00	21:00:00	0	t	f	\N	2026-06-22 21:27:44.351432+07	f	f
90667dc7-0ba6-48c5-9c92-1435d85fd90d	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-25	21:00:00	22:00:00	0	f	f	\N	2026-06-22 21:27:44.351432+07	f	f
76ab65e1-ef98-4565-adb8-194df42cac03	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-26	06:00:00	07:00:00	0	f	f	\N	2026-06-22 21:27:44.356754+07	f	f
21f4533c-9d0f-4819-846a-84f2fab5d206	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-26	07:00:00	08:00:00	0	f	f	\N	2026-06-22 21:27:44.356754+07	f	f
d2688b14-7a42-40aa-bcda-c068a5a70e8f	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-26	08:00:00	09:00:00	0	f	f	\N	2026-06-22 21:27:44.356754+07	f	f
b2641e8d-c53d-40a6-b55f-9437386effe3	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-26	09:00:00	10:00:00	0	f	f	\N	2026-06-22 21:27:44.356754+07	f	f
8b769701-0687-4399-8142-192e7568e396	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-26	10:00:00	11:00:00	0	f	f	\N	2026-06-22 21:27:44.356754+07	f	f
93161e35-5533-46dc-825b-2c3ad592d409	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-26	11:00:00	12:00:00	0	f	f	\N	2026-06-22 21:27:44.356754+07	f	f
f03983f3-730a-4774-8aae-c48d41f9bed7	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-26	12:00:00	13:00:00	0	f	f	\N	2026-06-22 21:27:44.356754+07	f	f
b97076e4-6856-4748-97fc-ab9cbc729e49	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-26	13:00:00	14:00:00	0	f	f	\N	2026-06-22 21:27:44.356754+07	f	f
f04b7805-e96a-445d-b5f2-571d8e7b4b5d	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-26	14:00:00	15:00:00	0	f	f	\N	2026-06-22 21:27:44.356754+07	f	f
7200f2c2-3173-44d8-b1ae-b52eecc66cd9	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-26	15:00:00	16:00:00	0	f	f	\N	2026-06-22 21:27:44.356754+07	f	f
dd76647a-e021-4baa-a065-d81048e4d318	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-26	16:00:00	17:00:00	0	t	f	\N	2026-06-22 21:27:44.356754+07	f	f
e0e19cc4-21c6-474c-becd-4826cb473236	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-26	17:00:00	18:00:00	0	t	f	\N	2026-06-22 21:27:44.356754+07	f	f
3d923275-b673-47ea-9241-e1a6fb833644	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-26	18:00:00	19:00:00	0	t	f	\N	2026-06-22 21:27:44.356754+07	f	f
25fd036e-f5a3-4079-80f2-b38812d3595d	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-26	19:00:00	20:00:00	0	t	f	\N	2026-06-22 21:27:44.356754+07	f	f
161df7f8-6772-4b6a-846b-a6c16bb4c199	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-26	20:00:00	21:00:00	0	t	f	\N	2026-06-22 21:27:44.356754+07	f	f
f8603af5-d863-4f64-b332-5fb6484c24bf	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-26	21:00:00	22:00:00	0	f	f	\N	2026-06-22 21:27:44.356754+07	f	f
b957784c-64b4-4144-a593-1aa7dcd547b8	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-27	06:00:00	07:00:00	0	f	f	\N	2026-06-22 21:27:44.362789+07	f	f
6e94e83c-5c8d-415c-a1d1-ce61a39a49a6	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-27	07:00:00	08:00:00	0	f	f	\N	2026-06-22 21:27:44.362789+07	f	f
40e76e9d-695a-4a12-b92d-712e89cd40de	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-27	08:00:00	09:00:00	0	f	f	\N	2026-06-22 21:27:44.362789+07	f	f
62a94284-89e5-40e5-afe4-7768f060ac7a	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-27	09:00:00	10:00:00	0	f	f	\N	2026-06-22 21:27:44.362789+07	f	f
573fbaf0-c3be-4c9d-8cbd-5bc555e52975	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-27	10:00:00	11:00:00	0	f	f	\N	2026-06-22 21:27:44.362789+07	f	f
d00ea510-fc15-480a-a698-227eb2b61ad9	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-27	11:00:00	12:00:00	0	f	f	\N	2026-06-22 21:27:44.362789+07	f	f
846f2b4d-ced3-447f-ad3f-541719f558f6	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-27	12:00:00	13:00:00	0	f	f	\N	2026-06-22 21:27:44.362789+07	f	f
f51d6c21-1a60-46ae-ab2a-52e62024c27d	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-27	13:00:00	14:00:00	0	f	f	\N	2026-06-22 21:27:44.362789+07	f	f
62525779-0182-4257-ab1a-d68df3b01f11	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-27	14:00:00	15:00:00	0	f	f	\N	2026-06-22 21:27:44.362789+07	f	f
3e9ac1dd-2073-4a74-971a-ec979daef741	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-27	15:00:00	16:00:00	0	f	f	\N	2026-06-22 21:27:44.362789+07	f	f
b5091552-718d-4a35-b5c7-7ead749d61c2	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-27	16:00:00	17:00:00	0	t	f	\N	2026-06-22 21:27:44.362789+07	f	f
b42ae8c6-9145-4180-829d-850193c2721d	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-27	17:00:00	18:00:00	0	t	f	\N	2026-06-22 21:27:44.362789+07	f	f
815c926c-429d-422b-856a-db836654777c	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-27	18:00:00	19:00:00	0	t	f	\N	2026-06-22 21:27:44.362789+07	f	f
cda7b709-ee20-4b2b-981b-aa3512003dc5	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-27	19:00:00	20:00:00	0	t	f	\N	2026-06-22 21:27:44.362789+07	f	f
112be90f-b050-4d70-a906-be93267bc45b	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-27	20:00:00	21:00:00	0	t	f	\N	2026-06-22 21:27:44.362789+07	f	f
d3a7363c-99a8-46bf-8c3c-9bedc9706a9f	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-27	21:00:00	22:00:00	0	f	f	\N	2026-06-22 21:27:44.362789+07	f	f
9efdb56b-12da-4174-800e-fe4d9cfe0466	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-28	06:00:00	07:00:00	0	f	f	\N	2026-06-22 21:27:44.367207+07	f	f
e790624b-8d0b-49ee-a496-8e6e3ede5650	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-28	07:00:00	08:00:00	0	f	f	\N	2026-06-22 21:27:44.367207+07	f	f
6d6a0b82-f66a-46de-9094-a6d6b4d1ef16	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-28	08:00:00	09:00:00	0	f	f	\N	2026-06-22 21:27:44.367207+07	f	f
bd442523-f189-4ed8-a3b3-69b90f1a9f8c	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-28	09:00:00	10:00:00	0	f	f	\N	2026-06-22 21:27:44.367207+07	f	f
3ffa94e2-aa33-4dec-b14a-7f5cbe2fd19d	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-28	10:00:00	11:00:00	0	f	f	\N	2026-06-22 21:27:44.367207+07	f	f
6508d2a4-2516-4ce3-9186-17f9b5885be4	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-28	11:00:00	12:00:00	0	f	f	\N	2026-06-22 21:27:44.367207+07	f	f
91b25182-4975-4557-b1b2-23e9029f35dd	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-28	12:00:00	13:00:00	0	f	f	\N	2026-06-22 21:27:44.367207+07	f	f
8485069a-e0fc-4c9d-a91d-6421151352d9	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-28	13:00:00	14:00:00	0	f	f	\N	2026-06-22 21:27:44.367207+07	f	f
3833c34e-e3e3-4fc1-b613-37d080e79804	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-28	14:00:00	15:00:00	0	f	f	\N	2026-06-22 21:27:44.367207+07	f	f
ce90ba22-ea57-4592-87c2-c4386220f85f	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-28	15:00:00	16:00:00	0	f	f	\N	2026-06-22 21:27:44.367207+07	f	f
724fd499-9575-4042-96b2-964291bfd26b	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-28	16:00:00	17:00:00	0	t	f	\N	2026-06-22 21:27:44.367207+07	f	f
82a4724c-9765-4b05-a27b-b5acbed4d1f8	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-28	17:00:00	18:00:00	0	t	f	\N	2026-06-22 21:27:44.367207+07	f	f
3bba67e9-9573-4494-b68e-0e231b3d0f73	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-28	18:00:00	19:00:00	0	t	f	\N	2026-06-22 21:27:44.367207+07	f	f
70cfc18a-ef1c-471c-b855-a1db91fab6fd	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-28	19:00:00	20:00:00	0	t	f	\N	2026-06-22 21:27:44.367207+07	f	f
d96eb90a-69f0-4595-a0ab-26225bd37ad3	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-28	20:00:00	21:00:00	0	t	f	\N	2026-06-22 21:27:44.367207+07	f	f
0815c834-b8f6-4a2b-9175-fde48d6e5e16	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-28	21:00:00	22:00:00	0	f	f	\N	2026-06-22 21:27:44.367207+07	f	f
a259ef02-4748-48b6-9bf6-2cabd9966c58	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-29	06:00:00	07:00:00	0	f	f	\N	2026-06-22 21:27:44.372795+07	f	f
add11df4-44c8-4415-ab24-686c9f1f8532	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-29	07:00:00	08:00:00	0	f	f	\N	2026-06-22 21:27:44.372795+07	f	f
0a87afd5-ef98-4896-adb4-4bc293fbeb00	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-29	08:00:00	09:00:00	0	f	f	\N	2026-06-22 21:27:44.372795+07	f	f
bd7d87d5-f974-4e4f-ba97-0a15849639c8	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-29	09:00:00	10:00:00	0	f	f	\N	2026-06-22 21:27:44.372795+07	f	f
d174b4f4-c753-4326-a9ba-dde71219a898	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-29	10:00:00	11:00:00	0	f	f	\N	2026-06-22 21:27:44.372795+07	f	f
885ea60b-6497-4b43-b292-008b35908c97	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-29	11:00:00	12:00:00	0	f	f	\N	2026-06-22 21:27:44.372795+07	f	f
523088c0-9235-4c5b-96cc-28c67dcac1c5	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-29	12:00:00	13:00:00	0	f	f	\N	2026-06-22 21:27:44.372795+07	f	f
768270c4-e85d-4a09-b71d-d1a2bb00c438	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-29	13:00:00	14:00:00	0	f	f	\N	2026-06-22 21:27:44.372795+07	f	f
c6f8a209-dd60-4078-869f-c1b34e7c4dcf	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-29	14:00:00	15:00:00	0	f	f	\N	2026-06-22 21:27:44.372795+07	f	f
66e4dc12-36bb-4bcd-8970-e08ac160ebdd	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-29	15:00:00	16:00:00	0	f	f	\N	2026-06-22 21:27:44.372795+07	f	f
b4d8961f-3651-40bf-84ee-b339b8a25cc8	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-29	16:00:00	17:00:00	0	t	f	\N	2026-06-22 21:27:44.372795+07	f	f
1b3b777c-3f31-4abd-ae02-dc29356398a0	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-29	17:00:00	18:00:00	0	t	f	\N	2026-06-22 21:27:44.372795+07	f	f
332657bf-a9b8-4ca3-ac19-5e3373b74b66	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-29	18:00:00	19:00:00	0	t	f	\N	2026-06-22 21:27:44.372795+07	f	f
b25ec429-7953-4556-8aaa-86aa2896e2eb	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-29	19:00:00	20:00:00	0	t	f	\N	2026-06-22 21:27:44.372795+07	f	f
c30ba65a-0734-4010-9280-60cdf4cf2f97	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-29	20:00:00	21:00:00	0	t	f	\N	2026-06-22 21:27:44.372795+07	f	f
fdd2736d-0e66-47ef-bb11-fc46db134438	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-29	21:00:00	22:00:00	0	f	f	\N	2026-06-22 21:27:44.372795+07	f	f
ef4a96ef-55c9-45aa-ab03-f839dcdbbfd6	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-30	06:00:00	07:00:00	0	f	f	\N	2026-06-22 21:27:44.378403+07	f	f
aa2bda36-94c8-4c9d-85eb-56e39286f5bd	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-30	07:00:00	08:00:00	0	f	f	\N	2026-06-22 21:27:44.378403+07	f	f
202b6fd8-f5c8-4aef-aa0d-e269ed0e0c39	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-30	08:00:00	09:00:00	0	f	f	\N	2026-06-22 21:27:44.378403+07	f	f
51f02d3f-0c37-4bc0-b15e-71ef79b2c1f6	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-30	09:00:00	10:00:00	0	f	f	\N	2026-06-22 21:27:44.378403+07	f	f
b04d5bc1-2b76-4ddb-8911-0cde465da56f	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-30	10:00:00	11:00:00	0	f	f	\N	2026-06-22 21:27:44.378403+07	f	f
bcc34423-3bee-4a81-8969-692714d6cdd4	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-30	11:00:00	12:00:00	0	f	f	\N	2026-06-22 21:27:44.378403+07	f	f
70df677f-b672-4637-849e-d8495f8d6480	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-30	12:00:00	13:00:00	0	f	f	\N	2026-06-22 21:27:44.378403+07	f	f
765fab69-0a8d-483f-925c-8090df3edf21	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-30	13:00:00	14:00:00	0	f	f	\N	2026-06-22 21:27:44.378403+07	f	f
d76cf09a-0315-472a-86c2-08e22ac1d4fc	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-30	14:00:00	15:00:00	0	f	f	\N	2026-06-22 21:27:44.378403+07	f	f
2fd11c75-63be-4015-a614-d29e27959712	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-30	15:00:00	16:00:00	0	f	f	\N	2026-06-22 21:27:44.378403+07	f	f
82cbc04c-5ac8-42d2-b78b-080092c2a6f7	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-30	16:00:00	17:00:00	0	t	f	\N	2026-06-22 21:27:44.378403+07	f	f
baf4686f-43b9-48d9-83d9-56a288d579ad	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-30	17:00:00	18:00:00	0	t	f	\N	2026-06-22 21:27:44.378403+07	f	f
f73465b1-743f-4288-8b8e-902dd4cb3cb8	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-30	18:00:00	19:00:00	0	t	f	\N	2026-06-22 21:27:44.378403+07	f	f
bf8e0bfe-b72b-48a9-b027-625d7d91250c	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-30	19:00:00	20:00:00	0	t	f	\N	2026-06-22 21:27:44.378403+07	f	f
703936d6-298c-487e-af98-3e77753d1bb9	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-30	20:00:00	21:00:00	0	t	f	\N	2026-06-22 21:27:44.378403+07	f	f
8dc4e842-14b1-43e8-a6cd-caf86e88bfd9	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-06-30	21:00:00	22:00:00	0	f	f	\N	2026-06-22 21:27:44.378403+07	f	f
408d906b-a381-439a-9a7b-1ce5bbc4dfcf	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-01	06:00:00	07:00:00	0	f	f	\N	2026-06-22 21:27:44.38315+07	f	f
c9777ab9-9815-424f-b0cb-bc0bc348d155	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-01	07:00:00	08:00:00	0	f	f	\N	2026-06-22 21:27:44.38315+07	f	f
b1b0034c-1fd8-45d3-b541-4c15a0cf6196	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-01	08:00:00	09:00:00	0	f	f	\N	2026-06-22 21:27:44.38315+07	f	f
f6a3b29c-d5b5-41e1-ae8a-e9ccfa78b013	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-01	09:00:00	10:00:00	0	f	f	\N	2026-06-22 21:27:44.38315+07	f	f
7d8d9e33-7ad0-49a6-b202-da21ae90eeb8	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-01	10:00:00	11:00:00	0	f	f	\N	2026-06-22 21:27:44.38315+07	f	f
73c39ed1-56e3-4ae5-85ee-86ba10ebf763	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-01	11:00:00	12:00:00	0	f	f	\N	2026-06-22 21:27:44.38315+07	f	f
5b3eed75-d928-40a8-a98d-87d148e98cc2	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-01	12:00:00	13:00:00	0	f	f	\N	2026-06-22 21:27:44.38315+07	f	f
12212a03-71e5-4a1d-b65a-5795fa3b71b8	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-01	13:00:00	14:00:00	0	f	f	\N	2026-06-22 21:27:44.38315+07	f	f
896c2b1b-d950-4853-bfde-87360c548699	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-01	14:00:00	15:00:00	0	f	f	\N	2026-06-22 21:27:44.38315+07	f	f
8d2d9016-74e4-4d81-966c-82481a86fd32	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-01	15:00:00	16:00:00	0	f	f	\N	2026-06-22 21:27:44.38315+07	f	f
2ed75f6e-0a9a-4e65-bb46-266cfeab781c	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-01	16:00:00	17:00:00	0	t	f	\N	2026-06-22 21:27:44.38315+07	f	f
b255bc25-4702-4f5e-836d-ec4692b6e22f	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-01	17:00:00	18:00:00	0	t	f	\N	2026-06-22 21:27:44.38315+07	f	f
2ec879b6-873a-46f3-93b8-6f3e78838d16	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-01	18:00:00	19:00:00	0	t	f	\N	2026-06-22 21:27:44.38315+07	f	f
314d266e-ae0c-428f-814d-a61f4ea83634	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-01	19:00:00	20:00:00	0	t	f	\N	2026-06-22 21:27:44.38315+07	f	f
f38b74e8-25f6-4b74-b8a9-05859372de28	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-01	20:00:00	21:00:00	0	t	f	\N	2026-06-22 21:27:44.38315+07	f	f
47c485b1-178d-4bba-8925-fbeba926d3a3	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-01	21:00:00	22:00:00	0	f	f	\N	2026-06-22 21:27:44.38315+07	f	f
deb87d5b-40a4-4b85-9d3c-58226e6050f4	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-02	06:00:00	07:00:00	0	f	f	\N	2026-06-22 21:27:44.390125+07	f	f
c00592b1-cc39-4b63-b6df-7e54f640b0bf	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-02	07:00:00	08:00:00	0	f	f	\N	2026-06-22 21:27:44.390125+07	f	f
2351d293-d1a7-4d68-95d1-6b9ea9223883	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-02	08:00:00	09:00:00	0	f	f	\N	2026-06-22 21:27:44.390125+07	f	f
58363f48-4270-4697-a3c0-adee498d70b1	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-02	09:00:00	10:00:00	0	f	f	\N	2026-06-22 21:27:44.390125+07	f	f
3df4559a-5d8f-4dca-a053-5aa6aae03317	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-02	10:00:00	11:00:00	0	f	f	\N	2026-06-22 21:27:44.390125+07	f	f
518d7321-d4c4-46c7-aa6f-526a2ac27895	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-02	11:00:00	12:00:00	0	f	f	\N	2026-06-22 21:27:44.390125+07	f	f
bbc0ac57-09b4-485c-8650-4d2ae5c6705c	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-02	12:00:00	13:00:00	0	f	f	\N	2026-06-22 21:27:44.390125+07	f	f
54a74961-b31a-4782-b75e-2c2795fa5a5f	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-02	13:00:00	14:00:00	0	f	f	\N	2026-06-22 21:27:44.390125+07	f	f
802777f8-2a75-44dc-9130-1f38a862deb5	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-02	14:00:00	15:00:00	0	f	f	\N	2026-06-22 21:27:44.390125+07	f	f
335d0bb5-edde-415e-aaa5-4bbe129ebe07	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-02	15:00:00	16:00:00	0	f	f	\N	2026-06-22 21:27:44.390125+07	f	f
76aab5aa-ec39-483a-8060-8a089e06df68	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-02	16:00:00	17:00:00	0	t	f	\N	2026-06-22 21:27:44.390125+07	f	f
aa941b81-8da2-4fd9-af70-07d247051e1b	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-02	17:00:00	18:00:00	0	t	f	\N	2026-06-22 21:27:44.390125+07	f	f
85e6fd32-f302-46da-a27a-1164dc0f544d	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-02	18:00:00	19:00:00	0	t	f	\N	2026-06-22 21:27:44.390125+07	f	f
ff41bfe9-2918-4fa3-8526-1ea011cd4c43	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-02	19:00:00	20:00:00	0	t	f	\N	2026-06-22 21:27:44.390125+07	f	f
527165e9-af3a-4f2c-9e77-d90aa9de9de2	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-02	20:00:00	21:00:00	0	t	f	\N	2026-06-22 21:27:44.390125+07	f	f
88df8da3-6e29-44ee-898c-bd1557e6e6af	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-02	21:00:00	22:00:00	0	f	f	\N	2026-06-22 21:27:44.390125+07	f	f
daa9dc17-4e5b-4a5c-a7e2-fc6606335ccd	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-03	06:00:00	07:00:00	0	f	f	\N	2026-06-22 21:27:44.395666+07	f	f
41f4994d-ffa0-4c7f-a3c1-1b9ba6feefde	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-03	07:00:00	08:00:00	0	f	f	\N	2026-06-22 21:27:44.395666+07	f	f
71d9e29c-15e3-4ab3-a5ca-7e1f8afb2283	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-03	08:00:00	09:00:00	0	f	f	\N	2026-06-22 21:27:44.395666+07	f	f
9134a24b-804b-46cd-9dd9-d7eb03bb4044	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-03	09:00:00	10:00:00	0	f	f	\N	2026-06-22 21:27:44.395666+07	f	f
fe583b85-0588-4fde-94fc-60440495df59	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-03	10:00:00	11:00:00	0	f	f	\N	2026-06-22 21:27:44.395666+07	f	f
09592ae9-bcb9-45a2-8293-74ba5cda4480	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-03	11:00:00	12:00:00	0	f	f	\N	2026-06-22 21:27:44.395666+07	f	f
ff36d66c-1751-421c-84a9-837e926934b2	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-03	12:00:00	13:00:00	0	f	f	\N	2026-06-22 21:27:44.395666+07	f	f
1ecd5b4e-2e8c-4b9b-8911-4df28fc90c84	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-03	13:00:00	14:00:00	0	f	f	\N	2026-06-22 21:27:44.395666+07	f	f
3c2ccfd2-a42b-4411-aad8-29c12e8a3e51	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-03	14:00:00	15:00:00	0	f	f	\N	2026-06-22 21:27:44.395666+07	f	f
e6ddcc7c-1acf-4535-a31f-e4fd45c5c754	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-03	15:00:00	16:00:00	0	f	f	\N	2026-06-22 21:27:44.395666+07	f	f
639e82b8-8d52-4bc7-9a66-6aef4cc084ee	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-03	16:00:00	17:00:00	0	t	f	\N	2026-06-22 21:27:44.395666+07	f	f
8c4eb9e4-15a6-4135-b2a0-04ac48c87d02	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-03	17:00:00	18:00:00	0	t	f	\N	2026-06-22 21:27:44.395666+07	f	f
aa4b9330-68e3-429a-89fa-13ed460ffecd	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-03	18:00:00	19:00:00	0	t	f	\N	2026-06-22 21:27:44.395666+07	f	f
45f4309a-aa96-48ff-ac16-b82476ee7fbe	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-03	19:00:00	20:00:00	0	t	f	\N	2026-06-22 21:27:44.395666+07	f	f
2a52ac76-33c8-4e1b-ab79-eedb7325c650	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-03	20:00:00	21:00:00	0	t	f	\N	2026-06-22 21:27:44.395666+07	f	f
b8129ab8-c5fa-4f9c-8d30-1ddfd66c6e65	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-03	21:00:00	22:00:00	0	f	f	\N	2026-06-22 21:27:44.395666+07	f	f
5ce303a0-daa5-4908-885a-1c066333ac99	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-04	06:00:00	07:00:00	0	f	f	\N	2026-06-22 21:27:44.399925+07	f	f
bd58fc94-4777-4a06-accf-e52a40dfe0dc	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-04	07:00:00	08:00:00	0	f	f	\N	2026-06-22 21:27:44.399925+07	f	f
0eaa7d8d-b808-445d-a3c8-f873997a100c	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-04	08:00:00	09:00:00	0	f	f	\N	2026-06-22 21:27:44.399925+07	f	f
265dbc9a-49bf-4ec8-a5c1-ad2eb0ae081c	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-04	09:00:00	10:00:00	0	f	f	\N	2026-06-22 21:27:44.399925+07	f	f
4d36c342-c9f2-48bf-9b9f-0e7327e1a520	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-04	10:00:00	11:00:00	0	f	f	\N	2026-06-22 21:27:44.399925+07	f	f
e0eb5896-b5f0-4f35-9784-7de6cba1c13c	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-04	11:00:00	12:00:00	0	f	f	\N	2026-06-22 21:27:44.399925+07	f	f
594c3b0c-f9c8-4bff-b151-81f3b8ddfa3b	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-04	12:00:00	13:00:00	0	f	f	\N	2026-06-22 21:27:44.399925+07	f	f
f9295836-f444-42b1-a4ed-44c799c3f3d4	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-04	13:00:00	14:00:00	0	f	f	\N	2026-06-22 21:27:44.399925+07	f	f
1387d0cd-4e72-4944-a2bd-0383e9dacd18	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-04	14:00:00	15:00:00	0	f	f	\N	2026-06-22 21:27:44.399925+07	f	f
7d53cc38-5115-4eaf-aeda-f9e60ea1ce6f	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-04	15:00:00	16:00:00	0	f	f	\N	2026-06-22 21:27:44.399925+07	f	f
08d17237-62d9-40a5-bfd2-b5ab56079180	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-04	16:00:00	17:00:00	0	t	f	\N	2026-06-22 21:27:44.399925+07	f	f
0c29622e-3585-44ad-9aeb-6f163aee9f81	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-04	17:00:00	18:00:00	0	t	f	\N	2026-06-22 21:27:44.399925+07	f	f
21774c8f-0116-4559-aaac-b6837534fe69	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-04	18:00:00	19:00:00	0	t	f	\N	2026-06-22 21:27:44.399925+07	f	f
3d3af61b-888b-4bc3-a416-9096c812e339	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-04	19:00:00	20:00:00	0	t	f	\N	2026-06-22 21:27:44.399925+07	f	f
abfa9969-5dda-41a4-9f0c-965bdc1b5654	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-04	20:00:00	21:00:00	0	t	f	\N	2026-06-22 21:27:44.399925+07	f	f
896319c5-9e9f-4b2d-b2d5-920e11033eaa	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-04	21:00:00	22:00:00	0	f	f	\N	2026-06-22 21:27:44.399925+07	f	f
fa911c6d-9e7c-4689-8eb7-d25512cee018	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-05	06:00:00	07:00:00	0	f	f	\N	2026-06-22 21:27:44.404854+07	f	f
25707f11-2ac8-4e44-ab10-047b8f31fb5c	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-05	07:00:00	08:00:00	0	f	f	\N	2026-06-22 21:27:44.404854+07	f	f
5b844feb-a344-4282-9c78-76e1e8fe6951	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-05	08:00:00	09:00:00	0	f	f	\N	2026-06-22 21:27:44.404854+07	f	f
8001cb5a-63ff-456c-b0a3-73eef95711ea	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-05	09:00:00	10:00:00	0	f	f	\N	2026-06-22 21:27:44.404854+07	f	f
4d42629f-058d-4773-b178-b1d7ff5c9939	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-05	10:00:00	11:00:00	0	f	f	\N	2026-06-22 21:27:44.404854+07	f	f
527f8b21-c933-4cda-a3e6-0998d3d4380d	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-05	11:00:00	12:00:00	0	f	f	\N	2026-06-22 21:27:44.404854+07	f	f
10591b72-08e7-46e8-bbe6-89eb599fbc42	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-05	12:00:00	13:00:00	0	f	f	\N	2026-06-22 21:27:44.404854+07	f	f
08653964-540f-413c-8a30-d13285afdced	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-05	13:00:00	14:00:00	0	f	f	\N	2026-06-22 21:27:44.404854+07	f	f
11470968-245d-4e9a-aa5d-4570a1988f81	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-05	14:00:00	15:00:00	0	f	f	\N	2026-06-22 21:27:44.404854+07	f	f
d8717676-4916-43c0-89fe-06a68dbb5c9c	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-05	15:00:00	16:00:00	0	f	f	\N	2026-06-22 21:27:44.404854+07	f	f
74ef2783-0a47-42e5-8b3d-e7c7d376e910	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-05	16:00:00	17:00:00	0	t	f	\N	2026-06-22 21:27:44.404854+07	f	f
162115e1-9a43-4a2b-ad27-a67d37a0e5be	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-05	17:00:00	18:00:00	0	t	f	\N	2026-06-22 21:27:44.404854+07	f	f
abfa3138-509a-4382-98ae-6a1d555a625e	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-05	18:00:00	19:00:00	0	t	f	\N	2026-06-22 21:27:44.404854+07	f	f
5b6ac2d0-b095-49f9-b0af-b56158cd7b7c	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-05	19:00:00	20:00:00	0	t	f	\N	2026-06-22 21:27:44.404854+07	f	f
e0216da2-16e5-4725-91ee-ecfbed00eccb	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-05	20:00:00	21:00:00	0	t	f	\N	2026-06-22 21:27:44.404854+07	f	f
851d377a-ab3c-474a-a4df-2cf89e2723ed	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-05	21:00:00	22:00:00	0	f	f	\N	2026-06-22 21:27:44.404854+07	f	f
c7506606-09f5-4493-bcea-a7db884b7a15	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-06	06:00:00	07:00:00	0	f	f	\N	2026-06-23 07:21:43.214857+07	f	f
64f8944f-961c-4c51-9b13-5b58859c82a2	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-06	07:00:00	08:00:00	0	f	f	\N	2026-06-23 07:21:43.214857+07	f	f
79c9da3e-2533-41a7-9c4b-ac9162c53ad2	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-06	08:00:00	09:00:00	0	f	f	\N	2026-06-23 07:21:43.214857+07	f	f
faa1ef31-53a0-47f0-824c-e419df69d19c	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-06	09:00:00	10:00:00	0	f	f	\N	2026-06-23 07:21:43.214857+07	f	f
4766b042-c67c-4714-8c37-b9603fdeb989	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-06	10:00:00	11:00:00	0	f	f	\N	2026-06-23 07:21:43.214857+07	f	f
bdcc6e48-da47-4b0a-a68b-efb0ff94e310	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-06	11:00:00	12:00:00	0	f	f	\N	2026-06-23 07:21:43.214857+07	f	f
1ceff2eb-c381-41d7-a770-9a240ff42bc3	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-06	12:00:00	13:00:00	0	f	f	\N	2026-06-23 07:21:43.214857+07	f	f
b88c2934-7130-419d-96ed-8da0c0b29b4a	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-06	13:00:00	14:00:00	0	f	f	\N	2026-06-23 07:21:43.214857+07	f	f
1c999fe2-d62d-4c6b-a806-877c27d1a7cb	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-06	14:00:00	15:00:00	0	f	f	\N	2026-06-23 07:21:43.214857+07	f	f
40505bcc-e913-4c31-acdd-455836fd84db	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-06	15:00:00	16:00:00	0	f	f	\N	2026-06-23 07:21:43.214857+07	f	f
38a47eda-91af-40d8-81bc-1d0adbc4a23b	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-06	16:00:00	17:00:00	0	t	f	\N	2026-06-23 07:21:43.214857+07	f	f
ea2a215e-2771-474c-99c4-9994621d001b	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-06	17:00:00	18:00:00	0	t	f	\N	2026-06-23 07:21:43.214857+07	f	f
1e1e36d6-1ad8-4744-9626-cb133baff4aa	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-06	18:00:00	19:00:00	0	t	f	\N	2026-06-23 07:21:43.214857+07	f	f
9cd56c02-0032-476a-bac1-609d59511eea	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-06	19:00:00	20:00:00	0	t	f	\N	2026-06-23 07:21:43.214857+07	f	f
fcd79a31-0f00-449c-9710-bbc49b33875c	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-06	20:00:00	21:00:00	0	t	f	\N	2026-06-23 07:21:43.214857+07	f	f
ed93fb39-a66b-4c69-bcd5-a9b33f09d79a	1bbeb2d4-bf00-48e2-ba88-0b1ad1b23860	2026-07-06	21:00:00	22:00:00	0	f	f	\N	2026-06-23 07:21:43.214857+07	f	f
\.


--
-- Data for Name: tournament_registrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tournament_registrations (id, tournament_id, user_id, team_name, registered_at) FROM stdin;
\.


--
-- Data for Name: tournaments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tournaments (id, organizer_id, title, sport, status, start_date, end_date, venue_name, venue_address, participants_limit, registered_count, prize_pool, entry_fee, image_url, description, rules, bracket_data, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_profiles (id, user_id, display_name, avatar_url, gender, active_area, bio, wallet_balance, points, tier, created_at, updated_at, profile_completed) FROM stdin;
5747e038-ad26-4cfe-8b62-3968ede1ff89	ff9a13ed-8519-4020-a69c-2747b705b065	SportRes Admin	\N	\N	\N	\N	0	0	Đồng	2026-06-22 21:20:03.512693+07	2026-06-23 08:03:01.607314+07	t
bad98043-1b21-4414-9b55-89d16def03fd	8248808e-cb5b-4a9d-9ef2-7a05127342a3	Nguyễn Thu Hương	\N	\N	Xóm Chùa 2, Yên Xuân, Hà Nội.	\N	0	0	Đồng	2026-06-22 21:27:44.076404+07	2026-06-23 08:03:01.607314+07	t
48a80b59-93b5-4139-818e-5dead7e6c20b	d2b2440a-cd9e-495d-8771-967d9a71085e	Nguyễn Minh Quân	\N	Nam	Thạch Thất, Hà Nội	\N	0	0	Đồng	2026-06-23 07:42:14.213264+07	2026-06-23 08:19:33.627098+07	t
\.


--
-- Data for Name: user_sport_skills; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_sport_skills (id, user_id, sport, skill, is_favorite, created_at) FROM stdin;
eec735f0-8082-445f-ba48-f03ae22142e0	d2b2440a-cd9e-495d-8771-967d9a71085e	soccer	Beginner	t	2026-06-23 08:19:33.627098+07
7fc6b922-1013-4a3b-93d4-8186c6cb114f	d2b2440a-cd9e-495d-8771-967d9a71085e	badminton	Intermediate	t	2026-06-23 08:19:33.627098+07
4e198eca-54c3-451f-a0b7-f29b0a734cbe	d2b2440a-cd9e-495d-8771-967d9a71085e	tennis	Beginner	f	2026-06-23 08:19:33.627098+07
e8560c4c-d972-4c0c-a721-b665da32a9bb	d2b2440a-cd9e-495d-8771-967d9a71085e	basketball	Beginner	f	2026-06-23 08:19:33.627098+07
227168bb-97d5-48af-941b-b6e9d602ad8a	d2b2440a-cd9e-495d-8771-967d9a71085e	pickleball	Beginner	f	2026-06-23 08:19:33.627098+07
9dd27d49-13a6-4dbb-aa79-ed9ba51baecc	d2b2440a-cd9e-495d-8771-967d9a71085e	volleyball	Beginner	f	2026-06-23 08:19:33.627098+07
78f2a27e-0d4d-4d5a-8f47-6cdc775cd30a	d2b2440a-cd9e-495d-8771-967d9a71085e	golf	Beginner	f	2026-06-23 08:19:33.627098+07
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, username, email, phone, password_hash, role, status, created_at, updated_at, last_login_at, full_name) FROM stdin;
ff9a13ed-8519-4020-a69c-2747b705b065	admin	\N	0914181298	$2b$12$ys.DP5DomWLXJMVaoMymCuntdTB7AxgoVBig0wlYQRd1iDqLfBq42	admin	active	2026-06-22 21:20:03.512693+07	2026-06-23 08:19:07.014942+07	2026-06-23 08:19:07.014942+07	SportRes Admin
d2b2440a-cd9e-495d-8771-967d9a71085e	09141812988	\N	09141812988	$2b$10$vIDq1kS.w6gkkcOzzWJqGeiWwv9QsNINKfDA5jgoKuB0bNgflVGYS	player	active	2026-06-23 07:42:14.213264+07	2026-06-23 08:19:33.627098+07	2026-06-23 08:19:25.808784+07	Nguyễn Minh Quân
8248808e-cb5b-4a9d-9ef2-7a05127342a3	0947401298	\N	0947401298	$2b$10$7KilTJKrexBfnQXgy3vRouowB7U1rDKvIaBedgZJFqSA0taL69Yua	venue_owner	active	2026-06-22 21:27:44.076404+07	2026-06-23 07:22:03.150506+07	2026-06-23 07:22:03.150506+07	Nguyễn Thu Hương
\.


--
-- Data for Name: venue_requests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.venue_requests (id, owner_id, name, address, district, sport, price_per_hour, opening_hour, closing_hour, closed_days, description, image_url, status, rejection_reason, created_at, reviewed_at) FROM stdin;
\.


--
-- Data for Name: venues; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.venues (id, owner_id, name, address, district, city, description, image_url, latitude, longitude, rating, reviews_count, status, amenities, opening_hour, closing_hour, phone, created_at, updated_at, internal_note) FROM stdin;
5311f3aa-013c-41e5-ab9b-612c3449919f	8248808e-cb5b-4a9d-9ef2-7a05127342a3	Queen Bee Sports	Xóm Chùa 2, Yên Xuân, Hà Nội	Xóm Chùa 2, Yên Xuân, Hà Nội.	Hà Nội	\N	\N	\N	\N	0.0	0	active	\N	05:00:00	22:00:00	\N	2026-06-22 21:27:44.076404+07	2026-06-22 21:27:44.076404+07	\N
\.


--
-- Data for Name: wallet_transactions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.wallet_transactions (id, user_id, type, amount, balance_after, reference_id, description, created_at) FROM stdin;
\.


--
-- Name: booking_extras booking_extras_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking_extras
    ADD CONSTRAINT booking_extras_pkey PRIMARY KEY (id);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: bookings bookings_qr_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_qr_code_key UNIQUE (qr_code);


--
-- Name: conversation_members conversation_members_conversation_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_members
    ADD CONSTRAINT conversation_members_conversation_id_user_id_key UNIQUE (conversation_id, user_id);


--
-- Name: conversation_members conversation_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_members
    ADD CONSTRAINT conversation_members_pkey PRIMARY KEY (id);


--
-- Name: conversations conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);


--
-- Name: court_schedules court_schedules_court_id_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.court_schedules
    ADD CONSTRAINT court_schedules_court_id_date_key UNIQUE (court_id, date);


--
-- Name: court_schedules court_schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.court_schedules
    ADD CONSTRAINT court_schedules_pkey PRIMARY KEY (id);


--
-- Name: courts courts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courts
    ADD CONSTRAINT courts_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_user_id_venue_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_venue_id_key UNIQUE (user_id, venue_id);


--
-- Name: friend_requests friend_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.friend_requests
    ADD CONSTRAINT friend_requests_pkey PRIMARY KEY (id);


--
-- Name: friend_requests friend_requests_sender_id_receiver_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.friend_requests
    ADD CONSTRAINT friend_requests_sender_id_receiver_id_key UNIQUE (sender_id, receiver_id);


--
-- Name: match_participants match_participants_match_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.match_participants
    ADD CONSTRAINT match_participants_match_id_user_id_key UNIQUE (match_id, user_id);


--
-- Name: match_participants match_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.match_participants
    ADD CONSTRAINT match_participants_pkey PRIMARY KEY (id);


--
-- Name: matches matches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: time_slots time_slots_court_id_date_start_time_end_time_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.time_slots
    ADD CONSTRAINT time_slots_court_id_date_start_time_end_time_key UNIQUE (court_id, date, start_time, end_time);


--
-- Name: time_slots time_slots_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.time_slots
    ADD CONSTRAINT time_slots_pkey PRIMARY KEY (id);


--
-- Name: tournament_registrations tournament_registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tournament_registrations
    ADD CONSTRAINT tournament_registrations_pkey PRIMARY KEY (id);


--
-- Name: tournament_registrations tournament_registrations_tournament_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tournament_registrations
    ADD CONSTRAINT tournament_registrations_tournament_id_user_id_key UNIQUE (tournament_id, user_id);


--
-- Name: tournaments tournaments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tournaments
    ADD CONSTRAINT tournaments_pkey PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);


--
-- Name: user_sport_skills user_sport_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sport_skills
    ADD CONSTRAINT user_sport_skills_pkey PRIMARY KEY (id);


--
-- Name: user_sport_skills user_sport_skills_user_id_sport_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sport_skills
    ADD CONSTRAINT user_sport_skills_user_id_sport_key UNIQUE (user_id, sport);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: venue_requests venue_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.venue_requests
    ADD CONSTRAINT venue_requests_pkey PRIMARY KEY (id);


--
-- Name: venues venues_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.venues
    ADD CONSTRAINT venues_pkey PRIMARY KEY (id);


--
-- Name: wallet_transactions wallet_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wallet_transactions
    ADD CONSTRAINT wallet_transactions_pkey PRIMARY KEY (id);


--
-- Name: idx_booking_extras_booking_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_booking_extras_booking_id ON public.booking_extras USING btree (booking_id);


--
-- Name: idx_bookings_booking_code; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_bookings_booking_code ON public.bookings USING btree (booking_code);


--
-- Name: idx_bookings_court_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bookings_court_id ON public.bookings USING btree (court_id);


--
-- Name: idx_bookings_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bookings_date ON public.bookings USING btree (date);


--
-- Name: idx_bookings_payment_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bookings_payment_status ON public.bookings USING btree (payment_status);


--
-- Name: idx_bookings_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bookings_status ON public.bookings USING btree (status);


--
-- Name: idx_bookings_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bookings_user_id ON public.bookings USING btree (user_id);


--
-- Name: idx_bookings_venue_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bookings_venue_id ON public.bookings USING btree (venue_id);


--
-- Name: idx_conversation_members_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversation_members_user ON public.conversation_members USING btree (user_id);


--
-- Name: idx_courts_sport; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_courts_sport ON public.courts USING btree (sport);


--
-- Name: idx_courts_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_courts_status ON public.courts USING btree (status);


--
-- Name: idx_courts_venue_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_courts_venue_id ON public.courts USING btree (venue_id);


--
-- Name: idx_favorites_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_favorites_user ON public.favorites USING btree (user_id);


--
-- Name: idx_friend_requests_receiver; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_friend_requests_receiver ON public.friend_requests USING btree (receiver_id);


--
-- Name: idx_friend_requests_sender; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_friend_requests_sender ON public.friend_requests USING btree (sender_id);


--
-- Name: idx_match_participants_match_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_match_participants_match_id ON public.match_participants USING btree (match_id);


--
-- Name: idx_match_participants_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_match_participants_user_id ON public.match_participants USING btree (user_id);


--
-- Name: idx_matches_booking_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_matches_booking_id ON public.matches USING btree (booking_id) WHERE (booking_id IS NOT NULL);


--
-- Name: idx_matches_creator_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_matches_creator_id ON public.matches USING btree (creator_id);


--
-- Name: idx_matches_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_matches_date ON public.matches USING btree (match_date);


--
-- Name: idx_matches_sport; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_matches_sport ON public.matches USING btree (sport);


--
-- Name: idx_matches_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_matches_status ON public.matches USING btree (status);


--
-- Name: idx_messages_conversation; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_messages_conversation ON public.messages USING btree (conversation_id);


--
-- Name: idx_messages_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_messages_created_at ON public.messages USING btree (created_at);


--
-- Name: idx_messages_sender; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_messages_sender ON public.messages USING btree (sender_id);


--
-- Name: idx_notifications_read; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_read ON public.notifications USING btree (is_read);


--
-- Name: idx_notifications_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_user ON public.notifications USING btree (user_id);


--
-- Name: idx_reviews_reviewer; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reviews_reviewer ON public.reviews USING btree (reviewer_id);


--
-- Name: idx_reviews_venue; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reviews_venue ON public.reviews USING btree (venue_id);


--
-- Name: idx_time_slots_booked; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_time_slots_booked ON public.time_slots USING btree (is_booked);


--
-- Name: idx_time_slots_court_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_time_slots_court_date ON public.time_slots USING btree (court_id, date);


--
-- Name: idx_tournament_registrations_tournament; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tournament_registrations_tournament ON public.tournament_registrations USING btree (tournament_id);


--
-- Name: idx_tournaments_sport; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tournaments_sport ON public.tournaments USING btree (sport);


--
-- Name: idx_tournaments_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tournaments_status ON public.tournaments USING btree (status);


--
-- Name: idx_user_profiles_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_profiles_user_id ON public.user_profiles USING btree (user_id);


--
-- Name: idx_user_sport_skills_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_sport_skills_user_id ON public.user_sport_skills USING btree (user_id);


--
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- Name: idx_users_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_status ON public.users USING btree (status);


--
-- Name: idx_users_username; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_username ON public.users USING btree (username);


--
-- Name: idx_venue_requests_owner_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_venue_requests_owner_id ON public.venue_requests USING btree (owner_id);


--
-- Name: idx_venue_requests_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_venue_requests_status ON public.venue_requests USING btree (status);


--
-- Name: idx_venues_city; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_venues_city ON public.venues USING btree (city);


--
-- Name: idx_venues_coordinates; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_venues_coordinates ON public.venues USING btree (latitude, longitude);


--
-- Name: idx_venues_owner_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_venues_owner_id ON public.venues USING btree (owner_id);


--
-- Name: idx_venues_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_venues_status ON public.venues USING btree (status);


--
-- Name: idx_wallet_transactions_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_wallet_transactions_created ON public.wallet_transactions USING btree (created_at);


--
-- Name: idx_wallet_transactions_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_wallet_transactions_type ON public.wallet_transactions USING btree (type);


--
-- Name: idx_wallet_transactions_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_wallet_transactions_user ON public.wallet_transactions USING btree (user_id);


--
-- Name: bookings trg_bookings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: conversations trg_conversations_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_conversations_updated_at BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: courts trg_courts_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_courts_updated_at BEFORE UPDATE ON public.courts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: matches trg_matches_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_matches_updated_at BEFORE UPDATE ON public.matches FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: tournaments trg_tournaments_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_tournaments_updated_at BEFORE UPDATE ON public.tournaments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: user_profiles trg_user_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: users trg_users_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: bookings trg_validate_booking_court_venue; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_validate_booking_court_venue BEFORE INSERT OR UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.validate_booking_court_venue();


--
-- Name: venues trg_venues_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_venues_updated_at BEFORE UPDATE ON public.venues FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: booking_extras booking_extras_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking_extras
    ADD CONSTRAINT booking_extras_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE;


--
-- Name: bookings bookings_court_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_court_id_fkey FOREIGN KEY (court_id) REFERENCES public.courts(id) ON DELETE CASCADE;


--
-- Name: bookings bookings_time_slot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_time_slot_id_fkey FOREIGN KEY (time_slot_id) REFERENCES public.time_slots(id) ON DELETE CASCADE;


--
-- Name: bookings bookings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: bookings bookings_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(id) ON DELETE CASCADE;


--
-- Name: conversation_members conversation_members_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_members
    ADD CONSTRAINT conversation_members_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;


--
-- Name: conversation_members conversation_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_members
    ADD CONSTRAINT conversation_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: court_schedules court_schedules_court_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.court_schedules
    ADD CONSTRAINT court_schedules_court_id_fkey FOREIGN KEY (court_id) REFERENCES public.courts(id) ON DELETE CASCADE;


--
-- Name: courts courts_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courts
    ADD CONSTRAINT courts_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(id) ON DELETE CASCADE;


--
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: favorites favorites_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(id) ON DELETE CASCADE;


--
-- Name: friend_requests friend_requests_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.friend_requests
    ADD CONSTRAINT friend_requests_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: friend_requests friend_requests_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.friend_requests
    ADD CONSTRAINT friend_requests_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: match_participants match_participants_match_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.match_participants
    ADD CONSTRAINT match_participants_match_id_fkey FOREIGN KEY (match_id) REFERENCES public.matches(id) ON DELETE CASCADE;


--
-- Name: match_participants match_participants_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.match_participants
    ADD CONSTRAINT match_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: matches matches_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE SET NULL;


--
-- Name: matches matches_court_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_court_id_fkey FOREIGN KEY (court_id) REFERENCES public.courts(id) ON DELETE SET NULL;


--
-- Name: matches matches_creator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: matches matches_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(id) ON DELETE SET NULL;


--
-- Name: messages messages_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;


--
-- Name: messages messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE SET NULL;


--
-- Name: reviews reviews_court_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_court_id_fkey FOREIGN KEY (court_id) REFERENCES public.courts(id) ON DELETE SET NULL;


--
-- Name: reviews reviews_reviewer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(id) ON DELETE CASCADE;


--
-- Name: time_slots time_slots_booked_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.time_slots
    ADD CONSTRAINT time_slots_booked_by_fkey FOREIGN KEY (booked_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: time_slots time_slots_court_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.time_slots
    ADD CONSTRAINT time_slots_court_id_fkey FOREIGN KEY (court_id) REFERENCES public.courts(id) ON DELETE CASCADE;


--
-- Name: tournament_registrations tournament_registrations_tournament_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tournament_registrations
    ADD CONSTRAINT tournament_registrations_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id) ON DELETE CASCADE;


--
-- Name: tournament_registrations tournament_registrations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tournament_registrations
    ADD CONSTRAINT tournament_registrations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: tournaments tournaments_organizer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tournaments
    ADD CONSTRAINT tournaments_organizer_id_fkey FOREIGN KEY (organizer_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_profiles user_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_sport_skills user_sport_skills_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sport_skills
    ADD CONSTRAINT user_sport_skills_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: venue_requests venue_requests_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.venue_requests
    ADD CONSTRAINT venue_requests_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: venues venues_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.venues
    ADD CONSTRAINT venues_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: wallet_transactions wallet_transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wallet_transactions
    ADD CONSTRAINT wallet_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict Wl8SzQyvL0AzzUl5pqSE0vKE4dRsdT9pEWbzPP2aIojkeLhBt9DFmpdNquD6Wuh

