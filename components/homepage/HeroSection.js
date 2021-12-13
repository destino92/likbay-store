import React from 'react';
import { Autoplay, EffectFade, Swiper as SwiperCore } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';

const params = {
  slidesPerView: 1,
  watchOverflow: false,
  autoplay: {
    delay: 5000
  },
  loop: true,
  allowTouchMove: false,
  speed: 1000,
  effect: 'fade',
  fadeEffect: {
    crossFade: true
  }
};
const images = [
  '/images/home-1.jpg',
  '/images/home-2.jpg',
  '/images/home-3.jpg',
  '/images/home-4.jpg',
];

const images_m = [
  'images/1-mobile.jpg',
  'images/2-mobile.jpg',
  'images/3-mobile.jpg',
  'images/4-mobile.jpg',
];

export default function HeroSection() {
  SwiperCore.use([Autoplay, EffectFade]);
  return (
    <div className="container">
      <div className="hero-section-space">
        <div className="hero-section position-relative d-none d-sm-block">
          <Swiper {...params}>
            {images.map((image, index) => (
              <SwiperSlide key={image}>
                <div
                  className="hero-slide d-flex align-items-center justify-content-center flex-column font-color-white"
                  style={{
                    backgroundImage: `url("${image}")`,
                  }}
                >
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div className="hero-section position-relative d-block d-sm-none">
        <Swiper {...params}>
          {images_m.map((image, index) => (
            <SwiperSlide key={image}>
              <div
                className="hero-slide-m d-flex align-items-center justify-content-center flex-column font-color-white"
                style={{
                  backgroundImage: `url("${image}")`,
                }}
              >
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
