from joblib import load
from os import path
import tensorflow as tf
import numpy as np
from numpy import linalg as LA
from .utils import *
from db.manager import DbManager
import pandas as pd

def predict(company, services):
    X = load(path_to_pipelines_dir('fund_classifier_preprocessor_X.joblib')).transform(np.array([company.rename(columns=lambda x: '{}__company'.format(x))]))
    services_space = load(path_to_pipelines_dir('fund_classifier_preprocessor_Y.joblib')).transform(services.rename(columns=lambda x: '{}__investor'.format(x)))

    proj = tf.keras.models.load_model(path_to_models_dir('fund_classifier_model.h5')).predict(X)[0]

    idx_sorted = np.argsort(np.apply_along_axis(LA.norm, 1, services_space - proj, ord=2))

    return idx_sorted

def load_train_data():
    db = DbManager()
    db.init_connection()

    companies = load_companies()
    deals = load_deals()
    services = load_services()

    res = match_company_and_investor(deals, services, companies)

    db.close_conn()

    return res

def train(train_data, val_data):
    pre_X = load(path_to_pipelines_dir('fund_classifier_preprocessor_X.joblib'))
    pre_Y = load(path_to_pipelines_dir('fund_classifier_preprocessor_Y.joblib'))

    X_tr = pre_X.transform(train_data)
    y_tr = pre_Y.transform(train_data)

    X_te = pre_X.transform(val_data)
    y_te = pre_Y.transform(val_data)

    es_cb = tf.keras.callbacks.EarlyStopping(
        monitor='val_loss', min_delta=0.001, patience=10, verbose=0,
        mode='auto', baseline=None, restore_best_weights=True
    )

    model = tf.keras.models.load_model(path_to_models_dir('fund_classifier_model.h5'))
    
    model.fit(X_tr, y_tr, validation_data=(X_te, y_te), epochs=100, callbacks=[es_cb])

    model.save(path_to_models_dir('fund_classifier_model.h5'))