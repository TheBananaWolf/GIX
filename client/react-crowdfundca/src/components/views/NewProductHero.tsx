import * as React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '../items/Typography';
import Button from '@mui/material/Button';
import ImageSlider from '../items/ImageSlider';
import LinearWithValueLabel from '../items/ProgressBar';
import ReturnProductCard from '../items/ReturnProductCard';


const images = [
  {
    url: 'https://images.unsplash.com/photo-1534081333815-ae5019106622?auto=format&fit=crop&w=400',
    title: 'Snorkeling',
  },
  {
    url: 'https://images.unsplash.com/photo-1531299204812-e6d44d9a185c?auto=format&fit=crop&w=400',
    title: 'Massage',
  },
  {
    url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=400',
    title: 'Hiking',
  },
  {
    url: 'https://images.unsplash.com/photo-1453747063559-36695c8771bd?auto=format&fit=crop&w=400',
    title: 'Tour',
  },
  {
    url: 'https://images.unsplash.com/photo-1523309996740-d5315f9cc28b?auto=format&fit=crop&w=400',
    title: 'Gastronomy',
  },
  {
    url: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=400',
    title: 'Shopping',
  },
  {
    url: 'https://images.unsplash.com/photo-1506941433945-99a2aa4bd50a?auto=format&fit=crop&w=400',
    title: 'Walking',
  },
  {
    url: 'https://images.unsplash.com/photo-1533727937480-da3a97967e95?auto=format&fit=crop&w=400',
    title: 'Fitness',
  },
  {
    url: 'https://images.unsplash.com/photo-1518136247453-74e7b5265980?auto=format&fit=crop&w=400',
    title: 'Reading',
  },
];

export default function NewProductHero({ items = images }) {

    const [currentIndex, setCurrentIndex] = React.useState<number>(0); // 明确指定状态的类型

    const goToNext = () => {
      setCurrentIndex((prevIndex: number) => (prevIndex + 1) % items.length); // 明确指定参数的类型
    };
  
    const goToPrevious = () => {
      setCurrentIndex((prevIndex: number) => (prevIndex - 1 + items.length) % items.length); // 明确指定参数的类型
    };
  
    return (
      <div style={{ position: 'relative', width: '50%', height: '300px', margin: 'auto' }}>
        <img
          src={items[currentIndex].url}
          alt={items[currentIndex].title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <button onClick={goToPrevious} style={{ position: 'absolute', top: '50%', left: 0 }}>
          Prev
        </button>
        <button onClick={goToNext} style={{ position: 'absolute', top: '50%', right: 0 }}>
          Next
        </button>
      </div>
  );
}
