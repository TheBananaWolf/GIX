import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '../items/Typography';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import ProjectBoxCardRecommend from '../items/ProjectBoxCardRecommend';
import ProjectBoxCardMini from '../items/ProjectBoxCardMini';
import { fetchData } from '../../services/apiService';
import {Button} from '@mui/material';




export default function ProductCategories() {

  const [projectItems, setProjectItems] = React.useState([]);
  const [displayCount, setDisplayCount] = React.useState(2); // 初始显示一个项目
  
  React.useEffect(() => {
    fetchData(`/api/project/showProjectBy?queryKey=categoryid&value=1`, localStorage.getItem('userToken'), afterFetchProjectList);
  }, []);

  const afterFetchProjectList = async (values: any) => {
    setProjectItems(values.projectInfo);
    return;
  };

  const loadMore = () => {
    setDisplayCount(prevCount => prevCount + 2); // 每次点击增加显示一个项目
  };


  return (
    <Container component="section" sx={{ mt: 8, mb: 4 }} data-testid="product-categories">
      <Typography variant="h4" marked="center" align="center" component="h2" gutterBottom sx={{mt:20}}>
        Featured Projects
      </Typography>
      <Grid container spacing={6}>
        <Grid item xs={12} md={12}>
          <Grid container direction="column" justifyContent="center" alignItems="flex-start" spacing={2} sx={{ display: { xs: 'none', sm: 'flex' }}}>
            {projectItems.slice(0, displayCount).map((projectItem, index) => (
              <Grid item key={index} sx={{
                width: '100%', // 或者可以用固定的宽度，例如 width: 300
                minHeight: '100px', // 可以根据需要调整最小高度
              }}>
                <ProjectBoxCardRecommend projectItem={projectItem} index={index}/>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      {displayCount < projectItems.length && ( // 只有当还有更多项目时才显示加载更多按钮
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button onClick={loadMore} sx={{
            border: '3px solid currentColor',
            borderRadius: 0,
            height: 'auto',
            py: 1,
            px: 3,
          }}>
            <Typography variant="body1" component="span" sx={{ fontSize: '1.25rem' }}>
              LOAD MORE
            </Typography>
          </Button>
        </Box>

        
      )}
    </Container>
  );
}

          {/* 
          <Grid container direction="row" justifyContent="center" alignItems="flex-start" spacing={2} sx={{ display: { xs: 'none', sm: 'flex' }, mt: 2, ml: 2}}>
            {projectItems.map((projectItem, index) => (
              <Grid item key={index}>
                <ProjectBoxCardMini projectItem={projectItem} index={index}/>
              </Grid>
            ))}
          </Grid> */}