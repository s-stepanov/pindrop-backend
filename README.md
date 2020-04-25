  # Pindrop Application Backend

This repo contains the code for Pindrop app's backend - semester project at OSTU


## Requirements to run app locally in dev mode:
1. Node v12.x or higher
2. NPM v6.x or higher

## How to set up the dev environment:
1. run in the console `make setup-dev-env`

## Run the app in the dev mode (with nodemon):
1. run in the console `make run-dev`


docker-compose.dev.yml file uses postgres as a database.
You can change db_user and db_password in docker-compose.dev.yml file.

## How to run app's prod mode using Docker:

Run all commands project root folder

1. `docker-compose up -d`
2. Go to http://localhost


# DB commands
## Make a dump
`docker-compose exec db sh -c 'exec pg_dump -U postgres lntsunday > /backup/dump.sql'`

## Restore from the dump
`docker-compose exec db sh -c 'exec psql -U postgres lntsunday < /backup/dump.sql'`

# Useful commands
## Clean all docker containers info
`make clean`
