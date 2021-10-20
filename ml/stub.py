import numpy as np
import tensorflow as tf
from tensorflow.keras.layers import Dense, Input
from tensorflow import keras
import random

inp = Input((5,))
x = Dense(5)(inp)
model = keras.Model(inp, x)

def fit(matches, companies, services, file):#принимает на вход матрицу n*m (matches), где n - количество пользователей, 
                                      #m - количество сервисов. В ячейке i, j записана -1, если i-ый
                                      #пользователь дизлайкал j-ый сервис, -0.5 - если никак не реагировал, но видел,
                                      #0, если не видел, 1, если лайкнул, 2, если они смэтчились, (?)3 - если получил поддержку
                
                
                
    #здесь я дообучаю модель, функция вызывается раз в какое-то время по мере накопления данных       
    #веса сохраняю в директорию file и сам их оттуда достаю
    return

def predict(company, services, likes_or_dislikes):#принимает компанию, список всех сервисов и список компаний, которые 
                                                  #лайкнул/дизлайкнул/проигнорил (1/-1/-0.5) на предыдущем шаге (в начале все 0)
    #выдает список сервисов, которые показываем пользователю company
    return np.random.sample(random.random())