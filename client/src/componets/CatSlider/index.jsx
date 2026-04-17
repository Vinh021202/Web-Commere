import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';

const HomeCatSlider = (props) => {
  return (
    <>
      <div className="homeCatSlider py-5 md:py-7">
        <div className="container">
          <div className="mb-4 flex flex-col gap-3 md:mb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="eyebrow mb-3">Shop by vibe</span>
              <h2 className="text-[26px] font-[800] leading-[1.1] tracking-[-0.03em] text-[#201714] md:text-[32px]">
                Explore our featured categories.
              </h2>
            </div>
            <p className="max-w-[420px] text-[13px] leading-6 text-[rgba(31,41,55,0.66)] md:text-right">
              Fast access to the collections customers browse most, from fashion staples to
              lifestyle picks.
            </p>
          </div>

          <Swiper
            slidesPerView={2.2}
            spaceBetween={12}
            breakpoints={{
              480: {
                slidesPerView: 2.6,
                spaceBetween: 12,
              },
              640: {
                slidesPerView: 3.4,
                spaceBetween: 12,
              },
              768: {
                slidesPerView: 4.5,
                spaceBetween: 14,
              },
              1024: {
                slidesPerView: 6,
                spaceBetween: 14,
              },
              1280: {
                slidesPerView: 8,
                spaceBetween: 10,
              },
            }}
            navigation={true}
            modules={[Navigation]}
            className="homeCatSlider"
          >
            {
              props?.data?.map((cat,index) => {
                return (
                  <SwiperSlide key={cat?._id || index}>
                    <Link
                      to={`/ProductListing?catId=${cat?._id}&cat=${encodeURIComponent(cat?.name || '')}`}
                      className="block h-full"
                    >
                      <div className="item group flex h-full flex-col items-center justify-center rounded-[24px] px-3 py-5 text-center sm:px-4 sm:py-6">
                        <div className="homeCatSlider__iconWrap flex h-[72px] w-[72px] items-center justify-center rounded-[22px] sm:h-[82px] sm:w-[82px]">
                          <img
                            src={cat?.images?.[0]}
                            alt={cat?.name || 'category'}
                            className="w-[42px] transition-all duration-300 sm:w-[50px]"
                          />
                        </div>
                        <h3 className="mt-4 text-[13px] font-[800] leading-5 text-[#201714] sm:text-[15px]">
                          {cat?.name}
                        </h3>
                        <span className="mt-2 text-[11px] font-[700] uppercase tracking-[0.08em] text-[rgba(31,41,55,0.48)]">
                          Explore now
                        </span>
                      </div>
                    </Link>
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

export default HomeCatSlider;
