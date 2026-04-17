import React from 'react';
import '../ProductsItem/style.css';
import { Link } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import { Button } from '@mui/material';
import { MdOutlineShoppingCart } from 'react-icons/md';

const ProductsItemListView = (props) => {
  const primaryImage = props.item?.images?.[0] || '/bannerBox1.jpg';
  const hoverImage = props.item?.images?.[1] || primaryImage;
  const brandName = props.item?.brand || 'Collection';
  const productName = props.item?.name || 'San pham noi bat';
  const isInStock = (props.item?.countInStock || 0) > 0;
  const description =
    props.item?.description || 'Bo cuc da duoc rut gon de theo doi nhieu san pham nhanh hon trong che do danh sach.';

  return (
    <div className="productsItem list-product-card overflow-hidden rounded-[24px] border border-[rgba(255,82,82,0.12)] bg-[rgba(255,255,255,0.94)] shadow-[0_14px_30px_rgba(15,23,42,0.10)]">
      <div className="flex flex-col xl:flex-row">
        <div className="group imgWrapper relative h-[180px] overflow-hidden xl:h-auto xl:w-[220px] xl:min-w-[220px]">
          <Link to={`/product/${props.item?._id}`}>
            <img
              src={primaryImage}
              alt={productName}
              className="h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.04]"
            />
            <img
              src={hoverImage}
              alt={`${productName} hover`}
              className="absolute left-0 top-0 h-full w-full object-cover opacity-0 transition-all duration-700 group-hover:scale-[1.08] group-hover:opacity-100"
            />
          </Link>

          {props.item?.discount > 0 && (
            <span className="absolute left-[12px] top-[12px] z-50 rounded-full bg-[#1f2937] px-2.5 py-1 text-[10px] font-[800] uppercase tracking-[0.06em] text-white">
              -{props.item?.discount}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4 md:p-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <span className="rounded-full bg-[#fff1eb] px-2.5 py-1 text-[10px] font-[800] uppercase tracking-[0.08em] text-[#a65434]">
              {brandName}
            </span>
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-[800] uppercase tracking-[0.08em] ${
                isInStock ? 'bg-[#eefbf3] text-[#1f8f52]' : 'bg-[#fff1f1] text-[#d14343]'
              }`}
            >
              {isInStock ? 'Con hang' : 'Het hang'}
            </span>
          </div>

          <h3 className="mt-3 text-[18px] font-[800] leading-[1.3] text-[#1f2937]">
            <Link to={`/product/${props.item?._id}`} className="link product-card__title transition-all">
              {productName}
            </Link>
          </h3>

          <p className="mb-0 mt-2 max-w-[760px] text-[13px] leading-6 text-[#6b7280]">
            {description.length > 130 ? `${description.slice(0, 130)}...` : description}
          </p>

          <div className="mt-3 flex items-center gap-2">
            <Rating name={`rating-${props.item?._id}`} value={props.item?.rating || 0} size="small" readOnly />
            <span className="text-[11px] font-[700] text-[#6b7280]">({props.item?.rating || 0})</span>
          </div>

          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="product-card__meta rounded-[18px] p-3">
              {props.item?.oldPrice > 0 && (
                <span className="block text-[11px] font-[600] text-gray-400 line-through">
                  {props.item?.oldPrice?.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                    minimumFractionDigits: 0,
                  })}
                </span>
              )}
              <span className="mt-1 block text-[18px] font-[800] leading-5 text-[#ff5252]">
                {props.item?.price?.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                  minimumFractionDigits: 0,
                })}
              </span>
            </div>

            <Button className="bg-org product-card__cta product-card__cta--primary flex gap-2 !px-5">
              <MdOutlineShoppingCart className="text-[16px]" /> Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsItemListView;
