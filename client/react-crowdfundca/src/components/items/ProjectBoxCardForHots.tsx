import * as React from "react";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import CardMedia from "@mui/material/CardMedia";
import CircularWithValueLabel from "./CircleProgressWithLable";
import Avatar from "@mui/material/Avatar";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PercentIcon from "@mui/icons-material/Percent";
import { useNavigate } from "react-router-dom";
import { fetchImage, fetchData} from '../../services/apiService';

export type ProjectBoxCardProps = {
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


const ProjectBoxCardForHots: React.FC<ProjectBoxCardProps> = ({
  projectItem,
  index,
}) => {
  const [imageUrl, setImage] = React.useState("");
  const navigate = useNavigate();
  const [headIconUrl, setHeadIconUrl] = React.useState("/static/1.jpg");
  const [userName, setUserName] = React.useState('');

  const projectDescription: String = projectItem?.projectsdescription || "";
  const processedDescription: String = removeTags(projectDescription);
  const truncatedDescription: String = processedDescription.length <= 100 ? processedDescription : (processedDescription.substr(0, 100) + "...");
  
  const handleItemClick = (index: number) => {
    navigate("/project-detail", { state: { data: { projectItem } } });
    window.scrollTo(0, 0);
  };

  React.useEffect(() => {
    const imgName = projectItem.images[0].split("/").pop();
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
    <Box sx={{ width: "100%" }}>
      <Card
        key={index}
        component={Button}
        // href="/project-detail"
        onClick={() => handleItemClick(index)}

        sx={{
          p: 3,
          height: "fit-content",
          width: "100%",
          background: "none",
          backgroundColor: undefined,
          borderColor: "grey.200",
          display: "flex",
          flexDirection: "column", // Changed to column
          gap: 2,
        }}
      >
        <CardMedia
          component="img"
          sx={{
            width: "100%",
            height: 180,
            objectFit: "cover",
            marginBottom: 2,
          }} // Adjust width to 100% and add margin bottom
          image={imageUrl}
        />

        <Typography color="text.primary" variant="body2" fontWeight="bold">
          {projectItem.projectname}
        </Typography>

        <Typography color="text.secondary" variant="body2" sx={{
        my: 0.5,
        display: '-webkit-box', 
        overflow: 'hidden',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 4,
      }}>
          {truncatedDescription}
        </Typography>

        <Stack direction="column" spacing={1} sx={{ width: "100%" }}>
          {" "}
          {/* Changed direction to column */}
          <Chip //Producer
            avatar={<Avatar alt="Producer" src={headIconUrl}  />}
            label={userName}
            variant="outlined"
          />
          <Chip //Date Range
            icon={<DateRangeIcon />}
            label={projectItem.startdate.toString().substring(0, 10)}
          />
          <Chip //Donate Amount
            icon={<AttachMoneyIcon />}
            label={projectItem.rewardprice.join("/")}
          />
        </Stack>

        <Box
          sx={{
            mt: 2,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {" "}
          {/* Adjust for alignment */}
          <CircularWithValueLabel
            value={
              (parseFloat(projectItem.currentmoney.toString()) /
                parseFloat(projectItem.targetmoney.toString())) *
              100
            }
          />
        </Box>
      </Card>
    </Box>
  );
};
export default ProjectBoxCardForHots;
