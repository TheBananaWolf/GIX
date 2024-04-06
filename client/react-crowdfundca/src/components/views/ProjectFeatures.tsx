import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ProjectBoxCard from '../items/ProjectBoxCard';
import { useLocation } from 'react-router-dom';
import { fetchData } from '../../services/apiService';

export default function ProjectFeatures() {
  const [projectItems, setProjectItems] = React.useState([]);
  const [categoryTitle, setCategoryTitle] = React.useState("");
  const [categoryDes, setCategoryDes] = React.useState("");

  
  const location = useLocation();
  const categoryObj = location.state?.categoryId;

  React.useEffect(() => {
    fetchData(`/api/project/getCategoryInfoById?queryKey=categoryid&value=${categoryObj.categoryId}`, localStorage.getItem('userToken'), afterFetchCategoryInfo);
    fetchData(`/api/project/showProjectBy?queryKey=categoryid&value=${categoryObj.categoryId}`, localStorage.getItem('userToken'), afterFetchProjectList);
  }, []);

  const afterFetchCategoryInfo = async (values: any) => {
    setCategoryTitle(values.projectInfo.categoryname);
    setCategoryDes(values.projectInfo.categorydescription);
    return;
  };

  const afterFetchProjectList = async (values: any) => {
    setProjectItems(values.projectInfo);
    return;
  };

  return (
    <Container id="features" sx={{ py: { xs: 4, sm: 8 } }} data-testid="project-features">
      <Grid container spacing={6}>
        <Grid item xs={12} md={12}>
          <div>
            <Typography component="h2" variant="h4" color="text.primary" data-testid="category-title">
              {categoryTitle}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: { xs: 2, sm: 4 } }}
              data-testid="category-description"
            >
              {categoryDes}
            </Typography>
          </div>
          <Grid container item gap={1} sx={{ display: { xs: 'auto', sm: 'none' } }} >
            {projectItems.map(({ projectname }, index) => (
              <Chip
                key={index}
                label={projectname}
                sx={{
                  borderColor:'primary.light',
                  background: 'none',
                  backgroundColor: '#fff',
                }}
              />
            ))}
          </Grid>
          <Box
            component={Card}
            variant="outlined"
            sx={{
              display: { xs: 'auto', sm: 'none' },
              mt: 4,
            }}
          >
            <Box
              sx={{
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: 280,
              }}
            />
          </Box>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="flex-start"
            spacing={2}
            useFlexGap
            sx={{ width: '100%', display: { xs: 'none', sm: 'flex' } }}
          >
            {projectItems.map((projectItem, index) => (
              // Show box card
              <ProjectBoxCard key={index} projectItem={projectItem} index={index}/>
            ))}
          </Stack>
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          sx={{ display: { xs: 'none', sm: 'flex' }, width: '100%' }}
        >
          <Card
            variant="outlined"
            sx={{
              height: '100%',
              width: '100%',
              display: { xs: 'none', sm: 'flex' },
              pointerEvents: 'none',
            }}
          >
            {/* <Box
              sx={{
                m: 'auto',
                width: 420,
                height: 500,
                backgroundSize: 'contain',
                backgroundImage: (theme) =>
                  theme.palette.mode === 'light'
                    ? items[selectedItemIndex].imageLight
                    : items[selectedItemIndex].imageDark,
              }}
            /> */}
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}