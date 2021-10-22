
from logging import error
from typing import Union

from starlette import status
from api.model import DefaultResponseModel

from pandas import to_numeric, to_datetime, Timestamp
from numpy import nan_to_num

from datetime import datetime


def success_response(msg: dict = {}) -> DefaultResponseModel[dict]:
    resp = DefaultResponseModel[dict](data=msg, status=True)
    return resp

def error_response(msg: Union[str, None] = None) -> DefaultResponseModel[dict]:
    resp = DefaultResponseModel[dict](data={}, error=msg, status=False)
    return resp

split_by_n1 = lambda x: [i.strip().lower() for i in str(x).split('|')]
split_by_n2 = lambda x: [i.strip().lower() for i in str(x).split(';')]

placeholder_if_not_instanceof = lambda x, t, p: x if isinstance(x, t) else p
to_str = lambda x: str(x).strip().lower()
to_num = lambda x: nan_to_num(to_numeric(x, errors='coerce'))
to_dt = lambda x: placeholder_if_not_instanceof(to_datetime(x, errors='coerce'), Timestamp, datetime(1970, 1, 1))
