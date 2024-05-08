

npm run migrate

npm run dev

#!/bin/bash

export PGADMIN_CONFIG=/etc/pgadmin/pgadmin4.conf

export PGADMIN_DEFAULT_EMAIL=${PGADMIN_DEFAULT_EMAIL}
export PGADMIN_DEFAULT_PASSWORD=${PGADMIN_DEFAULT_PASSWORD}

export PGADMIN_SERVERS='{"Servers": [{"Name": "My Database", "Group": "Servers", "Host": "'$DATABASE_HOST'", "Port": "'$DATABASE_PORT'", "MaintenanceDB": "'$DATABASE_NAME'", "Username": "'$DATABASE_USER'", "Password": "'$DATABASE_PASSWORD'", "SSLMode": "prefer"}]}'

echo "[general]" > /etc/pgadmin/pgadmin4.conf
echo "data_dir = /var/lib/pgadmin" >> /etc/pgadmin/pgadmin4.conf
echo "logs_dir = /var/log/pgadmin" >> /etc/pgadmin/pgadmin4.conf

echo "$PGADMIN_SERVERS" > /etc/pgadmin/pgadmin4.conf

exec /usr/bin/pgadmin4
