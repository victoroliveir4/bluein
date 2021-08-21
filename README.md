# Bluein Tech

Votação de Empreendimentos

# Dependências

Para a execução do projeto tenha instalado em sua máquina as dependências abaixo:
- node (https://nodejs.org/en/download/)
- docker (https://docs.docker.com/get-docker/)
- docker-compose (https://docs.docker.com/compose/install/)

# Executando o projeto

Após realizar o download deste repositório, execute os seguintes comandos dentro da pasta raiz do projeto:

Suba os containers do servidor Node e do banco MYSQL:
$ docker-compose up -d

Pare o container do servidor Node para criar o database no banco:
$ docker stop node-container

Execute o script que insere o database:
$ docker exec -i mysql-container mysql -uroot -pbluein < db/create.sql

Suba novamente o container do servidor:
$ docker start node-container

Pronto! Agora basta acessar a aplicação localmente:
http://localhost:3000


# Bash container

$ docker exec -it container-name /bin/bash

