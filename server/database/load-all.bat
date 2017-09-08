:: NOTE: These credentials are for a dummy development database (non-production). Production database credentials are not made public!
set server="ec2-54-83-26-65.compute-1.amazonaws.com"
set port=5432
set database="dboab0kq8r4usn"
set username="vvbtixriggqnkz"
set PGPASSWORD=dda3a35edddd2ccb79bafa2bdddad61531827529d4c78c9843a0c02aa17c5660


:: WARNING: The -nuke_database argument will literally drop and recreate the entire development database (destroying all data)!
if "%1"=="-nuke_database" (
    echo "=== Warning: If you confirm this action, then all development data will be lost!"
    heroku pg:reset DATABASE_URL -a connect-food
)


:: Construct the database by (re)initializing all tables and functions.
psql --set=sslmode=require -h %server% -p %port% -d %database% -U %username% ^
    -f core-tables\app-user.sql ^
    -f core-tables\app-user-password.sql ^
    -f core-tables\contact-info.sql ^
    -f core-tables\organization.sql ^
    -f core-tables\unverified-app-user.sql ^
    -f core-tables\food-listing.sql ^
    -f core-tables\claimed-food-listing.sql ^
    -f core-tables\food-type.sql ^
    -f core-tables\food-listing-food-type-map.sql ^
    -f stored-procedures\drop-function.sql ^
    -f stored-procedures\add-unverified-app-user.sql ^
    -f stored-procedures\verify-app-user.sql ^
    -f stored-procedures\add-contact-info.sql ^
    -f stored-procedures\add-app-user.sql ^
    -f stored-procedures\get-app-user-info.sql ^
    -f stored-procedures\get-missing-address-info.sql ^
    -f stored-procedures\update-app-user.sql ^
    -f stored-procedures\add-food-listing.sql ^
    -f stored-procedures\get-food-listings.sql ^
    -f stored-procedures\claim-food-listing.sql ^
    -f stored-procedures\unclaim-food-listing.sql ^
    -f stored-procedures\remove-food-listing.sql ^
    -c "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;"
