import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '../items/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import ProjectImageList from '../items/ProjectImageList';
import ProjectBoxCardMini from '../items/ProjectBoxCardMini';
import { useLocation } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { fetchData } from '../../services/apiService';

export default function ProjectDescription() {

  const [projectItems, setProjectItems] = React.useState([]);
  const [headIconUrl, setHeadIconUrl] = React.useState("/static/1.jpg");
  const [userName, setUserName] = React.useState('');
  const [userDes, setUserDes] = React.useState('');

  const location = useLocation();
  const projectInfo = location.state?.data;
  
  React.useEffect(() => {
    //TODO: use recommand project list
    fetchData(`/api/project/showProjectBy?queryKey=categoryid&value=${1}`, localStorage.getItem('userToken'), afterFetchProjectList);
    // fetchData(`/api/showTopProjects`, null, afterFetchProjectList);
    fetchData(`/api/profile/getUserProfile`, projectInfo.projectItem.token, afterFetchUser);
  }, []);

  const afterFetchProjectList = async (values: any) => {
    setProjectItems(values.projectInfo);
    return;
  };

  const afterFetchUser = async (values: any) => {
    setUserName(values.firstName + " " + values.lastName);
    setHeadIconUrl(values.profilePic);
    setUserDes(values.description);
    // TODO: Set image url
    return;
  }


  return (
    <Box
      component="section"
      sx={{ display: 'flex', overflow: 'hidden', bgcolor: 'secondary.light' }}
      data-testid="project-description"
    >
        <Grid container>
            <Grid // Project Description
                item
                xs={12}
                md={8}
                sx={{ display: { md: 'block', xs: 'none' }, position: 'relative' }}
                >
                  <Container component="section" sx={{ mt: 8, mb: 4 }}>
                    <Typography variant="h4" marked="center" align="center" component="h2">
                        Project Description
                    </Typography>
                    <Typography variant="body1" component="div">
                      <div dangerouslySetInnerHTML={{ __html: projectInfo.projectItem.projectsdescription }} />
                    </Typography>
                  </Container>
            </Grid>
            <Grid // Seller Info
                item
                xs={12}
                md={4}
                sx={{ display: { md: 'block', xs: 'none' }, position: 'relative'}}>
                  <Card sx={{ maxWidth: 345 , mt: 8}}>
                    <CardMedia
                      sx={{ height: 140 }}
                      image={headIconUrl}
                      // image="https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=400"
                      title="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                          {userName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                          {userDes}
                      </Typography>
                  </CardContent>
                      <CardActions>
                      {/* <Button size="small">Share</Button> */}
                      <Button size="small" href='profile'>Learn More</Button>
                      </CardActions>
                  </Card>
                  <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="flex-start"
                    spacing={2}
                    useFlexGap
                    sx={{ width: '100%', display: { xs: 'none', sm: 'flex' }, mt: 2}}
                  >
                    {projectItems.map((projectItem, index) => (
                      // Show box card
                      <ProjectBoxCardMini key={index} projectItem={projectItem} index={index} hasCloseBtn={false}/>
                    ))}
                  </Stack>
            </Grid>
            
        </Grid>
    </Box>
  );
}
