SELECT dropFunction ('weekdayTextToInt');

/**
 * Convets a weekday in Text format to an integer format. The integer format indexes each day of the week in order.
 * NOTE: The weekday indexes are in range [1, 7]. First weekday is Sunday, and last is Saturday.
 */
CREATE OR REPLACE FUNCTION weekdayTextToInt
(
    _weekdayText TEXT -- Case insensitive day of week.
)
RETURNS INTEGER -- Day of week 1-based index.
AS $$

    SELECT CASE (LOWER(_weekdayText))
        WHEN 'sunday'       THEN 1
        WHEN 'monday'       THEN 2
        WHEN 'tuesday'      THEN 3
        WHEN 'wednesday'    THEN 4
        WHEN 'thursday'     THEN 5
        WHEN 'friday'       THEN 6
        WHEN 'saturday'     THEN 7
    END;
    
$$ LANGUAGE sql;


/*
SELECT 'Sunday', weekdayTextToInt('Sunday');
SELECT 'Monday', weekdayTextToInt('Monday');
SELECT 'Tuesday', weekdayTextToInt('Tuesday');
SELECT 'Wednesday', weekdayTextToInt('Wednesday');
SELECT 'Thursday', weekdayTextToInt('Thursday');
SELECT 'Friday', weekdayTextToInt('Friday');
SELECT 'Saturday', weekdayTextToInt('Saturday');
*/
