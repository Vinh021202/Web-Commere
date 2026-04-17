import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
// import required modules
import { Autoplay, Navigation } from 'swiper/modules';

const HomeSlider = (props) => {
  return (
    <>
      <div className="homeSlider py-3 md:py-4">
        <div className="container">
          <Swiper
            spaceBetween={10}
            navigation={true}
            modules={[Navigation, Autoplay]}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            className="sliderHome"
          >
            {
              props?.data?.length !== 0 && props?.data?.map((item, index) => {
                return (
                  <SwiperSlide key={index}>
                    <div className="sliderHome__item overflow-hidden rounded-[16px] md:rounded-[20px]">
                      <img
                        src={item?.images[0]}
                        alt="Banner slide"
                        className="sliderHome__image block h-full w-full object-cover"
                      />
                    </div>
                  </SwiperSlide>
                );
              })
            }
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default HomeSlider;
