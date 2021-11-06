from numpy.lib.type_check import imag
from prediction.fund_predictor import train_model, load_train_data
from db.manager import DbManager

from sklearn.model_selection import StratifiedShuffleSplit

def train_models():
    data = load_train_data()

    sss = StratifiedShuffleSplit(n_splits=1, test_size=0.2)
    for train, test in sss.split(data, data['type_of_ownership__investor'].fillna('')):
        train_idx, test_idx = train, test

    train_model(data.iloc[train_idx], data.iloc[test_idx])

# Дообучение модели, запускается по cron
if __name__ == 'main':
    train_models()
