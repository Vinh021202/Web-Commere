import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation } from 'swiper/modules';
import BannerBox from '../BannerBox';

const AdsBannerSlider = (props) => {
  return (
    <>
      <div className="py-5 w-full">
        <Swiper
          slidesPerView={props.items}
          spaceBetween={10}
          navigation={true}
          modules={[Navigation]}
          className="smlBtn"
        >
          <SwiperSlide>
            <BannerBox img={'/hsmg.jpg'} link={'/'} />
          </SwiperSlide>

          <SwiperSlide>
            <BannerBox img={'/rcsmt.jpg'} link={'/'} />
          </SwiperSlide>

          <SwiperSlide>
            <BannerBox img={'/rem.jpg'} link={'/'} />
          </SwiperSlide>

          <SwiperSlide>
            <BannerBox img={'/rtlm.jpg'} link={'/'} />
          </SwiperSlide>

          <SwiperSlide>
            <BannerBox img={'/thckc.jpg'} link={'/'} />
          </SwiperSlide>
        </Swiper>
      </div>
    </>
  );
};

export default AdsBannerSlider;
