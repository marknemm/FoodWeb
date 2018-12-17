# Construct the database by (re)initializing all tables and functions.
psql --set=sslmode=require -h $1 -p $2 -d $3 -U $4 \
 \
    -f ../../bootstrap.sql \
 \
    -f ../../tables/availability/availability.sql \
 \
    -f ../../tables/app-user/domain/app-user-type.sql \
    -f ../../tables/food-listing/domain/food-listings-status.sql \
    -f ../../tables/food-listing/domain/food-type.sql \
    -f ../../tables/food-listing/domain/vehicle-type.sql \
    -f ../../tables/food-listing/delivery-info/domain/delivery-state.sql \
 \
    -f ../../tables/app-user/app-user.sql \
    -f ../../tables/app-user/contact-info.sql \
    -f ../../tables/app-user/organization.sql \
    -f ../../tables/app-user/deliverer-info.sql \
    -f ../../tables/app-user/password/app-user-password.sql \
    -f ../../tables/app-user/password/app-user-password-recovery.sql \
    -f ../../tables/app-user/availability/app-user-availability-map.sql \
    -f ../../tables/app-user/verification/unverified-app-user.sql \
 \
    -f ../../tables/food-listing/food-listing.sql \
    -f ../../tables/food-listing/food-listing-food-type-map.sql \
    -f ../../tables/food-listing/removed-food-listing.sql \
    -f ../../tables/food-listing/img/food-listing-img.sql \
    -f ../../tables/food-listing/availability/food-listing-availability-map.sql \
    -f ../../tables/food-listing/filters/food-listing-filters.sql \
    -f ../../tables/food-listing/filters/food-listing-filters-availability.sql \
 \
    -f ../../tables/food-listing/claim-info/claim-info.sql \
    -f ../../tables/food-listing/claim-info/unclaim-info.sql \
    -f ../../tables/food-listing/claim-info/availability/claim-availability-map.sql \
 \
    -f ../../tables/food-listing/delivery-info/delivery-info.sql \
    -f ../../tables/food-listing/delivery-info/cancelled-delivery-info.sql \
 \
    -f ../../triggers/auto-inc-food-listing-filters-key.sql \
 \
    -f ../../functions/common-util/drop-function.sql \
    -f ../../functions/common-util/create-gps-coordinates.sql \
    -f ../../functions/common-util/json-arr-to-postgres-text-arr.sql \
    -f ../../functions/common-util/generate-token.sql \
 \
    -f ../../functions/date-time-util/timestamp-to-utc-text.sql \
    -f ../../functions/date-time-util/utc-text-to-timestamp.sql \
    -f ../../functions/date-time-util/to-weekday-of-week.sql \
 \
    -f ../../functions/availability/add-availability.sql \
 \
    -f ../../functions/app-user/verification/add-unverified-app-user.sql \
    -f ../../functions/app-user/verification/verify-app-user.sql \
 \
    -f ../../functions/app-user/password-recovery/add-password-recovery-token.sql \
    -f ../../functions/app-user/password-recovery/remove-password-recovery-token.sql \
 \
    -f ../../functions/app-user/availability/add-update-app-user-availability.sql \
    -f ../../functions/app-user/availability/refresh-app-user-availability.sql \
 \
    -f ../../functions/app-user/add-update-contact-info.sql \
    -f ../../functions/app-user/add-app-user.sql \
    -f ../../functions/app-user/update-app-user.sql \
    -f ../../functions/app-user/get-app-user-session-data.sql \
 \
    -f ../../functions/food-listing/deliver/get-delivery-state.sql \
    -f ../../functions/food-listing/deliver/get-delivery-update-notification.sql \
    -f ../../functions/food-listing/deliver/get-possible-delivery-times.sql \
    -f ../../functions/food-listing/deliver/schedule-delivery.sql \
    -f ../../functions/food-listing/deliver/update-delivery-state.sql \
    -f ../../functions/food-listing/deliver/cancel-delivery.sql \
 \
    -f ../../functions/food-listing/claim-unclaim/get-unclaim-notification-data.sql \
    -f ../../functions/food-listing/claim-unclaim/add-update-claim-availability.sql \
    -f ../../functions/food-listing/claim-unclaim/claim-food-listing.sql \
    -f ../../functions/food-listing/claim-unclaim/unclaim-food-listing.sql \
 \
    -f ../../functions/food-listing/donate/add-update-food-listing-availability.sql \
    -f ../../functions/food-listing/donate/add-update-food-listing-food-type-map.sql \
    -f ../../functions/food-listing/donate/add-update-food-listing-img.sql \
    -f ../../functions/food-listing/donate/add-food-listing.sql \
    -f ../../functions/food-listing/donate/update-food-listing.sql \
    -f ../../functions/food-listing/donate/remove-food-listing.sql \
 \
    -f ../../functions/food-listing/filters/add-food-listing-filters.sql \
    -f ../../functions/food-listing/filters/get-food-listing-filters.sql \
 \
    -f ../../functions/food-listing/get-food-listings/gen-availability-overlap-filters.sql \
    -f ../../functions/food-listing/get-food-listings/get-food-listings.sql


if [ "$5" != "-child_script" ]
then
  read -p "Press enter to exit the shell..."
fi
