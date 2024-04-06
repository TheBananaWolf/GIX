import * as React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import AppBar from '../items/AppBar';
import Toolbar from '../items/Toolbar';
import SeachInputBox from '../items/SeachInputBox';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../../services/apiService';
import { Avatar } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';


const rightLink = {
  fontSize: 12,
  color: 'common.white',
  ml: 3,
};

function AppAppBar() {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(menuAnchorEl);
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const [showExtendedBar, setShowExtendedBar] = React.useState(false);


  const [cateNameList, setCateNames] = React.useState([""]);
  const navigate = useNavigate();
  // 控制登录登出按钮
  const [isLoggedIn, setIsLoggedIn] = React.useState(false); // 添加登录状态

  // 检查登录状态
  React.useEffect(() => {
    const token = localStorage.getItem('userToken');
    setIsLoggedIn(!!token); // 如果token存在，设置为true
  }, []);

  // 登出处理函数
  const handleLogout = () => {
    localStorage.removeItem('userToken'); // 移除token
    setIsLoggedIn(false); // 更新状态为未登录
    navigate('/sign-in'); // 重定向到登录页面
  };

  React.useEffect (() => {
    fetchData(`/api/project/getCategorys`, "", afterFetchCategories);
  }, []);

  const afterFetchCategories = async (values: any) => {
    console.log(values);
    let myList = [];
    for(let i = 0; i < values.categories.length; i++){
      myList.push(values.categories[i].categoryname);
    }
    setCateNames(myList);
    return;
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate('/project-list', { state: { categoryId: { categoryId} } });
  }

// 获取用户信息
const [userProfilePic, setUserProfilePic] = React.useState('');

React.useEffect(() => {
  const fetchUserProfile = async () => {
    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        fetchData(`/api/profile/getUserProfile`, token, (userData:  any)=>{
          if (userData.profilePic) {
            setUserProfilePic(userData.profilePic);
            localStorage.setItem('userId', userData.userId);
          }
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }
  };

  fetchUserProfile();
}, []);



  return (
    <div>
      <AppBar position="fixed" >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1, justifyContent: 'flex-start' }} />
          {/* <Box sx={{flexWrap:'wrap',flexGrow: 0, display:'flex', ml:4}}/> */}
          <Link
            variant="h6"
            underline="none"
            color="inherit"
            href="/"
            sx={{ fontSize: 24 }}
          >
            {'G I X'}
          </Link>
          {/* Categories */}
          <Box sx={{flexWrap:'wrap',flexGrow: 2, display:'flex', ml:4}}>
            {cateNameList.map((name, index) => {
                return (
                  <Button
                    key={name}
                    sx={{ my: 2, color: '#D4A278', display: 'block', 
                      '&:hover': {
                        backgroundColor: '#fff',
                        color: 'secondary.dark',
                      },}}
                    onClick={() => handleCategoryClick((index+1).toString())}
                    href='/project-list'
                  >
                    {name}
                  </Button>
                );
              // }
            })}
          </Box>
          {/* Sign In and User Profile */}
          {/* <Box sx={{ display: 'flex', justifyContent: 'center', minWidth: '50ch' }}>
            <SeachInputBox />
          </Box> */}
          <Box sx={{ flex: 0, display: 'flex', justifyContent: 'flex-end' }}>
            <SeachInputBox/>
            <Link
              color="inherit"
              variant="h6"
              underline="none"
              href=""
              onClick={() => navigate('/project-edit')}
              sx={rightLink}
            >
              Create New
            </Link>

            {isLoggedIn ? (
              <>
                <Button color="inherit" onClick={handleLogout} sx={rightLink}>
                  Logout
                </Button>
                {/* Conditionally render the Avatar if userProfilePic is not null */}
                {userProfilePic && (
                  <Link
                    onClick={() => navigate('/profile ')}
                  >
                  <Avatar
                    src={userProfilePic}
                    alt="User Profile Pic"
                    sx={{ width: 24, height: 24, ml: 3 }}/>
                  </Link>
              )}
            </>
            ) : (
              <>
                <Link
                  color="inherit"
                  variant="h6"
                  underline="none"
                  href="/sign-in"
                  sx={rightLink}
                >
                  Sign In
                </Link>
                <Link
                  variant="h6"
                  underline="none"
                  href="/sign-up"
                  sx={{ ...rightLink, color: 'secondary.main' }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </div>
  );
}

export default AppAppBar;
