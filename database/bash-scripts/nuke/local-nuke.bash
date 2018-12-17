server="localhost"
port=5432
database="postgres"
username="postgres"

while true; do
  read -p "WARNING: You are about to DESTROY AND RECREATE LOCAL FOOD WEB DATABASE. Are you sure you want to perform this action [y/n/q]?" yn
  case $yn in
    [Yy]* )

      psql --set=sslmode=require -h $server -p $port -d $database -U $username \
      -c "DROP DATABASE IF EXISTS dboab0kq8r4usn;" \
      -c "CREATE DATABASE dboab0kq8r4usn;" \
      -c "\c dboab0kq8r4usn;" \
      -c "CREATE EXTENSION Postgis;"

      break;;

    [Nn]* ) break;;
    [Qq]* ) exit;;
    * )     echo "Please answer [y/N]";;
  esac
done

if [ "$1" != "-child_script" ]
then
  read -p "Press enter to exit the shell..."
fi
