/** 
 *  A domain enum (table) that holds all possible hard-coded short hand food type descriptions.
 *  Should be used to populate some form item such as checkboxes for filtering.
 */
DO $$
BEGIN

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'foodtype')
    THEN
        CREATE TYPE FoodType AS ENUM ();
    END IF;

END$$;

-- Fill the Enum with all of our Food Types. Each one has an external string representation, but is internally an integer!
ALTER TYPE FoodType ADD VALUE IF NOT EXISTS 'Produce';
ALTER TYPE FoodType ADD VALUE IF NOT EXISTS 'Canned Good';
ALTER TYPE FoodType ADD VALUE IF NOT EXISTS 'Dessert';
ALTER TYPE FoodType ADD VALUE IF NOT EXISTS 'Frozen';
ALTER TYPE FoodType ADD VALUE IF NOT EXISTS 'Grain';
ALTER TYPE FoodType ADD VALUE IF NOT EXISTS 'Dairy';
ALTER TYPE FoodType ADD VALUE IF NOT EXISTS 'Meat';
ALTER TYPE FoodType ADD VALUE IF NOT EXISTS 'Sea Food';
ALTER TYPE FoodType ADD VALUE IF NOT EXISTS 'Baked Good';
ALTER TYPE FoodType ADD VALUE IF NOT EXISTS 'Beverage';
ALTER TYPE FoodType ADD VALUE IF NOT EXISTS 'Snack';
ALTER TYPE FoodType ADD VALUE IF NOT EXISTS 'Meal';

SELECT unnest(enum_range(NULL::FoodType)) AS foodType;
