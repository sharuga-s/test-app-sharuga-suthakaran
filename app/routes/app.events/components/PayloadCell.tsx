import {Button, Collapsible} from '@shopify/polaris';
import {useCallback, useState} from 'react';
import {Cell} from '../../../components/IndexTable/Cell';

interface Props {
  payload: string;
}

export function PayloadCell(props: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = useCallback(() => {
    setIsOpen((prevState) => !prevState);
  }, []);

  const truncatePayload = (payload: string, length: number = 30) => {
    return JSON.stringify(payload).length > length
      ? JSON.stringify(payload).substring(0, length)
      : JSON.stringify(payload);
  };

  return (
    <Cell>
      {isOpen ? (
        <Collapsible open={true} id={''}>
          <pre>
            {JSON.stringify(props.payload, null, 2)}
            <Button variant="plain" onClick={handleToggle}>
              {isOpen ? '<<' : '...'}
            </Button>
          </pre>
        </Collapsible>
      ) : (
        <pre>
          {truncatePayload(props.payload)}
          <Button variant="plain" onClick={handleToggle}>
            {isOpen ? '<<' : '...'}
          </Button>
        </pre>
      )}
    </Cell>
  );
}
