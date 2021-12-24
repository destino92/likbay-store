import React from 'react';

import Lottie from 'react-lottie';
import animationData from '../../lotties/add-to-cart.json';

export default function Animation( props ) {
  const defaultOptions = {
    loop: false,
    autoplay: false,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className="cart-animation">
      <div style={{width:'32px',height:'32px',overflow:'hidden',margin:'0 auto',outline:'none', fill:'white'}} title="" role="button" tabIndex="0">
        <svg width="24" height="24" viewBox="0 0 24 24" stroke="white" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.39999 6.5H15.6C19 6.5 19.34 8.09 19.57 10.03L20.47 17.53C20.76 19.99 20 22 16.5 22H7.50999C3.99999 22 3.23999 19.99 3.53999 17.53L4.44 10.03C4.66 8.09 4.99999 6.5 8.39999 6.5Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8 8V4.5C8 3 9 2 10.5 2H13.5C15 2 16 3 16 4.5V8"  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M20.41 17.03H8"  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
  );
}
