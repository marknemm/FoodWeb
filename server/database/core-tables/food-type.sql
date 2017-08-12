/*  A domain table that holds all possible hard-coded short hand food type descriptions.
 *  Should be used to populate some form item such as a combobox for selection.
 *  We may be able to get data from an online database for this in the future...
 */

--DROP TABLE FoodType CASCADE;
CREATE TABLE IF NOT EXISTS FoodType
(
    foodTypeKey SERIAL PRIMARY KEY
);

ALTER TABLE FoodType ADD COLUMN IF NOT EXISTS foodTypeDescription VARCHAR(60) NOT NULL UNIQUE;

-- We can add all our FoodType entries here.
DO $$ BEGIN

    IF NOT EXISTS (SELECT 1 FROM FoodType WHERE foodTypeDescription = 'Produce') THEN
        INSERT INTO FoodType (foodTypeDescription) VALUES ('Produce');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM FoodType WHERE foodTypeDescription = 'Canned Goods') THEN
        INSERT INTO FoodType (foodTypeDescription) VALUES ('Canned Goods');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM FoodType WHERE foodTypeDescription = 'Dessert') THEN
        INSERT INTO FoodType (foodTypeDescription) VALUES ('Dessert');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM FoodType WHERE foodTypeDescription = 'Frozen') THEN
        INSERT INTO FoodType (foodTypeDescription) VALUES ('Frozen');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM FoodType WHERE foodTypeDescription = 'Grain') THEN
        INSERT INTO FoodType (foodTypeDescription) VALUES ('Grain');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM FoodType WHERE foodTypeDescription = 'Dairy') THEN
        INSERT INTO FoodType (foodTypeDescription) VALUES ('Dairy');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM FoodType WHERE foodTypeDescription = 'Meat') THEN
        INSERT INTO FoodType (foodTypeDescription) VALUES ('Meat');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM FoodType WHERE foodTypeDescription = 'Sea Food') THEN
        INSERT INTO FoodType (foodTypeDescription) VALUES ('Sea Food');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM FoodType WHERE foodTypeDescription = 'Baked Goods') THEN
        INSERT INTO FoodType (foodTypeDescription) VALUES ('Baked Goods');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM FoodType WHERE foodTypeDescription = 'Beverages') THEN
        INSERT INTO FoodType (foodTypeDescription) VALUES ('Beverages');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM FoodType WHERE foodTypeDescription = 'Snacks') THEN
        INSERT INTO FoodType (foodTypeDescription) VALUES ('Snacks');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM FoodType WHERE foodTypeDescription = 'Meal') THEN
        INSERT INTO FoodType (foodTypeDescription) VALUES ('Meal');
    END IF;

END$$;

SELECT * FROM FoodType;
