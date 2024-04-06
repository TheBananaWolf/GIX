import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '../items/Typography';
import ProductHeroLayout from './ProductHeroLayout';
import Box from '@mui/material/Box';
import ImageSlider from '../items/ImageSlider';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { useState, useEffect } from 'react';
import Carousel from 'react-material-ui-carousel'
import { Paper} from '@mui/material';
import { Fade } from '@mui/material';



const backgroundImage =
  'https://images.unsplash.com/photo-1534854638093-bada1813ca19?auto=format&fit=crop&w=1400';

const images = [
  {
    url: 'https://images.squarespace-cdn.com/content/v1/631a15cef71d743070208dc1/63d07349-fb81-46ae-922a-313ca73d3647/Session-Studio-song-credits-app-header-image.jpg',
    title: 'Snorkeling',
  },
  {
    url: 'https://newxel.com/wp-content/uploads/2022/08/Game-development-studio.jpeg',
    title: 'Massage',
  },
  {
    url: 'https://c14.patreon.com/quxga_Patreon_Website_Module3_2_X_72dpi_Kamauu1_c26920eff8.jpg',
    title: 'Hiking',
  },
  {
    url: 'https://cdn2.veltra.com/ptr/20240218045653_1435704225_16070_0.jpg',
    title: 'Hiking',
  },
  {
    url: 'https://c14.patreon.com/20230901_Patreon_x_Kevin_33799_v1_f11c9ed4f1.jpg',
    title: 'Hiking',
  },
  {
    url: 'https://images.squarespace-cdn.com/content/v1/5980733286e6c0f4f499a4c3/1541611774031-3CH8UMW1CUWBNDWFATL0/IMG_6746.jpg?format=2500w',
    title: 'Tour',
  },
  

];
export default function ProductHero({ items = images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((currentIndex) => (currentIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div data-testid="product-hero" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/*  */}
      <ProductHeroLayout
        sxBackground={{
          backgroundImage: `url(${items[currentIndex].url})`,
          backgroundColor: '#7fc7d9', // Average color of the background image.
          backgroundPosition: 'center',
          backgroundSize: 'cover', // 确保背景图片覆盖整个区域
          width: '100%', // 宽度为100%
          flex: '1 0 auto', // 使用flex布局，允许组件自动扩展填满可用空间
        }}
      >


        <Box sx={{ position: 'relative',   button: '200px', right: '350px', 
          height: 200, width: 400, backgroundColor: '#transparent',}}>
          <Typography color="pink" align="left" variant="h2">
          Get your 
          </Typography>
          <Typography color="pink" align="left" variant="h2">
          Amazing
          </Typography>
          <Typography color="pink" align="left" variant="h2">
          Funding
          </Typography>
        </Box>
        
        <Box sx={{ position: 'relative',   top: '100px', 
        height: 200, width: 900, borderColor: 'primary.main', 
        backgroundColor: '#transparent'}}>

          <Typography variant='body1' sx={{ position: 'absolute', top: 120, left: 50 }}>
          We serve as a platform where individuals or organizations can raise funds for their projects, ventures, or causes by soliciting small contributions from a large number of people, typically via the internet. 
          </Typography>
        </Box>

        <Typography
          color="inherit"
          align="center"
          variant="h5"
          sx={{ mb: 4, mt: { xs: 4, sm: 10 } }}
        >
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Typography variant="body2" color="inherit">
            Discover the experience
          </Typography>
        </Box>
      </ProductHeroLayout>
    </div>
  );
}

