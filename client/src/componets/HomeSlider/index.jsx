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
          <div className="home-hero-slider overflow-hidden">
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
              {props?.data?.length !== 0 &&
                props?.data?.map((item, index) => {
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
                          <span className="homeHeroBanner__eyebrow">Chạm menbox</span>
                          <h2 className="homeHeroBanner__title">
                            Quà tặng và đặc sản được chọn lọc kỹ hơn.
                          </h2>
                          <p className="homeHeroBanner__copy">
                            Không gian mua sắm gọn gàng, thanh lịch và dễ chọn lựa hơn cho mỗi dịp.
                          </p>
                          <Link to="/ProductListing" className="homeHeroBanner__cta">
                            Khám phá ngay
                          </Link>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
            </Swiper>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeSlider;
