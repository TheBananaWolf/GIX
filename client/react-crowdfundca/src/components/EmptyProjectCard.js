// EmptyProjectCard.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const EmptyProjectCard = () => {
  return (
    <Box sx={{ width: 345, height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px dashed grey', borderRadius: '4px', margin: '8px' }}>
      <Typography variant="subtitle1" color="textSecondary">
        No projects found
      </Typography>
    </Box>
  );
};

export default EmptyProjectCard;
