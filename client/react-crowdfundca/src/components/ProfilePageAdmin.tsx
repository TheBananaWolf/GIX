import React, { useState, useEffect } from 'react';
import AppFooter from './views/AppFooter';
import AppAppBar from './views/AppAppBar';
import Typography from './items/Typography';
import withRoot from './withRoot';
import { Box, Card, Grid, Avatar, Tab, Tabs } from '@mui/material';
import EditProfileForm from './form/EditProfileForm';
import { updateData } from '../services/apiService';
import ProjectBoxCardMini from './items/ProjectBoxCardMini';
import EmptyProjectCard from './EmptyProjectCard';



const gridStyle = {
  // 添加上边距，避免与上方的元素重叠
  marginTop: '24px',
   // 设置最大宽度为父容器宽度的一定百分比，例如 100%
  maxWidth: '100%',
  justifyContent: 'space-between',
  display: 'flex', // 使用flex布局
  // flexDirection: 'row' as 'row',
  overflowX: 'auto' as 'auto',
  padding: '0 16px', // 在容器两侧添加内间距
  margin: '0 8px',

   // 设置左右边距为 'auto' 可以居中对齐卡片
  // margin: '0 auto',
};

const projectCardContainerStyle = {
  // 确保容器不会超过父元素的宽度
  display: 'flex', // 使用flex布局
  flexDirection: 'row' as 'row',
  overflowX: 'auto' as 'auto', // 明确指定类型为'auto'，允许横向滚动
  margin: '0 8px',
  justifyContent: 'space-between',
  marginTop: '1px',
  // maxWidth: 'calc(100% )', // 减去内间距的总宽度
  // margin: '0 auto', // 可以居中对齐容器
};

// 定义项目数据的类型
type Project = {
  _id: string;
  pid: string;
  token: string;
  projectname: string;
  projectsdescription: string;
  categoryid: string;
  images: string[];
  userId: string;
  targetmoney: string;
  currentmoney: string;
  statue: boolean;
  enddate: Date;
  startdate: Date;
  participateduser?: string[];
  rewardlevel: any[];
  rewardprice: string[];
  rewardcontent: string[];
};

function ProfilePage() {
  const [activeTab, setActiveTab] = React.useState(0);
  // 使用Project类型来初始化projects状态
  const [projects, setProjects] = useState<Project[]>([]);    // 发起的项目
  const [participatedProjects, setParticipatedProjects] = useState<Project[]>([]);  // 参与的项目

  // 新状态来存储用户头像的URL
  const [avatarUrl, setAvatarUrl] = useState('/path-to-user-image.jpg');

  // 添加两个新的状态来控制表单的编辑状态
  const [isEditing, setIsEditing] = useState(false);

  // 处理编辑个人资料 保存操作的函数
  const handleSave = () => {
    // TODO: 这里可以添加将个人信息发送到服务器的逻辑
    setIsEditing(false); // 保存后退出编辑状态
  };
  // 处理编辑个人资料 取消编辑的函数
  // const handleCancel = () => {
  //   setIsEditing(false); // 取消编辑
  // };
  // 处理用户info回显
  const [userInfo, setUserInfo] = useState({
    userId: '',
    firstName: '',  // 根据实际返回的用户信息结构调整
    lastName: '',
    email: '',
    gender: '',
    location: '',
    investedProjectList: [],
  });
  // 处理用户信息回显
  const fetchUserInfo = async () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      try {
        const response = await fetch('/api/admin/adminGetUserProfile', {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }
  
        const fetchedUserInfo = await response.json();
        setUserInfo({
          userId: fetchedUserInfo.userId, 
          firstName: fetchedUserInfo.firstName,
          lastName: fetchedUserInfo.lastName,
          email: fetchedUserInfo.email,
          gender: fetchedUserInfo.gender,
          location: fetchedUserInfo.location,
          investedProjectList: fetchedUserInfo.investedProjectList,
        });
  
        // 更新头像URL状态
        if (fetchedUserInfo.profilePic) {
          setAvatarUrl(fetchedUserInfo.profilePic);
        }
        // 拉取user的project
        if (fetchedUserInfo.userId) {
          fetchInitiatedProjects(fetchedUserInfo.userId);
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    }
  };
  
  // 用户信息回显!!!!!!!
  useEffect(() => {
    fetchUserInfo();
  }, []);
  useEffect(() => {
    if (userInfo.userId) {
      if (activeTab === 0) {
        fetchParticipatedProjects();
      } else if (activeTab === 1) {
        fetchInitiatedProjects(userInfo.userId);
      }
    }
  }, [userInfo.userId]);

// 更新 fetchParticipatedProjects 函数
const fetchParticipatedProjects = async () => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    console.error('Authentication token is missing');
    return;
  }

  try {
    const response = await fetch('/api/admin/showUserDonateProject', {    // Todo: modify to adminShowUserDonateProject
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ token: `Bearer ${token}` }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch participated projects');
    }

    const data = await response.json();
    if (data.success) {
      setParticipatedProjects(data.projectInfo);
    } else {
      console.error(data.message);
    }
  } catch (error) {
    console.error('An error occurred while processing your request:', error);
  }
};




// 处理用户发起的Project
const fetchInitiatedProjects = async (userId: string) => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    console.error('Token is not available.');
    return;
  }
  try {
    const response = await fetch('/api/admin/adminShowUserProject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, token: `Bearer ${token}` }), // 确保这里的 userId 是存在且有效的
    });
    // const data = await response.json(); // 将这行移到 try 块的开头
    if (response.ok) {
      // const { success, projectInfo } = await response.json();
      const data = await response.json();
      if (data.success) {
        const validProjects = data.projectInfo.filter((proj: any) => proj._id);
        // Transform the data from the API to match the ProjectItem type
        const adaptedProjects = data.projectInfo.map((proj: any) => ({
          ...proj,          // Make sure every field is mapped correctly, 
          // converting types if necessary
          _id: proj._id || '', // 提供一个空字符串作为默认值
          enddate: new Date(proj.enddate),
          startdate: new Date(proj.startdate),
        }));
        setProjects(adaptedProjects);
      } else {
        console.error('Failed to fetch projects:', data.message);
        setProjects([]);
      }
    } else {
      // throw new Error('Network response was not ok.');
      // 如果响应不是成功的，打印出详细错误
      const errorData = await response.json();
      console.error('Failed to fetch projects:', errorData.message);
    }
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    // setProjects([]);
  }
};


  

  // 处理文件选择和图片上传
  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        // 将文件转换为Base64编码
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result as string;
            // 调用函数上传头像
            await updateProfilePic(base64String);
        };
        reader.readAsDataURL(file);
    }
};

const updateProfilePic = async (profilePicBase64: string) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
      try {
          const response = await updateData('/api/admin/adminUpdateProfilePic', { profilePic: profilePicBase64 }, token);
          console.log('Profile picture updated successfully:', response);
          setAvatarUrl(profilePicBase64); // 更新头像URL以反映新的头像
          // 重新获取用户信息以更新页面上的头像信息
          fetchUserInfo();
      } catch (error) {
          console.error('Failed to update profile picture:', error);
      }
  }
};


  // const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     // TODO: 这里可以添加将文件上传到服务器的逻辑
  //     // 临时读取文件并作为URL显示
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       // 只有当reader.result为string类型时才更新状态
  //       if (typeof reader.result === 'string') {
  //         setAvatarUrl(reader.result);
  //       }      
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  
  // const handleTabChange = (
  //   event: React.ChangeEvent<{}>,
  //   newValue: number
  // ) => {
  //   setActiveTab(newValue);
  // };
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
  };

  // 样式
  const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const tabStyle = {
    borderBottom: '1px solid #e8e8e8',
    '& .MuiTabs-indicator': {
      backgroundColor: '#1890ff',
    },
  };

  const avatarStyle = {
    width: '100px',
    height: '100px',
  };

  const projectCardStyle = {
    width: '75%',
    margin: '6px', // 添加间隔
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  };

  const projectCardContentStyle = {
    padding: '16px',
  };

  /* const projectImageStyle = {
    height: '345px', // 使图片为正方形
    width: '100%',
    objectFit: 'cover' as const, // 正确的类型
  }; */

  // 模拟的项目数据
  // const participatedProjects: Project[] = [
  //   {
  //     id: 1,
  //     name: 'Chair',
  //     status: 'Processing',
  //     imageUrl: 'http://tinyurl.com/25avsvzp',
  //     description: 'A chair with a unique design',
  //   },
  //   {
  //     id: 2,
  //     name: 'keyboard',
  //     status: 'Completed',
  //     imageUrl: 'http://tinyurl.com/59ue69z6',
  //     description: 'Unique design, make your own keyboard',
  //   },
    
  // ];
  // const initiatedProjects: Project[] = [
  //   {
  //     id: 1,
  //     name: 'Subaru sti logo',
  //     status: 'Processing',
  //     imageUrl: 'http://tinyurl.com/4p842tz6',
  //     description: 'sti logo(pink)',
  //   },
  //   {
  //     id: 2,
  //     name: 'Alcantara steering wheel',
  //     status: 'Completed',
  //     imageUrl: 'http://tinyurl.com/4377wka8',
  //     description: 'Unique design, make your own steering wheel',
  //   },
    
  // ];


  // 函数来决定状态徽章的颜色
  const statusColor = (status: string) => {
    return status === 'Processing' ? 'primary' : 'success';
  };

  return (
  <React.Fragment>
    <AppAppBar/>
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={2}>
        {/* 用户信息卡片 */}
        <Grid item xs={12}>
          <Card sx={{ ...cardStyle }}>
            {/* 点击头像时可以上传新图片 */}
            <input
                accept="image/*"
                style={{ display: 'none' }}
                id="raised-button-file"
                multiple
                type="file"
                onChange={handleAvatarChange}
            />
            <label htmlFor="raised-button-file">
              <Avatar sx={{ ...avatarStyle, cursor: 'pointer' }} src={avatarUrl} title="Change Avatar" />
            </label>
            {/* <Avatar sx={{ ...avatarStyle }} src="/path-to-user-image.jpg" /> */}
            <Typography gutterBottom variant="h4" component="div">
            {userInfo.lastName + userInfo.firstName || 'Please Signin First'}
            </Typography>
            {/* <Button variant="outlined" sx={{ mt: 1, mb: 2 }} onClick={handleEditProfileClick}>
              Edit Profile
            </Button> */}
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ ...tabStyle }}>
              <Tab label="Participated" />
              <Tab label="Initiated" />
              <Tab label="Profile" />
              {/* <Tab label="Updates" /> */}
            </Tabs>
          </Card>
        </Grid>
        


        {/* 根据选中的标签显示内容 */}
        {activeTab === 0 && (
          <Grid item xs={12} style={gridStyle} >
            <div style={projectCardContainerStyle}>
            {participatedProjects.length > 0 ? (
              participatedProjects.map((project, index) => (
                <ProjectBoxCardMini
                  key={project._id}
                  projectItem={project}
                  index={index}
                  hasCloseBtn={true} // Add the hasCloseBtn property with a boolean value
                />
              ))
            ) : (
              <EmptyProjectCard />
            )}
            </div>
          </Grid>
        )}

        {/* 在这里添加 'Initiated' 项目的内容 */}
        {activeTab === 1 && (       
          <Grid item xs={12} style={gridStyle} >
            <div style={projectCardContainerStyle}>
              {projects.length > 0 ? (
                projects.map((project, index) => (
                  <ProjectBoxCardMini 
                  key={project._id}
                  projectItem={project}
                  index={index}
                  hasCloseBtn={true} // Add the hasCloseBtn property with a boolean value
                />
                ))
              ) : (
                <EmptyProjectCard />
              )}
            </div>
            
          </Grid>
        )}

        {activeTab === 2 && (
          <Grid item xs={12}>
            <Box width={1} maxWidth={500} mx="auto"> {/* 设置最大宽度并居中 */}
              {/* <EditProfileForm onSave={handleSave} /> */}
              <EditProfileForm userInfo={userInfo} onSave={handleSave} />

            </Box>
          </Grid>
        )}
        

        
      </Grid>
    </Box>
    {/* <EditProfileForm open={isEditProfileDialogOpen} onClose={handleDialogClose} /> */}
    <AppFooter />
  </React.Fragment>
);

}

export default withRoot(ProfilePage);