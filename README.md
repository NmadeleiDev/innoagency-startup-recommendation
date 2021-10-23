# innoagency-startup-recommendation

## Structure

Folders for parts of the project. Each part has its own Dockerfile inside. All parts connected with one docker-compose in the root of the project.

## Quick Start

```bash
git clone git@github.com:NmadeleiDev/innoagency-startup-recommendation.git
cd innoagency-startup-recommendation

cp .env.example .env

docker-compose build
docker-compose up -d
```

> _All Dockerfiles must have EXPOSE [PORT] to be visible with traefik._

## How to develop

```bash
# On every completed milestone
docker-compose build [<service>]
docker-compose up -d [<service>]
```

### ML

Folder for ML Part.

### Backend

Folder for backend business logic

### Front

Folder for frontend part
