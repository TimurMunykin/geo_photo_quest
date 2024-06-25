import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import QuestForm from './QuestForm';
import QuestSelector from './QuestSelector';
import PhotoUploader from './PhotoUploader';
import PhotoList from './PhotoList';

const QuestManagement: React.FC = () => {
  const [selectedQuestId, setSelectedQuestId] = useState<string>('');

  return (
    <Box>
      <Typography variant="h4">Quest Management</Typography>
      <QuestForm />
      <QuestSelector selectedQuestId={selectedQuestId} setSelectedQuestId={setSelectedQuestId} />
      <PhotoUploader selectedQuestId={selectedQuestId} />
      <PhotoList selectedQuestId={selectedQuestId} />
    </Box>
  );
};

export default QuestManagement;
