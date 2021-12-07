import React from 'react';

import Lottie from 'react-lottie';
import animationData from '../../lotties/checkout.json';

export default function Loader() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    }
  };

  return (
    <div className="loader-animation">
      <Lottie
        options={defaultOptions}
        height={500}
        width={400}
      />
      <h1 className="text-center font-family-secondary">Votre commande est en cours de traitement...</h1>
    </div>
  );
}
