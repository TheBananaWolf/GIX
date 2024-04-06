import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

export default function ReturnProductCard() {
  const theme = useTheme();

  return (
    <Card sx={{ display: 'flex', mb: 2}}> 
      <Box sx={{ display: 'flex', flexDirection: 'column'}}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h4" color="text.secondary">
            $10 Reward
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            A macbook air 15 inch with 16GB RAM 512GB SSD
          </Typography>
        </CardContent>
      </Box>
      <CardMedia
        component="img"
        sx={{ width: 151, float: 'right' }}
        image="/static/mba15.jpg"
      />
    </Card>
  );
}