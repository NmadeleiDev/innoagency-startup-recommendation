# Rolling Drones - Innoagency Startup Recommendation

## Задача проекта

Текущий проект - это персонализированная рекомендательная система по сервисам Москвы для стартапов

## Quick Start

```bash
git clone https://github.com/NmadeleiDev/innoagency-startup-recommendation.git
cd innoagency-startup-recommendation

cp .env.example .env

docker-compose build
docker-compose up -d
```

или с использованием make

```bash
git clone https://github.com/NmadeleiDev/innoagency-startup-recommendation.git
cd innoagency-startup-recommendation

cp .env.example .env

make up
make up-c # с очисткой БД
```

## Структура проекта

Папки - части общего проекта. Каждая часть опционально имеет внутри Dockerfile. Все части соединены docker-compose файлом в корне проекта.

[![](https://mermaid.ink/svg/eyJjb2RlIjoiZmxvd2NoYXJ0IExSXG4gICAgVVtVc2VyL0Zyb250XSA8LS0-IEJbQmFja2VuZF1cbiAgICBCPC0tPk1MW01vZGVsXSAgJiBNW01vbmdvREJdICYgUFxuICAgIFBbUGFyc2VyXS0tPk0iLCJtZXJtYWlkIjp7InRoZW1lIjoiZGFyayJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlLCJhdXRvU3luYyI6dHJ1ZSwidXBkYXRlRGlhZ3JhbSI6ZmFsc2V9)](https://mermaid-js.github.io/mermaid-live-editor/edit/#eyJjb2RlIjoiZmxvd2NoYXJ0IExSXG4gICAgVVtVc2VyL0Zyb250XSA8LS0-IEJbQmFja2VuZF1cbiAgICBCPC0tPk1MW01vZGVsXSAgJiBNW01vbmdvREJdICYgUFxuICAgIFBbUGFyc2VyXS0tPk0iLCJtZXJtYWlkIjoie1xuICBcInRoZW1lXCI6IFwiZGFya1wiXG59IiwidXBkYXRlRWRpdG9yIjpmYWxzZSwiYXV0b1N5bmMiOnRydWUsInVwZGF0ZURpYWdyYW0iOmZhbHNlfQ)

### ML

Папка ML содержит в себе Jupyter Notebooks, где продемонстрировано создание модели для персонализированных рекомендаций.

### Backend

Папка backend содержит код (python{FastAPI}) серверной части веб-приложения, API для приема запросов от клиентской части веб-приложения (frontend) и логику работы с обученной моделью.

### Front

Папка front содержит код (NodeJS{React}) клиентской части веб-приложения.

### Parser

Папка parser содержит код для парсинга данных компаний по ИНН для пополнения датасета и дообучения модели.

### DB

Так как данные разрежены (по многим аттрибутам много пробелов), мы решили отказаться от реляционных БД в пользу NoSQL подобных. Поэтому качестве базы данных взяли MongoDB.

## Документация по интерфейсу

Документация по интерфейсу в формате OpenAPI (Swagger) доступна по адресу <https://startup-guide.ml/backend/docs>

По адресу <https://startup-guide.ml> также доступна демо-версия проекта.

## Пользовательская история / сценарий использования

### Главный экран

[![main](./images/form1.png)](./images/form1.png)

### Экран заполнения анкеты о стартапе

[![form](./images/frame2.png)](./images/frame2.png)

### Экран выданных рекмендаций сервисов Москвы


