import React, { useState, useEffect, useRef, useMemo } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link, useParams } from 'react-router-dom';
import { fetchDataFromApi } from '../../utils/api';
import ProductZoom from '../../componets/ProductZoom';
import Button from '@mui/material/Button';
import ProductsSlider from '../../componets/ProductsSlider';
import ProductDetailsComponent from '../../componets/ProductDetails';
import CircularProgress from '@mui/material/CircularProgress';
import Reviews from './reviews';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { FiShield, FiTruck } from 'react-icons/fi';

const ProductDetails = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [productData, setProductData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [relatedProductData, setRelatedProductData] = useState([]);

  const { id } = useParams();
  const reviewSec = useRef();

  useEffect(() => {
    fetchDataFromApi(`/api/user/getReviews?productId=${id}`).then((res) => {
      if (res?.error === false) {
        setReviewsCount(res?.reviews.length);
      }
    });
  }, [id, reviewsCount]);

  useEffect(() => {
    setIsLoading(true);
    fetchDataFromApi(`/api/product/${id}`).then((res) => {
      if (res?.error === false) {
        setProductData(res?.product);
        const relatedGroupId = res?.product?.subCatId || res?.product?.catId;
        const relatedEndpoint = res?.product?.subCatId
          ? `/api/product/getAllProductsBySubCatId/${res.product.subCatId}`
          : res?.product?.catId
            ? `/api/product/getAllProductsByCatId/${res.product.catId}`
            : null;

        if (relatedGroupId && relatedEndpoint) {
          fetchDataFromApi(relatedEndpoint).then((relatedRes) => {
            if (relatedRes?.error === false) {
              const filteredData = relatedRes?.products?.filter((item) => item._id !== id);
              setRelatedProductData(filteredData);
            }
          });
        } else {
          setRelatedProductData([]);
        }

        setTimeout(() => {
          setIsLoading(false);
        }, 700);
      }
    });

    window.scrollTo(0, 0);
  }, [id]);

  const gotoReviews = () => {
    window.scrollTo({
      top: reviewSec?.current.offsetTop - 180,
      behavior: 'smooth',
    });
    setActiveTab(1);
  };

  const breadcrumbLabel = productData?.name || 'Chi tiết sản phẩm';
  const categoryLabel =
    productData?.subCat ||
    productData?.category?.name ||
    productData?.catName ||
    productData?.brand ||
    'Bộ sưu tập';
  const descriptionPreview = useMemo(() => {
    if (!productData?.description) {
      return 'Chi tiết sản phẩm được trình bày rõ ràng để bạn xem nhanh và ra quyết định mua hàng dễ hơn.';
    }
    return productData.description.length > 170
      ? `${productData.description.slice(0, 170)}...`
      : productData.description;
  }, [productData?.description]);

  return (
    <section className="pb-10 pt-5 md:pt-6 xl:pt-8">
      <div className="container">
        <div className="section-shell overflow-hidden px-4 py-6 md:px-8 md:py-8">
          <div className="absolute inset-y-0 right-0 hidden w-[34%] bg-[radial-gradient(circle_at_top_right,rgba(255,82,82,0.12),transparent_58%)] lg:block" />

          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-[760px]">
              <Breadcrumbs aria-label="breadcrumb" className="listing-breadcrumbs">
                <Link to="/" className="link !text-[14px]">
                  Trang chủ
                </Link>
                <Link to="/" className="link !text-[14px]">
                  {categoryLabel}
                </Link>
                <span className="text-[14px] font-[600] text-[rgba(31,41,55,0.72)]">
                  {breadcrumbLabel}
                </span>
              </Breadcrumbs>

              <span className="eyebrow mt-5">Chi tiết sản phẩm</span>
              <h1 className="section-heading mt-4 max-w-[760px]">
                {productData?.name || 'Khám phá chi tiết sản phẩm với bố cục rõ ràng hơn.'}
              </h1>
              <p className="muted-copy mt-4 max-w-[660px] text-[15px] leading-7">
                {descriptionPreview}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="listing-chip">Thông tin mua hàng rõ ràng</span>
                <span className="listing-chip">Hình ảnh chi tiết</span>
                <span className="listing-chip">Đánh giá từ khách hàng</span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[460px]">
              <div className="soft-card p-4">
                <span className="listing-stat__label">Thương hiệu</span>
                <strong className="listing-stat__value !text-[1.2rem]">
                  {productData?.brand || 'Bộ sưu tập'}
                </strong>
              </div>
              <div className="soft-card p-4">
                <span className="listing-stat__label">Đánh giá</span>
                <strong className="listing-stat__value !text-[1.2rem]">
                  {productData?.rating || 0}
                </strong>
              </div>
              <div className="soft-card p-4">
                <span className="listing-stat__label">Đánh giá</span>
                <strong className="listing-stat__value !text-[1.2rem]">{reviewsCount}</strong>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-5">
          {isLoading === true ? (
            <div className="section-shell flex min-h-[340px] items-center justify-center px-6 py-10">
              <CircularProgress color="inherit" />
            </div>
          ) : (
            <>
              <div className="section-shell overflow-hidden px-4 py-4 md:px-6 md:py-6">
                <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] xl:items-start">
                  <div className="soft-card h-full p-3 md:p-4">
                    <ProductZoom images={productData?.images} />
                  </div>

                  <div className="flex flex-col gap-5">
                    <div className="soft-card p-4 md:p-5">
                      <ProductDetailsComponent
                        item={productData}
                        reviewsCount={reviewsCount}
                        gotoReviews={gotoReviews}
                      />
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="soft-card flex items-start gap-3 p-4">
                        <span className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#fff1eb] text-[#a65434]">
                          <FiTruck className="text-[20px]" />
                        </span>
                        <div>
                          <h3 className="text-[14px] font-[800] text-[#1f2937]">Giao nhanh</h3>
                          <p className="mb-0 mt-1 text-[12px] leading-6">
                            Giao hàng nhanh và đóng gói gọn gàng.
                          </p>
                        </div>
                      </div>

                      <div className="soft-card flex items-start gap-3 p-4">
                        <span className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#fff1eb] text-[#a65434]">
                          <FiShield className="text-[20px]" />
                        </span>
                        <div>
                          <h3 className="text-[14px] font-[800] text-[#1f2937]">Sản phẩm chính hãng</h3>
                          <p className="mb-0 mt-1 text-[12px] leading-6">
                            Thông tin sản phẩm và tồn kho hiển thị rõ ràng.
                          </p>
                        </div>
                      </div>

                      <div className="soft-card flex items-start gap-3 p-4">
                        <span className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#fff1eb] text-[#a65434]">
                          <HiOutlineSparkles className="text-[20px]" />
                        </span>
                        <div>
                          <h3 className="text-[14px] font-[800] text-[#1f2937]">Thông tin chi tiết</h3>
                          <p className="mb-0 mt-1 text-[12px] leading-6">
                            Hình ảnh, mô tả và review được sắp xếp để xem nhanh.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="section-shell mt-5 overflow-hidden px-4 py-4 md:px-6 md:py-6">
                <div className="mb-5 flex flex-wrap items-center gap-3" ref={reviewSec}>
                  <Button
                    className={`!rounded-full !px-5 !py-2 !text-[13px] !font-[800] !capitalize ${
                      activeTab === 0
                        ? '!bg-[#ff5252] !text-white'
                        : '!border !border-[rgba(255,82,82,0.14)] !bg-white !text-[#1f2937]'
                    }`}
                    onClick={() => setActiveTab(0)}
                  >
                    Mô tả
                  </Button>
                  <Button
                    className={`!rounded-full !px-5 !py-2 !text-[13px] !font-[800] !capitalize ${
                      activeTab === 1
                        ? '!bg-[#ff5252] !text-white'
                        : '!border !border-[rgba(255,82,82,0.14)] !bg-white !text-[#1f2937]'
                    }`}
                    onClick={() => setActiveTab(1)}
                  >
                    Đánh giá ({reviewsCount})
                  </Button>
                </div>

                {activeTab === 0 && (
                  <div className="soft-card rounded-[28px] p-5 md:p-6">
                    <h2 className="text-[20px] font-[800] text-[#1f2937]">Mô tả sản phẩm</h2>
                    <p className="mb-0 mt-4 whitespace-pre-line text-[14px] leading-7 text-[#4b5563]">
                      {productData?.description}
                    </p>
                  </div>
                )}

                {activeTab === 1 && (
                  <div className="soft-card rounded-[28px] p-5 md:p-6">
                    {productData?._id && (
                      <Reviews productId={productData?._id} setReviewsCount={setReviewsCount} />
                    )}
                  </div>
                )}
              </div>

              {relatedProductData?.length !== 0 && (
                <div className="section-shell mt-5 overflow-hidden px-4 py-4 md:px-6 md:py-6">
                  <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <span className="eyebrow">Có thể bạn sẽ thích</span>
                      <h2 className="mt-3 text-[22px] font-[800] text-[#1f2937]">
                        Sản phẩm liên quan
                      </h2>
                    </div>
                    <p className="mb-0 max-w-[520px] text-[14px] leading-7 text-[#6b7280]">
                      Gợi ý thêm những sản phẩm cùng nhóm để bạn so sánh nhanh ngay trong cùng một
                      bố cục.
                    </p>
                  </div>
                  <ProductsSlider items={6} data={relatedProductData} />
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </section>
  );
};

export default ProductDetails;
