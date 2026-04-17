import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// import required modules
import { EffectFade, Navigation, Pagination, Autoplay } from 'swiper/modules';
import Button from '@mui/material/Button';

const HomeBannerV2 = (props) => {
  const spotlightItems =
    props?.data?.filter((item) => item?.isDisplayOnHomeBanner && (item?.bannerimages?.[0] || item?.images?.[0])) ||
    [];

  const fallbackItems =
    props?.data?.filter((item) => item?.bannerimages?.[0] || item?.images?.[0]).slice(0, 4) || [];

  const slides = spotlightItems.length !== 0 ? spotlightItems : fallbackItems;

  return (
    <>
      <Swiper
        loop={true}
        spaceBetween={30}
        effect={'fade'}
        navigation={true}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[EffectFade, Navigation, Pagination, Autoplay]}
        className="HomeSliderV2"
      >
        {slides.map((item, index) => {
          const image = item?.bannerimages?.[0] || item?.images?.[0];

          return (
            <SwiperSlide key={item?._id || index}>
              <div className="item relative min-h-[260px] w-full overflow-hidden rounded-[20px] bg-[#f7f1ed] sm:min-h-[340px] lg:min-h-[420px]">
                <img
                  src={image}
                  alt={item?.name || 'Spotlight product'}
                  className="block h-full min-h-[260px] w-full object-cover sm:min-h-[340px] lg:min-h-[420px]"
                />

                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,24,39,0.12)_0%,rgba(17,24,39,0.04)_38%,rgba(255,255,255,0)_100%)]" />

                <div className="info absolute top-0 right-0 z-50 flex h-full w-full flex-col items-start justify-end p-5 opacity-0 transition-all duration-700 sm:w-[68%] sm:p-8 md:w-[58%] lg:p-10">
                  <h4 className="relative mb-2 w-full text-left text-[13px] font-[600] uppercase tracking-[0.08em] text-[#7c553d] opacity-0 sm:mb-3 sm:text-[14px]">
                    {item?.bannerTitleName || 'Spotlight'}
                  </h4>
                  <h2 className="relative w-full text-[24px] font-[800] leading-tight text-[#1f2937] opacity-0 sm:text-[30px] md:text-[38px]">
                    {item?.name}
                  </h2>
                  <h3 className="relative mt-2 mb-4 flex w-full flex-wrap items-center gap-2 text-left text-[14px] font-[500] text-[#4b5563] opacity-0 sm:mt-3 sm:text-[16px] md:text-[18px]">
                    Starting at only
                    <span className="text-primary text-[22px] font-[800] sm:text-[26px] md:text-[30px]">
                      &#8363; {item?.price}
                    </span>
                  </h3>
                  <div className="btn_ relative w-full opacity-0">
                    <Button className="bg-org">SHOP NOW</Button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
};

export default HomeBannerV2;
