SELECT dropFunction ('weekdayIntToText');

/**
 * Convets a weekday in int index format to text format. The integer format indexes each day of the week in order.
 * NOTE: The weekday indexes are in range [0, 6]. First weekday is Sunday, and last is Saturday.
 */
CREATE OR REPLACE FUNCTION weekdayIntToText
(
    _weekdayInt INTEGER -- Index day of week [0, 6].
)
RETURNS TEXT -- Day of week text.
AS $$

    SELECT CASE (_weekdayInt)
        WHEN 0 THEN 'Sunday'
        WHEN 1 THEN 'Monday'
        WHEN 2 THEN 'Tuesday'
        WHEN 3 THEN 'Wednesday'
        WHEN 4 THEN 'Thursday'
        WHEN 5 THEN 'Friday'
        WHEN 6 THEN 'Saturday'
    END;
    
$$ LANGUAGE sql;


/*
SELECT 0, weekdayIntToText(0);
SELECT 1, weekdayIntToText(1);
SELECT 2, weekdayIntToText(2);
SELECT 3, weekdayIntToText(3);
SELECT 4, weekdayIntToText(4);
SELECT 5, weekdayIntToText(5);
SELECT 6, weekdayIntToText(6);
*/
