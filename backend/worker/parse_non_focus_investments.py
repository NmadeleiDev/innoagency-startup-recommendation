from prediction.utils import *

def get_fund_strategy_faults(df):
    res = {
        'market': set(try_concat(df['market__company'].values)) - set(try_concat(df['market__investor'].values)),
        'technologies': set(try_concat(df['technology__company'].values)) - set(try_concat(df['technologies__investor'].values)),
        'tech_focus': set(try_concat(df['tech_focus__company'].values)) - set(try_concat(df['tech_focus__investor'].values)),
        'startup_stage': set(df['stage_of_development__company'].values) - set(try_concat(df['startup_stage__investor'].values)),
    }
    return pd.Series(res)
    
def parse_and_save():
    db = DbManager()
    db.init_connection()

    companies = load_companies(db)
    deals = load_deals(db)
    services = load_services(db)

    res = match_company_and_investor(deals, services, companies)
    res = res.groupby('name__investor').apply(get_fund_strategy_faults).rename(columns=lambda x: '{}_non_focus'.format(x))
    
    for name in res.index:
        db.edit_service_by_name(name, {k: list(v) for k, v in res.loc[name].to_dict().items()})

    db.close_conn()