import React, { useState } from 'react';
import './style.css'; // Import CSS file
import { Button, Card } from '@chakra-ui/react';

function Carousel({ inputs }) {
  const [current, setCurrent] = useState(0);

  const handleNext = () => {
    setCurrent(current === inputs.length - 1 ? 0 : current + 1);
  };

  const handlePrev = () => {
    setCurrent(current === 0 ? inputs.length - 1 : current - 1);
  };

  return (
    <div className="carousel">
      <img src={inputs[current].image} alt="" />
      <Card className='text'>{inputs[current].text}</Card>
      <div className="carousel-buttons">
        <Button variant="outline" color="teal" backgroundColor="white" onClick={handlePrev}>Prev</Button>
        <Button variant="outline" color="teal" backgroundColor="white" onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
}

export default Carousel;