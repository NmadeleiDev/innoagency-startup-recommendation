import Tags from 'components/Tags';
import Category from 'components/Category';
import {
  AcceleratorModel,
  BusinessIncubatorModel,
  CorporationModel,
  EngeneeringCenterModel,
  ProgressInstituteModel,
  VentureFondModel,
} from 'models/Startup';

export type Service =
  | VentureFondModel
  | AcceleratorModel
  | ProgressInstituteModel
  | EngeneeringCenterModel
  | BusinessIncubatorModel
  | CorporationModel;

export const VentureFundLayout = (item: VentureFondModel) => (
  <>
    <div className="list">
      <Category header="Тип">Венчурный фонд</Category>
      <Category header="Раунд инвестирования">
        {item.investment_round?.join(', ')}
      </Category>
      <Category header="Этап развития стартапа">
        {item.startup_stage?.join(', ')}
      </Category>
      <Category header="Количество инвестиций">
        {item.num_of_investments}
      </Category>
    </div>
    <div className="description">{item.description}</div>
    <div className="items">
      <Tags header="Сервисы" className="services" tags={item.services} />
      <Tags
        header="Рынки"
        className="market"
        tags={item.market}
        nonFocus={item.market_non_focus}
      />
      <Tags
        header="Технологии"
        className="tech"
        tags={item.technologies}
        nonFocus={item.technologies_non_focus}
      />
      <Tags
        header="Тех фокус"
        className="focus"
        tags={item.tech_focus}
        nonFocus={item.tech_focus_non_focus}
      />
    </div>
  </>
);

export const AcceleratorLayout = (item: AcceleratorModel) => (
  <>
    <div className="list">
      <Category header="Тип">Акселератор</Category>
      <Category header="Раунд инвестирования">
        {item.startup_stage?.join(', ')}
      </Category>
    </div>
    <div className="description">{item.description}</div>
    <div className="items">
      <Tags header="Сервисы" className="services" tags={item.services} />
      <Tags
        header="Рынки"
        className="market"
        tags={item.market}
        nonFocus={item.market_non_focus}
      />
      <Tags
        header="Технологии"
        className="tech"
        tags={item.technologies}
        nonFocus={item.technologies_non_focus}
      />
      <Tags
        header="Тех фокус"
        className="focus"
        tags={item.tech_focus}
        nonFocus={item.tech_focus_non_focus}
      />
    </div>
  </>
);

export const ProgressInstituteLayout = (item: ProgressInstituteModel) => (
  <>
    <div className="list">
      <Category header="Тип">Институт развития</Category>
      <Category header="Раунд инвестирования">
        {item.startup_stage?.join(', ')}
      </Category>
    </div>
    <div className="description">{item.description}</div>
    <div className="items">
      <Tags header="Сервисы" className="services" tags={item.services} />
      <Tags header="Финансовая поддержка" tags={item.monetary_support} />
    </div>
  </>
);

export const EngeneeringCenterLayout = (item: EngeneeringCenterModel) => (
  <>
    <div className="list">
      <Category header="Тип">Инжиниринговый центр</Category>
      <Category header="Форма собственности">{item.type_of_ownership}</Category>
    </div>
    <div className="description">{item.description}</div>
    <div className="items">
      <Tags header="Сервисы" className="services" tags={item.services} />
      <Tags
        header="Рынки"
        className="market"
        tags={item.market}
        nonFocus={item.market_non_focus}
      />
      <Tags
        header="Технологии"
        className="tech"
        tags={item.technologies}
        nonFocus={item.technologies_non_focus}
      />
      <Tags
        header="Тех фокус"
        className="focus"
        tags={item.tech_focus}
        nonFocus={item.tech_focus_non_focus}
      />
    </div>
  </>
);

export const BusinessIncubatorLayout = (item: BusinessIncubatorModel) => (
  <>
    <div className="list">
      <Category header="Тип">Бизнес инкубатор</Category>
      <Category header="Раунд инвестирования">
        {item.startup_stage?.join(', ')}
      </Category>
      <Category header="Форма собственности">{item.type_of_ownership}</Category>
    </div>
    <div className="description">{item.description}</div>
    <div className="items">
      <Tags header="Сервисы" className="services" tags={item.services} />
      <Tags
        header="Рынки"
        className="market"
        tags={item.market}
        nonFocus={item.market_non_focus}
      />
      <Tags
        header="Технологии"
        className="tech"
        tags={item.technologies}
        nonFocus={item.technologies_non_focus}
      />
      <Tags
        header="Тех фокус"
        className="focus"
        tags={item.tech_focus}
        nonFocus={item.tech_focus_non_focus}
      />
    </div>
  </>
);

export const CorporationLayout = (item: CorporationModel) => (
  <>
    <div className="list">
      <Category header="Тип">Корпорация</Category>
      <Category header="Стадия развития компании">{item.corp_stage}</Category>
      <Category header="Бизнес-модель">
        {item.business_model?.join(', ')}
      </Category>
    </div>
    <div className="description">{item.description}</div>
    <div className="items">
      <Tags
        header="Рынки"
        className="market"
        tags={item.market}
        nonFocus={item.market_non_focus}
      />
      <Tags
        header="Технологии"
        className="tech"
        tags={item.technologies}
        nonFocus={item.technologies_non_focus}
      />
    </div>
  </>
);
