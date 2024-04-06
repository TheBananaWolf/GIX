import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import CardMedia from '@mui/material/CardMedia';
import CircularWithValueLabel from '../items/CircleProgressWithLable';
import Avatar from '@mui/material/Avatar';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PercentIcon from '@mui/icons-material/Percent';
import { useNavigate } from 'react-router-dom';
import { fetchImage, fetchData } from '../../services/apiService';
import { ProjectInfoProps } from './ProjectBoxCard';
import AlertDialogWithBtn from '../items/AlertDialogWithBtn';

// const ProjectBoxCardMini: React.FC<ProjectInfoProps> = ({ projectItem, index }) =>{
const ProjectBoxCardMini: React.FC<ProjectInfoProps & { hasCloseBtn: boolean }> = ({ projectItem, index, hasCloseBtn }) => {
    const [imageUrl, setImage] = React.useState('');
    const [headIconUrl, setHeadIconUrl] = React.useState("/static/1.jpg");
    const [userName, setUserName] = React.useState('Jane Doe');
  
    const navigate = useNavigate();

    const handleItemClick = (index: number) => {
      navigate('/project-detail', { state: { data: { projectItem} } });
      window.scrollTo(0, 0);
    };

    React.useEffect(() => {
      const imgName = projectItem.images[0].split('/').pop();
      fetchImage(`/api/project/image/${imgName}`, afterFetchImage);
      fetchData(`/api/profile/getUserProfile`, projectItem.token, afterFetchUser);
    }, []);

    const afterFetchImage = async (url: any) => {
      setImage(url);
      return;
    };

    const afterFetchUser = async (values: any) => {
      setUserName(values.firstName + " " + values.lastName);
      setHeadIconUrl(values.profilePic);
    };
    

    const handleCloseBtnClick = async () => {
      //TODO: write admin delete project function
        const projectId = projectItem.pid;
        const adminToken = localStorage.getItem('adminToken'); // Assuming adminToken is stored in localStorage
        if (!adminToken) {
            console.error('Admin token is not available.');
            return;
        }

        try {
            const response = await fetch(`/api/admin/adminDeleteProject?pid=${projectId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${adminToken}`,
            },
            });

            if (!response.ok) {
                throw new Error('Failed to delete project');
            }
            // // On successful deletion, update the projects/participatedProjects state to remove the deleted project
            // setProjects((prevProjects) => prevProjects.filter((project) => project._id !== projectId));
            // setParticipatedProjects((prevProjects) => prevProjects.filter((project) => project._id !== projectId));

        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            {hasCloseBtn && <AlertDialogWithBtn
              confirmCallbackFunc={handleCloseBtnClick}
              titleStr="Confirmation"
              contentStr="Are you sure you want to delete this project?"
              confirmStr="Confirm"
              cancelStr="Cancel"
              btnStr="X"
              btnDir="right"
              isForProfilePage={true}
            />}
            <Card
                key={index}
                component={Button}
                onClick={() => handleItemClick(index)}
                sx={{
                    p: 3,
                    width: 345,
                    height: 'fit-content',
                    background: 'white',
                    backgroundColor: undefined,
                    borderColor: 'grey.200',
                    // ...style, // 应用传递过来的样式
                }}
            >
                <Box
                    sx={{
                        width: '100%',  
                        display: 'flex',
                        textAlign: 'left',
                        flexDirection: { xs: 'column', md: 'column' },
                        alignItems: { md: 'center' },
                        gap: 2.5,
                    }}
                >
                    <Box sx={{ color: 'grey.600' }}>
                        <CardMedia
                            component="img"
                            sx={{ width: 180, height: 120}}
                            image={imageUrl}
                        />
                    </Box>
                    <div>
                        <Typography
                            color="text.primary"
                            variant="body2"
                            fontWeight="bold"
                            sx={{ textAlign: 'center' }}
                        >
                            {projectItem.projectname}
                        </Typography>
                        <Link
                            color="primary"
                            variant="body2"
                            fontWeight="bold"
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                '& > svg': { transition: '0.2s' },
                                '&:hover > svg': { transform: 'translateX(2px)' },
                            }}
                            onClick={(event) => {
                                event.stopPropagation();
                            }}
                        >
                        </Link>
                        <Stack direction="row" spacing={3} justifyContent={'flex-end'}>
                            <Stack direction="row" spacing={1} justifyContent={'flex-end'}>
                                <Chip //Producer
                                    avatar={<Avatar alt="Natacha" src={headIconUrl} />}
                                    label={userName}
                                    variant="outlined"
                                />
                                <Chip //Donate Amount
                                    icon={<AttachMoneyIcon />} label={projectItem.rewardprice.join('/')} />
                            </Stack>
                        </Stack>
                    </div>
                </Box>
            </Card>
        </Box>
  );
}
export default ProjectBoxCardMini;
