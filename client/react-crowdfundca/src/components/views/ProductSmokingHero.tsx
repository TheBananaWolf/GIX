import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '../items/Typography';

function ProductSmokingHero() {
  return (
      <Button
        sx={{
          border: '4px solid currentColor',
          borderRadius: 0,
          height: 'auto',
          py: 2,
          px: 5,
        }}
      >
        <Typography variant="caption" component="span">
          LOAD MORE
        </Typography>
      </Button>
  );
}

export default ProductSmokingHero;
