import logging
from joblib import load
import numpy as np
from numpy import linalg as LA
from .utils import *
from db.manager import DbManager

def get_out_features(transformer):
    if hasattr(transformer, 'n_features_'):
        return [transformer.n_features_]
    elif hasattr(transformer, 'categories_'):
        return [len(x) for x in transformer.categories_]
    else:
        return [1]

investor_metrics = ['investition_from_dol',
                    'investition_to_dol',
                    'fund_total_rub',
                    'num_of_investments',
                    'startup_stage',
                    'market',
                    'services',
                    'technologies',
                    'investment_round',
                    'tech_focus']

def predict(company, services):
    preprocessor_X = load(path_to_pipelines_dir('fund_classifier_preprocessor_X.joblib'))
    X = preprocessor_X.transform(company.rename(columns=lambda x: '{}__company'.format(x)))
    services_space = load(path_to_pipelines_dir('fund_classifier_preprocessor_Y.joblib')).transform(services.rename(columns=lambda x: '{}__investor'.format(x)))

    proj = tf.keras.models.load_model(path_to_models_dir('model_fund_classifier.h5'), compile=False).predict(X)[0]

    coords_lens = np.concatenate([get_out_features(t[1][-1]) for t in preprocessor_X.transformer_list])

    err = services_space - proj
    distance_by_coords = np.array([[np.mean((x[coords_lens[i - 1: i]]) ** 2) for i in range(1, len(investor_metrics))] for x in err])
    metric_imp_sorted = np.argsort(distance_by_coords, axis=1)
    distance = np.apply_along_axis(LA.norm, 1, err, ord=2)
    dist_mean = distance.mean()
    score = dist_mean / (dist_mean + distance)

    idx_sorted = np.argsort(distance)

    return idx_sorted, score, metric_imp_sorted, investor_metrics

def load_train_data():
    db = DbManager()
    db.init_connection()

    companies = load_companies()
    deals = load_deals()
    services = load_services()

    res = match_company_and_investor(deals, services, companies)

    db.close_conn()

    return res

def train_model(train_data, val_data):
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

    model = tf.keras.models.load_model(path_to_models_dir('model_fund_classifier.h5'))
    
    model.fit(X_tr, y_tr, validation_data=(X_te, y_te), epochs=100, callbacks=[es_cb])

    model.save(path_to_models_dir('model_fund_classifier.h5'))