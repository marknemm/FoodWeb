--
-- PostgreSQL database dump
--

-- Dumped from database version 11.2 (Debian 11.2-1.pgdg90+1)
-- Dumped by pg_dump version 11.7 (Debian 11.7-2.pgdg90+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: tiger; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA tiger;


ALTER SCHEMA tiger OWNER TO postgres;

--
-- Name: tiger_data; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA tiger_data;


ALTER SCHEMA tiger_data OWNER TO postgres;

--
-- Name: topology; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA topology;


ALTER SCHEMA topology OWNER TO postgres;

--
-- Name: SCHEMA topology; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA topology IS 'PostGIS Topology schema';


--
-- Name: fuzzystrmatch; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS fuzzystrmatch WITH SCHEMA public;


--
-- Name: EXTENSION fuzzystrmatch; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION fuzzystrmatch IS 'determine similarities and distance between strings';


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry, geography, and raster spatial types and functions';


--
-- Name: postgis_tiger_geocoder; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder WITH SCHEMA tiger;


--
-- Name: EXTENSION postgis_tiger_geocoder; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis_tiger_geocoder IS 'PostGIS tiger geocoder and reverse geocoder';


--
-- Name: postgis_topology; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS postgis_topology WITH SCHEMA topology;


--
-- Name: EXTENSION postgis_topology; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis_topology IS 'PostGIS topology spatial types and functions';


--
-- Name: account_accounttype_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.account_accounttype_enum AS ENUM (
    'Donor',
    'Receiver',
    'Volunteer',
    'Admin'
);


ALTER TYPE public.account_accounttype_enum OWNER TO postgres;

--
-- Name: audit_eventtype_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.audit_eventtype_enum AS ENUM (
    'Signup',
    'Verify Account',
    'Remove Unverified Account',
    'Update Account',
    'Update Password',
    'Reset Password',
    'Donate',
    'Update Donation',
    'Remove Donation',
    'Claim Donation',
    'Unclaim Donation',
    'Schedule Delivery',
    'Cancel Delivery',
    'Delivery State Advance',
    'Delivery State Undo',
    'Save App Data',
    'Remove App Data'
);


ALTER TYPE public.audit_eventtype_enum OWNER TO postgres;

--
-- Name: donation_donationstatus_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.donation_donationstatus_enum AS ENUM (
    'Unmatched',
    'Matched',
    'Scheduled',
    'Started',
    'Picked Up',
    'Complete'
);


ALTER TYPE public.donation_donationstatus_enum OWNER TO postgres;

--
-- Name: notification_notificationtype_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.notification_notificationtype_enum AS ENUM (
    'Signup',
    'Donate',
    'Update Donation',
    'Remove Donation',
    'Claim Donation',
    'Unclaim Donation',
    'Schedule Delivery',
    'Cancel Delivery',
    'Delivery State Advance',
    'Delivery State Undo',
    'Delivery Reminder'
);


ALTER TYPE public.notification_notificationtype_enum OWNER TO postgres;

--
-- Name: operationhours_weekday_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.operationhours_weekday_enum AS ENUM (
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
);


ALTER TYPE public.operationhours_weekday_enum OWNER TO postgres;

--
-- Name: updateDonationComplete(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public."updateDonationComplete"() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
      BEGIN
        NEW."complete" := (NEW."donationStatus" = 'Complete');
        RETURN NEW;
      END;
      $$;


ALTER FUNCTION public."updateDonationComplete"() OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Account" (
    id integer NOT NULL,
    "accountType" public.account_accounttype_enum NOT NULL,
    username character varying NOT NULL,
    "updateTimestamp" timestamp with time zone DEFAULT now() NOT NULL,
    "createTimestamp" timestamp with time zone DEFAULT now() NOT NULL,
    "profileImgUrl" character varying NOT NULL,
    "lastSeenNotificationId" integer DEFAULT '-1'::integer NOT NULL,
    "contactInfoId" integer
);


ALTER TABLE public."Account" OWNER TO postgres;

--
-- Name: Account_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Account_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Account_id_seq" OWNER TO postgres;

--
-- Name: Account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Account_id_seq" OWNED BY public."Account".id;


--
-- Name: AppData; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AppData" (
    "deviceUuid" character varying NOT NULL,
    "accountId" integer NOT NULL,
    "devicePlatform" character varying,
    "deviceModel" character varying,
    "deviceVersion" character varying,
    "deviceManufacturer" character varying,
    "deviceSerial" character varying,
    "deviceIsVirtual" boolean DEFAULT false NOT NULL,
    "pushRegistrationId" character varying,
    "createTimestamp" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."AppData" OWNER TO postgres;

--
-- Name: AppSession; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AppSession" (
    id integer NOT NULL,
    "appSessionToken" character varying NOT NULL,
    "createTimestamp" timestamp with time zone DEFAULT now() NOT NULL,
    "updateTimestamp" timestamp with time zone DEFAULT now() NOT NULL,
    "accountId" integer NOT NULL
);


ALTER TABLE public."AppSession" OWNER TO postgres;

--
-- Name: AppSession_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."AppSession_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."AppSession_id_seq" OWNER TO postgres;

--
-- Name: AppSession_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."AppSession_id_seq" OWNED BY public."AppSession".id;


--
-- Name: Audit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Audit" (
    id integer NOT NULL,
    "eventType" public.audit_eventtype_enum NOT NULL,
    data json NOT NULL,
    "recaptchaScore" double precision,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."Audit" OWNER TO postgres;

--
-- Name: AuditAccountMap; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AuditAccountMap" (
    "auditId" integer NOT NULL,
    "accountId" integer NOT NULL
);


ALTER TABLE public."AuditAccountMap" OWNER TO postgres;

--
-- Name: Audit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Audit_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Audit_id_seq" OWNER TO postgres;

--
-- Name: Audit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Audit_id_seq" OWNED BY public."Audit".id;


--
-- Name: AutoClaimHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AutoClaimHistory" (
    id integer NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    "claimId" integer
);


ALTER TABLE public."AutoClaimHistory" OWNER TO postgres;

--
-- Name: AutoClaimHistory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."AutoClaimHistory_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."AutoClaimHistory_id_seq" OWNER TO postgres;

--
-- Name: AutoClaimHistory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."AutoClaimHistory_id_seq" OWNED BY public."AutoClaimHistory".id;


--
-- Name: ClaimReqHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ClaimReqHistory" (
    id integer NOT NULL,
    "donationId" integer,
    "receiverAccountId" integer
);


ALTER TABLE public."ClaimReqHistory" OWNER TO postgres;

--
-- Name: ClaimReqHistory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ClaimReqHistory_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ClaimReqHistory_id_seq" OWNER TO postgres;

--
-- Name: ClaimReqHistory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ClaimReqHistory_id_seq" OWNED BY public."ClaimReqHistory".id;


--
-- Name: ContactInfo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ContactInfo" (
    id integer NOT NULL,
    email character varying NOT NULL,
    "phoneNumber" character varying NOT NULL,
    "streetAddress" character varying NOT NULL,
    city character varying NOT NULL,
    "stateProvince" character varying NOT NULL,
    "postalCode" character varying NOT NULL,
    location public.geography NOT NULL,
    timezone character varying NOT NULL,
    "enableEmail" boolean DEFAULT true NOT NULL,
    "enablePushNotification" boolean DEFAULT true NOT NULL,
    "notifyForEachDonation" boolean DEFAULT true NOT NULL
);


ALTER TABLE public."ContactInfo" OWNER TO postgres;

--
-- Name: ContactInfo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ContactInfo_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ContactInfo_id_seq" OWNER TO postgres;

--
-- Name: ContactInfo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ContactInfo_id_seq" OWNED BY public."ContactInfo".id;


--
-- Name: Delivery; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Delivery" (
    id integer NOT NULL,
    "pickupTime" timestamp with time zone,
    "dropOffTime" timestamp with time zone,
    "claimId" integer,
    "volunteerAccountId" integer,
    "pickupWindowStart" timestamp with time zone NOT NULL,
    "pickupWindowEnd" timestamp with time zone NOT NULL,
    "createTimestamp" timestamp with time zone DEFAULT now() NOT NULL,
    "routeToDonorId" integer,
    "startTime" timestamp with time zone,
    "dropOffWindowStart" timestamp with time zone NOT NULL,
    "dropOffWindowEnd" timestamp with time zone NOT NULL
);


ALTER TABLE public."Delivery" OWNER TO postgres;

--
-- Name: DeliveryReqHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DeliveryReqHistory" (
    id integer NOT NULL,
    "donationId" integer,
    "volunteerAccountId" integer
);


ALTER TABLE public."DeliveryReqHistory" OWNER TO postgres;

--
-- Name: DeliveryReqHistory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."DeliveryReqHistory_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."DeliveryReqHistory_id_seq" OWNER TO postgres;

--
-- Name: DeliveryReqHistory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."DeliveryReqHistory_id_seq" OWNED BY public."DeliveryReqHistory".id;


--
-- Name: Delivery_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Delivery_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Delivery_id_seq" OWNER TO postgres;

--
-- Name: Delivery_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Delivery_id_seq" OWNED BY public."Delivery".id;


--
-- Name: DevDbMetadata; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DevDbMetadata" (
    "createTimestamp" timestamp without time zone DEFAULT now() NOT NULL,
    "replaceDevPasswords" boolean DEFAULT false NOT NULL,
    "purgeDevPassResetTokens" boolean DEFAULT false NOT NULL,
    "purgeDevAppSessionsData" boolean DEFAULT false NOT NULL,
    "replaceDevPassVerificationTokens" boolean DEFAULT false NOT NULL,
    "replaceVolunteerNames" boolean DEFAULT false NOT NULL,
    "replaceEmails" boolean DEFAULT false NOT NULL,
    "replaceUsernames" boolean DEFAULT false NOT NULL,
    "replacePhoneNumbers" boolean DEFAULT false NOT NULL,
    "purgeAudits" boolean DEFAULT false NOT NULL,
    "purgeNotifications" boolean DEFAULT false NOT NULL,
    "purgeEventRegistrations" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."DevDbMetadata" OWNER TO postgres;

--
-- Name: Donation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Donation" (
    id integer NOT NULL,
    "donorLastName" character varying NOT NULL,
    "donorFirstName" character varying NOT NULL,
    "donationType" character varying NOT NULL,
    description character varying NOT NULL,
    "estimatedValue" numeric,
    "donationStatus" public.donation_donationstatus_enum DEFAULT 'Unmatched'::public.donation_donationstatus_enum NOT NULL,
    "updateTimestamp" timestamp with time zone DEFAULT now() NOT NULL,
    "createTimestamp" timestamp with time zone DEFAULT now() NOT NULL,
    "donorAccountId" integer,
    "pickupWindowStart" timestamp with time zone NOT NULL,
    "pickupWindowEnd" timestamp with time zone NOT NULL,
    "estimatedNumFeed" integer NOT NULL,
    "donorContactOverrideId" integer,
    complete boolean DEFAULT false
);


ALTER TABLE public."Donation" OWNER TO postgres;

--
-- Name: DonationClaim; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DonationClaim" (
    id integer NOT NULL,
    "createTimestamp" timestamp with time zone DEFAULT now() NOT NULL,
    "donationId" integer,
    "receiverAccountId" integer,
    "routeToReceiverId" integer,
    "dropOffWindowStart" timestamp without time zone NOT NULL,
    "dropOffWindowEnd" timestamp without time zone NOT NULL
);


ALTER TABLE public."DonationClaim" OWNER TO postgres;

--
-- Name: DonationClaim_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."DonationClaim_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."DonationClaim_id_seq" OWNER TO postgres;

--
-- Name: DonationClaim_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."DonationClaim_id_seq" OWNED BY public."DonationClaim".id;


--
-- Name: Donation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Donation_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Donation_id_seq" OWNER TO postgres;

--
-- Name: Donation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Donation_id_seq" OWNED BY public."Donation".id;


--
-- Name: Donor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Donor" (
    id integer NOT NULL,
    "organizationId" integer
);


ALTER TABLE public."Donor" OWNER TO postgres;

--
-- Name: Donor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Donor_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Donor_id_seq" OWNER TO postgres;

--
-- Name: Donor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Donor_id_seq" OWNED BY public."Donor".id;


--
-- Name: EventRegistration; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EventRegistration" (
    id integer NOT NULL,
    "fullName" character varying NOT NULL,
    email character varying NOT NULL,
    "phoneNumber" character varying NOT NULL,
    "accountId" integer,
    "featuredEventId" integer,
    timezone character varying NOT NULL
);


ALTER TABLE public."EventRegistration" OWNER TO postgres;

--
-- Name: EventRegistration_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."EventRegistration_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."EventRegistration_id_seq" OWNER TO postgres;

--
-- Name: EventRegistration_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."EventRegistration_id_seq" OWNED BY public."EventRegistration".id;


--
-- Name: FeaturedEvent; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FeaturedEvent" (
    id integer NOT NULL,
    city character varying NOT NULL,
    date timestamp with time zone NOT NULL,
    description character varying NOT NULL,
    "durationMins" integer,
    "postalCode" character varying NOT NULL,
    "showUntil" timestamp with time zone NOT NULL,
    "signupCompleteMsg" character varying DEFAULT ''::character varying NOT NULL,
    "signupTitle" character varying DEFAULT ''::character varying NOT NULL,
    "stateProvince" character varying NOT NULL,
    "streetAddress" character varying NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public."FeaturedEvent" OWNER TO postgres;

--
-- Name: FeaturedEvent_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."FeaturedEvent_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."FeaturedEvent_id_seq" OWNER TO postgres;

--
-- Name: FeaturedEvent_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."FeaturedEvent_id_seq" OWNED BY public."FeaturedEvent".id;


--
-- Name: MapRoute; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MapRoute" (
    id integer NOT NULL,
    "distanceMi" real NOT NULL,
    "durationMin" integer NOT NULL,
    directions json NOT NULL,
    "endLocation" public.geography NOT NULL,
    "startLocation" public.geography NOT NULL
);


ALTER TABLE public."MapRoute" OWNER TO postgres;

--
-- Name: MapRoute_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."MapRoute_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."MapRoute_id_seq" OWNER TO postgres;

--
-- Name: MapRoute_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."MapRoute_id_seq" OWNED BY public."MapRoute".id;


--
-- Name: Notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Notification" (
    id integer NOT NULL,
    read boolean DEFAULT false NOT NULL,
    flagged boolean DEFAULT false NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    "accountId" integer,
    "notificationType" public.notification_notificationtype_enum NOT NULL,
    "notificationLink" character varying,
    title character varying NOT NULL,
    subtitle character varying,
    body character varying,
    icon character varying,
    image character varying,
    priority character varying,
    action character varying,
    tag character varying,
    custom json
);


ALTER TABLE public."Notification" OWNER TO postgres;

--
-- Name: Notification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Notification_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Notification_id_seq" OWNER TO postgres;

--
-- Name: Notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Notification_id_seq" OWNED BY public."Notification".id;


--
-- Name: OperationHours; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OperationHours" (
    id integer NOT NULL,
    weekday public.operationhours_weekday_enum NOT NULL,
    "startTime" time without time zone NOT NULL,
    "endTime" time without time zone NOT NULL,
    "accountId" integer
);


ALTER TABLE public."OperationHours" OWNER TO postgres;

--
-- Name: OperationHours_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."OperationHours_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."OperationHours_id_seq" OWNER TO postgres;

--
-- Name: OperationHours_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."OperationHours_id_seq" OWNED BY public."OperationHours".id;


--
-- Name: Organization; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Organization" (
    id integer NOT NULL,
    name character varying NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    "accountId" integer,
    "deliveryInstructions" text DEFAULT ''::text NOT NULL
);


ALTER TABLE public."Organization" OWNER TO postgres;

--
-- Name: Organization_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Organization_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Organization_id_seq" OWNER TO postgres;

--
-- Name: Organization_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Organization_id_seq" OWNED BY public."Organization".id;


--
-- Name: Password; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Password" (
    id integer NOT NULL,
    "passwordHash" character varying NOT NULL,
    "updateTimestamp" timestamp with time zone DEFAULT now() NOT NULL,
    "accountId" integer
);


ALTER TABLE public."Password" OWNER TO postgres;

--
-- Name: PasswordReset; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PasswordReset" (
    id integer NOT NULL,
    "createTimestamp" timestamp with time zone DEFAULT now() NOT NULL,
    "resetToken" character varying NOT NULL,
    "accountId" integer NOT NULL
);


ALTER TABLE public."PasswordReset" OWNER TO postgres;

--
-- Name: PasswordReset_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PasswordReset_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."PasswordReset_id_seq" OWNER TO postgres;

--
-- Name: PasswordReset_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PasswordReset_id_seq" OWNED BY public."PasswordReset".id;


--
-- Name: Password_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Password_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Password_id_seq" OWNER TO postgres;

--
-- Name: Password_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Password_id_seq" OWNED BY public."Password".id;


--
-- Name: Receiver; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Receiver" (
    id integer NOT NULL,
    "autoReceiver" boolean NOT NULL,
    "organizationId" integer
);


ALTER TABLE public."Receiver" OWNER TO postgres;

--
-- Name: Receiver_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Receiver_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Receiver_id_seq" OWNER TO postgres;

--
-- Name: Receiver_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Receiver_id_seq" OWNED BY public."Receiver".id;


--
-- Name: UnverifiedAccount; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UnverifiedAccount" (
    id integer NOT NULL,
    "verificationToken" character varying NOT NULL,
    "accountId" integer
);


ALTER TABLE public."UnverifiedAccount" OWNER TO postgres;

--
-- Name: UnverifiedAccount_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."UnverifiedAccount_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."UnverifiedAccount_id_seq" OWNER TO postgres;

--
-- Name: UnverifiedAccount_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."UnverifiedAccount_id_seq" OWNED BY public."UnverifiedAccount".id;


--
-- Name: Volunteer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Volunteer" (
    id integer NOT NULL,
    "lastName" character varying NOT NULL,
    "firstName" character varying NOT NULL,
    "accountId" integer,
    "signedAgreement" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Volunteer" OWNER TO postgres;

--
-- Name: Volunteer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Volunteer_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Volunteer_id_seq" OWNER TO postgres;

--
-- Name: Volunteer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Volunteer_id_seq" OWNED BY public."Volunteer".id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.migrations_id_seq OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: Account id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account" ALTER COLUMN id SET DEFAULT nextval('public."Account_id_seq"'::regclass);


--
-- Name: AppSession id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AppSession" ALTER COLUMN id SET DEFAULT nextval('public."AppSession_id_seq"'::regclass);


--
-- Name: Audit id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Audit" ALTER COLUMN id SET DEFAULT nextval('public."Audit_id_seq"'::regclass);


--
-- Name: AutoClaimHistory id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AutoClaimHistory" ALTER COLUMN id SET DEFAULT nextval('public."AutoClaimHistory_id_seq"'::regclass);


--
-- Name: ClaimReqHistory id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ClaimReqHistory" ALTER COLUMN id SET DEFAULT nextval('public."ClaimReqHistory_id_seq"'::regclass);


--
-- Name: ContactInfo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContactInfo" ALTER COLUMN id SET DEFAULT nextval('public."ContactInfo_id_seq"'::regclass);


--
-- Name: Delivery id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Delivery" ALTER COLUMN id SET DEFAULT nextval('public."Delivery_id_seq"'::regclass);


--
-- Name: DeliveryReqHistory id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DeliveryReqHistory" ALTER COLUMN id SET DEFAULT nextval('public."DeliveryReqHistory_id_seq"'::regclass);


--
-- Name: Donation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Donation" ALTER COLUMN id SET DEFAULT nextval('public."Donation_id_seq"'::regclass);


--
-- Name: DonationClaim id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DonationClaim" ALTER COLUMN id SET DEFAULT nextval('public."DonationClaim_id_seq"'::regclass);


--
-- Name: Donor id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Donor" ALTER COLUMN id SET DEFAULT nextval('public."Donor_id_seq"'::regclass);


--
-- Name: EventRegistration id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EventRegistration" ALTER COLUMN id SET DEFAULT nextval('public."EventRegistration_id_seq"'::regclass);


--
-- Name: FeaturedEvent id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FeaturedEvent" ALTER COLUMN id SET DEFAULT nextval('public."FeaturedEvent_id_seq"'::regclass);


--
-- Name: MapRoute id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MapRoute" ALTER COLUMN id SET DEFAULT nextval('public."MapRoute_id_seq"'::regclass);


--
-- Name: Notification id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification" ALTER COLUMN id SET DEFAULT nextval('public."Notification_id_seq"'::regclass);


--
-- Name: OperationHours id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OperationHours" ALTER COLUMN id SET DEFAULT nextval('public."OperationHours_id_seq"'::regclass);


--
-- Name: Organization id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Organization" ALTER COLUMN id SET DEFAULT nextval('public."Organization_id_seq"'::regclass);


--
-- Name: Password id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Password" ALTER COLUMN id SET DEFAULT nextval('public."Password_id_seq"'::regclass);


--
-- Name: PasswordReset id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PasswordReset" ALTER COLUMN id SET DEFAULT nextval('public."PasswordReset_id_seq"'::regclass);


--
-- Name: Receiver id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Receiver" ALTER COLUMN id SET DEFAULT nextval('public."Receiver_id_seq"'::regclass);


--
-- Name: UnverifiedAccount id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UnverifiedAccount" ALTER COLUMN id SET DEFAULT nextval('public."UnverifiedAccount_id_seq"'::regclass);


--
-- Name: Volunteer id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Volunteer" ALTER COLUMN id SET DEFAULT nextval('public."Volunteer_id_seq"'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Account" (id, "accountType", username, "updateTimestamp", "createTimestamp", "profileImgUrl", "lastSeenNotificationId", "contactInfoId") FROM stdin;
1	Volunteer	foodweb	2020-04-06 21:57:16.032148+00	2020-04-06 21:57:09.564355+00	./assets/A.svg	1	1
\.


--
-- Data for Name: AppData; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AppData" ("deviceUuid", "accountId", "devicePlatform", "deviceModel", "deviceVersion", "deviceManufacturer", "deviceSerial", "deviceIsVirtual", "pushRegistrationId", "createTimestamp") FROM stdin;
\.


--
-- Data for Name: AppSession; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AppSession" (id, "appSessionToken", "createTimestamp", "updateTimestamp", "accountId") FROM stdin;
\.


--
-- Data for Name: Audit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Audit" (id, "eventType", data, "recaptchaScore", "timestamp") FROM stdin;
\.


--
-- Data for Name: AuditAccountMap; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AuditAccountMap" ("auditId", "accountId") FROM stdin;
\.


--
-- Data for Name: AutoClaimHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AutoClaimHistory" (id, "timestamp", "claimId") FROM stdin;
\.


--
-- Data for Name: ClaimReqHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ClaimReqHistory" (id, "donationId", "receiverAccountId") FROM stdin;
\.


--
-- Data for Name: ContactInfo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ContactInfo" (id, email, "phoneNumber", "streetAddress", city, "stateProvince", "postalCode", location, timezone, "enableEmail", "enablePushNotification", "notifyForEachDonation") FROM stdin;
1	Adrian.Ayala.1@foodweb.com	(772) 753-1964	10 Holly Ln, Apartment 5	Tonawanda	NY	14150	0101000020E61000000CA4D5DAC5B553C089E87C1DDD814540	America/New_York	t	t	t
\.


--
-- Data for Name: Delivery; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Delivery" (id, "pickupTime", "dropOffTime", "claimId", "volunteerAccountId", "pickupWindowStart", "pickupWindowEnd", "createTimestamp", "routeToDonorId", "startTime", "dropOffWindowStart", "dropOffWindowEnd") FROM stdin;
\.


--
-- Data for Name: DeliveryReqHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DeliveryReqHistory" (id, "donationId", "volunteerAccountId") FROM stdin;
\.


--
-- Data for Name: DevDbMetadata; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DevDbMetadata" ("createTimestamp", "replaceDevPasswords", "purgeDevPassResetTokens", "purgeDevAppSessionsData", "replaceDevPassVerificationTokens", "replaceVolunteerNames", "replaceEmails", "replaceUsernames", "replacePhoneNumbers", "purgeAudits", "purgeNotifications", "purgeEventRegistrations") FROM stdin;
2020-04-12 18:44:17.904281	t	t	t	t	t	t	t	t	t	t	t
\.


--
-- Data for Name: Donation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Donation" (id, "donorLastName", "donorFirstName", "donationType", description, "estimatedValue", "donationStatus", "updateTimestamp", "createTimestamp", "donorAccountId", "pickupWindowStart", "pickupWindowEnd", "estimatedNumFeed", "donorContactOverrideId", complete) FROM stdin;
\.


--
-- Data for Name: DonationClaim; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DonationClaim" (id, "createTimestamp", "donationId", "receiverAccountId", "routeToReceiverId", "dropOffWindowStart", "dropOffWindowEnd") FROM stdin;
\.


--
-- Data for Name: Donor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Donor" (id, "organizationId") FROM stdin;
\.


--
-- Data for Name: EventRegistration; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EventRegistration" (id, "fullName", email, "phoneNumber", "accountId", "featuredEventId", timezone) FROM stdin;
\.


--
-- Data for Name: FeaturedEvent; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FeaturedEvent" (id, city, date, description, "durationMins", "postalCode", "showUntil", "signupCompleteMsg", "signupTitle", "stateProvince", "streetAddress", title) FROM stdin;
1	Buffalo	2019-09-05 21:30:00+00	Signup for our next volunteer training at <strong>Hodgson Russ</strong>	60	14202	2019-09-05 22:30:00+00	Signup Successful - We look forward to seeing you at the training!	Training Signup	NY	140 Pearl Street	Volunteer Driver Training
2	Buffalo	2020-01-22 17:00:00+00	Signup for our next volunteer training at <strong>Hodgson Russ</strong>	60	14202	2020-01-22 18:00:00+00	Signup Successful - We look forward to seeing you at the training!	Training Signup	NY	140 Pearl Street	Volunteer Driver Training
3	Getzville	2020-02-10 23:30:00+00	Signup for our next volunteer training at the <strong>Hindu Cultural Society</strong>	60	14068	2020-02-11 00:30:00+00	Signup Successful - We look forward to seeing you at the training!	Training Signup	NY	1595 N. French Road	Volunteer Driver Training
4	Buffalo	2020-03-12 22:30:00+00	Signup for our next volunteer training at <strong>Hodgson Russ</strong>	60	14202	2020-03-12 23:30:00+00	Signup Successful - We look forward to seeing you at the training!	Training Signup	NY	140 Pearl Street	Volunteer Driver Training
5	Buffalo	2020-04-06 22:00:00+00	Signup for our next volunteer training at <strong>Hodgson Russ</strong>	60	14202	2020-04-06 23:00:00+00	Signup Successful - We look forward to seeing you at the training!	Training Signup	NY	140 Pearl Street	Volunteer Driver Training
6	Getzville	2020-05-12 22:00:00+00	Signup for our next volunteer training at the <strong>Hindu Cultural Society</strong>	60	14068	2020-05-12 23:00:00+00	Signup Successful - We look forward to seeing you at the training!	Training Signup	NY	1595 N. French Road	Volunteer Driver Training
7	Buffalo	2020-06-08 21:30:00+00	Signup for our next volunteer training at <strong>Hodgson Russ</strong>	60	14202	2020-06-08 22:30:00+00	Signup Successful - We look forward to seeing you at the training!	Training Signup	NY	140 Pearl Street	Volunteer Driver Training
\.


--
-- Data for Name: MapRoute; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MapRoute" (id, "distanceMi", "durationMin", directions, "endLocation", "startLocation") FROM stdin;
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Notification" (id, read, flagged, "timestamp", "accountId", "notificationType", "notificationLink", title, subtitle, body, icon, image, priority, action, tag, custom) FROM stdin;
\.


--
-- Data for Name: OperationHours; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OperationHours" (id, weekday, "startTime", "endTime", "accountId") FROM stdin;
\.


--
-- Data for Name: Organization; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Organization" (id, name, description, "accountId", "deliveryInstructions") FROM stdin;
\.


--
-- Data for Name: Password; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Password" (id, "passwordHash", "updateTimestamp", "accountId") FROM stdin;
1	$2b$10$FA4auxOmqN0XmapCCCstO.PqsRPGpRouKGKP0TmkXsACs/hwVgfE.	2020-04-06 21:57:09.564355+00	1
\.


--
-- Data for Name: PasswordReset; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PasswordReset" (id, "createTimestamp", "resetToken", "accountId") FROM stdin;
\.


--
-- Data for Name: Receiver; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Receiver" (id, "autoReceiver", "organizationId") FROM stdin;
\.


--
-- Data for Name: UnverifiedAccount; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UnverifiedAccount" (id, "verificationToken", "accountId") FROM stdin;
\.


--
-- Data for Name: Volunteer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Volunteer" (id, "lastName", "firstName", "accountId", "signedAgreement") FROM stdin;
1	Ayala	Adrian	1	f
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migrations (id, "timestamp", name) FROM stdin;
1	1557632233526	CreateDatabase1557632233526
2	1557632757037	AccountProfileImgUrl1557632757037
3	1557796559798	Volunteer1557796559798
4	1557888524194	instructionsField1557888524194
5	1558199226376	donationWindowTimes1558199226376
6	1558287985441	estimatedNumFeed1558287985441
7	1558564796570	delivery1558564796570
8	1560210683131	auditNotification1560210683131
9	1560640448900	geocode1560640448900
10	1560901490595	delivererPickupWindow1560901490595
11	1560985604098	timezone1560985604098
12	1563129237967	operationHoursIdx1563129237967
13	1564335367245	lastSeenNotificationId1564335367245
14	1564943729291	allowNulllableNotificationFields1564943729291
15	1564944424746	notificationTypeEnum1564944424746
16	1566150698428	notificationLink1566150698428
17	1566160381277	addNotificationTypes1566160381277
18	1566268190081	eventRegistration1566268190081
19	1567466240130	relativeAssets1567466240130
20	1567641753923	notificationDetailIdNullable1567641753923
21	1568332268268	donorContactInfoOverride1568332268268
22	1568568292192	estimatedValueNullable1568568292192
23	1569543950322	deliveryReminderNotificationType1569543950322
24	1570456199780	donorReceiverEntities1570456199780
25	1570988693732	appSessionToken1570988693732
26	1572400203132	appDataEntity1572400203132
27	1572811012800	pushNotification1572811012800
28	1573323878129	addHasEquipment1573323878129
29	1574615908483	preferredContact1574615908483
30	1575136399381	notifyForEachDonation1575136399381
31	1575213767857	deliveryStartStatus1575213767857
32	1575237456579	donationClaim1575237456579
33	1576463243837	directions1576463243837
34	1577582732218	mapRoute1577582732218
35	1577745814363	nullableDonationContactInfoOverride1577745814363
36	1577933296003	deliveryStartedTime1577933296003
37	1578251033011	claimDeliveryReqHistory1578251033011
38	1578276029608	dropOffWindow1578276029608
39	1578805610851	cascadeClaimDeliveryDelete1578805610851
40	1578808014097	moveDeliveryUnderClaim1578808014097
41	1580662267033	donationOrganizationVolunteerColumnIndexRefactor1580662267033
42	1580768664939	donationCompleteTrigger1580768664939
43	1581473265479	featuredEvent1581473265479
44	1581885804732	eventRegistrationTimezone1581885804732
45	1584208169097	autoClaimHistory1584208169097
46	1584905985397	volunteerSignedAgreement1584905985397
\.


--
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
\.


--
-- Data for Name: geocode_settings; Type: TABLE DATA; Schema: tiger; Owner: postgres
--

COPY tiger.geocode_settings (name, setting, unit, category, short_desc) FROM stdin;
\.


--
-- Data for Name: pagc_gaz; Type: TABLE DATA; Schema: tiger; Owner: postgres
--

COPY tiger.pagc_gaz (id, seq, word, stdword, token, is_custom) FROM stdin;
\.


--
-- Data for Name: pagc_lex; Type: TABLE DATA; Schema: tiger; Owner: postgres
--

COPY tiger.pagc_lex (id, seq, word, stdword, token, is_custom) FROM stdin;
\.


--
-- Data for Name: pagc_rules; Type: TABLE DATA; Schema: tiger; Owner: postgres
--

COPY tiger.pagc_rules (id, rule, is_custom) FROM stdin;
\.


--
-- Data for Name: topology; Type: TABLE DATA; Schema: topology; Owner: postgres
--

COPY topology.topology (id, name, srid, "precision", hasz) FROM stdin;
\.


--
-- Data for Name: layer; Type: TABLE DATA; Schema: topology; Owner: postgres
--

COPY topology.layer (topology_id, layer_id, schema_name, table_name, feature_column, feature_type, level, child_id) FROM stdin;
\.


--
-- Name: Account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Account_id_seq"', 1, true);


--
-- Name: AppSession_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."AppSession_id_seq"', 1, false);


--
-- Name: Audit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Audit_id_seq"', 2, true);


--
-- Name: AutoClaimHistory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."AutoClaimHistory_id_seq"', 1, false);


--
-- Name: ClaimReqHistory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ClaimReqHistory_id_seq"', 1, false);


--
-- Name: ContactInfo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ContactInfo_id_seq"', 1, true);


--
-- Name: DeliveryReqHistory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."DeliveryReqHistory_id_seq"', 1, false);


--
-- Name: Delivery_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Delivery_id_seq"', 1, false);


--
-- Name: DonationClaim_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."DonationClaim_id_seq"', 1, false);


--
-- Name: Donation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Donation_id_seq"', 1, false);


--
-- Name: Donor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Donor_id_seq"', 1, false);


--
-- Name: EventRegistration_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."EventRegistration_id_seq"', 1, false);


--
-- Name: FeaturedEvent_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."FeaturedEvent_id_seq"', 7, true);


--
-- Name: MapRoute_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."MapRoute_id_seq"', 1, false);


--
-- Name: Notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Notification_id_seq"', 1, true);


--
-- Name: OperationHours_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."OperationHours_id_seq"', 1, false);


--
-- Name: Organization_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Organization_id_seq"', 1, false);


--
-- Name: PasswordReset_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PasswordReset_id_seq"', 1, false);


--
-- Name: Password_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Password_id_seq"', 1, true);


--
-- Name: Receiver_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Receiver_id_seq"', 1, false);


--
-- Name: UnverifiedAccount_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."UnverifiedAccount_id_seq"', 1, true);


--
-- Name: Volunteer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Volunteer_id_seq"', 1, true);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 46, true);


--
-- Name: AppSession PK_06e3d692ecd443d27ceea01a755; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AppSession"
    ADD CONSTRAINT "PK_06e3d692ecd443d27ceea01a755" PRIMARY KEY (id);


--
-- Name: Password PK_07377bffb1bb311a73ed9e2b514; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Password"
    ADD CONSTRAINT "PK_07377bffb1bb311a73ed9e2b514" PRIMARY KEY (id);


--
-- Name: Receiver PK_1423a4d57917f13f718bf54f6cf; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Receiver"
    ADD CONSTRAINT "PK_1423a4d57917f13f718bf54f6cf" PRIMARY KEY (id);


--
-- Name: OperationHours PK_2026a8275d6905441155877de0d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OperationHours"
    ADD CONSTRAINT "PK_2026a8275d6905441155877de0d" PRIMARY KEY (id);


--
-- Name: DonationClaim PK_2813be32fd05c470af28ec3d702; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DonationClaim"
    ADD CONSTRAINT "PK_2813be32fd05c470af28ec3d702" PRIMARY KEY (id);


--
-- Name: MapRoute PK_4fc2a0cc574443434c185f01016; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MapRoute"
    ADD CONSTRAINT "PK_4fc2a0cc574443434c185f01016" PRIMARY KEY (id);


--
-- Name: DeliveryReqHistory PK_5ad04e6cbfbdbcdbaf4db984f9c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DeliveryReqHistory"
    ADD CONSTRAINT "PK_5ad04e6cbfbdbcdbaf4db984f9c" PRIMARY KEY (id);


--
-- Name: EventRegistration PK_5b09ac0d2d829dfaf7a13f66721; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EventRegistration"
    ADD CONSTRAINT "PK_5b09ac0d2d829dfaf7a13f66721" PRIMARY KEY (id);


--
-- Name: Organization PK_67bcafc78935cd441a054c6d4ea; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Organization"
    ADD CONSTRAINT "PK_67bcafc78935cd441a054c6d4ea" PRIMARY KEY (id);


--
-- Name: AppData PK_6d319785ed3819f09f9f06e0a44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AppData"
    ADD CONSTRAINT "PK_6d319785ed3819f09f9f06e0a44" PRIMARY KEY ("deviceUuid", "accountId");


--
-- Name: ContactInfo PK_6f8dde4721b91fd792e2e46588c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContactInfo"
    ADD CONSTRAINT "PK_6f8dde4721b91fd792e2e46588c" PRIMARY KEY (id);


--
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- Name: Delivery PK_90b858c3595a15f0e9bc9b972be; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Delivery"
    ADD CONSTRAINT "PK_90b858c3595a15f0e9bc9b972be" PRIMARY KEY (id);


--
-- Name: AutoClaimHistory PK_afb4bf5d58c0d5657030c8b3bbb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AutoClaimHistory"
    ADD CONSTRAINT "PK_afb4bf5d58c0d5657030c8b3bbb" PRIMARY KEY (id);


--
-- Name: Account PK_bf68fd30f1adeede9c72a5cac09; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "PK_bf68fd30f1adeede9c72a5cac09" PRIMARY KEY (id);


--
-- Name: FeaturedEvent PK_c321a2a7a69c654ce6b66a58165; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FeaturedEvent"
    ADD CONSTRAINT "PK_c321a2a7a69c654ce6b66a58165" PRIMARY KEY (id);


--
-- Name: ClaimReqHistory PK_d0bf81f6deff15dcc19576e77bc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ClaimReqHistory"
    ADD CONSTRAINT "PK_d0bf81f6deff15dcc19576e77bc" PRIMARY KEY (id);


--
-- Name: Notification PK_da18f6446b6fea585f01d03f56c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "PK_da18f6446b6fea585f01d03f56c" PRIMARY KEY (id);


--
-- Name: Donor PK_e8719874967684820aa4c43c042; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Donor"
    ADD CONSTRAINT "PK_e8719874967684820aa4c43c042" PRIMARY KEY (id);


--
-- Name: AuditAccountMap PK_eb739c0ce736fae4908e48cdab1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditAccountMap"
    ADD CONSTRAINT "PK_eb739c0ce736fae4908e48cdab1" PRIMARY KEY ("auditId", "accountId");


--
-- Name: UnverifiedAccount PK_ee84fd35703e440d08654ce4c1a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UnverifiedAccount"
    ADD CONSTRAINT "PK_ee84fd35703e440d08654ce4c1a" PRIMARY KEY (id);


--
-- Name: PasswordReset PK_ef0138f2aca0a0f38b49d683442; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PasswordReset"
    ADD CONSTRAINT "PK_ef0138f2aca0a0f38b49d683442" PRIMARY KEY (id);


--
-- Name: Donation PK_f3824607b80632a8619c8e93426; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Donation"
    ADD CONSTRAINT "PK_f3824607b80632a8619c8e93426" PRIMARY KEY (id);


--
-- Name: Audit PK_fc6e886590a36b630dd98096fc3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Audit"
    ADD CONSTRAINT "PK_fc6e886590a36b630dd98096fc3" PRIMARY KEY (id);


--
-- Name: Volunteer PK_ff269e3173a732c0dab4d97ad17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Volunteer"
    ADD CONSTRAINT "PK_ff269e3173a732c0dab4d97ad17" PRIMARY KEY (id);


--
-- Name: Donor REL_0dc5ba96d93634bb232a2979b9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Donor"
    ADD CONSTRAINT "REL_0dc5ba96d93634bb232a2979b9" UNIQUE ("organizationId");


--
-- Name: Organization REL_1163449e5a53ab64ad2536b455; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Organization"
    ADD CONSTRAINT "REL_1163449e5a53ab64ad2536b455" UNIQUE ("accountId");


--
-- Name: PasswordReset REL_1aa875e542fc0ed2be1ceb00c9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PasswordReset"
    ADD CONSTRAINT "REL_1aa875e542fc0ed2be1ceb00c9" UNIQUE ("accountId");


--
-- Name: Password REL_84f85b5ebbfeaa129fe2e07916; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Password"
    ADD CONSTRAINT "REL_84f85b5ebbfeaa129fe2e07916" UNIQUE ("accountId");


--
-- Name: DonationClaim REL_8550ec0b53280fe4700cabe463; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DonationClaim"
    ADD CONSTRAINT "REL_8550ec0b53280fe4700cabe463" UNIQUE ("donationId");


--
-- Name: Receiver REL_893b416fd28748e0ca0ad60123; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Receiver"
    ADD CONSTRAINT "REL_893b416fd28748e0ca0ad60123" UNIQUE ("organizationId");


--
-- Name: Delivery REL_938d39366adb780438836faec3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Delivery"
    ADD CONSTRAINT "REL_938d39366adb780438836faec3" UNIQUE ("claimId");


--
-- Name: Volunteer REL_9edcd1322b945110e96f229a76; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Volunteer"
    ADD CONSTRAINT "REL_9edcd1322b945110e96f229a76" UNIQUE ("accountId");


--
-- Name: AppSession REL_a5bf92aa3c976715684a272226; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AppSession"
    ADD CONSTRAINT "REL_a5bf92aa3c976715684a272226" UNIQUE ("accountId");


--
-- Name: UnverifiedAccount REL_e7562406292a6e47eb17697ccb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UnverifiedAccount"
    ADD CONSTRAINT "REL_e7562406292a6e47eb17697ccb" UNIQUE ("accountId");


--
-- Name: AutoClaimHistory REL_eec29d34cc30cf3cad99b17482; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AutoClaimHistory"
    ADD CONSTRAINT "REL_eec29d34cc30cf3cad99b17482" UNIQUE ("claimId");


--
-- Name: Donation UQ_d801d8ac724b6529fe5b438dca2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Donation"
    ADD CONSTRAINT "UQ_d801d8ac724b6529fe5b438dca2" UNIQUE ("donorContactOverrideId");


--
-- Name: Account UQ_f3f5c02509d4f9b16cdebfd9bff; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "UQ_f3f5c02509d4f9b16cdebfd9bff" UNIQUE ("contactInfoId");


--
-- Name: IDX_1aa6210f1bca9d9e4305f24806; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_1aa6210f1bca9d9e4305f24806" ON public."AuditAccountMap" USING btree ("accountId");


--
-- Name: IDX_4a67194a67f9217a63275eaeb2; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_4a67194a67f9217a63275eaeb2" ON public."OperationHours" USING btree (weekday, "startTime", "endTime");


--
-- Name: IDX_4b78c82b20ff8789ee0e1b0b91; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_4b78c82b20ff8789ee0e1b0b91" ON public."ContactInfo" USING btree ("streetAddress");


--
-- Name: IDX_50f45bd1bc452467959eb2d86d; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_50f45bd1bc452467959eb2d86d" ON public."ContactInfo" USING btree (email);


--
-- Name: IDX_93d60330979df192af26a58e9f; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_93d60330979df192af26a58e9f" ON public."AutoClaimHistory" USING btree ("timestamp");


--
-- Name: IDX_b89b220cadc68103e4f75edac7; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_b89b220cadc68103e4f75edac7" ON public."ContactInfo" USING gist (location);


--
-- Name: IDX_c8782447aa50983c50fa634d9c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_c8782447aa50983c50fa634d9c" ON public."Account" USING btree (username);


--
-- Name: IDX_ccf38c9ed2d680dd7886ab84f9; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_ccf38c9ed2d680dd7886ab84f9" ON public."AuditAccountMap" USING btree ("auditId");


--
-- Name: IDX_e94bf8c586c57df55287a7889e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_e94bf8c586c57df55287a7889e" ON public."FeaturedEvent" USING btree (date);


--
-- Name: IDX_f8ac8e48048300367947af4acb; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_f8ac8e48048300367947af4acb" ON public."FeaturedEvent" USING btree ("showUntil");


--
-- Name: donorNameIdx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "donorNameIdx" ON public."Donation" USING btree (lower(("donorLastName")::text), lower(("donorFirstName")::text));


--
-- Name: organizationNameIdx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "organizationNameIdx" ON public."Organization" USING btree (lower((name)::text));


--
-- Name: volunteerNameIdx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "volunteerNameIdx" ON public."Volunteer" USING btree (lower(("lastName")::text), lower(("firstName")::text));


--
-- Name: Donation updateDonationCompleteTrigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "updateDonationCompleteTrigger" AFTER UPDATE OF "donationStatus" ON public."Donation" FOR EACH ROW EXECUTE PROCEDURE public."updateDonationComplete"();


--
-- Name: ClaimReqHistory FK_041c7e2080cb98f27cad92795de; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ClaimReqHistory"
    ADD CONSTRAINT "FK_041c7e2080cb98f27cad92795de" FOREIGN KEY ("donationId") REFERENCES public."Donation"(id) ON DELETE CASCADE;


--
-- Name: Donor FK_0dc5ba96d93634bb232a2979b9a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Donor"
    ADD CONSTRAINT "FK_0dc5ba96d93634bb232a2979b9a" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id);


--
-- Name: Organization FK_1163449e5a53ab64ad2536b4550; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Organization"
    ADD CONSTRAINT "FK_1163449e5a53ab64ad2536b4550" FOREIGN KEY ("accountId") REFERENCES public."Account"(id);


--
-- Name: DeliveryReqHistory FK_19b86e3403724aeb2b20677c189; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DeliveryReqHistory"
    ADD CONSTRAINT "FK_19b86e3403724aeb2b20677c189" FOREIGN KEY ("volunteerAccountId") REFERENCES public."Account"(id);


--
-- Name: AuditAccountMap FK_1aa6210f1bca9d9e4305f248064; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditAccountMap"
    ADD CONSTRAINT "FK_1aa6210f1bca9d9e4305f248064" FOREIGN KEY ("accountId") REFERENCES public."Account"(id) ON DELETE CASCADE;


--
-- Name: PasswordReset FK_1aa875e542fc0ed2be1ceb00c94; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PasswordReset"
    ADD CONSTRAINT "FK_1aa875e542fc0ed2be1ceb00c94" FOREIGN KEY ("accountId") REFERENCES public."Account"(id);


--
-- Name: Volunteer FK_207855141cd8ce90c33182f9c70; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Volunteer"
    ADD CONSTRAINT "FK_207855141cd8ce90c33182f9c70" FOREIGN KEY ("accountId") REFERENCES public."Account"(id);


--
-- Name: EventRegistration FK_23a58dc54b801f5abf6d191f1c9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EventRegistration"
    ADD CONSTRAINT "FK_23a58dc54b801f5abf6d191f1c9" FOREIGN KEY ("accountId") REFERENCES public."Account"(id);


--
-- Name: DonationClaim FK_4df1f6cac9d40458b5f5a2d505a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DonationClaim"
    ADD CONSTRAINT "FK_4df1f6cac9d40458b5f5a2d505a" FOREIGN KEY ("routeToReceiverId") REFERENCES public."MapRoute"(id);


--
-- Name: Donation FK_59c1cb9a0762dcd7fd19a1a9098; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Donation"
    ADD CONSTRAINT "FK_59c1cb9a0762dcd7fd19a1a9098" FOREIGN KEY ("donorAccountId") REFERENCES public."Account"(id);


--
-- Name: Notification FK_65ba2a3f0c8e78599857d10758d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "FK_65ba2a3f0c8e78599857d10758d" FOREIGN KEY ("accountId") REFERENCES public."Account"(id);


--
-- Name: DonationClaim FK_81aebb3cb5cedb4728249963b9e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DonationClaim"
    ADD CONSTRAINT "FK_81aebb3cb5cedb4728249963b9e" FOREIGN KEY ("receiverAccountId") REFERENCES public."Account"(id);


--
-- Name: Password FK_84f85b5ebbfeaa129fe2e07916d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Password"
    ADD CONSTRAINT "FK_84f85b5ebbfeaa129fe2e07916d" FOREIGN KEY ("accountId") REFERENCES public."Account"(id);


--
-- Name: DonationClaim FK_8550ec0b53280fe4700cabe4636; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DonationClaim"
    ADD CONSTRAINT "FK_8550ec0b53280fe4700cabe4636" FOREIGN KEY ("donationId") REFERENCES public."Donation"(id) ON DELETE CASCADE;


--
-- Name: Receiver FK_893b416fd28748e0ca0ad601239; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Receiver"
    ADD CONSTRAINT "FK_893b416fd28748e0ca0ad601239" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id);


--
-- Name: AppSession FK_a5bf92aa3c976715684a2722262; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AppSession"
    ADD CONSTRAINT "FK_a5bf92aa3c976715684a2722262" FOREIGN KEY ("accountId") REFERENCES public."Account"(id);


--
-- Name: Delivery FK_a757ba8ea0ee10378e424e3ca02; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Delivery"
    ADD CONSTRAINT "FK_a757ba8ea0ee10378e424e3ca02" FOREIGN KEY ("claimId") REFERENCES public."DonationClaim"(id) ON DELETE CASCADE;


--
-- Name: EventRegistration FK_afcaa54b4571a3556506f0ebe08; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EventRegistration"
    ADD CONSTRAINT "FK_afcaa54b4571a3556506f0ebe08" FOREIGN KEY ("featuredEventId") REFERENCES public."FeaturedEvent"(id);


--
-- Name: OperationHours FK_c6c655044bd021a89231b4b31da; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OperationHours"
    ADD CONSTRAINT "FK_c6c655044bd021a89231b4b31da" FOREIGN KEY ("accountId") REFERENCES public."Account"(id);


--
-- Name: AuditAccountMap FK_ccf38c9ed2d680dd7886ab84f9a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditAccountMap"
    ADD CONSTRAINT "FK_ccf38c9ed2d680dd7886ab84f9a" FOREIGN KEY ("auditId") REFERENCES public."Audit"(id) ON DELETE CASCADE;


--
-- Name: DeliveryReqHistory FK_cf76f38185c34c5f14dbaa06fd9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DeliveryReqHistory"
    ADD CONSTRAINT "FK_cf76f38185c34c5f14dbaa06fd9" FOREIGN KEY ("donationId") REFERENCES public."Donation"(id);


--
-- Name: ClaimReqHistory FK_d2a40342e323cc2e3dbecb44615; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ClaimReqHistory"
    ADD CONSTRAINT "FK_d2a40342e323cc2e3dbecb44615" FOREIGN KEY ("receiverAccountId") REFERENCES public."Account"(id) ON DELETE CASCADE;


--
-- Name: Donation FK_d801d8ac724b6529fe5b438dca2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Donation"
    ADD CONSTRAINT "FK_d801d8ac724b6529fe5b438dca2" FOREIGN KEY ("donorContactOverrideId") REFERENCES public."ContactInfo"(id) ON DELETE CASCADE;


--
-- Name: UnverifiedAccount FK_e7562406292a6e47eb17697ccbd; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UnverifiedAccount"
    ADD CONSTRAINT "FK_e7562406292a6e47eb17697ccbd" FOREIGN KEY ("accountId") REFERENCES public."Account"(id);


--
-- Name: AutoClaimHistory FK_eec29d34cc30cf3cad99b17482b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AutoClaimHistory"
    ADD CONSTRAINT "FK_eec29d34cc30cf3cad99b17482b" FOREIGN KEY ("claimId") REFERENCES public."DonationClaim"(id) ON DELETE CASCADE;


--
-- Name: Delivery FK_f051bc007fa27012d377bdef6b7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Delivery"
    ADD CONSTRAINT "FK_f051bc007fa27012d377bdef6b7" FOREIGN KEY ("routeToDonorId") REFERENCES public."MapRoute"(id);


--
-- Name: Delivery FK_f0f54b9a6f79d79bcfdf98138ba; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Delivery"
    ADD CONSTRAINT "FK_f0f54b9a6f79d79bcfdf98138ba" FOREIGN KEY ("volunteerAccountId") REFERENCES public."Account"(id);


--
-- PostgreSQL database dump complete
--

