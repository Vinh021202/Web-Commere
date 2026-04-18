import React from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import ProductsItem from '../ProductsItem';
import { Navigation } from 'swiper/modules';
import './style.css';
// import required modules

const ProductsSlider = (props) => {
  return (
    <>
      <div className="productsSlider productsSlider--showcase py-3">
        <div className="productsSlider__backdrop" />
        <Swiper
          slidesPerView={1.15}
          spaceBetween={14}
          breakpoints={{
            480: {
              slidesPerView: 1.6,
              spaceBetween: 14,
            },
            640: {
              slidesPerView: 2.2,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 18,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            1280: {
              slidesPerView: props.items,
              spaceBetween: 20,
            },
          }}
          navigation={true}
          modules={[Navigation]}
          className="mySwiper productsSliderShell"
        >
          {props?.data?.map((item, index) => (
            <SwiperSlide key={item?._id || index} className="productsSlider__slide">
              <ProductsItem item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default ProductsSlider;
