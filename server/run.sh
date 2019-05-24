#!/bin/bash

# create machine and set everything up
docker-machine create --driver "virtualbox" "Char"
docker-machine start "Char"
export DOCKER_IP=$(docker-machine ip "Char")
export DB_HOST=$DOCKER_IP
eval $(docker-machine env "Char")

# remove all unused volumes & "mysql" container if exists
docker rm -f "mysql" 2>/dev/null
docker volume prune -f
echo ""

# display db related environments variables for check
echo "Checking environment DB_* variables."
env | grep -e "^DB_.\+$"
if [ -z "$DB_NAME" ] || [ -z "$DB_PASS" ] || [ -z "$DB_USER" ]; then
	echo "ERROR: You must at least set DB_NAME, DB_PASS & DB_USER for this to work."; exit 1;
fi
echo ""

# run mysql container
echo "Running new MySQL container."
docker run --name "mysql" --restart "on-failure" \
	--env "MYSQL_ROOT_PASSWORD=$DB_PASS" \
	--env "MYSQL_DATABASE=$DB_NAME" \
	--publish "3306:3306" \
	--detach "mysql:latest" \
	--default-authentication-plugin "mysql_native_password"
echo ""

# copy init.sql to initdb/ directory in container
docker cp "./config/init.sql" "mysql:/docker-entrypoint-initdb.d"

# initialize database via .sql file
echo "Initializing the database..."
until $(docker exec "mysql" /bin/bash -c "mysql -u$DB_USER -p$DB_PASS </docker-entrypoint-initdb.d/init.sql 2>/dev/null")
do
	sleep "5"
	echo "Working..."
done
echo ""

# done, display usage
echo "Done! To access MySQL container, run:"
echo "----------------------------------------------"
echo " docker exec --interactive --tty \"mysql\" bash"
echo "----------------------------------------------"
echo -e "\nAlso, you should probably run:"
echo "--------------------------------------------------------------------"
echo " export DB_HOST=$DB_HOST && eval \$(docker-machine env \"Char\")"
echo "--------------------------------------------------------------------"
echo ""

exit 0
