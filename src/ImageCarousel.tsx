import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Carousel from 'react-material-ui-carousel';

// Explicit styles
const useStyles = makeStyles({
  image: {
    display: "block",
    margin: "auto",
    height: "90vh"
  }
});

// Image carousel component
interface ImageCarouselProps {
  images: string[];
  className: string;
  swapInterval?: number;
}

// Main app
const ImageCarousel: React.FunctionComponent<ImageCarouselProps> =
  ({ images, className, swapInterval }) =>
    {
      const classes = useStyles();

      return (
        <Carousel className={className}
                  interval={swapInterval ?? 5000}
                  stopAutoPlayOnHover={false}
                  swipe={false}
                  navButtonsAlwaysInvisible={true}
        >
          { images.map( (url, index) =>
            <img src={url} key={index} className={classes.image} />
          ) }
        </Carousel>
      );
  };

export default ImageCarousel;
