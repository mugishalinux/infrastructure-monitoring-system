import React, { useState } from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageSlideshow = ({ imageList }) => {
  const images = imageList.split(",").map((image) => image.trim());
  const [currentImage, setCurrentImage] = useState(0);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (_, next) => setCurrentImage(next),
  };

  const previousImage = () => {
    setCurrentImage((prevImage) =>
      prevImage === 0 ? images.length - 1 : prevImage - 1
    );
  };

  const nextImage = () => {
    setCurrentImage((prevImage) =>
      prevImage === images.length - 1 ? 0 : prevImage + 1
    );
  };

  return (
    <div className="image-slideshow">
      <Slider {...settings} initialSlide={currentImage}>
        {images.map((image, index) => (
          <div key={index} className="slide">
            <img
              width={"500"}
              style={{ padding: "10px" }}
              src={image}
              alt={`Image ${index}`}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

ImageSlideshow.propTypes = {
  imageList: PropTypes.string.isRequired,
};

export default ImageSlideshow;
