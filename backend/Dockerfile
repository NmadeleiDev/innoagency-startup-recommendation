FROM continuumio/anaconda3

RUN python -m pip install --upgrade pip
RUN apt update && apt install -y uvicorn && pip install scikit-learn==0.22 pymongo fastapi[all] pandas dnspython openpyxl tensorflow
RUN mkdir -p /app/ && apt -y install cron

COPY . /app
WORKDIR /app

COPY cron_conf /etc/cron.d/cron_conf
 
RUN chmod 0644 /etc/cron.d/cron_conf && crontab /etc/cron.d/cron_conf

EXPOSE 2222

CMD uvicorn main:app --reload --port 2222 --host 0.0.0.0 --log-level debug

