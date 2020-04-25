setup-dev-env:
	npm install --silent

run-dev:
	docker-compose -f docker-compose.dev.yml up

clean:
	docker-compose -f docker-compose.dev.yml stop && docker-compose -f docker-compose.dev.yml down --rmi local --volumes --remove-orphans

generate-migrations:
	docker-compose -f docker-compose.dev.yml exec pindrop-backend npm run typeorm:migration:generate

run-migrations:
	docker-compose -f docker-compose.dev.yml exec pindrop-backend npm run typeorm:migration:run

revert-migrations:
	docker-compose -f docker-compose.dev.yml exec pindrop-backend npm run typeorm:migration:revert