
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.preprocessing import OrdinalEncoder, MultiLabelBinarizer
import numpy as np
import pandas as pd

class DfSelector(BaseEstimator, TransformerMixin):
    def __init__(self, attr_names, custom_apply=None, return_numpy=True, print_shapes=False, astype=None):
        self.attr_names = list(attr_names)
        self.custom_apply = custom_apply
        self.return_numpy = return_numpy
        self.print_shapes = print_shapes
        self.astype = astype
        self.n_features_in_ = len(self.attr_names)

    def fit(self, x, y=None):
        return self
    
    def transform(self, x):
        res = x[self.attr_names]

        if (self.custom_apply is not None):
            res = x[self.attr_names].apply(self.custom_apply)

        if (self.print_shapes is True):
            print('Out shape is {} for selector of {}'.format(res.shape, self.attr_names))
        if (self.astype is not None):
            res = res.astype(self.astype)

        if (self.return_numpy is True):
            return res.to_numpy()
        else:
            return res

class MemorizeOutShape(BaseEstimator, TransformerMixin):
    def __init__(self):
        pass

    def fit(self, x, y=None):
        self.x_len = x.shape[0]
        self.n_features_ = x.shape[1]
        return self
    
    def transform(self, x):
        return x

class MultilabelEncoder(BaseEstimator, TransformerMixin):
    def __init__(self):
        self.encoder = MultiLabelBinarizer()

    def fit(self, x, y=None):
        self.encoder.fit(x)
        self.known_values = set(self.encoder.classes_)
        return self
    
    def transform(self, x):
        if len(x.shape) != 1:
            print("WARN: MultilabelEncoder takes only one col at a time! Given ", x.shape)
        return self.encoder.transform([list(filter(lambda val: val in self.known_values, row)) for row in x])
