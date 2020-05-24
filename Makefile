setup-dev-env:
	npm install --silent && docker-compose -f docker-compose.dev.yml build

run-dev:
	docker-compose -f docker-compose.dev.yml up

dev-stop:
	docker-compose -f docker-compose.dev.yml stop

clean:
	docker-compose -f docker-compose.dev.yml stop && docker-compose -f docker-compose.dev.yml down --rmi local --volumes --remove-orphans

generate-migrations:
	docker-compose -f docker-compose.dev.yml exec pindrop-backend npm run typeorm:migration:generate -n $(NAME)

run-migrations:
	docker-compose -f docker-compose.dev.yml exec pindrop-backend npm run typeorm:migration:run

revert-migrations:
	docker-compose -f docker-compose.dev.yml exec pindrop-backend npm run typeorm:migration:revert