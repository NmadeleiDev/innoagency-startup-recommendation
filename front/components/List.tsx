import { useEffect, useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { IRecomendation } from 'axiosConfig';
import ListItem from 'components/ListItem';
import ListHeader from 'components/ListHeader';
import Button from 'components/Button';

const StyledDiv = styled.div`
  padding: 1rem 0;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  .header {
    text-align: center;
    font-size: 1.2rem;
  }
  .button {
    display: flex;
    justify-content: center;
  }

  .image {
    width: 64px;
  }
`;

interface Props {
  items: IRecomendation[];
  metrics: string[];
}

const metricsDictionary = {
  type_of_ownership: {
    title: 'Форма собственности',
    icon: 'ownership-2-904171.png',
  },
  investition_from_dol: {
    title: 'Объем инвестиций',
    icon: 'investment-425-1130766.png',
  },
  investition_to_dol: {
    title: 'Объем инвестиций',
    icon: 'investment-425-1130766.png',
  },
  fund_total_rub: {
    title: 'Объем фондов',
    icon: 'return-on-investment-4043536-3359389.png',
  },
  fund_total_dol: {
    title: 'Объем фондов',
    icon: 'return-on-investment-4043536-3359389.png',
  },
  num_of_investments: {
    title: 'Количество инвестиций',
    icon: 'investment-436-1183102.png',
  },
  num_of_exits: {
    title: 'Количество выходов',
    icon: 'sign-2879075-2393903.png',
  },
  startup_stage: {
    title: 'Стадия стартапа при инвестировании',
    icon: 'startup_stage',
  },
  market: {
    title: 'Рынок',
    icon: 'market-52-346209.png',
  },
  services: {
    title: 'Сервисы',
    icon: 'service-2010794-1693925.png',
  },
  technologies: {
    title: 'Технологии',
    icon: 'technology-136-972886.png',
  },
  investment_round: {
    title: 'Раунд инвестирования',
    icon: 'stage-2-429690.png',
  },
  tech_focus: {
    title: 'Технологический фокус',
    icon: 'target-1662580-1411546.png',
  },
};
type MetricsKey = keyof typeof metricsDictionary;

const prepareMetrics = (
  metrics: MetricsKey[],
  items: number[]
): JSX.Element[] => {
  return items?.map((item) => (
    <div key="el" className="imageWrapper">
      <Image
        className="image"
        width={50}
        height={50}
        src={'/icons/' + metricsDictionary[metrics[item]]?.icon || ''}
        alt={metricsDictionary[metrics[item]].title}
      />
      <span className="tooltip">{metricsDictionary[metrics[item]].title}</span>
    </div>
  ));
};

const List = ({ items, metrics }: Props) => {
  const [offset, setOffset] = useState(0);
  const NUMBER_OF_ITEMS_TO_SHOW = 3;
  const [displayedItems, setDisplayedItems] = useState<IRecomendation[]>([]);

  useEffect(() => {
    if (items.length === 0) return;
    console.log(offset);
    (async () => {
      const itemsToShow = items.slice(offset, offset + NUMBER_OF_ITEMS_TO_SHOW);
      setDisplayedItems((displayedItems) => [
        ...displayedItems,
        ...itemsToShow,
      ]);
    })();
  }, [items, offset]);

  const handleShowMore = () => {
    setOffset((offset) => offset + NUMBER_OF_ITEMS_TO_SHOW);
  };

  if (items.length === 0) return null;

  return (
    <StyledDiv>
      <div className="list">
        <ListHeader
          item={{
            name: 'Название компании',
            score: 'Совпадение',
            type: 'Тип сервиса',
            metrics: 'Наибольшее совпадение по параметрам',
          }}
        />
        {displayedItems &&
          displayedItems.map((item) => {
            const modifiedItem = { ...item };
            modifiedItem.metrics = prepareMetrics(
              metrics as MetricsKey[],
              item.metrics as number[]
            );
            return item && <ListItem key={item.id} item={modifiedItem} />;
          })}
      </div>
      <div className="button">
        <Button variant="secondary" onClick={handleShowMore}>
          Показать еще
        </Button>
      </div>
    </StyledDiv>
  );
};

export default List;
