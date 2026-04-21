import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// import required modules
import { EffectFade, Navigation, Pagination, Autoplay } from 'swiper/modules';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

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
              <div className="item homeSpotlightBanner relative min-h-[260px] w-full overflow-hidden rounded-[20px] bg-[#f7f1ed] sm:min-h-[340px] lg:min-h-[420px]">
                <img
                  src={image}
                  alt={item?.name || 'Spotlight product'}
                  className="block h-full min-h-[260px] w-full object-cover sm:min-h-[340px] lg:min-h-[420px]"
                />

                <div className="homeSpotlightBanner__overlay absolute inset-0" />

                <div className="info absolute inset-0 z-50 flex h-full w-full flex-col items-start justify-end p-4 opacity-0 transition-all duration-700 sm:p-6 lg:p-8">
                  <div className="homeSpotlightBanner__card">
                    <h4 className="homeSpotlightBanner__eyebrow relative mb-2 w-full text-left opacity-0 sm:mb-3">
                      {item?.bannerTitleName || 'Bo suu tap noi bat'}
                    </h4>
                    <h2 className="homeSpotlightBanner__title relative w-full opacity-0">{item?.name}</h2>
                    <h3 className="homeSpotlightBanner__meta relative mt-2 mb-4 flex w-full flex-wrap items-center gap-2 opacity-0 sm:mt-3">
                      Lua chon de thuong va tinh te tu
                      <span className="homeSpotlightBanner__price text-primary">
                        {Number(item?.price || 0).toLocaleString('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                          minimumFractionDigits: 0,
                        })}
                      </span>
                    </h3>
                    <div className="btn_ relative w-full opacity-0">
                      <Link to={item?._id ? `/product/${item._id}` : '/ProductListing'}>
                        <Button className="homeSpotlightBanner__cta bg-org">Xem bo suu tap</Button>
                      </Link>
                    </div>
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
