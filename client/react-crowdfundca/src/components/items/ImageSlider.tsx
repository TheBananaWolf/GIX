import React from 'react';
import Carousel from 'react-material-ui-carousel'
import { CardMedia } from '@mui/material'

function ImageSlider(props: any)
{
    const { items, ...other } = props;
    return (
        <Carousel>
            {
                items.map( (item:any, i:number) => <Item key={i} item={item} /> )
            }
        </Carousel>
    )
}

function Item(props: any)
{
    return (
        <CardMedia
            className="Media"
            sx={{ height: 350 }}
            image={props.item}
            title=""
        >
        </CardMedia>
    )
}

export default ImageSlider;