from os import path
import pandas as pd
import numpy as np

path_to_models_dir = lambda x: path.join('/models/{}', *(x if isinstance(x, str) is False else [x]))
path_to_pipelines_dir = lambda x: path.join('/pipelines/{}', *(x if isinstance(x, str) is False else [x]))


def load_companies(db):
    companies = pd.DataFrame(db.get_companies())
    cat_cols = ['got_support_from', 'did_get_support', 'service', 'stage_of_development', 'msp_category', 'is_export', 'inno_cluster_member', 'skolcovo_member', 'is_inno_company', 'is_startup']
    companies[cat_cols] = companies[cat_cols].astype('category')
    # companies.drop(columns=['_id'], inplace=True)
    companies.replace(['', 'н.д.'], np.nan, inplace=True)
    return companies

def load_deals(db):
    deals = pd.DataFrame(db.get_deals())
    deals[['round', 'deal_type']] = deals[['round', 'deal_type']].astype('category')
    # deals.drop(columns=['_id'], inplace=True)
    deals.replace(['', 'н.д.'], np.nan, inplace=True)
    deals = deals.applymap(lambda x: np.nan if isinstance(x, list) and len(x) == 0 else x)
    return deals

def load_services(db):
    services = pd.DataFrame(db.get_services())
    # services.drop(columns=['_id'], inplace=True)
    services.replace(['', 'н.д.'], np.nan, inplace=True)
    return services


def group_deals_by_investor_type(deals,present_inns):
    res = (deals[deals['deal_type'] == 'buy'].melt(id_vars=['startup_inn', 'round'], 
               value_vars=['gov_fund', 'private_fund', 'corp_fund', 'corp_investor', 'business_angel', 'accelerator'])
        .dropna()
        .groupby(['startup_inn', 'round'])['variable'].apply(pd.value_counts)
        .unstack().reset_index()
        .where(lambda x: x['startup_inn'].apply(lambda i: i in present_inns))
        .dropna(subset=['startup_inn'])
        .fillna(0).set_index(['startup_inn', 'round'])
        .apply(lambda x: x / x.sum(), axis=1))

    return res

def try_concat(arr):
    try:
        return np.concatenate(arr)
    except Exception as e:
        return []

def match_company_and_investor(deals, services, companies):
    ff = (
        deals[deals['deal_type'] == 'buy']
        .groupby(['startup_inn', 'round'])[['gov_fund', 'private_fund', 'corp_fund', 'corp_investor', 'business_angel', 'accelerator']]
        .apply(lambda x: set(try_concat([i for i in x.values.reshape((-1, )) if isinstance(i, list)]))))

    investor_and_company = pd.DataFrame()

    for row in services.to_dict(orient='records'):
        inv_name = row['name']
        fit = ff.where(ff.apply(lambda x: inv_name in x)).dropna(how='all')
        if fit.empty is False:
            investor_and_company = investor_and_company.append(pd.DataFrame({k: [v] * fit.shape[0] for k, v in row.items()}, index=fit.index))
    return investor_and_company.rename(columns=lambda x: '{}__investor'.format(x)).merge(
        companies.rename(columns=lambda x: '{}__company'.format(x)), left_on='startup_inn', right_on='inn__company')