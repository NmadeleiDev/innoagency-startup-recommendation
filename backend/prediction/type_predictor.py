from joblib import load
from .utils import *
import numpy as np
from db.manager import DbManager

def predict(company):
    labels = ['accelerator', 'business_angel', 'corp_fund', 'corp_investor', 'gov_fund', 'private_fund']
    X = load(path_to_pipelines_dir('type_classifier_preprocessor_X.joblib')).transform(np.array([company]))
    pred = tf.keras.models.load_model(path_to_models_dir('type_classifier_model.h5'), compile=False).predict(X)[0]
    
    idx_sorted = np.argsort(pred)

    return labels[idx_sorted]

def train(train_data, val_data):
    pre_X = load(path_to_pipelines_dir('type_classifier_preprocessor_X.joblib'))
    pre_Y = load(path_to_pipelines_dir('type_classifier_preprocessor_Y.joblib')).transform(train_data)

    X_tr = pre_X.transform(train_data)
    y_tr = pre_Y.transform(train_data)

    X_te = pre_X.transform(val_data)
    y_te = pre_Y.transform(val_data)

    es_cb = tf.keras.callbacks.EarlyStopping(
        monitor='val_loss', min_delta=0.001, patience=10, verbose=0,
        mode='auto', baseline=None, restore_best_weights=True
    )

    model = tf.keras.models.load_model(path_to_models_dir('type_classifier_model.h5'))
    
    model.fit(X_tr, y_tr, validation_data=(X_te, y_te), epochs=100, callbacks=[es_cb])

    model.save(path_to_models_dir('type_classifier_model.h5'))

def load_train_data():
    db = DbManager()
    db.init_connection()

    companies = load_companies()

    deals = load_deals()

    present_inns = set(deals['startup_inn']) & set(companies['inn'])

    target = group_deals_by_investor_type(deals, present_inns).set_index('startup_inn').sort_index()

    data = (companies.where(lambda x: x['inn'].apply(lambda i: i in present_inns)).dropna(how='all')
        ).dropna(subset=['inn']).drop_duplicates(subset=['inn']).set_index('inn')

    res = target.join(data)

    db.close_conn()

    return res