// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import './ImageSlider.css'; // Import your CSS file

// eslint-disable-next-line react/prop-types
const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(intervalId);
  }, [currentIndex]);


  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="slider-container">
      <div className="slider" style={{ transform: `translateX(${-currentIndex * 100}%)` }}>
        {images.map((image, index) => (
          <div className="slide" key={index}>
            <img src={image} alt={`Image ${index + 1}`} />
          </div>
        ))}
      </div>
      <button className="prev-btn" onClick={prevSlide}>&lt;</button>
      <button className="next-btn" onClick={nextSlide}>&gt;</button>
    </div>
  );
};

export default ImageSlider;
