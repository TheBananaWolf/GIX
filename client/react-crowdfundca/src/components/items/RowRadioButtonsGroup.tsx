import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import {ProjectInfoProps} from './ProjectBoxCard';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';

interface RowRadioButtonsGroupProps {
  projectItem: {
    _id: string;
    pid: string;
    projectname: string;
    projectsdescription: string;
    categoryid: string;
    images: string[];  // 修正为 string[] 类型
    userId: string;
    token: string;
    targetmoney: string;
    currentmoney: string;
    statue: boolean;
    enddate: Date;
    startdate: Date;
    rewardlevel: string[]; // 根据实际情况选择合适的类型
    rewardprice: string[]; // 修正为 string[] 类型
    rewardcontent: string[]; // 修正为 string[] 类型
  };
  index: number;
  onSelectedPriceChange: (selectedPrice: number) => void;
}

const RowRadioButtonsGroup: React.FC<RowRadioButtonsGroupProps> = ({projectItem, index, onSelectedPriceChange}) => {

  const [selectedValue, setSelectedValue] = React.useState(0);

  const handleChange = (event:any) => {
    setSelectedValue(event.target.value);
    onSelectedPriceChange(event.target.value);
  };

  return (
      <Card sx={{ display: 'flex', mb: 2}}> 
        <Box sx={{ display: 'flex', flexDirection: 'column', flex:'1'}}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography component="div" variant="h4" color="text.secondary">
              ${projectItem.rewardprice[selectedValue]} Reward
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" component="div">
              {projectItem.rewardcontent[selectedValue] }
            </Typography>
          </CardContent>
        </Box>
        
        <CardMedia
          component="img"
          sx={{ width: 80, height: 80, alignSelf: 'center', mr: 2}}
          image="/static/rewardIcon.png"
        />
        <FormControl
          sx={{alignSelf: 'flex-end'}}
        >
          <FormLabel id="demo-row-radio-buttons-group-label"></FormLabel>
          <RadioGroup value={selectedValue} onChange={handleChange}>
            <FormControlLabel value={0} control={<Radio />} label={"$"+projectItem.rewardprice[0]} />
            <FormControlLabel value={1} control={<Radio />} label={"$"+projectItem.rewardprice[1]} />
            <FormControlLabel value={2} control={<Radio />} label={"$"+projectItem.rewardprice[2]} />
          </RadioGroup>
        </FormControl>
      </Card>
  );
}

export default RowRadioButtonsGroup;