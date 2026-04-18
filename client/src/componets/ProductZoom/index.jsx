import React, { useEffect, useMemo, useState } from 'react';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { FiChevronLeft, FiChevronRight, FiImage, FiZoomIn } from 'react-icons/fi';
import './style.css';

const ProductZoom = (props) => {
  const images = Array.isArray(props?.images) ? props.images.filter(Boolean) : [];
  const galleryImages = images.length ? images : ['/bannerBox1.jpg'];
  const [sliderIndex, setSliderIndex] = useState(0);
  const [bigSwiper, setBigSwiper] = useState(null);
  const [smallSwiper, setSmallSwiper] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const goto = (index) => {
    setSliderIndex(index);
    if (bigSwiper) {
      bigSwiper.slideTo(index);
    }
    if (smallSwiper) {
      smallSwiper.slideTo(index);
    }
  };

  useEffect(() => {
    if (sliderIndex > galleryImages.length - 1) {
      setSliderIndex(0);
    }
  }, [galleryImages.length, sliderIndex]);

  const activeImage = useMemo(
    () => galleryImages?.[sliderIndex] || galleryImages?.[0] || '/bannerBox1.jpg',
    [galleryImages, sliderIndex]
  );

  const handleMove = (direction) => {
    if (!galleryImages.length) return;
    const nextIndex =
      direction === 'prev'
        ? (sliderIndex - 1 + galleryImages.length) % galleryImages.length
        : (sliderIndex + 1) % galleryImages.length;

    goto(nextIndex);
  };

  return (
    <>
      <div className="productZoomBlock">
        <div className="productZoomHeader">
          <div>
            <span className="productZoomEyebrow">Gallery</span>
            <h3 className="productZoomTitle">Xem chi tiet san pham</h3>
          </div>
          <div className="productZoomMeta">
            <span className="productZoomCount">
              <FiImage />
              {galleryImages.length} anh
            </span>
            <span className="productZoomHint">
              <FiZoomIn />
              {isMobile ? 'Cham de phong to' : 'Re chuot de phong to'}
            </span>
          </div>
        </div>

        <div className="productZoomLayout">
          <div className="productZoomThumbRail">
            <Swiper
            onSwiper={setSmallSwiper}
            direction={'vertical'}
            breakpoints={{
              0: {
                direction: 'horizontal',
                slidesPerView: 4,
                spaceBetween: 10,
              },
              640: {
                direction: 'vertical',
                slidesPerView: 4,
                spaceBetween: 12,
              },
            }}
            spaceBetween={12}
            navigation={true}
            modules={[Navigation]}
            className={`zoomProductSliderThumbs ${galleryImages?.length > 5 ? 'space' : ''}`}
          >
            {galleryImages?.map((item, index) => {
              return (
                <SwiperSlide key={index} className="zoomThumb">
                  <div
                    className={`zoomThumbCard group ${sliderIndex === index ? 'is-active' : ''}`}
                    onClick={() => goto(index)}
                  >
                    <img src={item} alt={`Preview ${index + 1}`} className="zoomThumbImage" />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        <div className="productZoomStage">
          <div className="productZoomStageHeader">
            <span className="productZoomStageBadge">Anh noi bat</span>
            <span className="productZoomStagePager">
              {sliderIndex + 1}/{Math.max(galleryImages.length, 1)}
            </span>
          </div>

          <button
            type="button"
            className="productZoomNav productZoomNav--prev"
            onClick={() => handleMove('prev')}
            aria-label="Xem anh truoc"
          >
            <FiChevronLeft />
          </button>

          <button
            type="button"
            className="productZoomNav productZoomNav--next"
            onClick={() => handleMove('next')}
            aria-label="Xem anh tiep theo"
          >
            <FiChevronRight />
          </button>

          <div className="productZoomPreviewGlow" style={{ backgroundImage: `url(${activeImage})` }} />

          <Swiper
            onSwiper={setBigSwiper}
            slidesPerView={1}
            spaceBetween={0}
            navigation={false}
            initialSlide={sliderIndex}
            onSlideChange={(swiper) => setSliderIndex(swiper.activeIndex)}
            className="productZoomMainSlider"
          >
            {galleryImages?.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="productInnerZoom">
                  <InnerImageZoom zoomType={isMobile ? 'click' : 'hover'} zoomScale={1} src={item} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        </div>
      </div>
    </>
  );
};

export default ProductZoom;
