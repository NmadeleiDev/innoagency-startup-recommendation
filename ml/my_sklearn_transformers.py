from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.preprocessing import OrdinalEncoder
import numpy as np
import pandas as pd

class DfSelector(BaseEstimator, TransformerMixin):
    def __init__(self, attr_names, custom_apply=None, return_numpy=True, print_shapes=False, astype=None):
        self.attr_names = list(attr_names)
        self.custom_apply = custom_apply
        self.return_numpy = return_numpy
        self.print_shapes = print_shapes
        self.astype = astype

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