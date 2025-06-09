import {Button, Collapsible, Text} from '@shopify/polaris';
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

  const parsePayload = () => {
    try {
      return JSON.parse(props.payload);
    } catch {
      return props.payload;
    }
  };

  const formatPayload = (payload: any) => {
    try {
      return JSON.stringify(payload, null, 2);
    } catch {
      return String(payload);
    }
  };

  const truncatePayload = (payload: string, length: number = 50) => {
    return payload.length > length
      ? payload.substring(0, length) + '...'
      : payload;
  };

  const parsedPayload = parsePayload();
  const formattedPayload = formatPayload(parsedPayload);

  return (
    <Cell>
      <div style={{ maxWidth: '300px' }}>
        {isOpen ? (
          <div>
            <div style={{ 
              maxHeight: '400px', 
              overflow: 'auto', 
              backgroundColor: '#f6f6f7', 
              padding: '12px', 
              borderRadius: '4px',
              fontSize: '12px',
              fontFamily: 'monospace'
            }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {formattedPayload}
              </pre>
            </div>
            <Button variant="plain" onClick={handleToggle} size="micro">
              Show less
            </Button>
          </div>
        ) : (
          <div>
            <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
              {truncatePayload(formattedPayload.replace(/\s+/g, ' '))}
            </span>
            <br />
            <Button variant="plain" onClick={handleToggle} size="micro">
              Show full payload
            </Button>
          </div>
        )}
      </div>
    </Cell>
  );
}
