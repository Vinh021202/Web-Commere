import React, { useContext, useEffect, useMemo, useState } from "react";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link, useParams } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";
import {
  MdBrandingWatermark,
  MdFilterVintage,
  MdOutlineInventory2,
  MdOutlineLocalOffer,
  MdOutlineSell,
  MdOutlineCalendarToday,
} from "react-icons/md";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { HiOutlineCube } from "react-icons/hi2";
import { BsPatchCheckFill } from "react-icons/bs";
import { IoArrowBack } from "react-icons/io5";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import CircularProgress from "@mui/material/CircularProgress";
import { MyContext } from "../../App";

const detailLabelClass =
  "flex items-center gap-2 text-[12px] font-[800] uppercase tracking-[0.08em] text-slate-500";

const attributeChipClass =
  "inline-flex rounded-full border border-[#e4ecfb] bg-[#f7faff] px-3 py-1.5 text-[12px] font-[800] text-[#315ea8]";

const ProductDetails = () => {
  const [sliderIndex, setSliderIndex] = useState(0);
  const [bigSwiper, setBigSwiper] = useState(null);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const { id } = useParams();
  const context = useContext(MyContext);

  const goto = (index) => {
    setSliderIndex(index);

    if (bigSwiper) {
      bigSwiper.slideTo(index);
    }
  };

  const handleMove = (direction) => {
    if (!galleryImages.length) return;

    const nextIndex =
      direction === "prev"
        ? (sliderIndex - 1 + galleryImages.length) % galleryImages.length
        : (sliderIndex + 1) % galleryImages.length;

    goto(nextIndex);
  };

  useEffect(() => {
    setIsLoading(true);

    fetchDataFromApi(`/api/product/${id}`).then((res) => {
      if (res?.error === false && res?.product) {
        setProduct(res.product);
      } else {
        setProduct(null);
      }

      setIsLoading(false);
    });
  }, [id]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  const galleryImages = useMemo(() => {
    if (!Array.isArray(product?.images)) {
      return [];
    }

    return product.images.filter(Boolean);
  }, [product?.images]);

  useEffect(() => {
    if (sliderIndex > galleryImages.length - 1) {
      setSliderIndex(0);
    }
  }, [galleryImages.length, sliderIndex]);

  const activeImage = useMemo(
    () => galleryImages?.[sliderIndex] || galleryImages?.[0] || "/placeholder.jpg",
    [galleryImages, sliderIndex],
  );

  const reviews = useMemo(() => {
    if (!Array.isArray(product?.reviews)) {
      return [];
    }

    return product.reviews;
  }, [product?.reviews]);

  const detailGroups = useMemo(
    () => [
      {
        icon: <MdBrandingWatermark className="text-[16px]" />,
        label: "Brand",
        value: product?.brand || "No brand",
      },
      {
        icon: <BiSolidCategoryAlt className="text-[16px]" />,
        label: "Category",
        value: product?.catName || "Uncategorized",
      },
      {
        icon: <MdOutlineInventory2 className="text-[16px]" />,
        label: "Stock",
        value: product?.countInStock ?? product?.stock ?? "N/A",
      },
      {
        icon: <MdOutlineSell className="text-[16px]" />,
        label: "Sales",
        value: `${product?.sale || 0} sale`,
      },
      {
        icon: <MdOutlineLocalOffer className="text-[16px]" />,
        label: "Product ID",
        value: product?._id || "N/A",
      },
      {
        icon: <MdOutlineCalendarToday className="text-[16px]" />,
        label: "Published",
        value: product?.createdAt?.split("T")[0] || "N/A",
      },
    ],
    [product],
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
          <CircularProgress color="inherit" size={22} />
          <span className="text-[13px] font-[700] text-slate-600">
            Loading product details...
          </span>
        </div>
      </div>
    );
  }

  if (!product?._id) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center rounded-[28px] border border-white/70 bg-white/90 p-8 text-center shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
        <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#f4f7ff] text-[#3872fa] shadow-[0_12px_30px_rgba(56,114,250,0.08)]">
          <HiOutlineCube className="text-[30px]" />
        </div>
        <h2 className="mt-5 text-[22px] font-[900] text-[#14213d]">
          Product not found
        </h2>
        <p className="mt-2 max-w-[420px] text-[14px] leading-7 text-slate-500">
          The requested product could not be loaded. It may have been deleted or
          is currently unavailable.
        </p>
        <Link to="/products" className="mt-6">
          <Button className="!rounded-[16px] !bg-[linear-gradient(135deg,_#14213d,_#3872fa)] !px-5 !py-3 !text-[13px] !font-[800] !capitalize !text-white shadow-[0_16px_35px_rgba(56,114,250,0.22)]">
            <IoArrowBack className="mr-2 text-[16px]" />
            Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-white/70 bg-[linear-gradient(135deg,_rgba(255,255,255,0.94),_rgba(245,247,255,0.98))] p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,_#14213d,_#3872fa)] text-white shadow-[0_16px_35px_rgba(56,114,250,0.20)]">
            <HiOutlineCube className="text-[26px]" />
          </div>
          <div>
            <p className="text-[11px] font-[800] uppercase tracking-[0.18em] text-slate-400">
              Product Details
            </p>
            <h1 className="mt-2 text-[28px] font-[900] leading-tight text-[#14213d]">
              {product?.name}
            </h1>
            <p className="mt-2 text-[14px] text-slate-500">
              Review product media, pricing, attributes and customer feedback in
              one place.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-[18px] border border-[#e6edfb] bg-white/80 px-4 py-3 text-right shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
            <p className="text-[11px] font-[800] uppercase tracking-[0.14em] text-slate-400">
              Current Price
            </p>
            <p className="mt-1 text-[22px] font-[900] text-[#3872fa]">
              {context?.formatCurrency
                ? context.formatCurrency(product?.price)
                : product?.price}
            </p>
          </div>
          <Link to="/products">
            <Button className="!rounded-[16px] !border !border-[#e7ebf3] !bg-white !px-4 !py-3 !text-[13px] !font-[800] !capitalize !text-slate-700 hover:!bg-[#f8fbff]">
              <IoArrowBack className="mr-2 text-[16px]" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="self-start rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
          <div className="mb-5">
            <p className="text-[11px] font-[800] uppercase tracking-[0.18em] text-slate-400">
              Gallery
            </p>
            <h2 className="mt-2 text-[22px] font-[900] text-[#14213d]">
              Product Media
            </h2>
          </div>

          {galleryImages.length > 0 ? (
            <div className="productZoomBlock">
              <div className="productZoomLayout">
                <div className="productZoomThumbRail">
                  {galleryImages.map((image, index) => (
                    <button
                      type="button"
                      key={index}
                      className={`zoomThumbCard ${
                        sliderIndex === index ? "is-active" : ""
                      }`}
                      onClick={() => goto(index)}
                      aria-label={`View image ${index + 1}`}
                    >
                      <div className="zoomThumb">
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="zoomThumbImage"
                        />
                      </div>
                    </button>
                  ))}
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
                    onClick={() => handleMove("prev")}
                    aria-label="View previous image"
                  >
                    <FiChevronLeft />
                  </button>

                  <button
                    type="button"
                    className="productZoomNav productZoomNav--next"
                    onClick={() => handleMove("next")}
                    aria-label="View next image"
                  >
                    <FiChevronRight />
                  </button>

                  <div
                    className="productZoomPreviewGlow"
                    style={{ backgroundImage: `url(${activeImage})` }}
                  />

                  <Swiper
                    onSwiper={setBigSwiper}
                    slidesPerView={1}
                    spaceBetween={0}
                    navigation={false}
                    initialSlide={sliderIndex}
                    onSlideChange={(swiper) => setSliderIndex(swiper.activeIndex)}
                    className="productZoomMainSlider"
                  >
                    {galleryImages.map((image, index) => (
                      <SwiperSlide key={index}>
                        <div className="productInnerZoom">
                          <InnerImageZoom
                            zoomType={isMobile ? "click" : "hover"}
                            zoomScale={1}
                            hideHint
                            src={image}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[420px] items-center justify-center rounded-[24px] border border-dashed border-[#d7e2f0] bg-[#fbfdff] text-slate-400">
              No product image
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-[800] uppercase tracking-[0.18em] text-slate-400">
                  Summary
                </p>
                <h2 className="mt-2 text-[24px] font-[900] text-[#14213d]">
                  {product?.name}
                </h2>
              </div>

              <span className="inline-flex rounded-full border border-[#dbe6ff] bg-[#f5f8ff] px-3 py-1.5 text-[12px] font-[800] text-[#3872fa]">
                ID: {product?._id?.slice(-6)}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <div>
                <p className="text-[12px] font-[700] text-slate-400 line-through">
                  {context?.formatCurrency
                    ? context.formatCurrency(product?.oldPrice)
                    : product?.oldPrice}
                </p>
                <p className="mt-1 text-[30px] font-[900] leading-none text-[#3872fa]">
                  {context?.formatCurrency
                    ? context.formatCurrency(product?.price)
                    : product?.price}
                </p>
              </div>

              <div className="rounded-[18px] border border-[#e6edfb] bg-[#f8faff] px-4 py-3">
                <Rating
                  name="product-rating"
                  value={Number(product?.rating || 0)}
                  precision={0.5}
                  readOnly
                />
                <p className="mt-1 text-[12px] font-[700] text-slate-500">
                  {product?.rating || 0}/5 rating
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {detailGroups.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[20px] border border-[#edf2f8] bg-[linear-gradient(180deg,_#ffffff,_#f8fbff)] p-4 shadow-[0_10px_25px_rgba(15,23,42,0.03)]"
                >
                  <p className={detailLabelClass}>
                    {item.icon}
                    {item.label}
                  </p>
                  <p className="mt-2 break-words text-[14px] font-[800] text-[#14213d]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
            <p className="text-[11px] font-[800] uppercase tracking-[0.18em] text-slate-400">
              Attributes
            </p>
            <h2 className="mt-2 text-[22px] font-[900] text-[#14213d]">
              Product Specs
            </h2>

            <div className="mt-5 space-y-5">
              <div>
                <p className={detailLabelClass}>
                  <MdFilterVintage className="text-[16px]" />
                  RAM
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product?.productRam?.length ? (
                    product.productRam.map((ram, index) => (
                      <span className={attributeChipClass} key={index}>
                        {ram}
                      </span>
                    ))
                  ) : (
                    <span className="text-[13px] text-slate-400">No RAM info</span>
                  )}
                </div>
              </div>

              <div>
                <p className={detailLabelClass}>
                  <MdFilterVintage className="text-[16px]" />
                  Size
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product?.size?.length ? (
                    product.size.map((size, index) => (
                      <span className={attributeChipClass} key={index}>
                        {size}
                      </span>
                    ))
                  ) : (
                    <span className="text-[13px] text-slate-400">No size info</span>
                  )}
                </div>
              </div>

              <div>
                <p className={detailLabelClass}>
                  <MdFilterVintage className="text-[16px]" />
                  Weight
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product?.productWeight?.length ? (
                    product.productWeight.map((weight, index) => (
                      <span className={attributeChipClass} key={index}>
                        {weight}
                      </span>
                    ))
                  ) : (
                    <span className="text-[13px] text-slate-400">
                      No weight info
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
          <p className="text-[11px] font-[800] uppercase tracking-[0.18em] text-slate-400">
            Description
          </p>
          <h2 className="mt-2 text-[22px] font-[900] text-[#14213d]">
            Product Description
          </h2>
          <p className="mt-4 whitespace-pre-line text-[14px] leading-7 text-slate-600">
            {product?.description || "No description available for this product."}
          </p>
        </div>

        <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
          <p className="text-[11px] font-[800] uppercase tracking-[0.18em] text-slate-400">
            Reviews
          </p>
          <h2 className="mt-2 text-[22px] font-[900] text-[#14213d]">
            Customer Feedback
          </h2>

          <div className="mt-5 space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div
                  key={`${review?._id || "review"}-${index}`}
                  className="rounded-[22px] border border-[#edf2f8] bg-[#fbfdff] p-4 shadow-[0_10px_25px_rgba(15,23,42,0.03)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 overflow-hidden rounded-full border border-[#e8eef7] bg-white">
                      <img
                        src={review?.customerImage || review?.image || "/user.jpg"}
                        alt={review?.customerName || review?.userName || "User"}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h4 className="text-[15px] font-[900] text-[#14213d]">
                            {review?.customerName ||
                              review?.userName ||
                              "Anonymous user"}
                          </h4>
                          <p className="mt-1 text-[12px] text-slate-400">
                            {review?.createdAt?.split("T")[0] || "No date"}
                          </p>
                        </div>

                        <Rating
                          name={`review-rating-${index}`}
                          value={Number(review?.rating || 0)}
                          precision={0.5}
                          readOnly
                          size="small"
                        />
                      </div>

                      <p className="mt-3 text-[13px] leading-6 text-slate-600">
                        {review?.review ||
                          review?.comment ||
                          "No review content provided."}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex min-h-[240px] flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#f4f7ff] text-[#3872fa] shadow-[0_12px_30px_rgba(56,114,250,0.08)]">
                  <BsPatchCheckFill className="text-[28px]" />
                </div>
                <h4 className="mt-5 text-[18px] font-[900] text-[#14213d]">
                  No customer reviews yet
                </h4>
                <p className="mt-2 max-w-[320px] text-[13px] leading-6 text-slate-500">
                  Reviews will appear here once customers start rating and
                  commenting on this product.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
