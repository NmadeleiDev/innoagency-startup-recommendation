# innoagency-startup-recommendation

## Structure

Folers for parts of the project. Each part has its own Dockerfile inside. All parts connected with one docker-compose in the root of the project.

> _All Dockerfiles must have EXPOSE [PORT] to be visible with traefik._

## How to develop

```bash
# On every completed milestone
docker-compose pull
docker-compose up -d
```

### ML

Folder for ML Part.

> Check ResNet serving

```bash
curl -F "image=@ml/coffee.jpg" -XPOST http://localhost/ml/model/predict
```

### Backend

Folder for backend business logic

### Front

Folder for frontend part

### DB
