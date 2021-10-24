FROM continuumio/anaconda3

RUN python -m pip install --upgrade pip
RUN apt update && apt install -y uvicorn && pip install scikit-learn==0.22 pymongo fastapi[all] pandas dnspython openpyxl tensorflow
RUN mkdir -p /app/

COPY . /app
WORKDIR /app

EXPOSE 2222

CMD uvicorn main:app --reload --port 2222 --host 0.0.0.0 --log-level debug
