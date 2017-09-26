SELECT dropFunction ('updateAvailability');

/**
 * Updates the availability times for a given App User. It will completely overwrite old availability times (given that they exist).
 */
CREATE OR REPLACE FUNCTION updateAvailability
(
    _appUserKey     INTEGER,
    _timeRanges     TimeRange[] -- See TimeRange type definition in app-user-availability.sql!
)
RETURNS VOID
AS $$
    DECLARE _weekday    INTEGER;
    DECLARE _startTime  TIME;
    DECLARE _endTime    TIME;
BEGIN

    -- First delete all current availability entries for the given App User.
    DELETE FROM AppUserAvailability
    WHERE       appUserKey = _appUserKey;


    -- Loop through all time ranges in _timeRanges argument, and add them into AppUserAvailability.
    FOR i IN array_lower(_timeRanges, 1) .. array_upper(_timeRanges, 1)
    LOOP

        -- Convert time in TEXT format to time in INTEGER/TIME format.
        _weekday := weekdayTextToInt(_timeRanges[i].weekday);
        _startTime := TO_TIMESTAMP(_timeRanges[i].startTime, 'hh12:mi AM');
        _endTime := TO_TIMESTAMP(_timeRanges[i].endTime, 'hh12:mi AM');

        -- Perform the insert.
        INSERT INTO AppUserAvailability (appUserKey, weekday, startTime, endTime)
        VALUES      (_appUserKey, _weekday, _startTime, _endTime);

    END LOOP;
    
END;
$$ LANGUAGE plpgsql;


/*
SELECT * FROM updateAvailability(1, '{"(Saturday, 9:00 AM, 1:00 PM)"}'::TimeRange[]);
SELECT * FROM AppUserAvailability;
*/
