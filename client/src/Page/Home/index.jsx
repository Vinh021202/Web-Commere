import React, { useContext, useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { LiaShippingFastSolid } from 'react-icons/lia';
import { HiOutlineChartBar, HiOutlineShieldCheck, HiOutlineSparkles } from 'react-icons/hi2';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { MyContext } from '../../App';
import AdsBannerSlider from '../../componets/AdsBannerSlider';
import AdsBannerSliderV2 from '../../componets/AdsBannerSliderV2';
import BlogItem from '../../componets/BlogItem';
import HomeCatSlider from '../../componets/CatSlider';
import ChatBox from '../../componets/ChatBox';
import ProductLoading from '../../componets/ProductLoading';
import ProductsSlider from '../../componets/ProductsSlider';
import BannerBoxV2 from '../../componets/bannerBoxV2';
import HomeSlider from '../../componets/HomeSlider';
import HomeBannerV2 from '../../componets/HomeSliderV2';
import { fetchDataFromApi } from '../../utils/api';

const Home = () => {
  const [value, setValue] = useState(0);
  const [homeSlidesData, setHomeSlidesData] = useState([]);
  const [popularproductsData, setPopularProducsData] = useState([]);
  const [productsData, setAllProductsData] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bannerV1Data, setBannerV1Data] = useState([]);
  const [blogData, setBlogData] = useState([]);

  const context = useContext(MyContext);

  const benefitChips = [
    context?.t('benefitFastShipping'),
    context?.t('benefitCurated'),
    context?.t('benefitWeeklyDeals'),
  ];

  const insightCards = [
    {
      icon: <HiOutlineSparkles />,
      title: context?.t('insightNewCollection'),
      value: `${productsData?.length || 0}+`,
      description: context?.t('insightNewCollectionDesc'),
    },
    {
      icon: <HiOutlineChartBar />,
      title: context?.t('insightFeatured'),
      value: `${featuredProducts?.length || 0}`,
      description: context?.t('insightFeaturedDesc'),
    },
    {
      icon: <HiOutlineShieldCheck />,
      title: context?.t('insightBrandBlog'),
      value: `${blogData?.length || 0}`,
      description: context?.t('insightBrandBlogDesc'),
    },
  ];

  const spotlightSideCards =
    featuredProducts?.filter((item) => item?.images?.[0] || item?.bannerimages?.[0]).slice(0, 2) || [];

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchDataFromApi(`/api/homeSlider`).then((res) => {
      setHomeSlidesData(res?.data);
    });

    fetchDataFromApi(`/api/product/getAllProducts`).then((res) => {
      setAllProductsData(res?.products);
    });

    fetchDataFromApi(`/api/product/getAllFeaturedProducts`).then((res) => {
      setFeaturedProducts(res?.products);
    });

    fetchDataFromApi(`/api/bannerV1`).then((res) => {
      setBannerV1Data(res?.data);
    });

    fetchDataFromApi(`/api/blog`).then((res) => {
      setBlogData(res?.data);
    });
  }, []);

  useEffect(() => {
    const firstCategoryId = context?.catData?.[0]?._id;

    if (!firstCategoryId) {
      return;
    }

    fetchDataFromApi(`/api/product/getAllProductsByCatId/${firstCategoryId}`).then((res) => {
      if (res?.error === false) {
        setPopularProducsData(res?.products);
      }
    });
  }, [context?.catData]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const filterByCatId = (id) => {
    if (!id) {
      return;
    }

    setPopularProducsData([]);
    fetchDataFromApi(`/api/product/getAllProductsByCatId/${id}`).then((res) => {
      if (res?.error === false) {
        setPopularProducsData(res?.products);
      }
    });
  };

  const activeCategory = context?.catData?.[value]?.name || context?.t('featuredTitle');

  return (
    <>
      {homeSlidesData?.length !== 0 && <HomeSlider data={homeSlidesData} />}
      {context?.catData?.length !== 0 && <HomeCatSlider data={context?.catData} />}

      <section className="py-4 md:py-6 lg:py-7">
        <div className="container">
          <div className="section-shell subtle-grid home-hero overflow-hidden px-4 py-5 md:px-8 md:py-8 xl:px-10 xl:py-10">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start xl:grid-cols-[1.15fr_0.85fr]">
              <div className="relative">
                <span className="eyebrow mb-5">{context?.t('springCollection')}</span>
                <h1 className="section-heading home-section-heading home-hero-title max-w-[760px]">{context?.t('homeHeroTitle')}</h1>
                <p className="muted-copy mt-5 max-w-[650px] text-[15px] leading-7">{context?.t('homeHeroText')}</p>

                <div className="mt-5 flex flex-wrap gap-2.5">
                  {benefitChips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-[rgba(255,82,82,0.14)] bg-white/80 px-3.5 py-2 text-[12px] font-[700] text-[#1f2937] md:text-[13px]"
                    >
                      {chip}
                    </span>
                  ))}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="soft-card home-mini-stat p-4">
                    <span className="home-mini-stat__label">{context?.t('statCategories')}</span>
                    <strong>{context?.catData?.length || 0}</strong>
                    <p className="mb-0 mt-2 text-[13px] leading-6">{context?.t('statCategoriesHint')}</p>
                  </div>
                  <div className="soft-card home-mini-stat p-4">
                    <span className="home-mini-stat__label">{context?.t('statPriority')}</span>
                    <strong>{context?.t('statPriorityValue')}</strong>
                    <p className="mb-0 mt-2 text-[13px] leading-6">{context?.t('statPriorityHint')}</p>
                  </div>
                  <div className="soft-card home-mini-stat p-4">
                    <span className="home-mini-stat__label">{context?.t('statFeeling')}</span>
                    <strong>{context?.t('statFeelingValue')}</strong>
                    <p className="mb-0 mt-2 text-[13px] leading-6">{context?.t('statFeelingHint')}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 lg:gap-4">
                {insightCards.map((card) => (
                  <div key={card.title} className="soft-card home-insight-card p-4 md:p-5">
                    <div className="home-insight-card__icon">{card.icon}</div>
                    <div>
                      <p className="mb-2 mt-0 text-[12px] font-[700] uppercase tracking-[0.12em] text-[#a65434]">
                        {card.title}
                      </p>
                      <h3 className="text-[24px] font-[800] text-[#1f2937] md:text-[26px] xl:text-[28px]">{card.value}</h3>
                      <p className="mb-0 text-[14px]">{card.description}</p>
                    </div>
                  </div>
                ))}

                <div className="home-editorial-panel">
                  <span className="home-editorial-panel__tag">{context?.t('layoutNote')}</span>
                  <h3 className="mt-4 text-[24px] font-[800] leading-[1.2] text-white md:text-[26px] xl:text-[28px]">
                    {context?.t('layoutTitle')}
                  </h3>
                  <p className="mb-0 mt-3 max-w-[420px] text-[14px] leading-7 text-white/78">{context?.t('layoutText')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-3 lg:py-4">
        <div className="container">
          <div className="section-shell px-4 py-5 md:px-8 md:py-7 xl:px-10 xl:py-8">
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="leftSec">
                <span className="eyebrow mb-4">{context?.t('popularEyebrow')}</span>
                <h2 className="section-heading home-section-heading">{context?.t('popularTitle')}</h2>
                <p className="mb-0 mt-2 text-[14px] font-[400]">{context?.t('popularText')}</p>
              </div>

              <div className="rightSec w-full lg:w-[58%]">
                <Tabs
                  value={value}
                  onChange={handleChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label={context?.t('popularTabsAria')}
                  className="home-tabs"
                >
                  {context?.catData?.length !== 0 &&
                    context?.catData?.map((cat, index) => (
                      <Tab key={cat?._id || index} label={cat?.name} onClick={() => filterByCatId(cat?._id)} />
                    ))}
                </Tabs>
              </div>
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#fff1eb] px-4 py-2 text-[12px] font-[700] uppercase tracking-[0.08em] text-[#a65434]">
                {context?.t('viewing')}
              </span>
              <span className="text-[15px] font-[700] text-[#1f2937]">{activeCategory}</span>
            </div>

            {popularproductsData?.length === 0 && <ProductLoading />}
            {popularproductsData?.length !== 0 && (
              <div className="home-popular-slider overflow-hidden">
                <ProductsSlider items={6} data={popularproductsData} />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-4 md:py-5 lg:py-6">
        <div className="container">
          <div className="section-shell overflow-hidden px-4 py-4 md:px-6 md:py-6 xl:px-7 xl:py-7">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="eyebrow mb-4">{context?.t('featuredEyebrow')}</span>
                <h2 className="section-heading home-section-heading">{context?.t('featuredTitle')}</h2>
              </div>
              <p className="muted-copy max-w-[420px] text-[14px] leading-7">{context?.t('featuredText')}</p>
            </div>

            <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:gap-5">
              <div className="part1 w-full lg:w-[68%]">{productsData?.length !== 0 && <HomeBannerV2 data={productsData} />}</div>

              <div className="part2 flex w-full flex-col gap-4 sm:grid sm:grid-cols-2 lg:w-[32%] lg:flex lg:grid-cols-none lg:flex-col lg:justify-between">
                <BannerBoxV2
                  info="left"
                  image={spotlightSideCards?.[0]?.images?.[0] || '/bannerBox2.jpg'}
                  item={spotlightSideCards?.[0]}
                />
                <BannerBoxV2
                  info="right"
                  image={spotlightSideCards?.[1]?.images?.[0] || '/bannerBox1.jpg'}
                  item={spotlightSideCards?.[1]}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-3 lg:py-4">
        <div className="container">
          <div className="section-shell px-4 py-5 md:px-8 md:py-7 xl:px-10 xl:py-8">
            <div className="freeShipping mb-6 flex flex-col gap-4 rounded-[28px] border border-[rgba(255,82,82,0.2)] bg-[linear-gradient(135deg,#fff5f5_0%,#fff_55%,#fff4ef_100%)] p-4 md:p-5 lg:flex-row lg:items-center lg:justify-between xl:p-6">
              <div className="col1 flex items-center gap-4">
                <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-[#ffe7e7] text-[#ff5252]">
                  <LiaShippingFastSolid className="text-[34px]" />
                </div>
                <div>
                  <span className="text-[13px] font-[700] uppercase tracking-[0.12em] text-[#ff5252]">{context?.t('memberOffer')}</span>
                  <span className="block text-[22px] font-[800] uppercase text-[#1f2937]">{context?.t('freeShippingLarge')}</span>
                </div>
              </div>

              <div className="col2">
                <p className="m-0 text-[15px] font-[500]">{context?.t('freeShippingText')}</p>
              </div>

              <p className="m-0 text-[24px] font-bold text-[#1f2937]">{context?.t('from200Usd')}</p>
            </div>

            {bannerV1Data?.length !== 0 && <AdsBannerSliderV2 items={4} data={bannerV1Data} />}
          </div>
        </div>
      </section>

      <section className="py-3 lg:py-4">
        <div className="container">
          <div className="section-shell px-4 py-5 md:px-8 md:py-7 xl:px-10 xl:py-8">
            <div className="mb-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="eyebrow mb-4">{context?.t('latestEyebrow')}</span>
                <h2 className="section-heading home-section-heading">{context?.t('latestTitle')}</h2>
              </div>
              <p className="muted-copy max-w-[420px] text-[14px] leading-7">{context?.t('latestText')}</p>
            </div>

            {productsData?.length === 0 && <ProductLoading />}
            {productsData?.length !== 0 && (
              <div className="home-latest-slider overflow-hidden">
                <ProductsSlider items={6} data={productsData} />
              </div>
            )}

            <AdsBannerSlider items={3} />
          </div>
        </div>
      </section>

      <section className="py-3 lg:py-4">
        <div className="container">
          <div className="section-shell px-4 py-5 md:px-8 md:py-7 xl:px-10 xl:py-8">
            <div className="mb-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="eyebrow mb-4">{context?.t('editorsChoiceEyebrow')}</span>
                <h2 className="section-heading home-section-heading">{context?.t('editorsChoiceTitle')}</h2>
              </div>
              <p className="muted-copy max-w-[420px] text-[14px] leading-7">{context?.t('editorsChoiceText')}</p>
            </div>

            {featuredProducts?.length !== 0 && (
              <div className="home-featured-slider overflow-hidden">
                <ProductsSlider items={6} data={featuredProducts} />
              </div>
            )}
            <AdsBannerSlider items={3} />
          </div>
        </div>
      </section>

      {blogData?.length !== 0 && (
        <section className="blogSection py-3 pb-10">
          <div className="container">
            <div className="section-shell px-4 py-5 md:px-8 md:py-7 xl:px-10 xl:py-8">
              <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <span className="eyebrow mb-4">{context?.t('magazineEyebrow')}</span>
                  <h2 className="section-heading home-section-heading mb-0">{context?.t('magazineTitle')}</h2>
                </div>
                <p className="muted-copy max-w-[420px] text-[14px] leading-7">{context?.t('magazineText')}</p>
              </div>
              <Swiper
                slidesPerView={1.1}
                spaceBetween={16}
                breakpoints={{
                  480: { slidesPerView: 1.35, spaceBetween: 16 },
                  640: { slidesPerView: 2, spaceBetween: 18 },
                  768: { slidesPerView: 2.4, spaceBetween: 20 },
                  1024: { slidesPerView: 3, spaceBetween: 24 },
                  1280: { slidesPerView: 4, spaceBetween: 30 },
                }}
                navigation={true}
                modules={[Navigation]}
                className="blogSlider"
              >
                {blogData?.map((item, index) => (
                  <SwiperSlide key={index}>
                    <BlogItem item={item} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </section>
      )}

      <ChatBox />
    </>
  );
};

export default Home;
