import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '../items/Typography';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import ProjectBoxCardForHots from '../items/ProjectBoxCardForHots';
import { useEffect, useState } from 'react';
import { fetchData } from '../../services/apiService'; // 确保导入路径正确

export default function ProductCategories() {
  const [items, setItems] = useState([]);
  const [displayCount, setDisplayCount] = useState(4); // 初始显示4个项目

  useEffect(() => {
    const afterFetchProjectList = async (values: any) => {
      // 假设result是直接获取到的项目信息
      setItems(values.projectInfo); // 根据您的API响应结构调整这里
    };


    // 同样的API调用
    fetchData(`/api/project/showProjectBy?queryKey=categoryid&value=1`, localStorage.getItem('userToken'), afterFetchProjectList);
  }, []);

  const loadMore = () => {
    setDisplayCount((prevCount) => prevCount + 4); // 每次点击增加显示四个项目
  };

  return (
    <Container component="section" sx={{ mt: 8, mb: 4 }} data-testid="product-categories-for-hot">
      <Typography variant="h4" marked="center" align="center" component="h2" gutterBottom>
        Featured Projects
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {items.slice(0, displayCount).map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <ProjectBoxCardForHots
              projectItem={item} index={index}
            />
          </Grid>
        ))}
      </Grid>
      {displayCount < items.length && (
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


// const items = [
//   {
//     icon: "https://ksr-ugc.imgix.net/assets/043/710/862/54ae257602dc7eb2a1481af7d4666d7e_original.jpg?ixlib=rb-4.1.0&crop=faces&w=1024&h=576&fit=crop&v=1705623079&auto=format&frame=1&q=92&s=5e2c7e2ed9b294d83ea565a83206d4fa",
//     title: 'Dashboard',
//     description:
//       'This item could provide a snapshot of the most important metrics or data points related to the product.',
//     imageLight: 'url("/static/images/templates/templates-images/dash-light.png")',
//     imageDark: 'url("/static/images/templates/templates-images/dash-dark.png")',
//     clickHref: '/project-detail',
//   },
//   {
//     icon: "https://ksr-ugc.imgix.net/assets/043/769/907/6e597c3e37a05f9c932164955f7400d9_original.jpg?ixlib=rb-4.1.0&crop=faces&w=1024&h=576&fit=crop&v=1706066476&auto=format&frame=1&q=92&s=1778da31238a2cd7afe3e84e386bb7ff",
//     title: 'Mobile integration',
//     description:
//       'This item could provide information about the mobile app version of the product.',
//     imageLight: 'url("/static/images/templates/templates-images/mobile-light.png")',
//     imageDark: 'url("/static/images/templates/templates-images/mobile-dark.png")',
//   },
//   {
//     icon: "/static/mba15.jpg",
//     title: 'Available on all platforms',
//     description:
//       'This item could let users know the product is available on all platforms, such as web, mobile, and desktop.',
//     imageLight: 'url("/static/images/templates/templates-images/devices-light.png")',
//     imageDark: 'url("/static/images/templates/templates-images/devices-dark.png")',
//   },
//     {
//     icon: "https://ksr-ugc.imgix.net/assets/044/074/813/f759bf63179c583b0a04daec4b68fd09_original.png?ixlib=rb-4.1.0&crop=faces&w=1024&h=576&fit=crop&v=1708476452&auto=format&frame=1&q=92&s=9178132e643d651d2a05f461f06d65dd",
//     title: 'Available on all platforms',
//     description:
//       'This item could let users know the product is available on all platforms, such as web, mobile, and desktop.',
//     imageLight: 'url("/static/images/templates/templates-images/devices-light.png")',
//     imageDark: 'url("/static/images/templates/templates-images/devices-dark.png")',
//   },
// ];


// export default function ProductCategories() {

//   return (
//     <Container component="section" sx={{ mt: 8, mb: 4 }} data-testid="product-categories-for-hot">
//       <Typography variant="h4" marked="left" align="left" component="h6">
//         Recommend for you
//       </Typography>
//       <Grid container spacing={6}>
//         <Grid item xs={12} md={12}>
//           <Grid container item gap={1} sx={{ display: { xs: 'auto', sm: 'none' } }}>
//             {items.map(({ title }, index) => (
//               <Chip
//                 key={index}
//                 label={title}
//                 sx={{
//                   borderColor:'primary.light',
//                   background: 'none',
//                   backgroundColor: '#fff',
//                 }}
//               />
//             ))}
//           </Grid>
//           <Box
//             component={Card}
//             variant="outlined"
//             sx={{
//               display: { xs: 'auto', sm: 'none' },
//               mt: 4,
//             }}
//           >
//             <Box
//               sx={{
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center',
//                 minHeight: 280,
//               }}
//             />
//           </Box>
//           <Stack
//             direction="row"
//             justifyContent="center"
//             alignItems="flex-start"
//             spacing={2}
//             useFlexGap
//             sx={{ width: '100%', display: { xs: 'none', sm: 'flex' }}}
//           >
//             {items.map(({ icon, title, description }, index) => (
//               // Show box card
//               <ProjectBoxCardForHots key={index} icon={icon} title={title} description={description} index={index}/>
//             ))}
//           </Stack>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// }
