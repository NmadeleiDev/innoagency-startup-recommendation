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

[![](https://mermaid.ink/svg/eyJjb2RlIjoiZmxvd2NoYXJ0IExSXG4gICAgVVtVc2VyL0Zyb250XSA8LS0-IEJbQmFja2VuZF1cbiAgICBCPC0tPk1MW01vZGVsXSAgJiBNW01vbmdvREJdXG4gICAgUFtQYXJzZXJdLS0-TVxuICAgIFAgLS0-fENyb258UCIsIm1lcm1haWQiOnsidGhlbWUiOiJkYXJrIn0sInVwZGF0ZUVkaXRvciI6dHJ1ZSwiYXV0b1N5bmMiOnRydWUsInVwZGF0ZURpYWdyYW0iOmZhbHNlfQ)](https://mermaid-js.github.io/mermaid-live-editor/edit/#eyJjb2RlIjoiZmxvd2NoYXJ0IExSXG4gICAgVVtVc2VyL0Zyb250XSA8LS0-IEJbQmFja2VuZF1cbiAgICBCPC0tPk1MW01vZGVsXSAgJiBNW01vbmdvREJdXG4gICAgUFtQYXJzZXJdLS0-TVxuICAgIFAgLS0-fENyb258UCIsIm1lcm1haWQiOiJ7XG4gIFwidGhlbWVcIjogXCJkYXJrXCJcbn0iLCJ1cGRhdGVFZGl0b3IiOnRydWUsImF1dG9TeW5jIjp0cnVlLCJ1cGRhdGVEaWFncmFtIjpmYWxzZX0)

### ML

Папка ML содержит в себе Jupyter Notebooks для подготовки данных и генерации рекомендаций.

Всего в проекте используется 2 модели:

- Класификатор для получения наиболее подходящего типа сервиса для компании (Частный фонд, гос. фонд, акселератор, частный инвестор, корпоративный инвестор)
- Класификатор для получения наиболее подходящего сервиса для компании

Описание notebooks и файлов:

- dataprep.py - подготовка данных для обоих классификаторов
- investor_classifier.ipynb - создание и обучение модели рекомендации сервиса для компании
- type_classifier.ipynb - создание и обучение модели рекомендации типа сервиса для компании

#### Как готовили данные:

- Категориальные метрики: Onehot кодирование (<https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.LabelBinarizer.html>, <https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MinMaxScaler.html>)
- Числовые метрики: Скейлинг (<https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OneHotEncoder.html>)


#### Проверка гипотез

Мы тестировали следующие гипотезы для классификации компании к сервисам:

- Метод линейной регрессии
- Метод опорных векторов
- Решающие деревья

Указанные методы сработали не очень хорошо. Мы решили, что стандарные методы плохо подходят для такой задачи и разработали свою кастомную модель. 

##### Что сработало хорошо?

Мы создали кастомную модель. С помощью нее мы ищем подходящие сервисы для компании.

Под капотом она сделана следующим образом:

Системе предоставляют данные новой компании, а модель генерирует для нее "идеальный" сервис или фонд. После этого система ищет в БД существующий фонд/сервис, который наиболее близок по параметрам к "идеальному".

##### Работа нашей модели

Строго говоря, мы строим отображение из пространства компаний в пространство сервисов, и в последнем для каждой компании ищем ближайший сервис, используя L2 норму.

В TensorFlow использовали Sequential модель с 1 внутренним слоем в 64 нейрона (<https://www.tensorflow.org/api_docs/python/tf/keras/Sequential>)

Далее, при помощи пакета numpy.linalg и функции norm искали сервисы, близки к образу компании на пространство сервисов.

### Backend

Папка backend содержит код (python{FastAPI}) серверной части веб-приложения, API для приема запросов от клиентской части веб-приложения (frontend) и логику работы с обученной моделью.

Бекенд взаимодействует с БД и производит следующие операции:

- Получает, вставляет или удаляет (CRUD) сущности (стартапы, компании, акселераторы и сервисы)
- Полученные данные подготавливает/трансформирует, используя процедуры, описанные в папке ML
- Трансформирванные и подготовленные данные отправляет в обученную модель из папки ML и возвращает рекмендации клиенту.

Ниже представлена диаграмма взаимодействий компонент стека.

[![](https://mermaid.ink/svg/eyJjb2RlIjoiZmxvd2NoYXJ0IFRCXG4gICAgJSUgc3ViZ3JhcGggQmFja2VuZFxuICAgIEZbRnJvbnRdIC0tPnwxLiDQlNCw0L3QvdGL0LUg0YEg0LDQvdC60LXRgtGLfCBCW0JhY2tlbmRdXG4gICAgQiAtLT58NS4g0JLQvtC30LLRgNCw0YIg0YDQtdC60L7QvNC10L3QtNCw0YbQuNC5fCBGXG4gICAgQiA8LS0-fDIuINCX0LDQv9GA0L7RgSDQtNCw0L3QvdGL0YUg0L4g0YHQtdGA0LLQuNGB0LDRhXwgREJcbiAgICBCIDwtLT58My4g0J_RgNC-0YbQtdC00YPRgNCwINC_0L7QtNCz0L7RgtC-0LLQutC4INC00LDQvdC90YvRhXwgUFxuICAgIEIgPC0tPnw0LiDQntGC0L_RgNCw0LLQutCwINC_0L7QtNCz0L7RgtC-0LLQu9C10L3QvdGL0YUg0LTQsNC90L3Ri9GFINCyINC80L7QtNC10LvRjHwgTVxuICAgICUlIGVuZFxuICAgIHN1YmdyYXBoIE1MXG4gICAgUFtTY2lraXQtbGVhcm4gUGlwZWxpbmVzXVxuICAgIE1bVGVuc29yZmxvdyBNb2RlbF1cbiAgICBlbmQiLCJtZXJtYWlkIjp7InRoZW1lIjoiZGFyayJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlLCJhdXRvU3luYyI6dHJ1ZSwidXBkYXRlRGlhZ3JhbSI6ZmFsc2V9)](https://mermaid-js.github.io/mermaid-live-editor/edit/#eyJjb2RlIjoiZmxvd2NoYXJ0IFRCXG4gICAgJSUgc3ViZ3JhcGggQmFja2VuZFxuICAgIEZbRnJvbnRdIC0tPnwxLiDQlNCw0L3QvdGL0LUg0YEg0LDQvdC60LXRgtGLfCBCW0JhY2tlbmRdXG4gICAgQiAtLT58NS4g0JLQvtC30LLRgNCw0YIg0YDQtdC60L7QvNC10L3QtNCw0YbQuNC5fCBGXG4gICAgQiA8LS0-fDIuINCX0LDQv9GA0L7RgSDQtNCw0L3QvdGL0YUg0L4g0YHQtdGA0LLQuNGB0LDRhXwgREJcbiAgICBCIDwtLT58My4g0J_RgNC-0YbQtdC00YPRgNCwINC_0L7QtNCz0L7RgtC-0LLQutC4INC00LDQvdC90YvRhXwgUFxuICAgIEIgPC0tPnw0LiDQntGC0L_RgNCw0LLQutCwINC_0L7QtNCz0L7RgtC-0LLQu9C10L3QvdGL0YUg0LTQsNC90L3Ri9GFINCyINC80L7QtNC10LvRjHwgTVxuICAgICUlIGVuZFxuICAgIHN1YmdyYXBoIE1MXG4gICAgUFtTY2lraXQtbGVhcm4gUGlwZWxpbmVzXVxuICAgIE1bVGVuc29yZmxvdyBNb2RlbF1cbiAgICBlbmQiLCJtZXJtYWlkIjoie1xuICBcInRoZW1lXCI6IFwiZGFya1wiXG59IiwidXBkYXRlRWRpdG9yIjpmYWxzZSwiYXV0b1N5bmMiOnRydWUsInVwZGF0ZURpYWdyYW0iOmZhbHNlfQ)

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

[![main](./images/frame1.png)](./images/frame1.png)

### Экран заполнения анкеты о стартапе

[![form](./images/frame2.png)](./images/frame2.png)

### Экран выданных рекмендаций сервисов Москвы

[![results](./images/frame3.png)](./images/frame3.png)

### Экран дополнительной информации о сервисе

[![info](./images/frame4.png)](./images/frame4.png)
