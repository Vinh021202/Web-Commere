import React, { useState } from 'react';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

const ProductZoom = (props) => {
  const [sliderIndex, setSliderIndex] = useState(0);
  const [bigSwiper, setBigSwiper] = useState(null);
  const [smallSwiper, setSmallSwiper] = useState(null);


  const goto = (index) => {
    setSliderIndex(index);
    if (bigSwiper) {
      bigSwiper.slideTo(index);
    }
    if (smallSwiper) {
      smallSwiper.slideTo(index);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="slider w-full sm:w-[15%] ">
          <Swiper
            onSwiper={setSmallSwiper}
            direction={'vertical'}
            breakpoints={{
              0: {
                direction: 'horizontal',
                slidesPerView: 4,
              },
              640: {
                direction: 'vertical',
                slidesPerView: 4,
              },
            }}
            spaceBetween={0}
            navigation={true}
            modules={[Navigation]}
            className={`zoomProductSliderThumbs h-[92px] sm:h-[400px] overflow-hidden ${props?.images?.length > 5 && 'space'}`}
          >
            {props?.images?.map((item, index) => {
              return (
                <SwiperSlide key={index}>
                  <div
                    className={`item rounded-md overflow-hidden cursor-pointer group
                                 ${sliderIndex === index ? '' : 'opacity-30'}`}
                    onClick={() => goto(index)}
                  >
                    <img src={item} className="w-full transition-all group-hover:scale-105" />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        <div className="zoomContainer h-[320px] w-full overflow-hidden rounded-md sm:h-[500px] sm:w-[85%]">
          <Swiper
            onSwiper={setBigSwiper}
            slidesPerView={1}
            spaceBetween={0}
            navigation={false}
            initialSlide={sliderIndex}
            onSlideChange={(swiper) => setSliderIndex(swiper.activeIndex)}
          >
            {props?.images?.map((item, index) => (
              <SwiperSlide key={index}>
                <InnerImageZoom zoomType="hover" zoomScale={1} src={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default ProductZoom;
