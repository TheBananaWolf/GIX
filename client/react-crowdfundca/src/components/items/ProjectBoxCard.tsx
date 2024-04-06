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
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import { useNavigate } from 'react-router-dom';
import { fetchImage, fetchData} from '../../services/apiService';

export type ProjectInfoProps = {
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
};

function removeTags(inputString:String) {
  // Regular expression to match <...> or </...> patterns
  const tagRegex = /<[^>]*>|<\/[^>]*>/g;
  // Replace matched patterns with an empty string
  return inputString.replace(tagRegex, '');
}

const ProjectBoxCard: React.FC<ProjectInfoProps> = ({ projectItem, index }) =>{

    const [imageUrl, setImage] = React.useState('');
    const [headIconUrl, setHeadIconUrl] = React.useState("/static/1.jpg");
    const [userName, setUserName] = React.useState('');
    
    const projectDescription: String = projectItem?.projectsdescription || "";
    const processedDescription: String = removeTags(projectDescription);
    const truncatedDescription: String = processedDescription.length <= 300 ? processedDescription : (processedDescription.substr(0, 300) + "...");
    
    const isExpired = new Date(projectItem.enddate) < new Date();
    const moneyPercent = (parseFloat(projectItem.currentmoney.toString())/parseFloat(projectItem.targetmoney.toString()))*100;

    const navigate = useNavigate();

    const handleItemClick = (index: number) => {
      navigate('/project-detail', { state: { data: { projectItem} } });
      window.scrollTo(0, 0);
    };

    React.useEffect(() => {
      const imgName = projectItem.images[0].split('/').pop();
      fetchImage(`/api/project/image/${imgName}`, afterFetchImage);
      const userToken = localStorage.getItem('userToken');
      fetchData(`/api/profile/getUserProfile`, projectItem.token, afterFetchUser);
    }, []);

    const afterFetchImage = async (url: any) => {
      setImage(url);
      return;
    };

    const afterFetchUser = async (values: any) => {
      setUserName(values.firstName + " " + values.lastName);
      setHeadIconUrl(values.profilePic);
    }

    return (
    <Box sx={{ width: '100%' }}>
        <Card
            key={index}
            component={Button}
            onClick={() => handleItemClick(index)}
            // href='/project-detail'
            sx={{
                p: 3,
                height: 'fit-content',
                width: '100%',
                background: 'none',
                backgroundColor: undefined,
                borderColor: 'grey.200',
            }}
            >
                <Box
                    sx={{
                    width: '100%',
                    display: 'flex',
                    textAlign: 'left',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { md: 'center' },
                    gap: 2.5,
                    }}
                >
                    <Box sx={{color: 'grey.600'}}>
                        <CardMedia
                            component="img"
                            sx={{ width: 150, height: 120 }}
                            image={imageUrl}
                        />
                    </Box>
                    <div>
                    <Typography
                        color="text.primary"
                        variant="body2"
                        fontWeight="bold"
                    >
                        {projectItem.projectname}
                    </Typography>
                    <Typography
                        color="text.secondary"
                        variant="body2"
                        sx={{ my: 0.5, mr: 1, textTransform: 'none'}}
                    >
                      {/* limit description length */}
                      {truncatedDescription}
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
                    </div>
                </Box>

                <Stack direction="row" spacing={3} justifyContent={'flex-end'}>
                  <Stack direction="column" spacing={1} justifyContent={'flex-end'}>
                    <Chip //Producer
                        avatar={<Avatar alt="Natacha" src={headIconUrl} />}
                        label={userName}
                        variant="outlined"
                        />
                        {isExpired && <Chip icon={<AssignmentLateIcon />} label= {projectItem.enddate.toString().substring(0,10)} disabled={true}/>}
                        {!isExpired && <Chip icon={<DateRangeIcon />} label= {projectItem.enddate.toString().substring(0,10)} />}
                        <Chip //Donate Amount
                            icon={<AttachMoneyIcon />} label= {projectItem.rewardprice.join('/')} />
                    </Stack>
                </Stack>
                <Box sx={{ml:2}}>
                  <CircularWithValueLabel value={moneyPercent} />
                </Box>
            </Card>
    </Box>
  );
}
export default ProjectBoxCard;