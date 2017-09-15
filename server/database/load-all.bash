# NOTE: These credentials are for a dummy development database (non-production). Production database credentials are not made public!
server="ec2-54-83-26-65.compute-1.amazonaws.com"
port=5432
database="dboab0kq8r4usn"
username="vvbtixriggqnkz"
export PGPASSWORD="dda3a35edddd2ccb79bafa2bdddad61531827529d4c78c9843a0c02aa17c5660"


# WARNING: The -nuke_database argument will literally drop and recreate the entire development database (destroying all data)!
if [ $1 == "-nuke_database" ]
then
    echo "=== Warning: If you confirm this action, then all development data will be lost!"
    heroku pg:reset DATABASE_URL -a connect-food
fi


# Construct the database by (re)initializing all tables and functions.
psql --set=sslmode=require -h $server -p $port -d $database -U $username \
 \
    -f tables/app-user/app-user.sql \
    -f tables/app-user/app-user-password.sql \
    -f tables/app-user/app-user-availability \
    -f tables/app-user/contact-info.sql \
    -f tables/app-user/organization.sql \
    -f tables/app-user/unverified-app-user.sql \
 \
    -f tables/food-listing/food-listing.sql \
    -f tables/food-listing/claimed-food-listing.sql \
    -f tables/food-listing/food-type.sql \
    -f tables/food-listing/food-listing-food-type-map.sql \
 \
    -f functions/common-util/drop-function.sql \
 \
    -f functions/app-user/add-unverified-app-user.sql \
    -f functions/app-user/verify-app-user.sql \
    -f functions/app-user/add-contact-info.sql \
    -f functions/app-user/add-app-user.sql \
    -f functions/app-user/get-app-user-info.sql \
    -f functions/app-user/update-app-user.sql \
 \
    -f functions/food-listing/add-food-listing.sql \
    -f functions/food-listing/get-food-listings.sql \
    -f functions/food-listing/claim-food-listing.sql \
    -f functions/food-listing/unclaim-food-listing.sql \
    -f functions/food-listing/remove-food-listing.sql \
 \
    -c "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;" \
    -c "SELECT routines.routine_name FROM information_schema.routines WHERE routines.specific_schema = 'public' ORDER BY routines.routine_name;"
