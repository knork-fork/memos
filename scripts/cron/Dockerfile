FROM alpine:latest

# Install dcron, PostgreSQL client, PHP, and PHP cURL
RUN apk add --no-cache dcron postgresql-client php php-curl

# Copy the crontab file into the container
COPY backup_script_crontab /etc/crontabs/root

# Start the cron daemon
COPY start_crond.sh /usr/local/bin/start-crond.sh
RUN chmod +x /usr/local/bin/start-crond.sh
CMD ["/usr/local/bin/start-crond.sh"]
