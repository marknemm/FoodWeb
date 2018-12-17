# NOTE: These credentials are for a dummy development database (non-production). Production database credentials are not made public!
host="localhost"
port=5432
database="dboab0kq8r4usn"
username="postgres"

# WARNING: The -nuke_database argument will literally drop and recreate the entire local database (destroying all data)!
if [ "$1" == "-nuke_database" ]
then
  ../nuke/local-db-nuke.bash "-child_script"
fi

./load-all.bash "$host" "$port" "$database" "$username" "-child_script"
read -p "Press enter to exit the shell..."
