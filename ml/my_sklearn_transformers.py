
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.preprocessing import OrdinalEncoder, MultiLabelBinarizer
import numpy as np
import pandas as pd
import torch
from torch import nn

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

class MatrixColsSelector(BaseEstimator, TransformerMixin):
    def __init__(self, indicies, custom_apply=None, print_shapes=False, astype=None):
        self.indicies = list(indicies)
        self.custom_apply = custom_apply
        self.print_shapes = print_shapes
        self.astype = astype

    def fit(self, x, y=None):
        return self
    
    def transform(self, x):
        if (self.custom_apply is None):
            res = x[:, self.indicies]
        else:
            res = np.apply_along_axis(self.custom_apply, 1, x[:, self.indicies])

        if (self.print_shapes is True):
            print('Out shape is {} for selector of {}'.format(res.shape, self.indicies))
        if (self.astype is not None):
            res = res.astype(self.astype)

        return res

class ValReplacerTf(BaseEstimator, TransformerMixin):
    def __init__(self, replacement_dicts=[], missing_value=np.nan):
        self.replacement_dicts = replacement_dicts
        self.missing_value = missing_value

    def fit(self, x, y=None):
        return self
    
    def transform(self, x):
        return np.array([[self.replacement_dicts[col_idx][x] if x in self.replacement_dicts[col_idx].keys() else self.missing_value for x in col_vals] for col_idx, col_vals in enumerate(x.T)]).T

def value_to_sin_cos(value, period=86400):
    rads = (value * 2 * np.pi) / period
    return np.stack([np.sin(rads), np.cos(rads)], axis=-1)

class ValueToSinCosTf(BaseEstimator, TransformerMixin):
    def __init__(self):
        pass

    def fit(self, x, y=None):
        self.periods = []
        for col in x.T:
            self.periods.append(len(np.unique(col)))
        return self
    
    def transform(self, x):
        results = []
        for col, period in zip(x.T, self.periods):
            sc = value_to_sin_cos(col, period=period)
            results.append(sc)
        return np.concatenate(results, axis=1)

class RelativeToPrevTf(BaseEstimator, TransformerMixin):
    def __init__(self, lookback=1):
        self.lookback = lookback

    def fit(self, x, y=None):
        return self
    
    def transform(self, x):
        padder = np.ones((self.lookback, x.shape[1]))
        return np.concatenate([padder, x[self.lookback:] / x[:-self.lookback]], axis=0) - 1 # вычитаю 1 чтобы получить долю самого изменения (более вероятно в [-1,1]), а не отношение к пред. (скорее [0,2])

class RelativeToLastTf(BaseEstimator, TransformerMixin):
    def __init__(self):
        pass

    def fit(self, x, y=None):
        return self
    
    def transform(self, x):
        return x / x[-1] - 1 # вычитаю 1 чтобы получить долю самого изменения (более вероятно в [-1,1]), а не отношение к пред. (скорее [0,2])

class PrintShapes(BaseEstimator, TransformerMixin):
    def __init__(self, tag=None):
        self.tag = tag

    def fit(self, x, y=None):
        print('{} fit X shape: '.format(self.tag), x.shape)
        return self
    
    def transform(self, x):
        print('{} transform X shape: '.format(self.tag), x.shape)
        return x

class InputMemorizer(BaseEstimator, TransformerMixin):
    def __init__(self, inp_dict=None, fill_value=np.nan):
        self.inp_dict = inp_dict
        self.fill_value = fill_value

    def fit(self, x, y=None):
        if (self.inp_dict is None):
            self.inp_dict = []
            for col in x.T:
                self.inp_dict.append(set(col))
        return self
    
    def transform(self, x):
        return np.stack([np.array([val if val in dic else self.fill_value for val in col]) for col, dic in zip(x.T, self.inp_dict)], axis=-1)

class MyOrdinalEncoder(BaseEstimator, TransformerMixin):
    def __init__(self, replace_unknown=None, categories=None):
        self.replace_unknown = int(replace_unknown)
        self.dicts = []
        self.categories = categories
        self.categories_len = []

    def fit(self, x, y=None):
        for col_idx, col_vals in enumerate(x.T):
            self.dicts.append({x: idx + 1 for idx, x in enumerate(np.unique(col_vals))})
            self.categories_len.append(len(self.dicts[-1]) + 1) # плюсую в силу replace_unknown
        return self
    
    def transform(self, x):
        return np.array([[(dic[x] if x in dic.keys() else self.replace_unknown) for x in col] for dic, col in zip(self.dicts, x.T)], dtype=np.int).T

class ToTorchTensor(BaseEstimator, TransformerMixin):
    def __init__(self, dtype=torch.float32):
        self.dtype = dtype

    def fit(self, x, y=None):
        return self
    
    def transform(self, x):
        return torch.from_numpy(x).type(self.dtype)

class EmbedderOnTorch(BaseEstimator, TransformerMixin):
    def __init__(self, embedding_vocab_size=12, ordinal_encode_first=True, categories=None, debug=False, weights=None, allow_refit=True):
        self.embedding_vocab_size = embedding_vocab_size
        self.categories_ = [['dim_{}'.format(i) for i in range(1, embedding_vocab_size + 1)]]
        self.ordinal_encode_first = ordinal_encode_first
        self.categories = categories
        self.debug = debug
        self.weights = weights
        self.allow_refit = allow_refit
        self.fitten = False

    def print_debug(self, text):
        if (self.debug):
            print(text)
        
    def fit(self, x, y=None):
        if (self.fitten is True and self.allow_refit is False):
            return self
        if (self.ordinal_encode_first is True):
            self.ord_encoder = MyOrdinalEncoder(replace_unknown=0)
            self.print_debug("Fitting encoder")
            self.ord_encoder.fit(x if self.categories is None else self.categories)
            self.print_debug("Encoder fitted")
        if (self.weights is None):
            self.embeddings = nn.Embedding(self.ord_encoder.categories_len[0], self.embedding_vocab_size, max_norm=1)
            self.embeddings.requires_grad_(requires_grad=False)
        else:
            self.embeddings = nn.Embedding.from_pretrained(self.weights, max_norm=1, sparse=False)
        self.print_debug("EmbedderOnTorch fitted")
        self.fitten = True
        
        return self
    
    def transform(self, x):
        if (self.ordinal_encode_first is True):
            inp = self.ord_encoder.transform(x)
        else:
            inp = x

        if (len(inp.shape) > 1 and inp.shape[1] != 1):
            print("MY WARN: Embedder is not designed to manager multiple inputs, showever shape of input is: {}".format(inp.shape))
        self.print_debug("Creating embeddings")
        res = self.embeddings(torch.from_numpy(inp.T).int()).numpy().reshape((inp.shape[0], -1)) # в 1 оси будет всего один эл.
        self.print_debug("Created embeddings")
        return res

class GroupSeqTo3DbyKeys(BaseEstimator, TransformerMixin):
    def __init__(self, keys, pad_max_len=15, min_len=15, valid_group_names=None, pad_values=np.nan, do_only_groupping=False, dtype=np.float32):
        self.keys = keys
        self.pad_max_len = pad_max_len
        self.min_len = min_len
        self.valid_group_names = set(valid_group_names) if valid_group_names is not None else None
        self.do_only_groupping = do_only_groupping
        self.dtype = dtype

        if hasattr(pad_values, '__iter__'):
            self.pad_values = {i: v for i, v in enumerate(pad_values)} 
        else:
            self.pad_values = pad_values
        self.check_group_name = (lambda x: x in self.valid_group_names) if (self.valid_group_names is not None) else (lambda x: True)
        self.check_len = lambda x: x.shape[0] >= self.min_len
    
    def fit(self, x, y=None):
        return self

    def transform(self, x):
        if self.pad_max_len > 0:
            res = np.stack([pd.DataFrame(np.pad(group, ((self.pad_max_len - group.shape[0], 0), (0, 0)), constant_values=np.nan) 
                    if (group.shape[0] < self.pad_max_len) else group.iloc[:self.pad_max_len] , copy=False).fillna(self.pad_values).to_numpy(dtype=self.dtype)
                for name, group in pd.DataFrame(x, copy=False).groupby(self.keys, sort=False, as_index=True).__iter__() 
                        if (self.check_len(group) and self.check_group_name(name))], axis=0)
        elif self.do_only_groupping is False:
            res = [pd.DataFrame(group, copy=False).fillna(self.pad_values).to_numpy(dtype=self.dtype)
                for name, group in pd.DataFrame(x, copy=False).groupby(self.keys, sort=False, as_index=True).__iter__() 
                        if (self.check_len(group) and self.check_group_name(name))]
        else:
            res = [group.to_numpy(dtype=self.dtype)
                for name, group in pd.DataFrame(x, copy=False).groupby(self.keys, sort=False, as_index=True).__iter__() 
                        if (self.check_len(group) and self.check_group_name(name))]
        return res

class GroupDataFrame(BaseEstimator, TransformerMixin):
    def __init__(self, key, group_apply, dropna_all=False):
        self.key = key
        self.group_apply = group_apply
        self.dropna_all = dropna_all
    
    def fit(self, x, y=None):
        return self

    def transform(self, x):
        res = x.groupby(self.key, sort=False).apply(self.group_apply)
        if (self.dropna_all is True):
            res.dropna(how='all', inplace=True)
        return res

class FeatureExtractor(BaseEstimator, TransformerMixin):
    def __init__(self, extractors, colnames=None):
        self.extractors = extractors
        self.colnames = colnames
    
    def fit(self, x, y=None):
        return self

    def transform(self, x):
        res = np.concatenate([fn(x) for fn in self.extractors], axis=1) # ожидается, что fn не меняет shape тензора
        if (self.colnames is not None):
            return pd.DataFrame(res, columns=self.colnames)
        else:
            return res
class ValuesToGradientTf(BaseEstimator, TransformerMixin):
    def __init__(self):
        pass

    def fit(self, x, y=None):
        return self
    
    def transform(self, x):
        return np.gradient(x, axis=0)
class MovingAverageTf(BaseEstimator, TransformerMixin):
    def __init__(self, lookback):
        self.lookback = lookback

    def fit(self, x, y=None):
        self.n_cols = x.shape[1]
        return self
    
    def transform(self, x):
        results = []
        padder = np.empty((self.lookback - 1,x.shape[1]))
        padder.fill(np.nan)
        for i in range(self.n_cols):
            results.append(np.convolve(x[:, i], np.ones((self.lookback,))/self.lookback, mode='valid'))
        return np.concatenate([padder, np.stack(results, axis=1)], axis=0)

class WrapperPipelineWithFeatureNames(BaseEstimator, TransformerMixin):
    def __init__(self, stages):
        self.pipeline = Pipeline(stages)

    def fit(self, X, y=None):
        self.pipeline.fit(X)

        return self

    def transform(self, X, y=None):
        return self.pipeline.transform(X)

    def get_feature_names(self):
        tts = [OneHotEncoder, MyEmbedderOnTorch]
        col_names = self.pipeline.named_steps['selector_stage'].attr_names
        transformer_categories = None
        for transformer in self.pipeline.named_steps.values():
            if (hasattr(transformer, 'categories_') and np.any([isinstance(transformer, tt) for tt in tts])):
                transformer_categories = transformer.categories_
        if (transformer_categories is None):
            return col_names
        else:
            return np.concatenate([['{}_{}'.format(col_name, cat) for cat in categories] for col_name, categories in zip(col_names, transformer_categories)])
        