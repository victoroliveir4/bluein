# Bluein Tech

Votação de Empreendimentos
# DOCKER COMMANDS

# Build node-image

docker build -t node-image .

# Build mysql-image

docker build -t mysql-image -f db/Dockerfile .

# Run docker compose

docker-compose up -d

# Run MYSQL script

docker exec -i mysql-container mysql -uroot -pbluein < db/create.sql

# AWS

docker-machine env aws01

# Docker machine

docker-compose -f docker-compose.yml -f docker-production.yml up -d
