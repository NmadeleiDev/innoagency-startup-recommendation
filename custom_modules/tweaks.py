import numpy as np
import ast

def try_concat(arr):
    try:
        return np.concatenate(arr)
    except Exception as e:
        return []

def try_load_list(val):
    try:
        if isinstance(val, list) is True:
            return val
        res = ast.literal_eval(val)
        if isinstance(res, list):
            return res
        else:
            return []
    except Exception as e:
        return []

def map_lists(x):
    return np.array([list(try_load_list(x[i])) for i in range(x.shape[0])], dtype=object)
