import {Modal, TextField} from '@shopify/polaris';
import {useState} from 'react';
import {BlockStack} from '../../../../components/Layout/BlockStack';

interface CreateFeedModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (country: string, language: string, channelId: string) => void;
}

export function CreateFeedModal({
  open,
  onClose,
  onSubmit,
}: CreateFeedModalProps) {
  const [country, setCountry] = useState('');
  const [language, setLanguage] = useState('');
  const [channelId, setChannelId] = useState('');

  const handleSubmit = () => {
    onSubmit(country, language, channelId);
    setCountry('');
    setLanguage('');
    setChannelId('');
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create new product feed"
      primaryAction={{
        content: 'Create feed',
        onAction: handleSubmit,
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: onClose,
        },
      ]}
    >
      <Modal.Section>
        <BlockStack>
          <TextField
            label="Country Code"
            value={country}
            onChange={setCountry}
            autoComplete="off"
            helpText="Two-letter country code (e.g., CA, US)"
          />
          <TextField
            label="Language Code"
            value={language}
            onChange={setLanguage}
            autoComplete="off"
            helpText="Language code (e.g., EN, FR)"
          />
          <TextField
            label="Channel ID"
            value={channelId}
            onChange={setChannelId}
            autoComplete="off"
            helpText="Channel to create the feed for"
          />
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}
