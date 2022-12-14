import React from 'react'
import emptyGif from '../assets/amongus-.gif';
const Nothing = () => {
  return (
    <div className="nothing">
      <h3 className="nothing-header">DMBox is Empty!</h3>
      <div className="nothing-image">
        <img src={emptyGif} alt="gif" />
      </div>

      <h4 className="nothing-header">Select Your Friend to Get Started...</h4>
    </div>
  );
}

export default Nothing;