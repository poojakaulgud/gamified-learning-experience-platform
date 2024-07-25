#!/bin/bash

# Set the Heroku app name from the first argument
APP_NAME="$1"

# Take the Heroku backup
heroku pg:backups:capture --app "$APP_NAME"

# Check if the backup was successful
if [ $? -eq 0 ]; then
  echo "Heroku backup captured successfully."
else
  echo "Failed to capture Heroku backup."
  exit 1
fi

# If the backup was successful, destroy the Heroku database
heroku addons:destroy heroku-postgresql --app "$APP_NAME" --confirm "$APP_NAME"

# Check if the database was destroyed
if [ $? -eq 0 ]; then
  echo "Heroku database destroyed successfully."
else
  echo "Failed to destroy Heroku database."
fi
