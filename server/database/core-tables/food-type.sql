/*  A domain table that holds all possible hard-coded short hand food type descriptions.
 *  Should be used to populate some form item such as a combobox for selection.
 *  We may be able to get data from an online database for this in the future...
 */

DROP TABLE FoodType CASCADE;
CREATE TABLE IF NOT EXISTS FoodType
(
    foodTypeKey SERIAL PRIMARY KEY
);

ALTER TABLE FoodType ADD COLUMN IF NOT EXISTS foodType VARCHAR(60) NOT NULL UNIQUE;

-- We can add all our FoodType entries here.
DO $$ BEGIN

    IF NOT EXISTS (SELECT 1 FROM FoodType WHERE foodType = 'Produce') THEN
        INSERT INTO FoodType (foodType) VALUES ('Produce');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM FoodType WHERE foodType = 'Canned Goods') THEN
        INSERT INTO FoodType (foodType) VALUES ('Canned Goods');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM FoodType WHERE foodType = 'Dessert') THEN
        INSERT INTO FoodType (foodType) VALUES ('Dessert');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM FoodType WHERE foodType = 'Frozen') THEN
        INSERT INTO FoodType (foodType) VALUES ('Frozen');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM FoodType WHERE foodType = 'Grain') THEN
        INSERT INTO FoodType (foodType) VALUES ('Grain');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM FoodType WHERE foodType = 'Dairy') THEN
        INSERT INTO FoodType (foodType) VALUES ('Dairy');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM FoodType WHERE foodType = 'Meat') THEN
        INSERT INTO FoodType (foodType) VALUES ('Meat');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM FoodType WHERE foodType = 'Sea Food') THEN
        INSERT INTO FoodType (foodType) VALUES ('Sea Food');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM FoodType WHERE foodType = 'Baked Goods') THEN
        INSERT INTO FoodType (foodType) VALUES ('Baked Goods');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM FoodType WHERE foodType = 'Beverages') THEN
        INSERT INTO FoodType (foodType) VALUES ('Beverages');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM FoodType WHERE foodType = 'Snacks') THEN
        INSERT INTO FoodType (foodType) VALUES ('Snacks');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM FoodType WHERE foodType = 'Meal') THEN
        INSERT INTO FoodType (foodType) VALUES ('Meal');
    END IF;

END$$;

--SELECT * FROM FoodType;
