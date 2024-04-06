import * as React from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "../items/Typography";
import TextField from "@mui/material/TextField";
import DropzoneImage from "../items/DropzoneImage";
import { useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { submitData, spSubmitData, submitUploadData } from "../../services/apiService";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import PageContentWithEditor from '../items/PageContentWithEditor';
import AlertDialogWithBtn from '../items/AlertDialogWithBtn';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

export default function EditProjectInfo() {
  const location = useLocation();
  let projectInfo = location.state?.data;
  const [tag, setTag] = React.useState("");
  const [enddate, setEndDate] = React.useState<dayjs.Dayjs | null>(null);
  const [projectname, setProjectname] = React.useState("");
  const [projectsdescription, setProjectdescription] = React.useState("");
  const [targetmoney, setTargetmoney] = React.useState("");
  const [rewardprice1, setRewardprice1] = React.useState("");
  const [rewardcontent1, setRewardcontent1] = React.useState("");
  const [rewardprice2, setRewardprice2] = React.useState("");
  const [rewardcontent2, setRewardcontent2] = React.useState("");
  const [rewardprice3, setRewardprice3] = React.useState("");
  const [rewardcontent3, setRewardcontent3] = React.useState("");
  const [imageUrlList, setImages] = React.useState([] as Blob[]);
  const [imageFileList, setImageFileList] = React.useState([] as File[]);

  const [showTmp, setShowTmp] = React.useState(false);
  const [tmpMsg, setTmpMsg] = React.useState("");
  const [showTmpRing, setShowTmpRing] = React.useState(true);

  const [e1, setE1] = React.useState(false);
  const [e2, setE2] = React.useState(false);
  const [e3, setE3] = React.useState(false);
  const [e4, setE4] = React.useState(false);
  const [e5, setE5] = React.useState(false);
  const [e6, setE6] = React.useState(false);
  const [e7, setE7] = React.useState(false);
  const [e8, setE8] = React.useState(false);

  const navigate = useNavigate();

  const pageContent = PageContentWithEditor({ initialContent: projectsdescription });

  const handleChange = (event: SelectChangeEvent) => {
    setTag(event.target.value as string);
  };

  React.useEffect(() => {
    // Check if projectInfo is available and contains projectItem
    if (
      projectInfo &&
      projectInfo.projectItem &&
      projectInfo.projectItem.startdate
    ) {
      // Set initial values for the form
      setTag((parseInt(projectInfo.projectItem.categoryid) - 1).toString());
      setProjectname(projectInfo.projectItem.projectname);
      setProjectdescription(projectInfo.projectItem.projectsdescription);
      setTargetmoney(projectInfo.projectItem.targetmoney);
      setEndDate(dayjs(projectInfo.projectItem.enddate.substring(0, 10)));
      setRewardprice1(projectInfo.projectItem.rewardprice[0]);
      setRewardcontent1(projectInfo.projectItem.rewardcontent[0]);
      setRewardprice2(projectInfo.projectItem.rewardprice[1]);
      setRewardcontent2(projectInfo.projectItem.rewardcontent[1]);
      setRewardprice3(projectInfo.projectItem.rewardprice[2]);
      setRewardcontent3(projectInfo.projectItem.rewardcontent[2]);
      setImages(projectInfo.projectItem.images);
    }
  }, [projectInfo]); // Only run this effect when projectInfo changes

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    setEndDate(date);
  };

  const handleImageChange = (files: File[]) => {
    setImageFileList(files);
    console.log("imageFileList");
    console.log(imageFileList);
  };

  const handleProjectSave = () => {
    // Show Saving
    setTmpMsg("Saving...");
    setShowTmp(true);
    // Update Project
    if(projectInfo){
      // Create a FormData object
      const formData = new FormData();
      formData.append("pid", projectInfo.projectItem.pid);
      formData.append("token", projectInfo.projectItem.token);
      formData.append("userId", projectInfo.projectItem.userId);
      formData.append(
        "projectsdescription",
        pageContent.getHTMLResult() as string
      );
      formData.append("categoryid", (parseInt(tag) + 1).toString());
      formData.append("projectname", projectname);
      formData.append("targetmoney", targetmoney);
      formData.append("enddate", enddate + "");
      formData.append("rewardprice[0]", rewardprice1);
      formData.append("rewardcontent[0]", rewardcontent1);
      formData.append("rewardprice[1]", rewardprice2);
      formData.append("rewardcontent[1]", rewardcontent2);
      formData.append("rewardprice[2]", rewardprice3);
      formData.append("rewardcontent[2]", rewardcontent3);
      imageFileList.forEach((file, index) => {
        formData.append(`images[${index}]`, file);
      });
      submitUploadData("/api/project/updateProject", formData, localStorage.getItem('userToken'), afterSave);
    }
    else{
      // Upload a new project
      // Create a FormData object
      const formData = new FormData();
      const userToken = "Bearer " + localStorage.getItem('userToken');
      formData.append("token", userToken ? userToken : "");
      formData.append(
        "projectsdescription",
        pageContent.getHTMLResult() as string
      );
      formData.append("categoryid", (parseInt(tag) + 1).toString());
      formData.append("projectname", projectname);
      formData.append("currentmoney", '0');
      formData.append("targetmoney", targetmoney);
      formData.append("enddate", enddate + "");
      formData.append("rewardprice[0]", rewardprice1);
      formData.append("rewardcontent[0]", rewardcontent1);
      formData.append("rewardprice[1]", rewardprice2);
      formData.append("rewardcontent[1]", rewardcontent2);
      formData.append("rewardprice[2]", rewardprice3);
      formData.append("rewardcontent[2]", rewardcontent3);
      imageFileList.forEach((file, index) => {
        formData.append(`images[${index}]`, file);
      });
      submitUploadData("/api/project/uploadProject", formData, localStorage.getItem('userToken'), afterSave);
    }
  };

  const afterSave = async (values: any) => {
    setTmpMsg("Save Success");
    setShowTmpRing(false);
    setTimeout(() => {
      setShowTmp(false);
      setShowTmpRing(true);
    }, 1200); // Close after 1.2 seconds

    if (values.success === true) {
      projectInfo = values.project;
      let projectItem = values.project;
      navigate('/project-detail', { state: { data: { projectItem} } });
      window.scrollTo(0, 0);
    }
  };

  const confirmDelete = () => {
    // Show Deleting
    setTmpMsg("Deleting...");
    setShowTmp(true);

    const data = {
      "pid": projectInfo.projectItem.pid,
      "token": projectInfo.projectItem.token,
    };
    spSubmitData(`/api/project/deleteproject?pid=${projectInfo.projectItem.pid}&token=${projectInfo.projectItem.token}`, null, afterDelete);
  };

  const afterDelete = async (values: any) => {
    // Back to project list page after 1.2s
    setTmpMsg("Delete Success");
    setShowTmpRing(false);
    setTimeout(() => {
      setShowTmp(false);
      setShowTmpRing(true);
      window.location.href = '/';
    }, 1200); 
  };

  return (
    <Container component="section" sx={{ mt: 4, mb: 8, display: "flex" }} data-testid="edit-project-info">
      <Grid container>
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: { md: "block", xs: "none" }, position: "relative" }}
        >
          <Typography
            variant="h4"
            marked="left"
            align="left"
            component="h2"
            sx={{ mb: 4, mt: 4 }}
          >
            Basic Information
          </Typography>

          <Grid container>
            <Grid
              item
              xs={6}
              sx={{
                display: { md: "block", xs: "none" },
                position: "relative",
              }}
            >
              <FormControl sx={{ width: 240, mb: 1 }}>
                <InputLabel id="demo-simple-select-helper-label">
                  Category
                </InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={tag}
                  label="Category"
                  onChange={handleChange}
                >
                  <MenuItem value={0}>Arts</MenuItem>
                  <MenuItem value={1}>Comics & Illustration</MenuItem>
                  <MenuItem value={2}>Design & Tech</MenuItem>
                  <MenuItem value={3}>Film</MenuItem>
                  <MenuItem value={4}>Food & Craft</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Project Name"
                id="filled-size-normal"
                variant="filled"
                value={projectname}
                error={e1}
                onChange={(event) => {
                  if (event.target.value.length > 30) {
                    setE1(true);
                  }
                  else{
                    setProjectname(event.target.value);
                    setE1(false);
                  }
                }}
                helperText={e1 ? 'Project name must be 30 characters or less' : ''}
                sx={{ width: 240 }}
              />
              <TextField
                label="Donate Target($)"
                id="filled-size-normal"
                variant="filled"
                value={targetmoney}
                error={e2}
                onChange={(event) => {
                  const isValid = /^\d+$/.test(event.target.value);
                  if(!isValid){
                    setTargetmoney(event.target.value);
                    setE2(true);
                  }
                  else{
                    setTargetmoney(event.target.value);
                    setE2(false);
                  }
                }}
                helperText={e2 ? 'Donate Target should be an integer' : ''}
                sx={{ width: 240 }}
              />
              {projectInfo &&
              <TextField
                label="Start Date"
                id="filled-size-normal"
                defaultValue={projectInfo.projectItem.startdate.substring(0, 10)}
                disabled={true}
                variant="filled"
                sx={{ width: 240}}
              />}
              <Box sx={{ mt:1 }} />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="End Date"
                  value={enddate}
                  onChange={handleDateChange}
                  minDate={dayjs()}
                />
              </LocalizationProvider>
            </Grid>
            <Grid
              item
              xs={6}
              sx={{
                display: { md: "block", xs: "none" },
                position: "relative",
              }}
            >
              <TextField
                label="Price 1($)"
                id="filled-size-normal"
                value={rewardprice1}
                error={e3}
                onChange={(event) => {
                  const isValid = /^\d+$/.test(event.target.value);
                  if(!isValid){
                    setRewardprice1(event.target.value);
                    setE3(true);
                  }
                  else{
                    setRewardprice1(event.target.value);
                    setE3(false);
                  }
                }}
                variant="filled"
                helperText={e3 ? 'Price should be an integer' : ''}
                sx={{ width: 240 }}
              />
              <TextField
                label="Price 1 Reward"
                id="filled-size-normal"
                value={rewardcontent1}
                error={e4}
                onChange={(event) => {
                  if (event.target.value.length > 100) {
                    setE4(true);
                  }
                  else{
                    setRewardcontent1(event.target.value);
                    setE4(false);
                  }
                }}
                helperText={e4 ? 'Reward text should be 100 characters or less' : ''}
                variant="filled"
                sx={{ width: 240 }}
              />
              <TextField
                label="Price 2($)"
                id="filled-size-normal"
                value={rewardprice2}
                error={e5}
                onChange={(event) => {
                  const isValid = /^\d+$/.test(event.target.value);
                  if(!isValid){
                    setRewardprice2(event.target.value);
                    setE5(true);
                  }
                  else{
                    setRewardprice2(event.target.value);
                    setE5(false);
                  }
                }}
                helperText={e5 ? 'Price should be an integer' : ''}
                variant="filled"
                sx={{ width: 240 }}
              />
              <TextField
                label="Price 2 Reward"
                id="filled-size-normal"
                value={rewardcontent2}
                error={e6}
                onChange={(event) => {
                  if (event.target.value.length > 100) {
                    setE6(true);
                  }
                  else{
                    setRewardcontent2(event.target.value);
                    setE6(false);
                  }
                }}
                helperText={e6 ? 'Reward text should be 100 characters or less' : ''}
                variant="filled"
                sx={{ width: 240 }}
              />
              <TextField
                label="Price 3($)"
                id="filled-size-normal"
                value={rewardprice3}
                error={e7}
                onChange={(event) => {
                  const isValid = /^\d+$/.test(event.target.value);
                  if(!isValid){
                    setRewardprice3(event.target.value);
                    setE7(true);
                  }
                  else{
                    setRewardprice3(event.target.value);
                    setE7(false);
                  }
                }}
                helperText={e7 ? 'Price should be an integer' : ''}
                variant="filled"
                sx={{ width: 240 }}
              />
              <TextField
                label="Price 3 Reward"
                id="filled-size-normal"
                value={rewardcontent3}
                error={e8}
                onChange={(event) => {
                  if (event.target.value.length > 100) {
                    setE8(true);
                  }
                  else{
                    setRewardcontent3(event.target.value);
                    setE8(false);
                  }
                }}
                helperText={e8 ? 'Reward text should be 100 characters or less' : ''}
                variant="filled"
                sx={{ width: 240 }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid // Empty space
          item
          xs={12}
          md={1}
        ></Grid>
        <Grid // Upload images
          item
          xs={12}
          md={5}
          sx={{ display: { md: "block", xs: "none" }, position: "relative" }}
        >
          <Typography
            variant="h4"
            marked="left"
            align="left"
            component="h2"
            sx={{ mb: 4, mt: 4 }}
          >
            Upload Images
          </Typography>
          <DropzoneImage
            initialImages={imageUrlList as never[]}
            onFilesChange={handleImageChange}
          />
        </Grid>
        <Grid // Save button
          item
          xs={12}
          md={12}
        >
          {projectInfo && projectsdescription && pageContent.component}
          {!projectInfo && pageContent.component}
          <Button
            color="secondary"
            size="large"
            variant="contained"
            component="a"
            onClick={handleProjectSave}
            sx={{ float: "right"}}
          >
            Save
          </Button>

          {projectInfo && 
          // Delete Button shows when projectInfo is available
            <AlertDialogWithBtn
              confirmCallbackFunc={confirmDelete}
              titleStr="Confirmation"
              contentStr="Are you sure you want to delete this project?"
              confirmStr="Detele"
              cancelStr="Cancel"
              btnStr="Delete"
              btnDir="left"
              isForProfilePage={false}
            />
          }
        </Grid>
      </Grid>
      <div>
        {/* Tmp message */}
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
