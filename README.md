# Bluein Tech
Votação de Empreendimentos


# DOCKER COMMANDS:

# AWS
docker-machine env aws01

# BUILD NODE-IMMAGE
docker build -t node-image .

# BUILD MYSQL-IMAGE
docker build -t mysql-image -f db/Dockerfile .

# RUN DOCKER COMPOSE
docker-compose up -d