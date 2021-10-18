# innoagency-startup-recommendation

## Structure

Folers for parts of the project. Each part has its own Dockerfile inside. All parts connected with one docker-compose in the root of the project.

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

### DB
