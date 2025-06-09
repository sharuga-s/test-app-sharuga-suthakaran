import {useLocation, useNavigate} from '@remix-run/react';
import {
  ChoiceList,
  IndexFilters,
  IndexFiltersProps,
  TextField,
  useSetIndexFiltersMode,
} from '@shopify/polaris';
import {useCallback, useState} from 'react';

export function IndexFilter() {
  const location = useLocation();
  const navigate = useNavigate();

  const [eventType, setEventType] = useState<string[] | undefined>(undefined);
  const [feedId, setFeedId] = useState<string | undefined>(undefined);
  const [queryValue, setQueryValue] = useState('');

  const handleEventTypeChange = useCallback(
    (value: string[]) => {
      setEventType(value);
      const newSearchParams = new URLSearchParams(location.search);
      newSearchParams.set('eventType', value.join(','));
      navigate(`?${newSearchParams.toString()}`, {replace: true});
    },
    [location.search, navigate],
  );

  const handleFeedIdChange = useCallback(
    (value: string) => {
      setFeedId(value);
      const newSearchParams = new URLSearchParams(location.search);
      newSearchParams.set('feedId', value);
      navigate(`?${newSearchParams.toString()}`, {replace: true});
    },
    [location.search, navigate],
  );

  const handleFilterQueryChange = useCallback(
    (value: string) => setQueryValue(value),
    [],
  );

  const handleEventTypeRemove = useCallback(() => {
    setEventType(undefined);
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.delete('eventType');
    navigate(`?${newSearchParams.toString()}`, {replace: true});
  }, [location.search, navigate]);

  const handleFeedIdRemove = useCallback(() => {
    setFeedId(undefined);
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.delete('feedId');
    navigate(`?${newSearchParams.toString()}`, {replace: true});
  }, [location.search, navigate]);

  const handleFilterQueryValueRemove = useCallback(() => setQueryValue(''), []);

  const filters = [
    {
      key: 'eventType',
      label: 'Event Type',
      filter: (
        <ChoiceList
          title="Event Type"
          choices={[
            {label: 'Incremental', value: 'PRODUCT_FEEDS_INCREMENTAL_SYNC'},
            {label: 'Full Sync', value: 'PRODUCT_FEEDS_FULL_SYNC'},
            {
              label: 'Full Sync Finish',
              value: 'PRODUCT_FEEDS_FULL_SYNC_FINISH',
            },
          ]}
          selected={eventType || []}
          onChange={handleEventTypeChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: 'feedId',
      label: 'Feed Id',
      filter: (
        <TextField
          label="Feed Id"
          value={feedId}
          onChange={handleFeedIdChange}
          autoComplete="off"
          labelHidden
        />
      ),
      shortcut: true,
    },
  ];

  const handleFiltersClearAll = useCallback(() => {
    handleEventTypeRemove();
    handleFeedIdRemove();
    handleFilterQueryValueRemove();
  }, [handleEventTypeRemove, handleFeedIdRemove, handleFilterQueryValueRemove]);

  const appliedFilters = [];
  if (!isEmpty(eventType)) {
    const key = 'eventType';
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, eventType),
      onRemove: handleEventTypeRemove,
    });
  }

  if (!isEmpty(feedId)) {
    const key = 'feedId';
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, feedId),
      onRemove: handleFeedIdRemove,
    });
  }

  const sortOptions: IndexFiltersProps['sortOptions'] = [
    {label: 'Timestamp', value: 'timestamp asc', directionLabel: 'A-Z'},
    {label: 'Timestamp', value: 'timestamp desc', directionLabel: 'Z-A'},
  ];

  const [sortSelected, setSortSelected] = useState(['order desc']);

  const handleSortChange = useCallback(
    (sortOption: string[]) => {
      setSortSelected(sortOption);
      const newSearchParams = new URLSearchParams(location.search);
      newSearchParams.set('sort', sortOption.join(','));
      navigate(`?${newSearchParams.toString()}`, {replace: true});
    },
    [location.search, navigate],
  );

  const {mode, setMode} = useSetIndexFiltersMode();

  return (
    <IndexFilters
      sortOptions={sortOptions}
      sortSelected={sortSelected}
      queryValue={queryValue}
      onQueryChange={handleFilterQueryChange}
      onQueryClear={() => setQueryValue('')}
      onSort={handleSortChange}
      filters={filters}
      appliedFilters={appliedFilters}
      onClearAll={handleFiltersClearAll}
      mode={mode}
      setMode={setMode}
      tabs={[]}
      selected={0}
      hideQueryField
    />
  );
}

function disambiguateLabel(key: string, value: any) {
  switch (key) {
    case 'eventType':
      return `Event Type: ${value.join(', ')}`;
    case 'feedId':
      return `Feed ID: ${value}`;
    default:
      return value;
  }
}

function isEmpty(
  value: string | string[] | [number, number] | undefined,
): boolean {
  if (Array.isArray(value)) {
    return value.length === 0;
  } else {
    return value === '' || value == null;
  }
}
