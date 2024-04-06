
// A component that displays a list of project images with titles and authors.
// Clicking should be able to nav to the project detail page.
import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import { styled } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import { Link } from 'react-router-dom';


type ProjectImageProps = {
  w: number;
  h: number;
  itemData: { img: string; title: string; author: string }[];
};


const ImageIconButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  display: 'block',
  padding: 0,
  borderRadius: 0,
  height: '40vh',
  [theme.breakpoints.down('md')]: {
    width: '100% !important',
    height: 100,
  },
  '&:hover': {
    zIndex: 1,
  },
  '&:hover .imageBackdrop': {
    opacity: 0.15,
  },
  '&:hover .imageMarked': {
    opacity: 0,
  },
  '&:hover .imageTitle': {
    border: '4px solid currentColor',
  },
  '& .imageTitle': {
    position: 'relative',
    padding: `${theme.spacing(2)} ${theme.spacing(4)} 14px`,
  },
  '& .imageMarked': {
    height: 3,
    width: 18,
    background: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity'),
  },
}));

const ProjectImageList: React.FC<ProjectImageProps> = ({ w, h, itemData }) =>{
    const handleItemClick = (index: number) => {
    };

    return (
      <ImageList cols={1} sx={{ width: w} }>
        <ImageListItem key="Subheader">
          <ListSubheader component="div">Related Projects</ListSubheader>
          </ImageListItem>
          {itemData.map((item) => (
            // Rewrite this part to jump to different pages
            <Link to="/project-detail">
              <ImageIconButton 
                key={item.title}
                style={{
                  width: 300,
                  height: '90%',
                }}
                >
                <ImageListItem key={item.img}>
                  <img
                    srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    src={`${item.img}?w=248&fit=crop&auto=format`}
                    alt={item.title}
                    loading="lazy"
                  />
                  <ImageListItemBar
                    title={item.title}
                    subtitle={item.author}
                  />
                </ImageListItem>
              </ImageIconButton>
            </Link>
        ))}
      </ImageList>
    );
}
export default ProjectImageList;