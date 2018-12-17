-- Extensions necessary for GEOGRAPHY types and faster indexing.
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Set the timezone to default to 'UTC' and reload configuration so it takes effect.
DO $$ BEGIN

  EXECUTE ( 'ALTER DATABASE ' || current_database() || ' SET TIMEZONE TO ''UTC''' );
  PERFORM pg_reload_conf();

END $$;
