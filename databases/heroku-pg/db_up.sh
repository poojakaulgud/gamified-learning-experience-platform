# Set the Heroku app name from the first argument
APP_NAME="$1"

heroku addons:create heroku-postgresql:essential-0 -a "$APP_NAME"

# get database url
# wait for database to be created
heroku pg:wait -a "$APP_NAME"

# restore the database
APP_NAME="residency-quiz"
heroku pg:backups:restore -a "$APP_NAME" --confirm "$APP_NAME"
