import React from 'react';
import '../bannerBoxV2/style.css';
import { Link } from 'react-router-dom';

const BannerBoxV2 = (props) => {
  const title = props?.item?.bannerTitle || props?.item?.name || 'Ưu đãi nổi bật';
  const price = props?.item?.price;

  return (
    <>
      <div className="bannerBoxV2 group relative w-full overflow-hidden rounded-[20px]">
        <img
          src={props.image}
          className="block min-h-[180px] w-full object-cover transition-all duration-150 group-hover:scale-105 sm:min-h-[220px] md:min-h-0"
        />

        <div
          className={`info bannerBoxV2__content absolute top-0 z-50 flex h-full w-[82%] flex-col items-start justify-end gap-2 p-4 sm:w-[72%] sm:justify-end sm:p-5 ${
              props.info === 'left' ? 'left-0' : 'right-0'
            } ${
              props.info === 'left' ? '' : 'sm:pl-15'
            } `}
        >
          <span className="bannerBoxV2__eyebrow">Uu dai duoc goi y</span>
          <h2 className="bannerBoxV2__title">{title}</h2>
          {price && (
            <span className="bannerBoxV2__price text-primary w-full">
              {Number(price).toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
                minimumFractionDigits: 0,
              })}
            </span>
          )}

          <div className="w-full">
            <Link to={'/'} className="bannerBoxV2__link link">
              Xem ngay
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default BannerBoxV2;
