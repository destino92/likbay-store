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
      <div style={{width:'32px',height:'32px',overflow:'hidden',margin:'0 auto',outline:'none'}} title="" role="button" tabIndex="0">
        <img src="/icon/shopping-bag.svg" alt=""/>
      </div>
    </div>
  );
}
