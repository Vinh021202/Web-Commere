import React, { useEffect, useMemo, useState } from 'react';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './style.css';

const ProductZoom = (props) => {
  const images = Array.isArray(props?.images) ? props.images.filter(Boolean) : [];
  const galleryImages = images.length ? images : ['/bannerBox1.jpg'];
  const [sliderIndex, setSliderIndex] = useState(0);
  const [bigSwiper, setBigSwiper] = useState(null);
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
        <div className="productZoomLayout">
          <div className="productZoomThumbRail">
            {galleryImages?.map((item, index) => {
              return (
                <button
                  type="button"
                  key={index}
                  className={`zoomThumbCard group ${sliderIndex === index ? 'is-active' : ''}`}
                  onClick={() => goto(index)}
                  aria-label={`Xem anh ${index + 1}`}
                >
                  <div className="zoomThumb">
                    <img src={item} alt={`Preview ${index + 1}`} className="zoomThumbImage" />
                  </div>
                </button>
              );
            })}
          </div>

        <div className="productZoomStage">
          <div className="productZoomStageHeader">
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
