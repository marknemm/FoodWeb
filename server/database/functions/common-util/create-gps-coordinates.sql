SELECT dropFunction ('createGPSCoordinate');

/**
 * Creates a storable GPSCoordinate from latitude and logitude.
 */
CREATE OR REPLACE FUNCTION createGPSCoordinate
(
    _latitude   NUMERIC(9, 6),
    _longitude  NUMERIC(9, 6)
)
RETURNS GEOGRAPHY -- The storable GPS Coordinate (Special PostreGIS type).
AS $$

    SELECT ST_SETSRID( ST_MAKEPOINT(_longitude, _latitude), 4326 )::GEOGRAPHY;
    
$$ LANGUAGE sql;


SELECT createGPSCoordinate(42.715080,-78.835782);