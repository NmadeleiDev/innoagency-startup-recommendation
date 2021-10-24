import ListItem from 'components/ListItem';
import styled from 'styled-components';
import { api, IApiResponse } from 'axiosConfig';
import NextLink from 'components/Link';
import Button from 'components/Button';
import { useEffect, useState } from 'react';
import { AcceleratorModel, VentureFondModel } from 'models/Startup';
import { useAppDispatch } from 'store/store';
import { setDispayedService } from 'store/features/services';

const StyledDiv = styled.div`
  padding: 1rem 0;

  .list {
    grid-area: list;
  }

  .button {
    grid-area: button;
  }

  display: grid;
  grid-row-gap: 1rem;
  grid-template-areas:
    'list'
    'button';

  .button {
    display: flex;
    justify-content: center;
  }
`;

interface Props {
  items: string[];
}

const fetchData = async (items: string[]) => {
  console.log(items);

  const promises = items.map(async (item) => {
    try {
      const { data } = await api.get<
        IApiResponse<VentureFondModel | AcceleratorModel>
      >(`/service/${item}`);
      return data.data;
    } catch (e) {
      console.log(e);
      return null;
    }
  });
  const entities = await Promise.all(promises);
  console.log(entities);
  return entities;
};

const List = ({ items }: Props) => {
  const dispatch = useAppDispatch();
  const [offset, setOffset] = useState(0);
  const NUMBER_OF_ITEMS_TO_SHOW = 3;
  const [displayedItems, setDisplayedItems] = useState<
    (VentureFondModel | AcceleratorModel | null)[]
  >([]);

  useEffect(() => {
    if (items.length === 0) return;
    console.log(offset);
    (async () => {
      const itemsToShow = items.slice(offset, offset + NUMBER_OF_ITEMS_TO_SHOW);
      const entities = await fetchData(itemsToShow);
      setDisplayedItems((displayedItems) => [...displayedItems, ...entities]);
    })();
  }, [items, offset]);

  const handleShowMore = () => {
    setOffset((offset) => offset + NUMBER_OF_ITEMS_TO_SHOW);
  };

  const selectCurrentItem = (item: VentureFondModel | AcceleratorModel) => {
    dispatch(setDispayedService(item));
  };

  if (items.length === 0) return null;

  return (
    <StyledDiv>
      <div className="list">
        {displayedItems &&
          displayedItems.map((item) => {
            return (
              item && (
                <ListItem
                  key={item.inn}
                  onClick={() => selectCurrentItem(item)}
                  item={item}
                />
              )
            );
          })}
      </div>
      <div className="button">
        <Button onClick={handleShowMore}>Показать еще</Button>
      </div>
    </StyledDiv>
  );
};

export default List;
