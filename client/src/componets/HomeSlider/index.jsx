import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';

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
                    <div className="sliderHome__item homeHeroBanner overflow-hidden rounded-[16px] md:rounded-[20px]">
                      <img
                        src={item?.images[0]}
                        alt="Banner slide"
                        className="sliderHome__image block h-full w-full object-cover"
                      />
                      <div className="homeHeroBanner__overlay" />
                      <div className="homeHeroBanner__content">
                        <span className="homeHeroBanner__eyebrow">Cham curated</span>
                        <h2 className="homeHeroBanner__title">Qua tang va dac san duoc chon loc ky hon.</h2>
                        <p className="homeHeroBanner__copy">
                          Khong gian mua sam gon gang, thanh lich va de chon qua hon cho moi dip.
                        </p>
                        <Link to="/ProductListing" className="homeHeroBanner__cta">
                          Kham pha ngay
                        </Link>
                      </div>
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
