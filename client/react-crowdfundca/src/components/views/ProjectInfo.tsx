import * as React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '../items/Typography';
import Button from '@mui/material/Button';
import ImageSlider from '../items/ImageSlider';
import LinearWithValueLabel from '../items/ProgressBar';
import RowRadioButtonsGroup from '../items/RowRadioButtonsGroup';
import { useLocation } from 'react-router-dom';
import AlertDialogWithBtn from '../items/AlertDialogWithBtn';
import { submitDataInJsonWithToken, fetchImage, fetchData } from '../../services/apiService';
import { useNavigate } from 'react-router-dom';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";


export default function ProjectInfo() {
  const [imageUrlList, setImages] = React.useState([] as Blob[]);
  const [editBtnVisible, setEditBtnVisible] = React.useState(true);
  const [donateBefore, setDonateBefore] = React.useState(false);
  const [donateRewardIndex, setDonateRewardIndex] = React.useState(0);

  const location = useLocation();
  let projectInfo = location.state?.data;
  let projectItem = projectInfo.projectItem;
  const navigate = useNavigate();

  const [selectedPrice, setSelectedPrice] = React.useState(parseInt(projectItem.rewardprice[0]));
  const isExpired = new Date(projectItem.enddate) < new Date();
  const [showTmp, setShowTmp] = React.useState(false);
  const [tmpMsg, setTmpMsg] = React.useState("");
  const [showTmpRing, setShowTmpRing] = React.useState(true);

  // image list related
  let imageList: Blob[] = [];

  React.useEffect(() => {
    const userToken = "Bearer "+localStorage.getItem('userToken');
    setEditBtnVisible(projectItem.userId === localStorage.getItem('userId'));
    if(userToken !== "Bearer null"){
      startFetchProfile();
    }
    startFetchImages();
  }, [projectInfo]);

  const startFetchImages = () => {
    for(let i = 0; i < projectItem.images.length; i++){
      const imgName = projectItem.images[i].split('/').pop();
      fetchImage(`/api/project/image/${imgName}`, afterFetchOneImage);
    }
  }

  const afterFetchOneImage = async (url: any) => {
    imageList.push(url);
    if(imageList.length === projectItem.images.length){
      setImages(imageList);
    }
    return;
  }


  const startFetchProfile = () => {
    fetchData(`/api/profile/getUserProfile`, localStorage.getItem('userToken'), afterFetchUser);
  }

  const afterFetchUser = async (values: any) => {
    const str1 = projectItem.pid + ":0";
    const str2 = projectItem.pid + ":1";
    const str3 = projectItem.pid + ":2";
    if(values.investedProjectList.includes(str1)){
      setDonateBefore(true);
      setDonateRewardIndex(0);
    }
    if(values.investedProjectList.includes(str2)){
      setDonateBefore(true);
      setDonateRewardIndex(1);
    }
    if(values.investedProjectList.includes(str3)){
      setDonateBefore(true);
      setDonateRewardIndex(2);
    }
  }

  const confirmDonate = () => {
    const data = {
      "pid": projectItem.pid,
      "selectedPrice": selectedPrice.toString(),
      "token": projectItem.token,
    };
    setShowTmp(true);
    setTmpMsg("Donating...");
    setShowTmpRing(true);
    submitDataInJsonWithToken('/api/project/updateProjectPrice', data, afterDonate);
  };

  const afterDonate = async (values: any) => {
    setTmpMsg("Donate Success");
    setShowTmpRing(false);
    setTimeout(() => {
      setShowTmp(false);
      setShowTmpRing(true);
      projectItem.currentmoney= (parseInt(projectItem.currentmoney) + selectedPrice).toString();
      if (parseInt(projectItem.currentmoney) >= parseInt(projectItem.targetmoney)) {
        projectItem.currentmoney = projectItem.targetmoney;
      }
      navigate('/project-detail', { state: { data: { projectItem} } });
      window.location.reload();
    }, 2000);
  };


  const handleClickEdit = () => {
    navigate('/project-edit', { state: { data: { projectItem} } });
    window.scrollTo(0, 0);
  };

  const handleSelectedPriceChange = (newSelectedPrice: number) => {
    setSelectedPrice(parseInt(projectItem.rewardprice[newSelectedPrice]));
  };  

  return (
    <Container component="section" sx={{ mt: 8, mb: 8, display: 'flex'  }} data-testid="project-info">
        <Grid container>
            <Grid 
              item
              xs={12}
              md={6}
              sx={{ display: { md: 'block', xs: 'none' }, position: 'relative' }}
            >
              <ImageSlider items={imageUrlList}/>
            </Grid>
            <Grid // Empty space
              item
              xs={12}
              md={1}>
            </Grid>
            <Grid // Project infos
              item
              xs={12}
              md={5}
              sx={{ display: { md: 'block', xs: 'none' }, position: 'relative' }}
              >
                <Typography display={'inline'} variant="h3" marked="left" align="left" component="h2">
                  {projectItem.projectname}
                </Typography>
                {editBtnVisible &&<Button
                  color="primary"
                  size="large"
                  variant="contained"
                  component="a" 
                  onClick={() => handleClickEdit()}
                  sx={{float: 'right'}}
                >
                  Edit
                </Button>}
                <Typography variant="h5" marked="left" align="left" component="h2" color='green'>
                    Funds Raised: ${projectItem.currentmoney}/ ${projectItem.targetmoney}
                </Typography>
                {/* Progress Bar */}
                <LinearWithValueLabel value={(parseFloat(projectItem.currentmoney.toString())/parseFloat(projectItem.targetmoney.toString()))*100}/>
                {isExpired&&<Typography variant="h5" marked="left" align="left" component="h2" color="red" sx={{ mt: 2, mb: 1}}>
                  {projectItem.startdate.toString().substring(0,10)} - {projectItem.enddate.toString().substring(0,10)} (Expired)
                </Typography>}
                {!isExpired&&<Typography variant="h5" marked="left" align="left" component="h2" sx={{ mt: 2, mb: 1}}>
                  {projectItem.startdate.toString().substring(0,10)} - {projectItem.enddate.toString().substring(0,10)}
                </Typography>}
                <RowRadioButtonsGroup projectItem={projectItem} index={projectInfo.index} onSelectedPriceChange={handleSelectedPriceChange} />
                {!editBtnVisible&&!donateBefore&&!isExpired&&<AlertDialogWithBtn
                  confirmCallbackFunc={confirmDonate}
                  titleStr="Confirmation"
                  contentStr="Are you sure you want to proceed and donate this one?"
                  confirmStr="Confirm"
                  cancelStr="Cancel"
                  btnStr="Donate"
                  btnDir="right"
                  isForProfilePage={false}
                />}
                {
                  donateBefore && 
                  <Card sx={{ display: 'flex', mb: 2}}> 
                    <Box sx={{ display: 'flex', flexDirection: 'column', flex:'1'}}>
                      <CardContent sx={{ flex: '1 0 auto' }}>
                        <Typography component="div" variant="subtitle1" color="text.secondary">
                          Donated [${projectItem.rewardprice[donateRewardIndex]}] with [{projectItem.rewardcontent[donateRewardIndex]}] as Reward
                        </Typography>
                      </CardContent>
                    </Box>
                  </Card>
                }
            </Grid>
        </Grid>
        <div>
          {/* donate success message */}
          {showTmp && (
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={showTmp}
            >
              <Typography variant="h5" marked="left" align="left" component="h2">
                {tmpMsg}
              </Typography>
              {showTmpRing && <CircularProgress color="inherit" />} 
            </Backdrop>
          )}
        </div>
    </Container>
  );
}
