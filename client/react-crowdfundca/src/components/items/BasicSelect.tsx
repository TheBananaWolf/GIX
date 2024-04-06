import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export default function BasicSelect() {
  const [tag, setTag] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setTag(event.target.value as string);
  };

  return (
    <Box sx={{ maxWidth: 120 , mt:2, mb:2}}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Tag</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={tag}
          label="Tag"
          onChange={handleChange}
        >
          <MenuItem value={10}>Tag1</MenuItem>
          <MenuItem value={20}>Tag2</MenuItem>
          <MenuItem value={30}>Tag3</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}